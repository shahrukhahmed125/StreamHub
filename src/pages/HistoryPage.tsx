import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { History, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { ConfirmationDialog } from '../components/Modal';

export const HistoryPage: React.FC = () => {
  const { watchHistory, removeFromHistory, clearHistory } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = watchHistory.filter(item =>
    item.video.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.video.channel.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3040]/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F5F7FA]">Watch History</h1>
            <p className="text-xs text-[#A3AABD]">Records of videos you have watched</p>
          </div>
        </div>

        {watchHistory.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#202635] hover:bg-[#F06464]/20 border border-[#2A3040] hover:border-[#F06464]/50 text-xs font-semibold text-[#A3AABD] hover:text-[#F06464] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Entire History</span>
          </button>
        )}
      </div>

      {/* Search Input Filter */}
      {watchHistory.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search watch history..."
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC]"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3AABD] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Video History List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-3">
          <History className="w-10 h-10 text-[#7C5CFC] mx-auto" />
          <h3 className="text-sm font-bold text-[#F5F7FA]">
            {searchFilter ? 'No matching history records' : 'No watch history yet'}
          </h3>
          <p className="text-xs text-[#A3AABD]">
            Videos you watch on StreamHub will appear here.
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold rounded-xl"
          >
            Start Watching
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map(({ video, watchedAt }) => (
            <div
              key={video.id}
              className="group flex flex-col sm:flex-row gap-4 p-3 rounded-2xl bg-[#181C26]/40 hover:bg-[#181C26] border border-[#2A3040]/50 hover:border-[#7C5CFC]/40 transition-colors"
            >
              <Link
                to={`/watch/${video.id}`}
                className="relative w-full sm:w-56 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-[#2A3040]/50"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-md bg-black/85 text-white">
                  {video.duration}
                </span>
              </Link>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/watch/${video.id}`}
                      className="text-sm font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-2"
                    >
                      {video.title}
                    </Link>
                    <button
                      onClick={() => removeFromHistory(video.id)}
                      className="p-1.5 rounded-lg text-[#A3AABD] hover:text-[#F06464] hover:bg-[#202635] transition-colors shrink-0"
                      title="Remove from history"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#A3AABD] mt-1">{video.channel.name}</p>
                  <p className="text-[11px] text-[#A3AABD] font-mono mt-0.5">
                    Watched {watchedAt} · {video.viewsFormatted} views
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearHistory}
        title="Clear Watch History"
        message="Are you sure you want to clear your entire watch history? This action cannot be undone."
        confirmLabel="Clear History"
        isDestructive
      />
    </div>
  );
};
