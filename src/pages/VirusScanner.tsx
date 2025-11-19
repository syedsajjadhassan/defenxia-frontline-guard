import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { invokeEdgeFunction } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Shield, AlertTriangle, CheckCircle, FileSearch, Globe } from "lucide-react";

interface ScanResult {
  service: string;
  resource: string;
  positives: number;
  total: number;
  status: string;
  scanDate: string;
  permalink?: string;
  verbose_msg?: string;
}

const VirusScanner = () => {
  const [url, setUrl] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanType, setScanType] = useState<'url' | 'hash'>('url');

  const handleScan = async () => {
    let target = scanType === 'url' ? url : fileHash;
    if (!target.trim()) {
      toast.error(`Please enter a ${scanType === 'url' ? 'URL' : 'file hash'}`);
      return;
    }

    // Handle defanged URLs and normalize URL format
    if (scanType === 'url' && target) {
      // Refang defanged URLs (hxxp:// -> http://, hxxps:// -> https://)
      target = target.replace(/^hxxp:\/\//i, 'http://').replace(/^hxxps:\/\//i, 'https://');
      
      // Add https:// if no protocol is present
      if (!target.match(/^https?:\/\//i)) {
        target = `https://${target}`;
      }
    }

    setIsScanning(true);
    try {
      const { data, error } = await invokeEdgeFunction('virus-scan', 
        scanType === 'url' ? { url: target } : { fileHash: target }
      );

      if (error) {
        console.error('VirusTotal scan error:', error);
        toast.error('Failed to scan with VirusTotal');
      } else {
        setScanResult(data);
        toast.success('VirusTotal scan completed');
      }
    } catch (err) {
      console.error('Scan error:', err);
      toast.error('Error performing scan');
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'text-green-500';
      case 'malicious': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean': return CheckCircle;
      case 'malicious': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">VirusTotal Scanner</h1>
          </div>
          <p className="text-muted-foreground">
            Scan URLs and file hashes using VirusTotal's comprehensive antivirus engines
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scanType === 'url' ? <Globe className="h-5 w-5" /> : <FileSearch className="h-5 w-5" />}
              VirusTotal {scanType === 'url' ? 'URL' : 'File Hash'} Scanner
            </CardTitle>
            <CardDescription>
              Enter a {scanType === 'url' ? 'URL' : 'file hash (MD5, SHA1, SHA256)'} to check for malware
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={scanType === 'url' ? 'default' : 'outline'}
                onClick={() => setScanType('url')}
                className="flex-1"
              >
                Scan URL
              </Button>
              <Button
                variant={scanType === 'hash' ? 'default' : 'outline'}
                onClick={() => setScanType('hash')}
                className="flex-1"
              >
                Scan File Hash
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder={scanType === 'url' ? 'Enter URL (e.g., https://example.com)' : 'Enter file hash (MD5, SHA1, SHA256)'}
                value={scanType === 'url' ? url : fileHash}
                onChange={(e) => scanType === 'url' ? setUrl(e.target.value) : setFileHash(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isScanning && handleScan()}
              />
              <Button onClick={handleScan} disabled={isScanning}>
                {isScanning ? 'Scanning...' : 'Scan'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {scanResult && (
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = getStatusIcon(scanResult.status);
                  return <Icon className={`h-5 w-5 ${getStatusColor(scanResult.status)}`} />;
                })()}
                Scan Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Resource</h4>
                  <p className="text-sm text-muted-foreground break-all">{scanResult.resource}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge variant={scanResult.status === 'clean' ? 'default' : 'destructive'}>
                    {scanResult.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Detection Ratio</h4>
                  <p className="text-sm">
                    <span className={scanResult.positives > 0 ? 'text-red-500' : 'text-green-500'}>
                      {scanResult.positives}
                    </span>
                    {' / '}
                    <span>{scanResult.total}</span>
                    {' engines detected threats'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Scan Date</h4>
                  <p className="text-sm text-muted-foreground">{scanResult.scanDate}</p>
                </div>
              </div>

              {scanResult.verbose_msg && (
                <div>
                  <h4 className="font-semibold mb-2">Message</h4>
                  <p className="text-sm text-muted-foreground">{scanResult.verbose_msg}</p>
                </div>
              )}

              {scanResult.permalink && (
                <Button 
                  variant="outline" 
                  onClick={() => window.open(scanResult.permalink, '_blank')}
                  className="w-full"
                >
                  View Detailed Report on VirusTotal
                </Button>
              )}

              <Button 
                onClick={() => setScanResult(null)} 
                variant="ghost" 
                className="w-full"
              >
                Scan Another {scanType === 'url' ? 'URL' : 'File'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle>About VirusTotal</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• VirusTotal analyzes files and URLs with 60+ antivirus engines</li>
              <li>• URL scanning checks for malicious websites and phishing attempts</li>
              <li>• File hash scanning verifies known malware signatures</li>
              <li>• Results show detection ratio across multiple security vendors</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VirusScanner;