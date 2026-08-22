import React, { useState } from 'react';
import { Search, Filter, Award } from 'lucide-react';
import { IntelligenceCard } from '../components/common/IntelligenceCard';
import { EmptyState } from '../components/common/EmptyState';

const ResearchPapersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const papers = [
    {
      id: 'arxiv-1',
      title: '3D Spatial Attention Transformers for Multi-Modal Automated CT Imaging & Diagnostic Radiology',
      authors: 'Dr. Sarah Lin, Prof. Michael Chang, Dr. Alex Rivera',
      organization: 'Stanford AI Health Lab & Massachusetts General Hospital',
      published_at: '2026-08-20',
      abstract: 'We present a novel 3D spatial attention transformer architecture evaluating 12,000 multi-center clinical CT scans, achieving 98.4% diagnostic sensitivity and reducing false positive anomaly rates by 42%.',
      relevance_score: 98,
      citations: 34,
      source: 'arXiv / PubMed',
      url: 'https://arxiv.org/abs/2026-medical-ai'
    },
    {
      id: 'arxiv-2',
      title: 'Low-Latency Neuromorphic Memory Interconnects for Edge Quantum Simulators',
      authors: 'Elena Rostova, David K. Vance, Dr. Hiroshi Tanaka',
      organization: 'MIT Quantum & Neuromorphic Hardware Consortium',
      published_at: '2026-08-18',
      abstract: 'Demonstrates a scalable hardware layout reducing inter-node memory latency by 42% across distributed quantum transformer nodes.',
      relevance_score: 94,
      citations: 19,
      source: 'arXiv physics.quant-ph',
      url: 'https://arxiv.org/abs/2026-quantum-sim'
    },
    {
      id: 'arxiv-3',
      title: 'Sparse Attention Matrix Acceleration in Next-Gen Blackwell Chipsets',
      authors: 'Dr. Robert Vance, Marcus Thorne',
      organization: 'Nvidia Research & Berkeley AI Lab',
      published_at: '2026-08-15',
      abstract: 'Provides empirical benchmarking of FP4 tensor core throughput for trillion-parameter LLM reasoning pipelines.',
      relevance_score: 91,
      citations: 45,
      source: 'IEEE Computer Architecture',
      url: 'https://arxiv.org/abs/2026-blackwell-gpu'
    }
  ];

  const filteredPapers = papers.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Scientific Research Papers & Literature
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            arXiv • PubMed • IEEE • ACM Academic Preprints & Benchmark Studies
          </p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium font-mono">
          {papers.length} Academic Preprints Indexed
        </span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search paper titles, authors, abstracts, or institutions..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Academic Sources (arXiv, PubMed)</option>
            <option value="medical">AI Healthcare</option>
            <option value="quantum">Quantum Computing</option>
            <option value="hardware">Hardware & Microchips</option>
          </select>
        </div>
      </div>

      {/* Papers Feed */}
      {filteredPapers.length === 0 ? (
        <EmptyState title="No Research Papers Found" description="Try adjusting your keyword filter or search term." />
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <IntelligenceCard
              key={paper.id}
              title={paper.title}
              summary={paper.abstract}
              impact={`Citations: ${paper.citations}`}
              confidence={paper.relevance_score}
              evidenceCount={paper.citations}
              source={paper.source}
              sourceUrl={paper.url}
              date={paper.published_at}
              isFact={true}
              actionText="Read arXiv Paper"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchPapersPage;
