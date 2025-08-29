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
    const { ipAddress } = await req.json();
    const abuseIpDbApiKey = Deno.env.get('ABUSEIPDB_API_KEY');
    
    if (!abuseIpDbApiKey) {
      return new Response(
        JSON.stringify({ error: 'AbuseIPDB API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!ipAddress) {
      return new Response(
        JSON.stringify({ error: 'IP address is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Checking IP address:', ipAddress);

    const response = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ipAddress)}&maxAgeInDays=90&verbose`,
      {
        method: 'GET',
        headers: {
          'Key': abuseIpDbApiKey,
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      console.error('AbuseIPDB API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to check IP with AbuseIPDB' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const ipData = data.data;
    
    const securityResult = {
      service: 'AbuseIPDB',
      ipAddress: ipData.ipAddress,
      isPublic: ipData.isPublic,
      ipVersion: ipData.ipVersion,
      isWhitelisted: ipData.isWhitelisted,
      abuseConfidencePercentage: ipData.abuseConfidencePercentage,
      countryCode: ipData.countryCode,
      usageType: ipData.usageType,
      isp: ipData.isp,
      domain: ipData.domain,
      totalReports: ipData.totalReports,
      numDistinctUsers: ipData.numDistinctUsers,
      lastReportedAt: ipData.lastReportedAt,
      status: ipData.abuseConfidencePercentage > 25 ? 'suspicious' : 
              ipData.abuseConfidencePercentage > 0 ? 'warning' : 'clean',
      scanTime: new Date().toISOString()
    };

    console.log('IP security check completed successfully');

    return new Response(
      JSON.stringify(securityResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ip-security-check function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});