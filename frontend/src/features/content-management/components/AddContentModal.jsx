import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Plus, Loader2, CheckCircle2 } from 'lucide-react';

const AddContentModal = ({ isOpen, onClose, onAdd }) => {
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!link.trim()) return;

    setStatus('loading');
    setError(null);

    try {
      await onAdd(link);
      setStatus('success');
      setLink('');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 1500);
    } catch (err) {
      setError(err || 'Failed to add content');
      setStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030014]/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#1C1E35] w-full max-w-lg rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl text-white">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Add to Brain</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/5 rounded-2xl text-[#9090CC] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#9090CC] uppercase tracking-widest ml-1">Paste URL</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#555577] group-focus-within:text-indigo-400 transition-colors">
                      <LinkIcon size={18} />
                    </div>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://example.com/article"
                      required
                      className="w-full pl-16 pr-6 py-4 bg-[#252845] border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-white placeholder:text-[#555577]"
                    />
                  </div>
                  <p className="mt-4 text-[11px] text-[#9090CC] opacity-60 flex items-center gap-2 ml-1 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Cortex will automatically generate tags and a summary.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-400/10 rounded-2xl text-red-400 text-xs font-bold border border-red-400/20">
                    {(typeof error === 'string' ? error : error?.message) || 'Failed to add content'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full h-16 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl
                    ${status === 'success'
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-[#6C63FF] hover:bg-[#5A52E8] text-white shadow-indigo-500/20'
                    } ${status === 'loading' || status === 'success' ? 'opacity-80' : ''}`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle2 size={24} />
                      Successfully Saved
                    </>
                  ) : (
                    'Save to Knowledge Hub'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddContentModal;
