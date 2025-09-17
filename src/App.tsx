import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import Homepage from "./pages/Homepage";
import Scanning from "./pages/Scanning";
import QRScanner from "./pages/QRScanner";
import WebsiteScanner from "./pages/WebsiteScanner";
import Settings from "./pages/Settings";
import WiFiSecurity from "./pages/WiFiSecurity";
import OTPSecurity from "./pages/OTPSecurity";
import DataBreach from "./pages/DataBreach";
import AppPermissions from "./pages/AppPermissions";
import AIAnalysis from "./pages/AIAnalysis";
import Firewall from "./pages/Firewall";
import Antivirus from "./pages/Antivirus";
import VirusScanner from "./pages/VirusScanner";
import IPSecurityCheck from "./pages/IPSecurityCheck";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background pb-16">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <Homepage />
                <Footer />
              </>
            } />
            <Route path="/scanning" element={
              <>
                <Header />
                <Scanning />
                <Footer />
              </>
            } />
            <Route path="/qr-scanner" element={
              <>
                <Header />
                <QRScanner />
                <Footer />
              </>
            } />
            <Route path="/website-scanner" element={
              <>
                <Header />
                <WebsiteScanner />
                <Footer />
              </>
            } />
            <Route path="/settings" element={
              <>
                <Header />
                <Settings />
                <Footer />
              </>
            } />
            <Route path="/wifi-security" element={
              <>
                <Header />
                <WiFiSecurity />
                <Footer />
              </>
            } />
            <Route path="/otp-security" element={
              <>
                <Header />
                <OTPSecurity />
                <Footer />
              </>
            } />
            <Route path="/data-breach" element={
              <>
                <Header />
                <DataBreach />
                <Footer />
              </>
            } />
            <Route path="/app-permissions" element={
              <>
                <Header />
                <AppPermissions />
                <Footer />
              </>
            } />
            <Route path="/ai-analysis" element={
              <>
                <Header />
                <AIAnalysis />
                <Footer />
              </>
            } />
            <Route path="/firewall" element={
              <>
                <Header />
                <Firewall />
                <Footer />
              </>
            } />
            <Route path="/antivirus" element={
              <>
                <Header />
                <Antivirus />
                <Footer />
              </>
            } />
            <Route path="/virus-scanner" element={
              <>
                <Header />
                <VirusScanner />
                <Footer />
              </>
            } />
            <Route path="/ip-security-check" element={
              <>
                <Header />
                <IPSecurityCheck />
                <Footer />
              </>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
