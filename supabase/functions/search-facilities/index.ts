import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  location?: string;
  facilityType?: string;
  priceMin?: number;
  priceMax?: number;
  acceptsMedicare?: boolean;
  acceptsMedicaid?: boolean;
  acceptsVA?: boolean;
  radius?: number; // in miles
  lat?: number;
  lng?: number;
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

    const serperApiKey = Deno.env.get('SERPER_API_KEY');
    if (!serperApiKey) {
      throw new Error('SERPER_API_KEY not found');
    }

    const { searchParams }: { searchParams: SearchParams } = await req.json();
    
    // Log search request for analytics
    const userId = req.headers.get('user-id');
    
    // Build search query for facilities
    let searchQuery = '';
    if (searchParams.facilityType) {
      searchQuery += `${searchParams.facilityType} `;
    } else {
      searchQuery += 'senior care assisted living nursing home ';
    }
    
    if (searchParams.location) {
      searchQuery += `in ${searchParams.location}`;
    } else {
      searchQuery += 'near me';
    }

    console.log('Searching with query:', searchQuery);

    // Search using Serper API
    const serperResponse = await fetch('https://google.serper.dev/places', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: searchQuery,
        location: searchParams.location || 'United States',
        num: 20
      }),
    });

    if (!serperResponse.ok) {
      throw new Error(`Serper API error: ${serperResponse.status}`);
    }

    const serperData = await serperResponse.json();
    console.log('Serper response:', serperData);

    // Transform Serper results to our format
    const facilities = (serperData.places || []).map((place: any, index: number) => ({
      id: `search-${Date.now()}-${index}`,
      name: place.title || 'Unknown Facility',
      address: place.address,
      phone: place.phoneNumber,
      website: place.website,
      rating: place.rating,
      reviews_count: place.ratingCount,
      latitude: place.latitude,
      longitude: place.longitude,
      facility_type: searchParams.facilityType || 'Senior Care',
      place_id: place.placeId,
      thumbnail_url: place.thumbnailUrl,
      types: place.types || []
    }));

    // Store search results in database for future reference
    const { data: searchResult } = await supabase
      .from('serperapi_search_results')
      .insert({
        user_id: userId,
        search_query: searchQuery,
        search_parameters: searchParams,
        raw_response: serperData
      })
      .select()
      .single();

    if (searchResult && facilities.length > 0) {
      // Store individual places
      const placesToInsert = facilities.map((facility: any, position: number) => ({
        search_result_id: searchResult.id,
        position: position,
        title: facility.name,
        address: facility.address,
        latitude: facility.latitude,
        longitude: facility.longitude,
        rating: facility.rating,
        rating_count: facility.reviews_count,
        place_type: facility.facility_type,
        place_types: facility.types,
        website: facility.website,
        phone_number: facility.phone,
        thumbnail_url: facility.thumbnail_url,
        place_id: facility.place_id
      }));

      await supabase.from('serperapi_places').insert(placesToInsert);
    }

    // Filter by radius if coordinates provided
    let filteredFacilities = facilities;
    if (searchParams.lat && searchParams.lng && searchParams.radius) {
      filteredFacilities = facilities.filter((facility: any) => {
        if (!facility.latitude || !facility.longitude) return false;
        
        const distance = calculateDistance(
          searchParams.lat!,
          searchParams.lng!,
          facility.latitude,
          facility.longitude
        );
        
        return distance <= (searchParams.radius || 25);
      });
    }

    // Update search request with results count
    if (userId) {
      await supabase
        .from('search_requests')
        .update({ results_count: filteredFacilities.length })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
    }

    // Track analytics
    await supabase.from('analytics').insert({
      user_id: userId,
      event_type: 'facility_search',
      metadata: {
        ...searchParams,
        results_count: filteredFacilities.length
      }
    });

    return new Response(
      JSON.stringify({ 
        facilities: filteredFacilities,
        total: filteredFacilities.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in search-facilities function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}