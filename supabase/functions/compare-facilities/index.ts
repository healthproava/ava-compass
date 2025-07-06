import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComparisonRequest {
  facilityIds: string[];
  saveComparison?: boolean;
}

interface FacilityComparison {
  basic_info: {
    name: string;
    address: string;
    rating: number;
    phone: string;
    website: string;
  };
  care_details: {
    facility_type: string;
    capacity: number;
    availability: number;
    care_services: any[];
    amenities: any[];
  };
  financial: {
    price_min: number;
    price_max: number;
    accepted_payers: any[];
  };
  location: {
    latitude: number;
    longitude: number;
    distance_from_user?: number;
  };
  verification: {
    is_verified: boolean;
    license_number: string;
    data_source: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { facilityIds, saveComparison = false }: ComparisonRequest = await req.json();
    
    if (!facilityIds || facilityIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Facility IDs are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (facilityIds.length > 5) {
      return new Response(
        JSON.stringify({ error: 'Maximum 5 facilities can be compared at once' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user ID from auth header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    console.log('Comparing facilities:', facilityIds);

    // Fetch facilities from unified_facilities table
    const { data: facilities, error: fetchError } = await supabase
      .from('unified_facilities')
      .select('*')
      .in('id', facilityIds);

    if (fetchError) {
      console.error('Error fetching facilities:', fetchError);
      throw fetchError;
    }

    if (!facilities || facilities.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No facilities found with provided IDs' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${facilities.length} facilities for comparison`);

    // Structure data for comparison
    const comparisonData: FacilityComparison[] = facilities.map(facility => ({
      id: facility.id,
      basic_info: {
        name: facility.title || facility.name || 'Unknown',
        address: facility.address || 'Address not available',
        rating: facility.rating || 0,
        phone: facility.phone_number || facility.phone || 'Not available',
        website: facility.website || 'Not available'
      },
      care_details: {
        facility_type: facility.place_type || 'Not specified',
        capacity: facility.capacity || 0,
        availability: facility.availability || 0,
        care_services: facility.care_services || [],
        amenities: facility.amenities || []
      },
      financial: {
        price_min: facility.price_min || 0,
        price_max: facility.price_max || 0,
        accepted_payers: facility.accepted_payers || []
      },
      location: {
        latitude: facility.latitude || 0,
        longitude: facility.longitude || 0
      },
      verification: {
        is_verified: facility.is_verified || false,
        license_number: facility.license_number || 'Not available',
        data_source: facility.source || 'unknown'
      }
    }));

    // Generate comparison summary
    const summary = generateComparisonSummary(comparisonData);

    // Save comparison if requested
    let comparisonId = null;
    if (saveComparison) {
      const { data: savedComparison, error: saveError } = await supabase
        .from('facility_comparisons')
        .insert({
          user_id: userId,
          facility_ids: facilityIds,
          comparison_data: comparisonData
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving comparison:', saveError);
      } else {
        comparisonId = savedComparison.id;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        comparisonId,
        facilities: comparisonData,
        summary,
        totalFacilities: comparisonData.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in compare-facilities function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateComparisonSummary(facilities: FacilityComparison[]) {
  const summary = {
    price_range: {
      min: Math.min(...facilities.map(f => f.financial.price_min).filter(p => p > 0)),
      max: Math.max(...facilities.map(f => f.financial.price_max).filter(p => p > 0))
    },
    rating_range: {
      min: Math.min(...facilities.map(f => f.basic_info.rating).filter(r => r > 0)),
      max: Math.max(...facilities.map(f => f.basic_info.rating).filter(r => r > 0))
    },
    facility_types: [...new Set(facilities.map(f => f.care_details.facility_type))],
    verified_count: facilities.filter(f => f.verification.is_verified).length,
    total_capacity: facilities.reduce((sum, f) => sum + (f.care_details.capacity || 0), 0),
    common_amenities: findCommonAmenities(facilities),
    key_differences: identifyKeyDifferences(facilities)
  };

  return summary;
}

function findCommonAmenities(facilities: FacilityComparison[]) {
  if (facilities.length === 0) return [];
  
  const amenitySets = facilities.map(f => new Set(
    Array.isArray(f.care_details.amenities) ? f.care_details.amenities : []
  ));
  
  if (amenitySets.length === 1) return Array.from(amenitySets[0]);
  
  return Array.from(amenitySets[0]).filter(amenity =>
    amenitySets.every(set => set.has(amenity))
  );
}

function identifyKeyDifferences(facilities: FacilityComparison[]) {
  const differences = [];
  
  // Price differences
  const prices = facilities.map(f => f.financial.price_min).filter(p => p > 0);
  if (prices.length > 1) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (maxPrice - minPrice > 1000) {
      differences.push(`Significant price variation: $${minPrice} - $${maxPrice}/month`);
    }
  }
  
  // Rating differences
  const ratings = facilities.map(f => f.basic_info.rating).filter(r => r > 0);
  if (ratings.length > 1) {
    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);
    if (maxRating - minRating > 1) {
      differences.push(`Rating range: ${minRating} - ${maxRating} stars`);
    }
  }
  
  // Verification status
  const verifiedCount = facilities.filter(f => f.verification.is_verified).length;
  if (verifiedCount > 0 && verifiedCount < facilities.length) {
    differences.push(`${verifiedCount} of ${facilities.length} facilities are verified`);
  }
  
  return differences;
}