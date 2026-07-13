import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminDataProvider } from "@/context/AdminDataContext";
import { useAdminData } from "@/hooks/useAdminData";
import { ThemeProvider } from "next-themes";
import { SpeedInsights } from "@vercel/speed-insights/react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import HivemindAI from "@/pages/HivemindAI";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Disclaimer from "@/pages/Disclaimer";
import ContactPage from "@/pages/ContactPage";

const queryClient = new QueryClient();

function SeoManager() {
  const { data } = useAdminData();
  
  useEffect(() => {
    document.title = data.seoTitle;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', data.seoDescription);

    let linkFavicon = document.querySelector('link[rel="icon"]');
    if (!linkFavicon) {
      linkFavicon = document.createElement('link');
      linkFavicon.setAttribute('rel', 'icon');
      document.head.appendChild(linkFavicon);
    }
    if (data.faviconDataUrl) {
      linkFavicon.setAttribute('href', data.faviconDataUrl);
    } else {
      linkFavicon.setAttribute('href', '/favicon.svg');
    }
  }, [data.seoTitle, data.seoDescription, data.faviconDataUrl]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/hivemind-ai" component={HivemindAI} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="hivemind-theme">
      <QueryClientProvider client={queryClient}>
        <AdminDataProvider>
          <TooltipProvider>
            <SeoManager />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <SpeedInsights />
          </TooltipProvider>
        </AdminDataProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
