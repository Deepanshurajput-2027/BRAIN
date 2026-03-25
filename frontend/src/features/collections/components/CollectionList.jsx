import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCollections, removeCollection } from '../slices/collectionSlice';
import { Folder, MoreVertical, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const CollectionList = ({ onSelect, onCreateClick }) => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(getCollections());
  }, [dispatch]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 mb-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Collections</h3>
        <button 
          onClick={onCreateClick}
          className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-1">
        {items.map((collection) => (
          <div 
            key={collection._id}
            className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all cursor-pointer"
            onClick={() => onSelect(collection)}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                <Folder size={16} />
              </div>
              <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">{collection.title}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(window.confirm('Delete collection?')) dispatch(removeCollection(collection._id));
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-[10px] text-gray-400 text-center py-4 font-medium italic">No collections yet</p>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
