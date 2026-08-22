import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface ThreatItem {
  title: string;
  severity: string;
  impact: string;
  confidence: string;
  date: string;
  evidence: string;
}

interface OpportunityItem {
  title: string;
  severity: string;
  impact: string;
  confidence: string;
  date: string;
  evidence: string;
}

interface ThreatOppData {
  threats?: ThreatItem[];
  opportunities?: OpportunityItem[];
}

const ThreatOpportunityWidget: React.FC<{ data?: ThreatOppData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const threats = data?.threats || [];
  const opportunities = data?.opportunities || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Threats Panel */}
      <div className="bg-rose-950/20 border border-rose-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-rose-200/60 pb-2.5">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-sm text-rose-950 uppercase font-mono">
              CRITICAL THREAT RADAR
            </h3>
          </div>
          <Link to="/alerts" className="text-xs text-rose-700 font-semibold font-mono flex items-center gap-1 hover:underline">
            <span>View Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {threats.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono py-2">No critical threats detected.</p>
        ) : (
          threats.map((t, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{t.title}</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-mono px-2 py-0.5 rounded font-bold uppercase">
                  {t.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600">{t.evidence}</p>
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                <span>Impact: {t.impact}</span>
                <span>Confidence: {t.confidence}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Opportunities Panel */}
      <div className="bg-cyan-950/20 border border-cyan-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-cyan-200/60 pb-2.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-sm text-cyan-950 uppercase font-mono">
              STRATEGIC OPPORTUNITIES
            </h3>
          </div>
          <Link to="/insights" className="text-xs text-cyan-700 font-semibold font-mono flex items-center gap-1 hover:underline">
            <span>View Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono py-2">No strategic opportunities detected.</p>
        ) : (
          opportunities.map((o, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-cyan-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{o.title}</span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 font-mono px-2 py-0.5 rounded font-bold uppercase">
                  {o.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600">{o.evidence}</p>
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                <span>Impact: {o.impact}</span>
                <span>Confidence: {o.confidence}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThreatOpportunityWidget;
