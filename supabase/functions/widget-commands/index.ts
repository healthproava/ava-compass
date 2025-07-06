import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WidgetCommand {
  commandType: 'display_cards' | 'navigate' | 'populate_map' | 'show_tooltip' | 'compare_facilities';
  commandData: any;
  userId?: string;
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

    const { commandType, commandData }: WidgetCommand = await req.json();
    
    if (!commandType || !commandData) {
      return new Response(
        JSON.stringify({ error: 'Command type and data are required' }),
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

    // Store the command
    const { data: command, error: commandError } = await supabase
      .from('widget_commands')
      .insert({
        user_id: userId,
        command_type: commandType,
        command_data: commandData
      })
      .select()
      .single();

    if (commandError) {
      throw commandError;
    }

    // Process different command types
    let response: any = { success: true, commandId: command.id };

    switch (commandType) {
      case 'display_cards':
        response.cards = commandData.facilities?.map((facility: any) => ({
          id: facility.id,
          title: facility.name,
          address: facility.address,
          rating: facility.rating,
          phone: facility.phone,
          website: facility.website
        })) || [];
        break;

      case 'navigate':
        response.navigationUrl = commandData.url || '/';
        break;

      case 'populate_map':
        response.mapData = {
          center: commandData.center || { lat: 44.9429, lng: -123.0351 }, // Default to Salem, OR
          markers: commandData.facilities?.map((facility: any) => ({
            id: facility.id,
            position: { lat: facility.latitude, lng: facility.longitude },
            title: facility.name,
            address: facility.address
          })) || []
        };
        break;

      case 'show_tooltip':
        response.tooltip = {
          content: commandData.content,
          position: commandData.position || 'top'
        };
        break;

      case 'compare_facilities':
        // Call compare-facilities function
        const { data: comparisonResult, error: comparisonError } = await supabase.functions.invoke('compare-facilities', {
          body: {
            facilityIds: commandData.facilityIds,
            saveComparison: commandData.saveComparison || false
          },
          headers: authHeader ? { Authorization: authHeader } : {}
        });

        if (comparisonError) {
          throw comparisonError;
        }

        response.comparison = comparisonResult;
        break;

      default:
        throw new Error(`Unknown command type: ${commandType}`);
    }

    // Mark command as processed
    await supabase
      .from('widget_commands')
      .update({ processed: true })
      .eq('id', command.id);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in widget-commands function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});