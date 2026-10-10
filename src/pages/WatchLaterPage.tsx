import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { videoService } from '../services/videoService';
import { Video } from '../types';
import { Clock, Play, Trash2, ArrowUpDown } from 'lucide-react';
import { ConfirmationDialog } from '../components/Modal';

export const WatchLaterPage: React.FC = () => {
  const { savedWatchLaterIds, toggleWatchLater, addToast } = useApp();
  const [videos, setVideos] = useState<Video[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'duration'>('default');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    videoService.getVideos().then(all => {
      setVideos(all.filter(v => savedWatchLaterIds.includes(v.id)));
    });
  }, [savedWatchLaterIds]);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'duration') return b.durationSeconds - a.durationSeconds;
    return 0;
  });

  const handleClearAll = () => {
    videos.forEach(v => toggleWatchLater(v));
    addToast('Cleared Watch Later', undefined, 'info');
  };

  const firstVideo = sortedVideos[0];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Left Column: Summary Card */}
      <div className="md:col-span-5 lg:col-span-4">
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181C26] to-[#12151D] border border-[#2A3040] shadow-2xl space-y-4 sticky top-20">
          <div className="w-12 h-12 rounded-2xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#F5F7FA]">Watch Later</h1>
            <p className="text-xs text-[#A3AABD] mt-1 font-mono">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} saved
            </p>
          </div>

          <p className="text-xs text-[#A3AABD] leading-relaxed">
            Personal list of videos saved to watch at a later time.
          </p>

          <div className="pt-2 space-y-2">
            {firstVideo ? (
              <Link
                to={`/watch/${firstVideo.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold shadow-lg shadow-[#7C5CFC]/25 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play All</span>
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-xl bg-[#202635] text-[#A3AABD] text-xs font-semibold opacity-50"
              >
                No Videos
              </button>
            )}

            {videos.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#202635] hover:bg-[#F06464]/20 border border-[#2A3040] hover:border-[#F06464]/40 text-xs font-medium text-[#A3AABD] hover:text-[#F06464] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear List</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Video List */}
      <div className="md:col-span-7 lg:col-span-8 space-y-3">
        {videos.length > 0 && (
          <div className="flex justify-end pb-2">
            <button
              onClick={() => {
                if (sortBy === 'default') setSortBy('title');
                else if (sortBy === 'title') setSortBy('duration');
                else setSortBy('default');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-medium text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: {sortBy === 'default' ? 'Recently Added' : sortBy === 'title' ? 'Title' : 'Duration'}</span>
            </button>
          </div>
        )}

        {sortedVideos.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-3">
            <Clock className="w-10 h-10 text-[#7C5CFC] mx-auto" />
            <h3 className="text-sm font-bold text-[#F5F7FA]">Your Watch Later list is empty</h3>
            <p className="text-xs text-[#A3AABD]">
              Click the "Save to Watch Later" button on any video card to save it here.
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold rounded-xl"
            >
              Browse Videos
            </Link>
          </div>
        ) : (
          sortedVideos.map((video, index) => (
            <div
              key={video.id}
              className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#181C26] transition-colors border border-transparent hover:border-[#2A3040]"
            >
              <span className="w-6 text-center text-xs font-mono font-bold text-[#A3AABD]">
                {index + 1}
              </span>

              <Link
                to={`/watch/${video.id}`}
                className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-[#2A3040]/50"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 text-[10px] font-bold rounded-sm bg-black/80 text-white">
                  {video.duration}
                </span>
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/watch/${video.id}`}
                  className="text-xs sm:text-sm font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-2"
                >
                  {video.title}
                </Link>
                <p className="text-xs text-[#A3AABD] mt-1">{video.channel.name}</p>
                <p className="text-[11px] text-[#A3AABD] font-mono mt-0.5">{video.viewsFormatted} views</p>
              </div>

              <button
                onClick={() => toggleWatchLater(video)}
                className="p-2 rounded-xl text-[#A3AABD] hover:text-[#F06464] hover:bg-[#202635] transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from Watch Later"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear Watch Later"
        message="Are you sure you want to remove all videos from your Watch Later collection?"
        confirmLabel="Clear All"
        isDestructive
      />
    </div>
  );
};
