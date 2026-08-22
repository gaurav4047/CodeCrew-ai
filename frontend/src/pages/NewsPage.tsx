import React from 'react';
import { Newspaper } from 'lucide-react';
import { IntelligenceCard } from '../components/common/IntelligenceCard';

const NewsPage: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      title: 'FDA Grants Breakthrough Device Designation for AI Spatial Radiology Platform',
      source: 'Healthcare Technology Press',
      published_at: '2026-08-22',
      confidence: '96%',
      category: 'Regulatory',
      summary: 'The U.S. FDA has granted breakthrough device status to 3D spatial attention CT diagnostic software following multi-center clinical validation.',
      url: 'https://news.google.com'
    },
    {
      id: 2,
      title: 'Major Microchip Producer Announces $4B Foundry Expansion for FP4 Tensor Cores',
      source: 'Global Semiconductor Digest',
      published_at: '2026-08-21',
      confidence: '94%',
      category: 'Competitor Activity',
      summary: 'Infrastructure expansion targeted at scaling high-density silicon interconnects and Blackwell GPU deployment.',
      url: 'https://news.google.com'
    },
    {
      id: 3,
      title: 'Quantum Simulator Achieves Sub-Microsecond Surface Code Error Correction',
      source: 'Quantum Computing Insider',
      published_at: '2026-08-19',
      confidence: '91%',
      category: 'Breakthrough',
      summary: 'Benchmarking results confirm cryo-logic interposers overcome long-standing decoherence barriers in quantum matrix multiplication.',
      url: 'https://news.google.com'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-sky-600" />
            Industry News & Media Feed
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Global Tech Press • Corporate Releases • Regulatory Designations
          </p>
        </div>
        <span className="text-xs bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-mono font-medium">
          Live Press Feed Active
        </span>
      </div>

      <div className="space-y-4">
        {newsItems.map((item) => (
          <IntelligenceCard
            key={item.id}
            severity="info"
            title={item.title}
            summary={item.summary}
            impact={`Category: ${item.category}`}
            confidence={item.confidence}
            source={item.source}
            sourceUrl={item.url}
            date={item.published_at}
            isFact={true}
            actionText="Read News Article"
          />
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
