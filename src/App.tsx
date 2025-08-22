import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/header";
import Homepage from "./pages/Homepage";
import Scanning from "./pages/Scanning";
import QRScanner from "./pages/QRScanner";
import WebsiteScanner from "./pages/WebsiteScanner";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/scanning" element={<Scanning />} />
            <Route path="/qr-scanner" element={<QRScanner />} />
            <Route path="/website-scanner" element={<WebsiteScanner />} />
            <Route path="/settings" element={<Settings />} />
            {/* Placeholder routes for other quick actions */}
            <Route path="/wifi-security" element={<NotFound />} />
            <Route path="/otp-security" element={<NotFound />} />
            <Route path="/data-breach" element={<NotFound />} />
            <Route path="/app-permissions" element={<NotFound />} />
            <Route path="/ai-analysis" element={<NotFound />} />
            <Route path="/firewall" element={<NotFound />} />
            <Route path="/antivirus" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
