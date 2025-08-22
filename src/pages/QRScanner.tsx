import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isSafe, setIsSafe] = useState<boolean | null>(null);

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    setIsSafe(null);
    
    // Simulate QR code detection after 3 seconds
    setTimeout(() => {
      const mockResult = "https://example.com/secure-link";
      const mockSafety = Math.random() > 0.3; // 70% chance of being safe
      
      setScanResult(mockResult);
      setIsSafe(mockSafety);
      setIsScanning(false);
    }, 3000);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const resetScanner = () => {
    setIsScanning(false);
    setScanResult(null);
    setIsSafe(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
          <p className="text-muted-foreground">
            Scan QR codes to check for security threats
          </p>
        </div>

        {/* Camera View */}
        <div className="glass-card p-6 rounded-2xl mb-6 animate-fade-in">
          <div className="aspect-video bg-secondary/20 rounded-lg mb-6 relative overflow-hidden">
            {!isScanning && !scanResult && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Camera preview will appear here</p>
                </div>
              </div>
            )}
            
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-48 border-2 border-primary rounded-lg relative mb-4">
                    <div className="absolute inset-2 border border-primary/50 rounded animate-pulse"></div>
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
                  </div>
                  <p className="text-primary font-medium">Point camera at QR code</p>
                  <p className="text-sm text-muted-foreground mt-1">Scanning for codes...</p>
                </div>
              </div>
            )}

            {scanResult && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  {isSafe ? (
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  ) : (
                    <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  )}
                  <h3 className={`text-xl font-semibold mb-2 ${isSafe ? 'text-success' : 'text-destructive'}`}>
                    {isSafe ? 'Safe QR Code' : 'Potentially Malicious'}
                  </h3>
                  <p className="text-sm text-muted-foreground break-all">
                    {scanResult}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {!isScanning && !scanResult && (
              <Button
                onClick={startScanning}
                className="glow-button text-white px-6 py-2"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            )}
            
            {isScanning && (
              <Button
                onClick={stopScanning}
                variant="destructive"
                className="px-6 py-2"
              >
                Stop Scanning
              </Button>
            )}
            
            {scanResult && (
              <Button
                onClick={resetScanner}
                className="glow-button text-white px-6 py-2"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Scan Another
              </Button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-card p-4 rounded-lg animate-fade-in">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Position the QR code within the scanning frame</li>
            <li>• Keep the camera steady and ensure good lighting</li>
            <li>• The scanner will automatically detect and analyze the code</li>
            <li>• Review the security assessment before proceeding</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;