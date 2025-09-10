import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <Homepage />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/scanning" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <Scanning />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/qr-scanner" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <QRScanner />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/website-scanner" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <WebsiteScanner />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <Settings />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/wifi-security" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <WiFiSecurity />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/otp-security" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <OTPSecurity />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/data-breach" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <DataBreach />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/app-permissions" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <AppPermissions />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/ai-analysis" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <AIAnalysis />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/firewall" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <Firewall />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/antivirus" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <Antivirus />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/virus-scanner" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <VirusScanner />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/ip-security-check" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                  <Header />
                  <IPSecurityCheck />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
