import React from 'react';
import { useGraph } from '../hooks/useGraph';

const GraphCanvas = ({ nodes, links, onNodeClick }) => {
  const { svgRef } = useGraph(nodes, links, onNodeClick);

  return (
    <div className="flex-1 w-full h-full relative bg-[var(--bg-secondary)]/30 rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-inner flex flex-col">
      <svg
        ref={svgRef}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g className="main-container" />
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 bg-[var(--bg-tertiary)]/80 backdrop-blur-md p-4 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        <LegendItem color="bg-indigo-600" label="Article" />
        <LegendItem color="bg-orange-500" label="Video" />
        <LegendItem color="bg-sky-500" label="Tweet" />
        <LegendItem color="bg-red-500" label="PDF/Doc" />
        <LegendItem color="bg-emerald-500" label="Image" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-80">
    <div className={`w-2 h-2 rounded-full ${color}`} /> {label}
  </div>
);

export default GraphCanvas;
