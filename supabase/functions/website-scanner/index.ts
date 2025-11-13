import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateUrl } from "../_shared/url-validator.ts";
import { checkRateLimit } from "../_shared/rate-limiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
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
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // SSRF protection - validate URL
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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing website scan request for URL:', url);

    // First, let's try to fetch basic information about the website
    let websiteInfo = '';
    try {
      const siteResponse = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) 
      });
      
      websiteInfo = `Status: ${siteResponse.status}, Headers: ${JSON.stringify(Object.fromEntries(siteResponse.headers.entries()))}`;
    } catch (fetchError) {
      websiteInfo = `Could not fetch website: ${fetchError.message}`;
    }

    const analysisPrompt = `As a cybersecurity expert, analyze this website for security threats and safety:

URL: ${url}
Website Info: ${websiteInfo}

Please provide a security analysis including:
1. Overall safety assessment (safe/warning/malicious)
2. Specific security concerns or threats if any
3. SSL/Certificate status assessment
4. General reputation indicators
5. Recommendations for users

Return your response in this JSON format:
{
  "status": "safe|warning|malicious",
  "threats": ["threat1", "threat2"],
  "analysis": "detailed analysis text",
  "recommendations": "safety recommendations"
}`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: analysisPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('Raw AI response:', aiResponse);

    // Try to parse JSON from the AI response
    let scanResult;
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse;
      
      scanResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.log('Failed to parse JSON, providing fallback result');
      // Fallback if AI doesn't return proper JSON
      scanResult = {
        status: 'warning',
        threats: ['Unable to perform complete analysis'],
        analysis: aiResponse,
        recommendations: 'Exercise caution when visiting this website'
      };
    }

    // Ensure required fields exist
    scanResult = {
      url: url,
      status: scanResult.status || 'warning',
      threats: Array.isArray(scanResult.threats) ? scanResult.threats : [],
      analysis: scanResult.analysis || aiResponse,
      recommendations: scanResult.recommendations || 'General web safety precautions recommended',
      scanTime: new Date().toLocaleTimeString()
    };

    console.log('Website scan completed successfully');

    return new Response(
      JSON.stringify(scanResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in website-scanner function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});