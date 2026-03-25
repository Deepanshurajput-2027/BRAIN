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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-subtle)] shadow-sm"
      >
        <div className="p-6 bg-indigo-500/10 rounded-full text-indigo-400 mb-6">
          <Inbox size={48} />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Your Knowledge Hub is Empty</h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-10 leading-relaxed text-lg">
          Start building your second brain by adding your first link, article, or video. 
          We'll handle the summarization and semantic mapping.
        </p>
        <button 
          onClick={onOpenAddModal}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95"
        >
          <Plus size={24} />
          Add First Link
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Library className="text-indigo-600" size={20} />} 
          label="Total Items" 
          value={stats.totalContent} 
          trend="+12% this week"
        />
        <StatCard 
          icon={<Layers className="text-purple-600" size={20} />} 
          label="Collections" 
          value={stats.totalCollections} 
        />
        <StatCard 
          icon={<Zap className="text-amber-600" size={20} />} 
          label="Highlights" 
          value={stats.totalHighlights} 
        />
        <StatCard 
          icon={<Search className="text-emerald-600" size={20} />} 
          label="AI Searches" 
          value={stats.totalSearches} 
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

const StatCard = ({ icon, label, value, trend }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-[var(--bg-secondary)] p-5 rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-indigo-500/10 transition-colors">
        {icon}
      </div>
      {trend && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <div className="text-2xl font-black text-[var(--text-primary)] mb-1">{value}</div>
    <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-tight opacity-70">{label}</div>
  </motion.div>
);

export default Dashboard;
