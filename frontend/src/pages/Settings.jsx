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
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Settings</h1>
          <div className="flex items-center gap-3">
            <p className="text-[var(--text-secondary)] font-medium opacity-70">Manage your account preferences and system configuration.</p>
            {user?.isVerified ? (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Verified</span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">Unverified</span>
            )}
          </div>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-[var(--border-subtle)] rounded-2xl font-bold text-[var(--text-primary)] hover:bg-white/10 transition-all shadow-sm"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 text-[var(--text-secondary)]/50 font-bold hover:text-[var(--text-primary)] transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={status === 'loading'}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-1">
          <SettingsTab icon={<User size={18} />} label="Account" active />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" />
          <SettingsTab icon={<Lock size={18} />} label="Security" />
          <SettingsTab icon={<Shield size={18} />} label="Privacy" />
        </aside>

        <main className="md:col-span-2 space-y-6">
          <section className="bg-[var(--bg-secondary)]/50 p-8 rounded-3xl border border-[var(--border-subtle)] shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 font-display">Profile Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-[var(--text-secondary)]/50 uppercase tracking-widest mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-5 py-4 rounded-2xl outline-none transition-all font-bold text-[var(--text-primary)] ${
                    isEditing 
                    ? 'bg-indigo-500/5 border-2 border-indigo-500/20 focus:border-indigo-500 focus:bg-[var(--bg-tertiary)]' 
                    : 'bg-white/5 border border-transparent text-[var(--text-secondary)]/50 cursor-not-allowed'
                  }`}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[var(--text-secondary)]/50 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-5 py-4 rounded-2xl outline-none transition-all font-bold text-[var(--text-primary)] ${
                    isEditing 
                    ? 'bg-indigo-500/5 border-2 border-indigo-500/20 focus:border-indigo-500 focus:bg-[var(--bg-tertiary)]' 
                    : 'bg-white/5 border border-transparent text-[var(--text-secondary)]/50 cursor-not-allowed'
                  }`}
                  placeholder="user@example.com"
                />
              </div>
            </div>
            {!user?.isVerified && (
              <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Email Verification Required</h4>
                    <p className="text-xs text-amber-400/60 font-medium">Please verify your email to secure your account and unlock all features.</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      await authService.sendVerification(); // I need to add this to authService
                      alert('Verification email sent!');
                    } catch (err) {
                      alert('Failed to send email.');
                    }
                  }}
                  className="px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/20 transition-all whitespace-nowrap"
                >
                  Resend Verification
                </button>
              </div>
            )}
          </section>

          <section className="bg-[var(--bg-secondary)]/50 p-8 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Danger Zone</h3>
            <button className="px-6 py-3 bg-red-400/5 text-red-400 rounded-xl font-bold hover:bg-red-400/10 transition-all text-sm border border-red-500/10">
              Delete Account
            </button>
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
