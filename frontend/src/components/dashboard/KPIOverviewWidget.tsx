import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  FileCheck,
  Building2,
  Newspaper,
  Share2,
  Lightbulb,
  Bell,
  Target,
  ShieldAlert,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface KPIData {
  kpis?: {
    research_papers?: { count: number; trend: string; status: string };
    patents?: { count: number; trend: string; status: string };
    competitors?: { count: number; trend: string; status: string };
    news_signals?: { count: number; trend: string; status: string };
    social_signals?: { count: number; trend: string; status: string };
    ai_insights?: { count: number; trend: string; status: string };
    active_alerts?: { count: number; trend: string; status: string };
    tracked_targets?: { count: number; trend: string; status: string };
    threats?: { count: number; level: string; status: string };
    opportunities?: { count: number; level: string; status: string };
  };
}

const KPIOverviewWidget: React.FC<{ data?: KPIData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const k = data?.kpis;

  const cards = [
    {
      label: 'Research Papers',
      value: k?.research_papers?.count ?? 'No data',
      trend: k?.research_papers?.trend || 'Active',
      icon: Award,
      href: '/papers',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      label: 'Patents',
      value: k?.patents?.count ?? 'No data',
      trend: k?.patents?.trend || 'Active',
      icon: FileCheck,
      href: '/patents',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      label: 'Competitors',
      value: k?.competitors?.count ?? 'No data',
      trend: k?.competitors?.trend || 'Monitored',
      icon: Building2,
      href: '/competitors',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      label: 'News Signals',
      value: k?.news_signals?.count ?? 'No data',
      trend: k?.news_signals?.trend || 'Active',
      icon: Newspaper,
      href: '/news',
      color: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    {
      label: 'Social Signals',
      value: k?.social_signals?.count ?? 'No data',
      trend: k?.social_signals?.trend || 'Public Feed',
      icon: Share2,
      href: '/social',
      color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200'
    },
    {
      label: 'AI Insights',
      value: k?.ai_insights?.count ?? 'No data',
      trend: k?.ai_insights?.trend || 'Generated',
      icon: Lightbulb,
      href: '/insights',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      label: 'Active Alerts',
      value: k?.active_alerts?.count ?? 'No data',
      trend: k?.active_alerts?.trend || 'Unread',
      icon: Bell,
      href: '/alerts',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    {
      label: 'Tracked Targets',
      value: k?.tracked_targets?.count ?? 'No data',
      trend: k?.tracked_targets?.trend || 'Running',
      icon: Target,
      href: '/tracking',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      label: 'Threats',
      value: k?.threats?.count ?? 'No data',
      trend: k?.threats?.level ? `Level: ${k.threats.level}` : 'Action Needed',
      icon: ShieldAlert,
      href: '/alerts',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      label: 'Opportunities',
      value: k?.opportunities?.count ?? 'No data',
      trend: k?.opportunities?.level ? `Level: ${k.opportunities.level}` : 'Analyzed',
      icon: Sparkles,
      href: '/insights',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
          Executive KPI Command Overview
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">Live Sync • Click card to open module</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            to={card.href}
            className="bg-white border border-slate-200 hover:border-blue-400 p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl border ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-500 block truncate">{card.label}</span>
              <dd className="text-xl font-bold text-slate-900 mt-0.5 font-mono">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </dd>
            </div>

            <span className="text-[10px] font-mono text-emerald-600 font-medium mt-1 block truncate">
              {card.trend}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KPIOverviewWidget;
