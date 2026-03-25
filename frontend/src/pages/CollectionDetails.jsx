import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCollectionDetails } from '../features/collections/slices/collectionSlice';
import ContentCard from '../features/content-management/components/ContentCard';
import { Folder, Inbox, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CollectionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCollection, status } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(getCollectionDetails(id));
  }, [id, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!currentCollection) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-[var(--text-secondary)]/50">
        <Inbox size={48} className="mb-4 opacity-20" />
        <p className="font-medium">Collection not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <Folder size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)]">{currentCollection.title}</h1>
            <p className="text-[var(--text-secondary)] font-medium opacity-70">
              {currentCollection.items?.length || 0} items in this collection
            </p>
          </div>
        </div>
        {currentCollection.description && (
          <p className="text-[var(--text-secondary)]/80 mt-4 max-w-2xl leading-relaxed">
            {currentCollection.description}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCollection.items?.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ContentCard item={item} />
          </motion.div>
        ))}
      </div>

      {(!currentCollection.items || currentCollection.items.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-secondary)]/50 rounded-3xl border border-dashed border-[var(--border-subtle)]">
          <Inbox size={48} className="text-[var(--text-secondary)]/10 mb-4" />
          <p className="text-[var(--text-secondary)]/30 font-bold uppercase tracking-widest text-[10px]">Empty Collection</p>
          <p className="text-[var(--text-secondary)]/50 mt-1 font-medium italic">Save some items here to see them later.</p>
        </div>
      )}
    </div>
  );
};

export default CollectionDetails;
