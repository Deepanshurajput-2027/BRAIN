import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

const GraphControls = ({ onZoomIn, onZoomOut, onRecenter, onRefresh }) => {
  return (
    <div className="absolute top-6 right-6 flex flex-col gap-2">
      <div className="flex flex-col bg-[var(--bg-tertiary)]/80 backdrop-blur-md rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
        <button 
          onClick={onZoomIn}
          className="p-3 hover:bg-white/5 text-[var(--text-secondary)] transition-colors border-b border-[var(--border-subtle)]"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          onClick={onZoomOut}
          className="p-3 hover:bg-white/5 text-[var(--text-secondary)] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
      </div>

      <button 
        onClick={onRecenter}
        className="p-3 bg-[var(--bg-tertiary)]/80 backdrop-blur-md rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:bg-white/5 text-[var(--text-secondary)] transition-colors"
        title="Recenter"
      >
        <Maximize2 size={18} />
      </button>

      <button 
        onClick={onRefresh}
        className="p-3 bg-[var(--bg-tertiary)]/80 backdrop-blur-md rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:bg-white/5 text-[var(--text-secondary)] transition-colors"
        title="Refresh Graph"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
};

export default GraphControls;
