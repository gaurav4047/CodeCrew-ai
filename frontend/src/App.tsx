import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResearchWorkspace from './pages/ResearchWorkspace';
import ObservabilityDashboard from './pages/ObservabilityDashboard';
import TracesPage from './pages/TracesPage';
import AgentEvaluationDashboard from './pages/AgentEvaluationDashboard';
import TestCasesPage from './pages/TestCasesPage';
import EvaluationRunsPage from './pages/EvaluationRunsPage';
import EvaluationResultDetail from './pages/EvaluationResultDetail';
import EvaluationBaselineCompare from './pages/EvaluationBaselineCompare';
import ResearchPapersPage from './pages/ResearchPapersPage';
import PatentsPage from './pages/PatentsPage';
import CompetitorsPage from './pages/CompetitorsPage';
import NewsPage from './pages/NewsPage';
import SocialIntelligencePage from './pages/SocialIntelligencePage';
import TrendsPage from './pages/TrendsPage';
import Insights from './pages/Insights';
import AlertsPage from './pages/AlertsPage';
import Tracking from './pages/Tracking';
import ReportsPage from './pages/ReportsPage';
import CollectionsPage from './pages/CollectionsPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="research" element={<ResearchWorkspace />} />
          <Route path="observability" element={<ObservabilityDashboard />} />
          <Route path="observability/traces" element={<TracesPage />} />
          <Route path="observability/traces/:traceId" element={<TracesPage />} />
          <Route path="evaluation" element={<AgentEvaluationDashboard />} />
          <Route path="evaluation/test-cases" element={<TestCasesPage />} />
          <Route path="evaluation/runs" element={<EvaluationRunsPage />} />
          <Route path="evaluation/results/:id" element={<EvaluationResultDetail />} />
          <Route path="evaluation/compare" element={<EvaluationBaselineCompare />} />
          <Route path="papers" element={<ResearchPapersPage />} />
          <Route path="patents" element={<PatentsPage />} />
          <Route path="competitors" element={<CompetitorsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="social" element={<SocialIntelligencePage />} />
          <Route path="trends" element={<TrendsPage />} />
          <Route path="insights" element={<Insights />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="graph" element={<KnowledgeGraphPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
