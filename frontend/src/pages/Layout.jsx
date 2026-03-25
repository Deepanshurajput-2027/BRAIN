import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Brain, Search, LayoutDashboard, Settings, LogOut, Plus, History } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useContent } from '../features/content-management/hooks/useContent';
import SearchBar from '../features/content-management/components/SearchBar';
import AddContentModal from '../features/content-management/components/AddContentModal';
import CollectionList from '../features/collections/components/CollectionList';
import CreateCollectionModal from '../features/collections/components/CreateCollectionModal';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { handleSearch, handleAdd, isSearching, searchQuery } = useContent();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-sans text-[var(--text-primary)]">
      {/* Sidebar */}
      <aside className="w-68 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex flex-col z-20 shadow-2xl shadow-black/50">
        <div className="p-8 flex items-center gap-4">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
            <Brain size={26} />
          </div>
          <span className="text-2xl font-black text-[var(--text-primary)] tracking-tight">BRAIN</span>
        </div>

        <nav className="flex-1 px-4 space-y-6 mt-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-2 mb-4 opacity-50">Discovery</h3>
            <NavLink icon={<LayoutDashboard size={22} />} label="Dashboard" href="/" />
            <NavLink icon={<History size={22} />} label="Memory Lane" href="/discovery" />
            <NavLink icon={<Search size={22} />} label="Explore" href="/explore" />
          </div>

          <CollectionList 
            onSelect={(c) => navigate(`/collections/${c._id}`)} 
            onCreateClick={() => setIsCollectionModalOpen(true)}
          />

          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-2 mb-4 opacity-50">System</h3>
            <NavLink icon={<Settings size={22} />} label="Settings" href="/settings" />
          </div>
        </nav>

        <div className="px-6 mb-8 group">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/10 active:scale-95"
          >
            <Plus size={20} />
            Add Content
          </button>
        </div>

        {/* User Profile / Logout */}
        <div className="p-6 border-t border-[var(--border-subtle)] bg-white/[0.02]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] mb-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm ring-4 ring-indigo-500/10">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user?.username || 'User'}</p>
              <p className="text-[11px] font-medium text-[var(--text-secondary)] truncate uppercase tracking-wider">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] h-screen scroll-smooth">
        <header className="h-24 bg-[var(--bg-secondary)]/50 backdrop-blur-2xl border-b border-[var(--border-subtle)] sticky top-0 z-10 px-10 flex items-center gap-6">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch} 
              isSearching={isSearching} 
              searchQuery={searchQuery}
            />
          </div>
          
          <QuickSave onAdd={handleAdd} />
        </header>

        <div className="p-10 max-w-[1400px] mx-auto min-h-[calc(100vh-6rem)]">
          <Outlet context={{ onOpenAddModal: () => setIsAddModalOpen(true) }} />
        </div>
      </main>

      <AddContentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAdd}
      />

      <CreateCollectionModal 
        isOpen={isCollectionModalOpen} 
        onClose={() => setIsCollectionModalOpen(false)}
      />
    </div>
  );
};

import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ icon, label, href = "#" }) => {
  const location = useLocation();
  const active = location.pathname === href;
  
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
        active 
        ? 'bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/5' 
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

const QuickSave = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      await onAdd(url);
      setUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hidden lg:flex items-center gap-2 bg-[var(--bg-tertiary)]/50 p-1.5 rounded-2xl border border-[var(--border-subtle)] shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
      <input
        type="text"
        placeholder="Paste link to save instantly..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="bg-transparent border-none outline-none px-3 py-1.5 text-sm w-64 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
      />
      <button 
        type="submit"
        disabled={loading}
        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/10"
      >
        {loading ? <Plus className="animate-spin" size={18} /> : <Plus size={18} />}
      </button>
    </form>
  );
};

export default Layout;
