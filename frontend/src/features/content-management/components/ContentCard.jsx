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

const sanitizeTitle = (title) => {
  if (!title) return 'Untitled Content';
  return title.replace(/^[-–—\s]+/, '').trim() || 'Untitled Content';
};

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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-[#1A1D35] rounded-3xl border border-white/5 overflow-hidden transition-all hover:bg-white/[0.03] hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full"
    >
      {/* Visual Indicator (Top Bar) */}
      <div className={`h-1.5 w-full ${getTypeColor(item.type).split(' ')[0]} opacity-30 group-hover:opacity-100 transition-opacity`} />
      
      <div className="p-6 flex flex-col flex-1">
        {/* Header: Icon & Category */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-xl bg-white/5 ${getTypeColor(item.type).split(' ')[1]} transition-colors group-hover:bg-white/10`}>
            {getTypeIcon(item.type)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-[#9090CC] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.type || 'Content'}
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-black text-white leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {sanitizeTitle(item.title)}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#555577] uppercase tracking-wider">
            <span className="px-1.5 py-0.5 bg-white/5 rounded-md">
              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Summary */}
        {(item.summary || item.description) && (
          <p className="text-sm text-[#9090CC] line-clamp-3 mb-6 leading-relaxed opacity-80 group-hover:opacity-100">
            {item.summary || item.description}
          </p>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                if (collections.length === 0) dispatch(getCollections());
                setShowCollectionMenu(!showCollectionMenu);
              }}
              className={`p-2 rounded-xl transition-all ${showCollectionMenu ? 'bg-indigo-500/20 text-indigo-400' : 'text-[#555577] hover:text-white hover:bg-white/5'}`}
              title="Add to Collection"
            >
              <FolderPlus size={18} />
              
              {/* Collection Dropdown */}
              {showCollectionMenu && (
                <div className="absolute left-6 bottom-full mb-2 w-48 bg-[#1C1E35] rounded-2xl shadow-2xl border border-white/10 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1 mb-1 border-b border-white/5 pb-2">
                    <span className="text-[9px] font-black text-[#9090CC] uppercase tracking-widest opacity-50">Add to Collection</span>
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
                        className="w-full text-left px-4 py-2 text-xs font-bold text-[#9090CC] hover:bg-white/5 hover:text-white flex items-center justify-between transition-colors"
                      >
                        {col.title}
                        {addedStatus === col._id && <Check size={12} className="text-emerald-400" />}
                      </button>
                    ))}
                    {collections.length === 0 && (
                      <div className="px-4 py-3 text-[10px] text-[#555577] font-medium italic">No collections found</div>
                    )}
                  </div>
                </div>
              )}
            </button>
            <a
              href={item.link?.startsWith('http') ? item.link : `https://${item.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#555577] hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <ExternalLink size={18} />
            </a>
          </div>
          <button 
            onClick={() => onDelete(item._id)}
            className="p-2 text-[#555577] hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default ContentCard;
