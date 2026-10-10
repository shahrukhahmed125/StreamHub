import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { mediaService } from '../services/mediaService';
import { Movie, TVSeries, MediaItem } from '../types';
import { MovieCard } from '../components/MovieCard';
import { SeriesCard } from '../components/SeriesCard';
import { Bookmark, Film, Tv, Sparkles, AlertCircle } from 'lucide-react';

export const MyListPage: React.FC = () => {
  const { myListIds } = useApp();
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [savedSeries, setSavedSeries] = useState<TVSeries[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      mediaService.getMovies(),
      mediaService.getTVSeries(),
    ]).then(([movies, series]) => {
      const matchedMovies = movies.filter(m => myListIds.includes(m.id));
      const matchedSeries = series.filter(s => myListIds.includes(s.id));
      setSavedMovies(matchedMovies);
      setSavedSeries(matchedSeries);
      setIsLoading(false);
    });
  }, [myListIds]);

  const allItems: MediaItem[] = [...savedMovies, ...savedSeries];
  const totalCount = allItems.length;

  const displayItems =
    activeTab === 'movies'
      ? savedMovies
      : activeTab === 'series'
      ? savedSeries
      : allItems;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-[#2A3040]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-[#7C5CFC]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">
              My List
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A3AABD] mt-1">
            Your personal streaming queue. Saved movies and television series.
          </p>
        </div>

        {/* Tab Switcher */}
        {totalCount > 0 && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#181C26] border border-[#2A3040] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#A3AABD] hover:text-white'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'movies'
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#A3AABD] hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies ({savedMovies.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('series')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'series'
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#A3AABD] hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV Shows ({savedSeries.length})</span>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-[#181C26] animate-pulse" />
          ))}
        </div>
      ) : totalCount === 0 ? (
        /* Empty State */
        <div className="p-16 text-center rounded-3xl bg-[#12151D] border border-[#2A3040] space-y-4 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-[#7C5CFC]/20 text-[#7C5CFC] mx-auto flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Your list is empty</h3>
          <p className="text-xs text-[#A3AABD] leading-relaxed">
            Save movies and shows here so you can easily find them later from any device.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/movies"
              className="px-6 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold transition-all shadow-md shadow-[#7C5CFC]/20"
            >
              Browse Movies
            </Link>
            <Link
              to="/tv-shows"
              className="px-6 py-2.5 rounded-xl bg-[#181C26] hover:bg-[#202635] text-white text-xs font-bold border border-[#2A3040] transition-colors"
            >
              Browse TV Shows
            </Link>
          </div>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#12151D] border border-[#2A3040] text-xs text-[#A3AABD]">
          No saved items in this category.
        </div>
      ) : (
        /* Items Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {displayItems.map(item =>
            item.type === 'movie' ? (
              <MovieCard key={item.id} movie={item} />
            ) : (
              <SeriesCard key={item.id} series={item} />
            )
          )}
        </div>
      )}
    </div>
  );
};
