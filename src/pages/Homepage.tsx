import { useNavigate } from "react-router-dom";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { QuickActionButton } from "@/components/quick-action-button";
import { Button } from "@/components/ui/button";
import { 
  QrCode, 
  Wifi, 
  Globe, 
  Shield, 
  Database, 
  Settings, 
  Brain, 
  ShieldCheck, 
  Bug 
} from "lucide-react";

const quickActions = [
  { icon: QrCode, label: "Scan QR Code", path: "/qr-scanner" },
  { icon: Wifi, label: "WiFi Security", path: "/wifi-security" },
  { icon: Globe, label: "Scan Website", path: "/website-scanner" },
  { icon: Shield, label: "OTP Security", path: "/otp-security" },
  { icon: Database, label: "Data Breach Security", path: "/data-breach" },
  { icon: Settings, label: "App Permissions Check", path: "/app-permissions" },
  { icon: Brain, label: "AI Analysis", path: "/ai-analysis" },
  { icon: ShieldCheck, label: "Firewall", path: "/firewall" },
  { icon: Bug, label: "Antivirus", path: "/antivirus" },
];

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-muted-foreground text-lg mb-8">
            Your device ultimate protector
          </p>
        </div>

        {/* Device Status Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Your Device Status</h2>
          <p className="text-muted-foreground mb-8">Secure and optimized</p>
          
          {/* Progress Circle */}
          <div className="flex justify-center mb-8">
            <ProgressCircle percentage={94} />
          </div>

          {/* Scan Button */}
          <Button
            onClick={() => navigate("/scanning")}
            className="glow-button text-white font-semibold px-8 py-4 text-lg rounded-full min-w-[280px]"
          >
            Initiate Comprehensive Scan
          </Button>
        </div>

        {/* Quick Actions Section */}
        <div className="animate-fade-in">
          <h3 className="text-2xl font-semibold mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <div
                key={action.label}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <QuickActionButton
                  icon={action.icon}
                  label={action.label}
                  onClick={() => navigate(action.path)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;