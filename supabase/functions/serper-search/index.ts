import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SerperSearchRequest {
  query: string;
  location?: string;
  type?: string;
  num?: number;
}

interface SerperPlace {
  position: number;
  uuid?: string;
  title: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  ratingCount?: number;
  type?: string;
  types?: string[];
  website?: string;
  phoneNumber?: string;
  openingHours?: any;
  thumbnailUrl?: string;
  cid?: string;
  fid?: string;
  placeId?: string;
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

    const { query, location, type = 'assisted living', num = 20 }: SerperSearchRequest = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
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

    // Construct search query
    let searchQuery = query;
    if (location) {
      searchQuery += ` near ${location}`;
    }

    console.log('Starting SerperAPI search for:', searchQuery);

    // Call SerperAPI
    const serperResponse = await fetch('https://google.serper.dev/maps', {
      method: 'POST',
      headers: {
        'X-API-KEY': Deno.env.get('SERPER_API_KEY') ?? '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: searchQuery,
        type: type,
        num: num
      })
    });

    if (!serperResponse.ok) {
      throw new Error(`SerperAPI error: ${serperResponse.status}`);
    }

    const serperData = await serperResponse.json();
    console.log('SerperAPI response received, places found:', serperData.places?.length || 0);

    // Store search result
    const { data: searchResult, error: searchError } = await supabase
      .from('serperapi_search_results')
      .insert({
        user_id: userId,
        search_query: searchQuery,
        search_parameters: { query, location, type, num },
        raw_response: serperData
      })
      .select()
      .single();

    if (searchError) {
      console.error('Error storing search result:', searchError);
      throw searchError;
    }

    // Parse and store places in unified facilities table
    const places = serperData.places || [];
    if (places.length > 0) {
      const facilitiesData = places.map((place: SerperPlace) => ({
        name: place.title,
        address_line1: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        rating: place.rating,
        reviews_count: place.ratingCount,
        facility_type: place.type,
        website: place.website,
        phone: place.phoneNumber,
        business_hours: place.openingHours,
        image_urls: place.thumbnailUrl ? [place.thumbnailUrl] : [],
        data_source: 'serperapi',
        original_id: place.uuid || place.placeId || place.cid,
        is_verified: false,
        is_active: true
      }));

      const { error: facilitiesError } = await supabase
        .from('unified_facilities')
        .insert(facilitiesData);

      if (facilitiesError) {
        console.error('Error storing facilities:', facilitiesError);
      }
    }

    // Generate AI summary using OpenAI
    try {
      const summaryPrompt = `
        Based on the following search results for "${searchQuery}", create a helpful summary for a senior care search assistant:
        
        Found ${places.length} facilities. Here are the key details:
        ${places.slice(0, 5).map((place: SerperPlace) => `
        - ${place.title} (Rating: ${place.rating || 'N/A'})
          Address: ${place.address || 'Address not available'}
          ${place.phoneNumber ? `Phone: ${place.phoneNumber}` : ''}
          ${place.website ? `Website: ${place.website}` : ''}
        `).join('\n')}
        
        Create a conversational summary that highlights the best options and includes helpful markup for displaying facility cards with map links.
      `;

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful senior care search assistant. Create conversational summaries with useful markup for displaying search results.' },
            { role: 'user', content: summaryPrompt }
          ],
          max_tokens: 1000
        })
      });

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json();
        const summary = openaiData.choices[0]?.message?.content || 'Search completed successfully.';
        
        // Store conversation summary
        await supabase
          .from('search_conversation_summaries')
          .insert({
            search_result_id: searchResult.id,
            summary_text: summary,
            markup_content: summary, // For now, using same content
            user_id: userId
          });
      }
    } catch (aiError) {
      console.error('Error generating AI summary:', aiError);
      // Continue without AI summary if it fails
    }

    // Fetch the facilities we just inserted for immediate display
    const { data: facilitiesForDisplay } = await supabase
      .from('unified_facilities')
      .select('*')
      .eq('data_source', 'serperapi')
      .order('created_at', { ascending: false })
      .limit(10);

    return new Response(
      JSON.stringify({
        success: true,
        searchResultId: searchResult.id,
        placesFound: places.length,
        facilities: facilitiesForDisplay || [],
        places: places.slice(0, 10) // Keep for backward compatibility
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in serper-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});