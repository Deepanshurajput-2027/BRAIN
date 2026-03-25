import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraph, setSelectedNodeId, clearSelectedNode } from '../features/knowledge-graph/slices/graphSlice';
import GraphCanvas from '../features/knowledge-graph/components/GraphCanvas';
import GraphControls from '../features/knowledge-graph/components/GraphControls';
import NodeDetailDrawer from '../features/knowledge-graph/components/NodeDetailDrawer';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

const Explore = () => {
  const dispatch = useDispatch();
  const { nodes, links, status, error, selectedNodeId } = useSelector((state) => state.graph);
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const graphRef = useRef(null);

  useEffect(() => {
    dispatch(fetchGraph());
  }, [dispatch]);

  const handleNodeClick = (id) => {
    dispatch(setSelectedNodeId(id));
  };

  const handleRefresh = () => {
    dispatch(fetchGraph());
  };

  const handleZoomIn = () => {
    const svg = document.querySelector('svg');
    if (svg && svg.zoomIn) svg.zoomIn();
  };

  const handleZoomOut = () => {
    const svg = document.querySelector('svg');
    if (svg && svg.zoomOut) svg.zoomOut();
  };

  const handleRecenter = () => {
    const svg = document.querySelector('svg');
    if (svg && svg.recenter) svg.recenter();
  };

  if (status === 'loading' && nodes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-400" size={48} />
          <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={20} />
        </div>
        <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-50">Mapping your semantic universe...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-red-400/5 rounded-2xl text-red-400 border border-red-400/10 flex items-center gap-3">
          <AlertCircle size={24} />
          <span className="font-bold">{error}</span>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Semantic Explore</h1>
          <p className="text-[var(--text-secondary)] font-medium opacity-70">Visualize how your saved items connect across dimensions.</p>
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px] h-[70vh] bg-[var(--bg-secondary)]/50 rounded-[3.5rem] border border-[var(--border-subtle)] shadow-2xl shadow-black/20 overflow-hidden flex flex-col">
        <GraphCanvas 
          nodes={nodes} 
          links={links} 
          onNodeClick={handleNodeClick} 
        />
        
        <GraphControls 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut}
          onRecenter={handleRecenter}
          onRefresh={handleRefresh}
        />

        <NodeDetailDrawer 
          isOpen={!!selectedNodeId} 
          onClose={() => dispatch(clearSelectedNode())}
          node={selectedNode}
        />
      </div>
    </div>
  );
};

export default Explore;
