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
  const [editingCollection, setEditingCollection] = useState(null);

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

        <nav className="flex-1 px-4 space-y-6 mt-2 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <h3 className="text-[9px] font-black text-[#9090CC] uppercase tracking-[0.25em] px-3 mb-4 opacity-40">Discovery</h3>
            <NavLink icon={<LayoutDashboard size={22} />} label="Dashboard" href="/" />
            <NavLink icon={<History size={22} />} label="Memory Lane" href="/discovery" />
            <NavLink icon={<Search size={22} />} label="Explore" href="/explore" />
          </div>

          <CollectionList 
            onSelect={(c) => navigate(`/collections/${c._id}`)} 
            onCreateClick={(c) => {
              setEditingCollection(c || null);
              setIsCollectionModalOpen(true);
            }}
          />

          <div className="space-y-2">
            <h3 className="text-[9px] font-black text-[#9090CC] uppercase tracking-[0.25em] px-3 mb-4 opacity-40">System</h3>
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
              <p className="text-[11px] font-medium text-[#9090CC] truncate lowercase tracking-normal">{user?.email || 'user@example.com'}</p>
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
      <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] h-screen scroll-smooth no-scrollbar">
        <header className="h-24 bg-[var(--bg-secondary)]/50 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-10 px-10 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <IntelligentHeader 
              onSearch={handleSearch} 
              onAdd={handleAdd}
              isSearching={isSearching} 
              searchQuery={searchQuery}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-[1px] bg-white/5 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#6C63FF] font-black text-xs shadow-lg shadow-indigo-500/5">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
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
        onClose={() => {
          setIsCollectionModalOpen(false);
          setEditingCollection(null);
        }}
        initialData={editingCollection}
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

const IntelligentHeader = ({ onSearch, onAdd, isSearching, searchQuery }) => {
  const [value, setValue] = useState(searchQuery || '');
  const [loading, setLoading] = useState(false);

  const isUrl = (str) => {
    return str.trim().startsWith('http') || str.trim().startsWith('www') || str.trim().includes('.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    if (isUrl(value)) {
      setLoading(true);
      try {
        await onAdd(value);
        setValue('');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[#555577] group-focus-within:text-indigo-400 transition-colors">
        {isUrl(value) ? <Plus size={20} /> : <Search size={20} />}
      </div>
      <input
        type="text"
        placeholder={isSearching ? "Searching..." : "Search brain or paste link to save..."}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (!isUrl(e.target.value)) onSearch(e.target.value);
        }}
        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-16 pr-24 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-[#555577]"
      />
      <div className="absolute inset-y-2 right-2 flex items-center">
        <button 
          type="submit"
          disabled={loading || !value.trim()}
          className={`px-4 h-full rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
            ${value.trim() ? 'bg-[#6C63FF] text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-[#555577] cursor-not-allowed'}`}
        >
          {loading ? 'Saving...' : (isUrl(value) ? 'Quick Save' : 'Search')}
        </button>
      </div>
    </form>
  );
};

export default Layout;
