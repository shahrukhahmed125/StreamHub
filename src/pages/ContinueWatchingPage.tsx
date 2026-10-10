import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Play, X, Clock, Film, Sparkles } from 'lucide-react';

export const ContinueWatchingPage: React.FC = () => {
  const { continueWatchingList, removeFromContinueWatching } = useApp();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-[#2A3040]/70">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#7C5CFC]" />
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">
            Continue Watching
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#A3AABD] mt-1">
          Pick up where you left off across all your devices.
        </p>
      </div>

      {continueWatchingList.length === 0 ? (
        /* Empty State */
        <div className="p-16 text-center rounded-3xl bg-[#12151D] border border-[#2A3040] space-y-4 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-[#7C5CFC]/20 text-[#7C5CFC] mx-auto flex items-center justify-center">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Nothing to continue yet</h3>
          <p className="text-xs text-[#A3AABD] leading-relaxed">
            Start watching movies and shows and they'll automatically appear here with saved progress.
          </p>
          <div className="pt-2">
            <Link
              to="/movies"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold transition-all shadow-md shadow-[#7C5CFC]/20"
            >
              Explore Movies
            </Link>
          </div>
        </div>
      ) : (
        /* Continue Watching OTT Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {continueWatchingList.map(item => {
            const isSeries = item.contentType === 'series';
            const watchUrl = `/watch/${item.contentId}`;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#181C26] border border-[#2A3040] hover:border-[#7C5CFC] transition-all shadow-xl"
              >
                {/* 16:9 Landscape Video Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={item.backdrop}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Play Overlay */}
                  <Link
                    to={watchUrl}
                    className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/95 group-hover:bg-[#7C5CFC] text-black group-hover:text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={e => {
                      e.preventDefault();
                      removeFromContinueWatching(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Remove from Continue Watching"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Progress bar along bottom of poster */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/80">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9278FF]"
                      style={{ width: `${item.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#9278FF] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="text-xs text-[#A3AABD] mt-0.5 font-mono">
                      {isSeries && item.seasonNumber && item.episodeNumber ? (
                        <span>
                          S{item.seasonNumber} E{item.episodeNumber}
                          {item.episodeTitle ? ` • ${item.episodeTitle}` : ''}
                        </span>
                      ) : (
                        <span>Feature Movie</span>
                      )}
                    </div>
                  </div>

                  {/* Progress percentage bar info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A3AABD]">
                      <span className="text-[#9278FF] font-bold">{item.progressPercentage}% watched</span>
                      <span className="text-[#35C98A]">{item.remainingTime} left</span>
                    </div>

                    <Link
                      to={watchUrl}
                      className="w-full py-2 rounded-xl bg-[#202635] hover:bg-[#7C5CFC] hover:text-white text-xs font-bold text-[#F5F7FA] border border-[#2A3040] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSeries ? 'Resume Episode' : 'Resume Movie'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
