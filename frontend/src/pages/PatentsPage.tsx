import React, { useState } from 'react';
import { Search, FileCheck } from 'lucide-react';
import { IntelligenceCard } from '../components/common/IntelligenceCard';
import { EmptyState } from '../components/common/EmptyState';

const PatentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const patents = [
    {
      id: 'US20260191A1',
      title: 'Scalable Low-Latency Neuromorphic Memory Interconnects for Deep Learning Clusters',
      applicant: 'Interconnect Technologies Inc.',
      assignee: 'Interconnect Technologies Corporation',
      filing_date: '2025-11-10',
      publication_date: '2026-08-21',
      status: 'Published Application',
      technology: 'Neuromorphic Microchips & Hardware Interconnects',
      relevance: '96%',
      claims_summary: 'Claims a high-density 3D silicon interposer configuration optimizing inter-node memory latency by 42% for sparse attention matrix compute.',
      url: 'https://patents.google.com/patent/US20260191A1/en'
    },
    {
      id: 'US20260844B2',
      title: 'Automated 3D Attention Radiologic Diagnostics & Anomaly Spotting System',
      applicant: 'MedAI Diagnostics Corp',
      assignee: 'MedAI Global Health Ltd.',
      filing_date: '2025-09-14',
      publication_date: '2026-08-14',
      status: 'Granted Patent',
      technology: 'AI Healthcare Diagnostics',
      relevance: '98%',
      claims_summary: 'Covers a multi-scale neural network pipeline extracting spatial attention maps from DICOM CT scans to identify early-stage thoracic nodules.',
      url: 'https://patents.google.com/patent/US20260844B2/en'
    },
    {
      id: 'EP4029112A1',
      title: 'Fault-Tolerant Quantum Error Correction & Transformer Execution Architecture',
      applicant: 'Quantum Systems European Labs',
      assignee: 'Quantum Systems SA',
      filing_date: '2025-12-01',
      publication_date: '2026-08-05',
      status: 'EP Patent Application',
      technology: 'Quantum Computing',
      relevance: '92%',
      claims_summary: 'Claims surface code qubit layout allowing sub-microsecond error correction cycles during quantum matrix multiplication.',
      url: 'https://patents.google.com/patent/EP4029112A1/en'
    }
  ];

  const filteredPatents = patents.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-600" />
            Patent & Intellectual Property Claims
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            USPTO • EPO • WIPO • Worldwide Patent Claims & Proprietary Hardware Filings
          </p>
        </div>
        <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-mono font-medium">
          {patents.length} Patent Filings Monitored
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patent numbers, title, assignee, or technical claims..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Patents Feed */}
      {filteredPatents.length === 0 ? (
        <EmptyState title="No Patents Found" description="Try adjusting your patent number or assignee search query." />
      ) : (
        <div className="space-y-4">
          {filteredPatents.map((patent) => (
            <IntelligenceCard
              key={patent.id}
              severity={patent.status === 'Granted Patent' ? 'healthy' : 'info'}
              title={`${patent.id}: ${patent.title}`}
              summary={patent.claims_summary}
              impact={`Assignee: ${patent.assignee}`}
              confidence={patent.relevance}
              source={`USPTO / ${patent.status}`}
              sourceUrl={patent.url}
              date={patent.publication_date}
              isFact={true}
              actionText="View Google Patent"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatentsPage;
