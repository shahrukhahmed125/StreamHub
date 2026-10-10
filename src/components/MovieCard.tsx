import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { useApp } from '../contexts/AppContext';
import { Play, Plus, Check, Star, Info } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '' }) => {
  const navigate = useNavigate();
  const { isInMyList, toggleMyList } = useApp();
  const inMyList = isInMyList(movie.id);

  return (
    <div className={`group relative flex flex-col shrink-0 ${className}`}>
      {/* 2:3 Vertical Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#181C26] border border-[#2A3040]/70 group-hover:border-[#7C5CFC]/60 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#7C5CFC]/10">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs border border-white/10">
            {movie.rating}
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-amber-400 backdrop-blur-xs flex items-center gap-1 font-mono">
            <Star className="w-3 h-3 fill-current" />
            {movie.score}
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3.5 z-20">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/watch/${movie.id}`}
                className="w-9 h-9 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                title="Watch Now"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </Link>

              <button
                onClick={e => {
                  e.preventDefault();
                  toggleMyList(movie);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                  inMyList
                    ? 'bg-[#35C98A] border-[#35C98A] text-white'
                    : 'bg-[#202635]/80 hover:bg-[#2A3040] border-white/20 text-white'
                }`}
                title={inMyList ? 'In My List' : 'Add to My List'}
              >
                {inMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>

              <Link
                to={`/movie/${movie.id}`}
                className="w-9 h-9 rounded-full bg-[#202635]/80 hover:bg-[#2A3040] border border-white/20 text-white flex items-center justify-center transition-colors ml-auto"
                title="View Movie Details"
              >
                <Info className="w-4 h-4" />
              </Link>
            </div>

            <div className="text-[11px] text-[#A3AABD] space-y-0.5 pt-1">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-white font-semibold">{movie.year}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
              </div>
              <p className="line-clamp-1 text-white/80 font-medium">
                {movie.genres.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Title Below Card */}
      <div className="mt-2.5 px-0.5">
        <Link
          to={`/movie/${movie.id}`}
          className="text-xs sm:text-sm font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-1 block leading-tight"
          title={movie.title}
        >
          {movie.title}
        </Link>
        <div className="flex items-center justify-between text-[11px] text-[#A3AABD] mt-1 font-mono">
          <span>{movie.country}</span>
          <span>{movie.year}</span>
        </div>
      </div>
    </div>
  );
};
