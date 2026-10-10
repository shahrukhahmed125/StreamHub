import React from 'react';
import { Link } from 'react-router-dom';
import { Playlist } from '../types';
import { ListVideo, Lock, Globe, EyeOff, Play } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group flex flex-col gap-2.5 rounded-2xl p-2 hover:bg-[#181C26]/50 transition-colors"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#181C26] border border-[#2A3040]/50 group-hover:border-[#7C5CFC]/40 transition-colors">
        <img
          src={playlist.thumbnail}
          alt={playlist.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Right side overlay bar showing playlist info */}
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1 p-2 text-center border-l border-white/10">
          <ListVideo className="w-6 h-6 text-[#7C5CFC]" />
          <span className="text-xs font-bold">{playlist.videoCount}</span>
          <span className="text-[10px] text-[#A3AABD] uppercase tracking-wider">Videos</span>
        </div>

        {/* Hover play icon */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-lg transform -translate-x-6">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <div className="px-1">
        <h4 className="text-sm font-semibold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-1">
          {playlist.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-[#A3AABD] mt-1">
          <span className="capitalize flex items-center gap-1">
            {playlist.visibility === 'private' ? (
              <Lock className="w-3 h-3" />
            ) : playlist.visibility === 'unlisted' ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Globe className="w-3 h-3" />
            )}
            {playlist.visibility}
          </span>
          <span>·</span>
          <span>Updated {playlist.updatedAt}</span>
        </div>
      </div>
    </Link>
  );
};
