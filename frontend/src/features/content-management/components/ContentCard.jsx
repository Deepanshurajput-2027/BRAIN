import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Video, 
  Twitter, 
  File, 
  Image as ImageIcon,
  ExternalLink, 
  Trash2,
  Tag as TagIcon,
  FolderPlus,
  Check
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addContentToCollection } from '../../collections/services/collectionService';
import { getCollections } from '../../collections/slices/collectionSlice';

const ContentCard = ({ item, onDelete, variant = 'default' }) => {
  const dispatch = useDispatch();
  const { items: collections } = useSelector((state) => state.collections);
  const [showCollectionMenu, setShowCollectionMenu] = React.useState(false);
  const [addedStatus, setAddedStatus] = React.useState(null); // 'loading' | 'success' | null
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={20} />;
      case 'tweet': return <Twitter size={20} />;
      case 'article': return <FileText size={variant === 'compact' ? 16 : 20} />;
      case 'image': return <ImageIcon size={variant === 'compact' ? 16 : 20} />;
      case 'document': 
      case 'pdf': return <File size={variant === 'compact' ? 16 : 20} />;
      default: return <File size={variant === 'compact' ? 16 : 20} />;
    }
  };

  const isCompact = variant === 'compact';

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-red-500/10 text-red-400';
      case 'tweet': return 'bg-sky-500/10 text-sky-400';
      case 'article': return 'bg-indigo-500/10 text-indigo-400';
      case 'image': return 'bg-emerald-500/10 text-emerald-400';
      case 'document':
      case 'pdf': return 'bg-orange-500/10 text-orange-400';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`group bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:shadow-2xl hover:shadow-black/50 hover:border-indigo-500/20 transition-all cursor-default relative overflow-hidden ${isCompact ? 'p-4' : 'p-6'}`}
    >
      {/* Type Badge & Actions */}
      <div className={`flex justify-between items-start ${isCompact ? 'mb-2' : 'mb-4'}`}>
        <div className={`${isCompact ? 'p-1.5 rounded-lg' : 'p-2.5 rounded-xl'} ${getTypeColor(item.type)} transition-colors`}>
          {getTypeIcon(item.type)}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              if (collections.length === 0) dispatch(getCollections());
              setShowCollectionMenu(!showCollectionMenu);
            }}
            className="p-2 text-[var(--text-secondary)]/50 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all relative"
            title="Add to Collection"
          >
            <FolderPlus size={18} />
            
            {/* Collection Dropdown */}
            {showCollectionMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-tertiary)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1 mb-1">
                  <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-50">Add to Collection</span>
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {collections.map((col) => (
                    <button
                      key={col._id}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setAddedStatus(col._id);
                        await addContentToCollection(col._id, item._id);
                        setTimeout(() => {
                          setAddedStatus(null);
                          setShowCollectionMenu(false);
                        }, 1000);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:bg-indigo-500/10 hover:text-indigo-400 flex items-center justify-between transition-colors"
                    >
                      {col.title}
                      {addedStatus === col._id && <Check size={12} className="text-emerald-400" />}
                    </button>
                  ))}
                  {collections.length === 0 && (
                    <div className="px-4 py-3 text-[10px] text-[var(--text-secondary)]/50 font-medium italic">No collections found</div>
                  )}
                </div>
              </div>
            )}
          </button>
          <a
            href={item.link?.startsWith('http') ? item.link : `https://${item.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-secondary)]/50 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
          >
            <ExternalLink size={18} />
          </a>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 text-[var(--text-secondary)]/50 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <h3 className={`${isCompact ? 'text-sm' : 'text-lg'} font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors`}>
        {item.title}
      </h3>
      
      {!isCompact && (item.summary || item.description) && (
        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4 leading-relaxed opacity-80">
          {item.summary || item.description}
        </p>
      )}

      {/* Tags */}
      {!isCompact && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
          {item.tags?.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all"
            >
              <TagIcon size={10} />
              {tag}
            </span>
          ))}
          {item.tags?.length > 3 && (
            <span className="text-[10px] font-bold text-[var(--text-secondary)]/50 self-center">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default ContentCard;
