import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Tag, ChevronRight } from 'lucide-react';

const NodeDetailDrawer = ({ isOpen, onClose, node }) => {
  if (!node && isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md z-30"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-4 bottom-4 right-4 w-96 bg-[var(--bg-secondary)] rounded-3xl shadow-2xl z-40 border border-[var(--border-subtle)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-full">
                {node.type}
              </span>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl text-[var(--text-secondary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-[var(--text-primary)] leading-tight mb-4">
                  {node.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed opacity-80">
                  {node.summary || node.description || "Semantic connection found between your saved items."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-tertiary)] p-4 rounded-2xl border border-[var(--border-subtle)]">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--text-secondary)] shadow-sm">
                    <Tag size={16} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {node.tags?.map(tag => (
                      <span key={tag} className="text-xs text-indigo-400 hover:underline cursor-pointer">#{tag}</span>
                    ))}
                  </div>
                </div>
 
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-tertiary)] p-4 rounded-2xl border border-[var(--border-subtle)]">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--text-secondary)] shadow-sm">
                    <Calendar size={16} />
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">Collected Recently</span>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href={node.link?.startsWith('http') ? node.link : `https://${node.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-5 bg-indigo-600 text-white rounded-2xl font-bold group hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] no-underline"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink size={20} />
                    Open Original Source
                  </div>
                  <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.02] border-t border-[var(--border-subtle)]">
              <p className="text-[10px] text-center font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-relaxed opacity-50">
                Semantic visualization powered by Gemini 
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NodeDetailDrawer;
