import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GeneralInfoForm from "./pages/GeneralInfoForm";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/questionnaire/new"} component={() => <GeneralInfoForm />} />
      <Route path={"/questionnaires"} component={() => <div className="p-8">قائمة الاستبيانات</div>} />
      <Route path={"/analytics"} component={() => <div className="p-8">التحليلات والتقارير</div>} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

