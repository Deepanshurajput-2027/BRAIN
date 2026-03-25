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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                      <Plus size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Add to Brain</h2>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Paste URL
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <LinkIcon size={18} />
                      </div>
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://example.com/article"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-400 flex items-center gap-1.5 ml-1">
                      Gemini will automatically generate tags and a summary.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 rounded-xl text-red-600 text-sm border border-red-100">
                      {(typeof error === 'string' ? error : error?.message) || 'Failed to add content'}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                      status === 'success'
                        ? 'bg-emerald-500 text-white shadow-emerald-100'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                    }`}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddContentModal;
