import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Marketing Pages
const Index = lazy(() => import("./pages/Index"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Demo = lazy(() => import("./pages/Demo"));
const DemoTour = lazy(() => import("./pages/DemoTour"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

// App Pages
const Dashboard = lazy(() => import("./pages/app/Dashboard"));
const Duplicates = lazy(() => import("./pages/app/Duplicates"));
const Enrichment = lazy(() => import("./pages/app/Enrichment"));
const Reactivation = lazy(() => import("./pages/app/Reactivation"));
const Settings = lazy(() => import("./pages/app/Settings"));
const ApiKeys = lazy(() => import("./pages/app/ApiKeys"));

// App Layout
import { AppLayout } from "./components/app/AppLayout";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Marketing */}
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/demo-tour" element={<DemoTour />} />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* App (protected) */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="duplicates" element={<Duplicates />} />
                <Route path="enrichment" element={<Enrichment />} />
                <Route path="reactivation" element={<Reactivation />} />
                <Route path="settings" element={<Settings />} />
                <Route path="api" element={<ApiKeys />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
