import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { Header } from "@/components/header";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Buyer from "@/pages/buyer";
import Seller from "@/pages/seller";
import BookDetail from "@/pages/book-detail";
import Transactions from "@/pages/transactions";
import BrowsingHistory from "@/pages/history";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/buyer" component={Buyer} />
      <Route path="/seller" component={Seller} />
      <Route path="/book/:id" component={BookDetail} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/history" component={BrowsingHistory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="book-platform-theme">
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <Router />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
