import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MediaItem } from '../types';
import { useApp } from '../contexts/AppContext';
import {
  Play,
  Plus,
  Check,
  Info,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
} from 'lucide-react';

interface HeroCarouselProps {
  items: MediaItem[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const navigate = useNavigate();
  const { isInMyList, toggleMyList } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  if (items.length === 0) return null;

  const current = items[currentIndex];
  const inMyList = isInMyList(current.id);
  const isMovie = current.type === 'movie';
  const detailUrl = isMovie ? `/movie/${current.id}` : `/series/${current.id}`;
  const watchUrl = `/watch/${current.id}`;

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % items.length);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + items.length) % items.length);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] -mx-4 md:-mx-6 -mt-4 mb-8 overflow-hidden bg-black select-none group"
    >
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={current.backdrop}
          alt={current.title}
          className="w-full h-full object-cover object-center transition-all duration-700 scale-100 group-hover:scale-105"
        />
        {/* Cinematic Scrim Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12] via-[#0B0D12]/70 to-transparent w-full lg:w-3/4" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0B0D12]/90 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-16 z-10">
        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Category Badge & Match score */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-widest bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30">
              {isMovie ? 'FEATURED FILM' : 'ORIGINAL SERIES'}
            </span>
            {current.matchScore && (
              <span className="text-xs font-bold text-[#35C98A] font-mono">
                {current.matchScore}% Match
              </span>
            )}
            <span className="text-xs text-[#A3AABD]">·</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/20">
              {current.rating}
            </span>
            <span className="text-xs text-[#A3AABD]">·</span>
            <span className="text-xs text-white/90 font-medium">{current.year}</span>
            <span className="text-xs text-[#A3AABD]">·</span>
            <span className="text-xs text-white/90 font-medium">
              {isMovie ? (current as any).runtime : `${(current as any).seasonsCount} Seasons`}
            </span>
          </div>

          {/* Cinematic Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F5F7FA] tracking-tight leading-[1.08] drop-shadow-2xl">
            {current.title}
          </h1>

          {/* Genre & Tagline */}
          <div className="flex items-center gap-2 text-xs text-[#A3AABD] flex-wrap">
            {current.genres.map((g, i) => (
              <React.Fragment key={g}>
                <span className="text-white/80 font-medium">{g}</span>
                {i < current.genres.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
            <span className="text-xs text-[#A3AABD]">·</span>
            <span className="text-amber-400 font-bold flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              {current.score}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-[#A3AABD] line-clamp-3 leading-relaxed max-w-xl drop-shadow-md">
            {current.description}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              to={watchUrl}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold shadow-xl transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Now</span>
            </Link>

            <button
              onClick={() => toggleMyList(current)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#202635]/80 hover:bg-[#2A3040] border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
            >
              {inMyList ? (
                <>
                  <Check className="w-4 h-4 text-[#35C98A]" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>My List</span>
                </>
              )}
            </button>

            <Link
              to={detailUrl}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#181C26]/80 hover:bg-[#202635] border border-white/10 text-white text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Chevrons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
        aria-label="Previous featured movie"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
        aria-label="Next featured movie"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicator Bars */}
      <div className="absolute bottom-5 right-6 md:right-10 flex items-center gap-2 z-20">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-8 bg-[#7C5CFC]' : 'w-3 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
