import React from 'react';
import { Share2, ShieldAlert } from 'lucide-react';
import { IntelligenceCard } from '../components/common/IntelligenceCard';

const SocialIntelligencePage: React.FC = () => {
  const signals = [
    {
      id: 1,
      topic: 'AI Medical Diagnosis & 3D Spatial Transformers',
      source: 'Public Developer & Researcher Forums',
      mentions: '1,420 mentions (+84% 7d)',
      sentiment: '88% Positive',
      confidence: 'High Public Interest',
      is_verified_fact: false,
      summary: 'High volume of discussion among clinical radiologists evaluating open weights for 3D CT diagnostic attention models.'
    },
    {
      id: 2,
      topic: 'Nvidia Blackwell FP4 Tensor Core Benchmarks',
      source: 'Hardware Engineers Channel',
      mentions: '3,890 mentions (+120% 7d)',
      sentiment: '92% Positive',
      confidence: 'Verified Discussion Volume',
      is_verified_fact: false,
      summary: 'Developers sharing early benchmark comparisons for low-precision inference throughput.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-600" />
            Social Intelligence & Public Signals
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Permitted Public Signals • Community Sentiment Analysis • Mention Curves
          </p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-mono font-medium">
          Public Signals Filter Active
        </span>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center space-x-2.5 text-xs text-amber-950">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Fact vs Signal Distinction:</strong> Public social signals reflect community sentiment and discussion volume, distinct from peer-reviewed facts or official patent grants.
        </span>
      </div>

      <div className="space-y-4">
        {signals.map((sig) => (
          <IntelligenceCard
            key={sig.id}
            severity="low"
            title={sig.topic}
            summary={sig.summary}
            impact={`Mentions: ${sig.mentions} (${sig.sentiment})`}
            confidence={sig.confidence}
            source={sig.source}
            isFact={false}
            actionText="Inspect Signal"
          />
        ))}
      </div>
    </div>
  );
};

export default SocialIntelligencePage;
