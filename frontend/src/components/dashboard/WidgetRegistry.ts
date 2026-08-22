import React from 'react';
import KPIOverviewWidget from './KPIOverviewWidget';
import ActiveResearchWidget from './ActiveResearchWidget';
import LatestIntelligenceFeedWidget from './LatestIntelligenceFeedWidget';
import ThreatOpportunityWidget from './ThreatOpportunityWidget';
import ResearchOverviewWidget from './ResearchOverviewWidget';
import PatentLandscapeWidget from './PatentLandscapeWidget';
import CompetitorOverviewWidget from './CompetitorOverviewWidget';
import IndustrySocialSignalsWidget from './IndustrySocialSignalsWidget';
import TrendRadarWidget from './TrendRadarWidget';
import AgentSystemWidget from './AgentSystemWidget';
import AgenticCapabilityWidget from './AgenticCapabilityWidget';
import AlertCenterWidget from './AlertCenterWidget';
import TrackingOverviewWidget from './TrackingOverviewWidget';
import SystemHealthWidget from './SystemHealthWidget';
import KnowledgeGraphWidget from './KnowledgeGraphWidget';
import ReportsSummaryWidget from './ReportsSummaryWidget';
import MemorySummaryWidget from './MemorySummaryWidget';

export interface WidgetProps {
  data?: any;
  jobs?: any;
  items?: any;
  health?: any;
  sources?: any;
  loading?: boolean;
}

export interface DashboardWidgetConfig {
  id: string;
  name: string;
  component: React.ComponentType<WidgetProps>;
  category: string;
  enabled: boolean;
}

export const WIDGET_REGISTRY: DashboardWidgetConfig[] = [
  { id: 'kpi_overview', name: 'Executive KPI Command Overview', component: KPIOverviewWidget, category: 'kpi', enabled: true },
  { id: 'active_research', name: 'Active AI Research Jobs & Execution Pipeline', component: ActiveResearchWidget, category: 'agents', enabled: true },
  { id: 'latest_intelligence', name: 'Latest Intelligence Event Stream', component: LatestIntelligenceFeedWidget, category: 'intelligence', enabled: true },
  { id: 'threat_opportunity', name: 'Critical Threats & Strategic Opportunities', component: ThreatOpportunityWidget, category: 'insights', enabled: true },
  { id: 'research_overview', name: 'Research & Academic Literature Landscape', component: ResearchOverviewWidget, category: 'research', enabled: true },
  { id: 'patent_landscape', name: 'Patent & IP Intelligence Landscape', component: PatentLandscapeWidget, category: 'patents', enabled: true },
  { id: 'competitor_overview', name: 'Competitor Intelligence Overview', component: CompetitorOverviewWidget, category: 'competitors', enabled: true },
  { id: 'industry_social', name: 'Industry News & Public Social Signals', component: IndustrySocialSignalsWidget, category: 'news_social', enabled: true },
  { id: 'trend_radar', name: 'Emerging Technology Trend Radar', component: TrendRadarWidget, category: 'trends', enabled: true },
  { id: 'agent_system', name: 'AI Agent Framework Overview', component: AgentSystemWidget, category: 'agents', enabled: true },
  { id: 'agentic_capability', name: 'Enterprise Agentic Capabilities Summary', component: AgenticCapabilityWidget, category: 'agents', enabled: true },
  { id: 'alerts_overview', name: 'Priority Alerts Center', component: AlertCenterWidget, category: 'alerts', enabled: true },
  { id: 'tracking_overview', name: 'Active Monitoring & Tracking Targets', component: TrackingOverviewWidget, category: 'tracking', enabled: true },
  { id: 'system_health', name: 'Platform & Data Source Health', component: SystemHealthWidget, category: 'health', enabled: true },
  { id: 'graph_summary', name: 'Knowledge Graph Summary', component: KnowledgeGraphWidget, category: 'graph', enabled: true },
  { id: 'reports_summary', name: 'Executive Reports Summary', component: ReportsSummaryWidget, category: 'reports', enabled: true },
  { id: 'memory_summary', name: 'AI Agent Memory Engine Status', component: MemorySummaryWidget, category: 'memory', enabled: true },
];
