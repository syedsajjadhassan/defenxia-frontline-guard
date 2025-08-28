import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Search, CheckCircle, AlertTriangle, Shield, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ScanResult {
  url: string;
  status: 'safe' | 'malicious' | 'warning';
  threats: string[];
  scanTime: string;
  analysis?: string;
  recommendations?: string;
}

const WebsiteScanner = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScan = async () => {
    if (!url.trim()) return;
    
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('website-scanner', {
        body: { url: url }
      });

      if (error) {
        throw new Error(error.message);
      }

      setScanResult(data);
    } catch (error) {
      // Fallback to mock data if API fails
      const fallbackResult: ScanResult = {
        url: url,
        status: 'warning',
        threats: ['Unable to complete AI-powered scan'],
        scanTime: new Date().toLocaleTimeString(),
        analysis: 'AI scanning service is currently unavailable. Please ensure the Gemini API key is configured.',
        recommendations: 'Exercise caution and manually verify website safety.'
      };
      setScanResult(fallbackResult);
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'warning': return 'text-warning';
      case 'malicious': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'malicious': return AlertTriangle;
      default: return Shield;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'safe': return 'Website is Safe';
      case 'warning': return 'Potential Issues Detected';
      case 'malicious': return 'Malicious Website Detected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Website Scanner</h1>
          <p className="text-muted-foreground">
            Check websites for security threats and malicious content
          </p>
        </div>

        {/* Scanner Input */}
        <div className="glass-card p-6 rounded-2xl mb-6 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Website URL</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-secondary/50 border-border"
                disabled={isScanning}
              />
            </div>
            
            <Button
              onClick={handleScan}
              disabled={!url.trim() || isScanning}
              className="w-full glow-button text-white py-2"
            >
              {isScanning ? (
                <>
                  <Search className="h-4 w-4 mr-2 animate-spin" />
                  Scanning Website...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Scan Website
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Scanning Progress */}
        {isScanning && (
          <div className="glass-card p-6 rounded-2xl mb-6 animate-fade-in">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Analyzing Website Security</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Checking SSL certificate</p>
                <p>• Scanning for malware</p>
                <p>• Analyzing reputation</p>
                <p>• Verifying domain safety</p>
              </div>
            </div>
          </div>
        )}

        {/* Scan Results */}
        {scanResult && (
          <div className="glass-card p-6 rounded-2xl animate-fade-in">
            <div className="text-center mb-6">
              {React.createElement(getStatusIcon(scanResult.status), {
                className: `h-16 w-16 mx-auto mb-4 ${getStatusColor(scanResult.status)}`
              })}
              <h3 className={`text-2xl font-bold mb-2 ${getStatusColor(scanResult.status)}`}>
                {getStatusText(scanResult.status)}
              </h3>
              <p className="text-muted-foreground break-all">
                {scanResult.url}
              </p>
            </div>

            {/* Scan Details */}
            <div className="border-t border-border pt-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scan completed at:</span>
                  <span className="text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {scanResult.scanTime}
                  </span>
                </div>
                
                {scanResult.threats.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-destructive">Threats Detected:</h4>
                    <ul className="space-y-1">
                      {scanResult.threats.map((threat, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {scanResult.status === 'safe' && (
                  <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-success text-sm">
                      This website appears to be safe and legitimate. No security threats detected.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => {
                setScanResult(null);
                setUrl("");
              }}
              variant="outline"
              className="w-full mt-4"
            >
              Scan Another Website
            </Button>
          </div>
        )}

        {/* Safety Tips */}
        <div className="glass-card p-4 rounded-lg animate-fade-in">
          <h3 className="font-semibold mb-2">Safety Tips:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Always verify URLs before entering sensitive information</li>
            <li>• Look for HTTPS and valid SSL certificates</li>
            <li>• Be cautious of shortened URLs and suspicious domains</li>
            <li>• Never download files from untrusted websites</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebsiteScanner;