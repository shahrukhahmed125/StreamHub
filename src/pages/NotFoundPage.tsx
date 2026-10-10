import React from 'react';
import { Link } from 'react-router-dom';
import { PlaySquare, Home, Compass, Flame } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30 shadow-2xl">
        <PlaySquare className="w-10 h-10 fill-current" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-4xl font-extrabold text-[#7C5CFC] font-mono">404</span>
        <h1 className="text-xl font-bold text-[#F5F7FA]">This page isn't available</h1>
        <p className="text-xs text-[#A3AABD] leading-relaxed">
          The link you followed may be broken, or the video or channel may have been removed.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>StreamHub Home</span>
        </Link>
        <Link
          to="/explore"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] transition-colors"
        >
          <Compass className="w-4 h-4 text-[#7C5CFC]" />
          <span>Explore</span>
        </Link>
        <Link
          to="/trending"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] transition-colors"
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Trending</span>
        </Link>
      </div>
    </div>
  );
};
