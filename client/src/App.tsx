import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GeneralInfoForm from "./pages/GeneralInfoForm";
import AssetsForm from "./pages/AssetsForm";
import OpportunitiesForm from "./pages/OpportunitiesForm";
import ReportPage from "./pages/ReportPage";
import QuestionnairesListPage from "./pages/QuestionnairesListPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/questionnaire/new"} component={() => <GeneralInfoForm />} />
      <Route path={"/assets/:id"} component={({ params }) => <AssetsForm questionnaireId={parseInt(params.id)} />} />
      <Route path={"/opportunities/:id"} component={({ params }) => <OpportunitiesForm questionnaireId={parseInt(params.id)} />} />
      <Route path={"/report/:id"} component={({ params }) => <ReportPage questionnaireId={parseInt(params.id)} />} />
      <Route path={"/questionnaires"} component={QuestionnairesListPage} />
      <Route path={"/analytics"} component={AnalyticsPage} />
      <Route path={"/reports"} component={ReportsPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
