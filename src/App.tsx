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
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background pb-16">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Header />
                  <Homepage />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/scanning" element={
                <ProtectedRoute>
                  <Header />
                  <Scanning />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/qr-scanner" element={
                <ProtectedRoute>
                  <Header />
                  <QRScanner />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/website-scanner" element={
                <ProtectedRoute>
                  <Header />
                  <WebsiteScanner />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Header />
                  <Settings />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/wifi-security" element={
                <ProtectedRoute>
                  <Header />
                  <WiFiSecurity />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/otp-security" element={
                <ProtectedRoute>
                  <Header />
                  <OTPSecurity />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/data-breach" element={
                <ProtectedRoute>
                  <Header />
                  <DataBreach />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/app-permissions" element={
                <ProtectedRoute>
                  <Header />
                  <AppPermissions />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/ai-analysis" element={
                <ProtectedRoute>
                  <Header />
                  <AIAnalysis />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/firewall" element={
                <ProtectedRoute>
                  <Header />
                  <Firewall />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/antivirus" element={
                <ProtectedRoute>
                  <Header />
                  <Antivirus />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/virus-scanner" element={
                <ProtectedRoute>
                  <Header />
                  <VirusScanner />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/ip-security-check" element={
                <ProtectedRoute>
                  <Header />
                  <IPSecurityCheck />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
