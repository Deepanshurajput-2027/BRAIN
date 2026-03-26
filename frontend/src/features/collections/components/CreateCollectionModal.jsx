import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveNewCollection, updateCollection } from '../slices/collectionSlice';
import { X, FolderPlus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateCollectionModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    if (initialData?._id) {
      dispatch(updateCollection({ id: initialData._id, data: { title, description } }));
    } else {
      dispatch(saveNewCollection({ title, description }));
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030014]/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#1C1E35] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-white/5 rounded-2xl text-white shadow-xl shadow-black/20">
                    <FolderPlus size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {initialData ? 'Edit Collection' : 'New Collection'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/5 rounded-2xl text-[#9090CC] hover:text-white transition-all active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#9090CC] uppercase tracking-[0.2em] ml-1 opacity-60">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Research Papers"
                    className="w-full px-7 py-5 bg-[#252845] border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold text-white placeholder:text-[#555577]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#9090CC] uppercase tracking-[0.2em] ml-1 opacity-60">Description (Optional)</label>
                  <textarea
                    placeholder="What's this collection about?"
                    className="w-full px-7 py-5 bg-[#252845] border border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold resize-none h-40 text-white placeholder:text-[#555577]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!title.trim()}
                  className={`w-full py-5 rounded-2xl font-black shadow-2xl transition-all active:scale-95 text-white flex items-center justify-center gap-3
                    ${title.trim()
                      ? 'bg-[#6C63FF] hover:bg-[#5A52E8] shadow-indigo-600/20'
                      : 'bg-[#6C63FF] opacity-40 cursor-not-allowed'}`}
                >
                  {initialData ? <Save size={20} /> : <FolderPlus size={20} />}
                  {initialData ? 'Save Changes' : 'Create Collection'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCollectionModal;
