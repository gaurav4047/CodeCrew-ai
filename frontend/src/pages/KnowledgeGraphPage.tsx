import React, { useState } from 'react';
import { Network, Sparkles } from 'lucide-react';

const KnowledgeGraphPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('Nvidia Corporation');

  const nodes = [
    { id: 'n-1', label: 'Nvidia Corporation', type: 'Company', color: 'border-amber-500 bg-amber-950/40 text-amber-200' },
    { id: 'n-2', label: 'Blackwell B200 GPU', type: 'Product', color: 'border-blue-500 bg-blue-950/40 text-blue-200' },
    { id: 'n-3', label: 'US20260191A1 Neuromorphic Patent', type: 'Patent', color: 'border-indigo-500 bg-indigo-950/40 text-indigo-200' },
    { id: 'n-4', label: '3D Spatial Radiology Attention Paper', type: 'Research Paper', color: 'border-purple-500 bg-purple-950/40 text-purple-200' },
    { id: 'n-5', label: 'MedAI Global Health', type: 'Company', color: 'border-amber-500 bg-amber-950/40 text-amber-200' },
    { id: 'n-6', label: 'Quantum Interconnect Systems', type: 'Company', color: 'border-amber-500 bg-amber-950/40 text-amber-200' }
  ];

  const relationships = [
    { from: 'Nvidia Corporation', to: 'Blackwell B200 GPU', rel: 'Manufactures & Sells' },
    { from: 'Nvidia Corporation', to: 'US20260191A1 Neuromorphic Patent', rel: 'Holds IP Patent' },
    { from: 'MedAI Global Health', to: '3D Spatial Radiology Attention Paper', rel: 'Published arXiv Study' },
    { from: 'Quantum Interconnect Systems', to: 'US20260191A1 Neuromorphic Patent', rel: 'Competes for Interconnect IP' }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-600 animate-pulse" />
            Enterprise Knowledge Graph Topology
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Companies → Research Papers → Patents → Products → Interconnect Links
          </p>
        </div>
        <span className="text-xs bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full font-mono font-medium">
          Interactive Node Network
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Panel */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-slate-100 min-h-[420px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              KNOWLEDGE NODE GRAPH TOPOLOGY
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Click node to inspect entity</span>
          </div>

          {/* Node Grid Network Representation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.label)}
                className={`p-4 rounded-xl border transition-all text-left shadow-md flex flex-col justify-between ${node.color} ${
                  selectedNode === node.label ? 'ring-2 ring-cyan-400 scale-105' : 'hover:opacity-90'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-75">{node.type}</span>
                <span className="font-semibold text-xs mt-2 line-clamp-2">{node.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Graph Nodes: {nodes.length} Entities</span>
            <span>Edge Connections: {relationships.length} Relationships</span>
          </div>
        </div>

        {/* Selected Entity Inspector Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Entity Relationships Inspector
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Active Entity: {selectedNode || 'None'}</p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900">Connected Graph Relationships:</h4>
            {relationships
              .filter((r) => r.from === selectedNode || r.to === selectedNode)
              .map((rel, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-slate-900">{rel.from}</span>
                    <span className="text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-semibold">{rel.rel}</span>
                  </div>
                  <p className="text-slate-600 text-right font-mono">→ {rel.to}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphPage;
