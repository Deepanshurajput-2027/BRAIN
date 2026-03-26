import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Lock, Shield, Edit3, Save, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileUser } from '../features/auth/slices/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const handleSave = async () => {
    await dispatch(updateProfileUser(formData));
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl font-black text-white tracking-tighter">Settings</h1>
            {!user?.isVerified && (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20 shadow-lg shadow-amber-500/5">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[#9090CC] font-bold text-sm opacity-60 max-w-lg leading-relaxed">
            Configure your digital consciousness. Manage account security, personalization, and workspace preferences.
          </p>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/5 rounded-2xl font-black text-white hover:bg-white/10 transition-all shadow-xl shadow-black/20 active:scale-95 group"
          >
            <Edit3 size={18} className="group-hover:text-indigo-400 transition-colors" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-4 text-[#555577] font-black text-sm hover:text-white transition-all uppercase tracking-widest"
            >
              Discard
            </button>
            <button 
              onClick={handleSave}
              disabled={status === 'loading'}
              className="flex items-center gap-3 px-10 py-4 bg-[#6C63FF] text-white rounded-2xl font-black hover:bg-[#5A52E8] transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-2">
          <SettingsTab icon={<User size={18} />} label="Account" active />
          <SettingsTab icon={<Bell size={18} />} label="Intelligence" />
          <SettingsTab icon={<Lock size={18} />} label="Security" />
          <SettingsTab icon={<Shield size={18} />} label="Privacy" />
          
          <div className="pt-8 mt-8 border-t border-white/5">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black text-[#555577] uppercase tracking-[0.2em] opacity-50">System Status</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest">Core Online</span>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-8">
          <section className="bg-[#1C1E35] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -mr-32 -mt-32 group-hover:bg-indigo-600/10 transition-colors duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Identity Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#9090CC] uppercase tracking-widest ml-1 opacity-60">Username</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl outline-none transition-all font-bold text-white ${
                      isEditing 
                      ? 'bg-[#252845] border border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10' 
                      : 'bg-white/5 border border-transparent opacity-50 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#9090CC] uppercase tracking-widest ml-1 opacity-60">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl outline-none transition-all font-bold text-white ${
                      isEditing 
                      ? 'bg-[#252845] border border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10' 
                      : 'bg-white/5 border border-transparent opacity-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {!user?.isVerified && (
                <div className="mt-12 p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group/alert">
                  <div className="absolute inset-0 bg-amber-500/[0.02] translate-x-full group-hover/alert:translate-x-0 transition-transform duration-700" />
                  <div className="flex gap-6 items-center relative z-10">
                    <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 shadow-lg shadow-amber-500/10">
                      <Shield size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white mb-1">Identity Verification</h4>
                      <p className="text-sm text-amber-500/60 font-medium leading-relaxed max-w-md">Verify your email to establish ultimate trust and unlock advanced encryption features.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Verification protocol initiated.')}
                    className="relative z-10 px-8 py-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-widest rounded-2xl border border-amber-500/20 transition-all active:scale-95"
                  >
                    Resend Protocol
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="bg-[#1C1E35] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl group">
            <h3 className="text-2xl font-black text-white mb-8 tracking-tight">System Terminal</h3>
            <div className="space-y-4">
              <p className="text-sm text-[#9090CC] font-bold opacity-60">Complete erasure of your digital consciousness. This action is irreversible.</p>
              <button className="px-8 py-4 bg-red-500/5 text-red-500 rounded-2xl font-black hover:bg-red-500/10 transition-all text-xs uppercase tracking-widest border border-red-500/10 active:scale-95">
                Execute Wipe Out
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
  }`}>
    {icon}
    {label}
  </button>
);

export default Settings;
