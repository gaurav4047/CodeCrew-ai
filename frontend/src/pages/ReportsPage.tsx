import React from 'react';
import { FileText, Download } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const reports = [
    {
      title: '360° AI Medical Diagnosis Executive Intelligence Briefing',
      type: 'Executive Summary',
      generated_at: '2026-08-22',
      pages: 12,
      format: 'PDF / CSV / JSON',
      summary: 'Comprehensive correlation of 18 arXiv preprints, 6 patent filings, FDA regulatory designations, and competitor market positioning.'
    },
    {
      title: 'Global Quantum Computing Patent & Hardware Landscape 2026',
      type: 'Patent & IP Report',
      generated_at: '2026-08-20',
      pages: 24,
      format: 'PDF / CSV',
      summary: 'Deep-dive analysis of USPTO and EPO claims covering low-latency cryo-interconnects and surface code qubit layouts.'
    },
    {
      title: 'Nvidia Blackwell vs Rival Microchip Architectures',
      type: 'Competitor Intelligence',
      generated_at: '2026-08-18',
      pages: 16,
      format: 'PDF / JSON',
      summary: 'Technical benchmark evaluation of FP4 tensor cores, NVLink 5 throughput, and datacenter market share.'
    }
  ];

  const handleDownload = (title: string, fmt: string) => {
    alert(`Downloading "${title}" in ${fmt} format...`);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Executive Reports & Export Engine
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Automated PDF Summaries • Raw CSV Export • Structured JSON Payloads
          </p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-mono font-medium">
          Multi-Format Export Ready
        </span>
      </div>

      <div className="space-y-4">
        {reports.map((rep, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200">
                  {rep.type}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1.5">{rep.title}</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Generated: {rep.generated_at}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans">
              {rep.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-mono">{rep.pages} Pages • Formats: {rep.format}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(rep.title, 'PDF')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-xl transition-colors flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => handleDownload(rep.title, 'CSV')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleDownload(rep.title, 'JSON')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
                >
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
