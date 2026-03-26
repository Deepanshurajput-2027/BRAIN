import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveNewCollection } from '../slices/collectionSlice';
import { X, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateCollectionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(saveNewCollection({ title, description }));
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <FolderPlus size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">New Collection</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Research Papers"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                <textarea 
                   placeholder="What's this collection about?"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium resize-none text-black h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={!title.trim()}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none active:scale-95"
              >
                Create Collection
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateCollectionModal;
