import React from 'react';
import { Link } from 'react-router-dom';
import { ContinueWatchingItem } from '../types';
import { useApp } from '../contexts/AppContext';
import { Play, X } from 'lucide-react';

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({ item }) => {
  const { removeFromContinueWatching } = useApp();
  const watchUrl = `/watch/${item.contentId}`;

  return (
    <div className="group relative flex flex-col shrink-0 w-64 sm:w-72">
      {/* 16:9 Landscape Video Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#181C26] border border-[#2A3040] group-hover:border-[#7C5CFC]/70 transition-all duration-300 shadow-md group-hover:shadow-xl">
        <img
          src={item.backdrop}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play Icon in center */}
        <Link
          to={watchUrl}
          className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center"
        >
          <div className="w-11 h-11 rounded-full bg-white/90 group-hover:bg-[#7C5CFC] text-black group-hover:text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </Link>

        {/* Remove from row button */}
        <button
          onClick={e => {
            e.preventDefault();
            removeFromContinueWatching(item.id);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
          title="Remove from Continue Watching"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Progress Bar at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/60">
          <div
            className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9278FF]"
            style={{ width: `${item.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-1">
        <Link
          to={watchUrl}
          className="text-xs sm:text-sm font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-1 block leading-tight"
        >
          {item.title}
        </Link>
        <div className="flex items-center justify-between text-[11px] text-[#A3AABD] mt-1 font-mono">
          <span>
            {item.seasonNumber && item.episodeNumber
              ? `S${item.seasonNumber}:E${item.episodeNumber}`
              : 'Movie'}
          </span>
          <span className="text-[#35C98A]">{item.remainingTime}</span>
        </div>
      </div>
    </div>
  );
};
