import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Leads from "@/pages/leads";
import Customers from "@/pages/customers";
import Projects from "@/pages/projects";
import Inventory from "@/pages/inventory";
import Payments from "@/pages/payments";
import Communications from "@/pages/communications";
import ChannelPartners from "@/pages/channel-partners";
import Reports from "@/pages/reports";
import UserManagement from "@/pages/user-management";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/leads" component={Leads} />
      <ProtectedRoute path="/customers" component={Customers} />
      <ProtectedRoute path="/projects" component={Projects} />
      <ProtectedRoute path="/inventory" component={Inventory} />
      <ProtectedRoute path="/payments" component={Payments} />
      <ProtectedRoute path="/communications" component={Communications} />
      <ProtectedRoute path="/channel-partners" component={ChannelPartners} />
      <ProtectedRoute path="/reports" component={Reports} />
      <ProtectedRoute path="/user-management" component={UserManagement} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
