import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, searchQuery, isSearching }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearch(localQuery);
      }
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [localQuery, onSearch, searchQuery]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/50">
          {isSearching ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Search size={20} />
          )}
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search your brain..."
          className="w-full pl-12 pr-24 py-4 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/30"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <AnimatePresence>
            {localQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setLocalQuery('')}
                className="p-1.5 hover:bg-white/5 rounded-lg text-[var(--text-secondary)]/50 transition-colors"
              >
                <X size={18} />
              </motion.button>
            )}
          </AnimatePresence>
          
          <button 
            type="button"
            className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-colors flex items-center gap-2 text-xs font-bold"
            title="Semantic Search Enabled"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">Semantic</span>
          </button>
        </div>
      </div>
      
      {/* AI Search Indicator */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 right-0 flex justify-center"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
              <Sparkles size={12} />
              Gemini is vectorizing your query...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
