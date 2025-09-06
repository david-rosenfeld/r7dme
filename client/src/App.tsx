import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/main-layout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Projects from "@/pages/projects";
import Research from "@/pages/research";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/contexts/theme-context";
import { HoverEffectsProvider } from "@/contexts/hover-effects-context";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/research" component={Research} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <HoverEffectsProvider>
            <Toaster />
            <Router />
          </HoverEffectsProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
