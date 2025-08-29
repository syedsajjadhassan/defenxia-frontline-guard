import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    const safeBrowsingApiKey = Deno.env.get('SAFE_BROWSING_API_KEY');
    
    if (!safeBrowsingApiKey) {
      return new Response(
        JSON.stringify({ error: 'Safe Browsing API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Checking URL with Safe Browsing:', url);

    const requestBody = {
      client: {
        clientId: "defenxia-security-app",
        clientVersion: "1.0.0"
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [
          { url: url }
        ]
      }
    };

    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${safeBrowsingApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      console.error('Safe Browsing API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to check URL with Safe Browsing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    const safeBrowsingResult = {
      service: 'Google Safe Browsing',
      url: url,
      threats: data.matches || [],
      status: data.matches && data.matches.length > 0 ? 'malicious' : 'safe',
      threatTypes: data.matches ? data.matches.map((match: any) => match.threatType) : [],
      scanTime: new Date().toISOString()
    };

    console.log('Safe Browsing check completed successfully');

    return new Response(
      JSON.stringify(safeBrowsingResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in safe-browsing-check function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});