import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCollections, removeCollection } from '../slices/collectionSlice';
import { Folder, Edit3, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const CollectionList = ({ onSelect, onCreateClick }) => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(getCollections());
  }, [dispatch]);

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between px-3 mb-6">
        <h3 className="text-[9px] font-black text-[#9090CC] uppercase tracking-[0.25em] opacity-40">Collections</h3>
        <button 
          onClick={onCreateClick}
          className="p-1.5 hover:bg-white/5 rounded-xl text-[#9090CC] hover:text-white transition-all active:scale-90"
          title="New Collection"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-1 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
        {items.map((collection) => (
          <motion.div 
            key={collection._id}
            whileHover={{ x: 4 }}
            className="group flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
            onClick={() => onSelect(collection)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl text-[#9090CC] group-hover:text-[#6C63FF] transition-colors">
                <Folder size={14} />
              </div>
              <span className="text-sm font-bold text-[#9090CC] group-hover:text-white truncate max-w-[120px]">
                {collection.title}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateClick(collection);
                }}
                className="p-1.5 text-[#555577] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Edit"
              >
                <Edit3 size={12} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.confirm(`Delete "${collection.title}"?`)) dispatch(removeCollection(collection._id));
                }}
                className="p-1.5 text-[#555577] hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-[10px] text-[#555577] font-bold uppercase tracking-widest opacity-50">Empty Archive</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
