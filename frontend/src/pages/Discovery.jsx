import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResurfacedContent } from '../features/discovery/slices/discoverySlice';
import ContentCard from '../features/content-management/components/ContentCard';
import { Sparkles, History, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Discovery = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.discovery);

  useEffect(() => {
    dispatch(fetchResurfacedContent());
  }, [dispatch]);

  return (
    <div className="space-y-10">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
            <Sparkles size={20} />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Memory Lane</h1>
        </div>
        <p className="text-[var(--text-secondary)] font-medium opacity-70">Resurfacing the gems you saved 7, 30, or 90 days ago.</p>
      </header>

      {status === 'loading' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <div className="absolute -top-3 -left-3 z-10 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2 border-2 border-[var(--bg-primary)]">
                  <History size={12} />
                  Flashback
                </div>
                <ContentCard item={item} />
              </div>
            </motion.div>
          ))}

          {items.length === 0 && status !== 'loading' && (
            <div className="col-span-full py-20 text-center bg-[var(--bg-secondary)]/50 rounded-[3rem] border border-[var(--border-subtle)] shadow-sm">
              <div className="inline-flex p-6 bg-white/5 rounded-full text-[var(--text-secondary)]/20 mb-6">
                <Calendar size={48} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Nothing to resurface today</h3>
              <p className="text-[var(--text-secondary)]/50 font-medium max-w-xs mx-auto">Check back tomorrow for more memories from your past captures.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discovery;
