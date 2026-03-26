import React, { useEffect, useState } from 'react';
import { useContent } from '../features/content-management/hooks/useContent';
import ContentCard from '../features/content-management/components/ContentCard';
import SkeletonCard from '../features/content-management/components/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, Plus, Sparkles, History, Library, Search, Layers, Zap } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { fetchResurfaced } from '../features/content-management/services/contentService';

const Dashboard = () => {
  const { onOpenAddModal } = useOutletContext();
  const { items, isLoading, fetchItems, handleDelete, stats, fetchStats } = useContent();
  const [resurfacedItems, setResurfacedItems] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchStats();
    
    // Fetch resurfaced items locally
    const getResurfaced = async () => {
      try {
        const data = await fetchResurfaced();
        setResurfacedItems(data);
      } catch (err) {
        console.error("Failed to fetch resurfaced content", err);
      }
    };
    getResurfaced();
  }, [fetchItems, fetchStats]);

  if (isLoading && (!items || items.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 px-6 text-center bg-[#1C1E35] rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-indigo-600/[0.02] -translate-y-full group-hover:translate-y-0 transition-transform duration-1000" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-[#6C63FF] mb-8 mx-auto shadow-2xl shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-500">
            <Inbox size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Your Digital Void</h2>
          <p className="text-[#9090CC] max-w-md mx-auto mb-12 leading-relaxed font-bold text-lg opacity-60">
            Every great discovery starts with a single spark. Begin layering your second brain by capturing your first piece of knowledge.
          </p>
          <button 
            onClick={onOpenAddModal}
            className="group/btn bg-[#6C63FF] text-white px-10 py-5 rounded-2xl font-black hover:bg-[#5A52E8] transition-all shadow-2xl shadow-indigo-500/20 flex items-center gap-3 mx-auto active:scale-95"
          >
            <Plus size={24} className="group-hover/btn:rotate-90 transition-transform duration-300" />
            Initialize Brain
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Library />} 
          label="Total Items" 
          value={stats.totalContent} 
          trend="12%"
          trendType="up"
        />
        <StatCard 
          icon={<Layers />} 
          label="Collections" 
          value={stats.totalCollections} 
          trend="5%"
          trendType="up"
        />
        <StatCard 
          icon={<Zap />} 
          label="Highlights" 
          value={stats.totalHighlights} 
          trend="2%"
          trendType="down"
        />
        <StatCard 
          icon={<Search />} 
          label="AI Searches" 
          value={stats.totalSearches} 
          trend="24%"
          trendType="up"
        />
      </section>

      {/* Resurfaced Section */}
      {resurfacedItems.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] font-bold uppercase tracking-wider text-[10px] opacity-40">
            <History size={14} />
            <span>Resurfaced Today</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {resurfacedItems.slice(0, 3).map((item) => (
                <ContentCard 
                  key={`resurfaced-${item._id}`} 
                  item={item} 
                  onDelete={handleDelete}
                  variant="compact"
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Main Library Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-[var(--text-secondary)] font-bold uppercase tracking-wider text-[10px] opacity-40">
          <Sparkles size={14} />
          <span>Recently Added</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <ContentCard 
                key={item._id} 
                item={item} 
                onDelete={handleDelete} 
              />
            ))}
          </AnimatePresence>
        </div>
      </section>
      
      {/* Loading Overlay for Background Searches */}
      {isLoading && items.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-[var(--bg-secondary)]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-subtle)] flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] shadow-lg animate-pulse z-50">
          Syncing brain...
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, trendType = 'up' }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-[var(--bg-secondary)] p-5 rounded-3xl border border-white/5 shadow-sm hover:shadow-xl hover:bg-white/[0.02] transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C63FF]/5 blur-3xl -mr-12 -mt-12 group-hover:bg-[#6C63FF]/10 transition-colors" />
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-[#6C63FF]/20 transition-colors text-white">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1
          ${trendType === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
          {trendType === 'up' ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
    <div className="text-3xl font-black text-white mb-1 relative z-10 tracking-tight">{value}</div>
    <div className="text-[10px] font-black text-[#9090CC] uppercase tracking-widest relative z-10 opacity-60">{label}</div>
  </motion.div>
);

export default Dashboard;
