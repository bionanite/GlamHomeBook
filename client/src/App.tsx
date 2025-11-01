import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import FindBeauticians from "@/pages/FindBeauticians";
import BeauticianOnboarding from "@/pages/BeauticianOnboarding";
import BeauticianDashboard from "@/pages/BeauticianDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import BeauticianProfile from "@/pages/BeauticianProfile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-beauticians" component={FindBeauticians} />
      <Route path="/become-beautician" component={BeauticianOnboarding} />
      <Route path="/beautician/dashboard" component={BeauticianDashboard} />
      <Route path="/customer/dashboard" component={CustomerDashboard} />
      <Route path="/beauticians/:id" component={BeauticianProfile} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
