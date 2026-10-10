import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdvertisementBannerProps {
  variant?: 'banner' | 'card';
}

export const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({ variant = 'banner' }) => {
  if (variant === 'card') {
    return (
      <div className="relative aspect-[2/3] w-44 rounded-2xl overflow-hidden bg-gradient-to-br from-[#181C26] to-[#12151D] border border-dashed border-[#7C5CFC]/40 p-4 flex flex-col justify-between shrink-0 select-none">
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 text-[#A3AABD] self-start border border-white/10">
          Sponsored
        </span>
        <div className="text-center space-y-1">
          <Sparkles className="w-6 h-6 text-[#7C5CFC] mx-auto animate-pulse" />
          <h4 className="text-xs font-bold text-white">StreamHub Premium 4K</h4>
          <p className="text-[10px] text-[#A3AABD]">Spatial Audio & Ad-Free VIP Experience</p>
        </div>
        <button className="w-full py-1.5 rounded-lg bg-[#7C5CFC]/20 text-[#9278FF] text-[11px] font-bold border border-[#7C5CFC]/30 hover:bg-[#7C5CFC] hover:text-white transition-colors">
          Learn More
        </button>
      </div>
    );
  }

  return (
    <div className="relative my-8 p-6 rounded-3xl bg-gradient-to-r from-[#181C26] via-[#12151D] to-[#181C26] border border-[#2A3040] overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="absolute top-2 left-3 text-[9px] font-mono uppercase tracking-widest text-[#A3AABD]/60">
        Demo Advertisement Placement
      </div>
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#9278FF] flex items-center justify-center text-white shadow-lg shadow-[#7C5CFC]/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#F5F7FA]">
            Experience StreamHub Cinema in Dolby Vision & Atmos
          </h3>
          <p className="text-xs text-[#A3AABD] mt-0.5">
            Stream on connected Smart TVs, Apple TV, Chromecast, and mobile devices in pristine master quality.
          </p>
        </div>
      </div>
      <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold shrink-0 shadow-md shadow-[#7C5CFC]/25 transition-all">
        <span>Upgrade to VIP</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
