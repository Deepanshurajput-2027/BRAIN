import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-5 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-white/5 rounded-xl"></div>
        <div className="h-8 w-8 bg-white/[0.02] rounded-lg"></div>
      </div>
      <div className="h-6 bg-white/5 rounded-lg w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/[0.02] rounded w-full"></div>
        <div className="h-4 bg-white/[0.02] rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-white/5 rounded-full"></div>
        <div className="h-6 w-12 bg-white/5 rounded-full"></div>
        <div className="h-6 w-20 bg-white/5 rounded-full"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
