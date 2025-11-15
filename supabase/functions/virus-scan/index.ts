import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateUrl, validateInput } from "../_shared/url-validator.ts";
import { checkRateLimit } from "../_shared/rate-limiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, fileHash } = await req.json();
    
    // Validate session ID
    const sessionId = req.headers.get('x-session-id');
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(sessionId);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          resetAt: rateLimitResult.resetAt
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const virusTotalApiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
    
    if (!virusTotalApiKey) {
      return new Response(
        JSON.stringify({ error: 'VirusTotal API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!url && !fileHash) {
      return new Response(
        JSON.stringify({ error: 'URL or file hash is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate URL if provided
    if (url) {
      const urlValidation = validateUrl(url);
      if (!urlValidation.valid) {
        return new Response(
          JSON.stringify({ error: urlValidation.error }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Validate file hash if provided
    if (fileHash) {
      const hashValidation = validateInput(fileHash, 256);
      if (!hashValidation.valid) {
        return new Response(
          JSON.stringify({ error: hashValidation.error }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    let response;
    let apiUrl;

    if (url) {
      // Scan URL using v3 API
      const urlId = btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      apiUrl = `https://www.virustotal.com/api/v3/urls/${urlId}`;
      response = await fetch(apiUrl, {
        headers: {
          'x-apikey': virusTotalApiKey
        }
      });
    } else if (fileHash) {
      // Scan file hash using v3 API
      apiUrl = `https://www.virustotal.com/api/v3/files/${fileHash}`;
      response = await fetch(apiUrl, {
        headers: {
          'x-apikey': virusTotalApiKey
        }
      });
    }

    if (!response.ok) {
      console.error('VirusTotal API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to scan with VirusTotal' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    const attributes = data.data?.attributes || {};
    const stats = attributes.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const total = Object.values(stats).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0);
    
    const scanResult = {
      service: 'VirusTotal',
      resource: url || fileHash,
      scanId: data.data?.id,
      permalink: `https://www.virustotal.com/gui/${url ? 'url' : 'file'}/${data.data?.id}`,
      responseCode: data.data ? 1 : 0,
      verbose_msg: malicious > 0 ? 'Resource found and flagged' : 'Resource found and clean',
      positives: malicious,
      total: total,
      scanDate: attributes.last_analysis_date ? new Date(attributes.last_analysis_date * 1000).toISOString() : new Date().toISOString(),
      status: malicious > 0 ? 'malicious' : 'clean',
      scans: attributes.last_analysis_results,
      scanTime: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(scanResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in virus-scan function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});