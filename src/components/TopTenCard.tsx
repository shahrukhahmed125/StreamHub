import React from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { useApp } from '../contexts/AppContext';
import { Play, Plus, Check } from 'lucide-react';

interface TopTenCardProps {
  item: MediaItem;
  rank: number;
}

export const TopTenCard: React.FC<TopTenCardProps> = ({ item, rank }) => {
  const { isInMyList, toggleMyList } = useApp();
  const inMyList = isInMyList(item.id);
  const detailUrl = item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;

  const rankPadded = rank < 10 ? `0${rank}` : `${rank}`;

  return (
    <div className="group relative flex items-end shrink-0 w-52 sm:w-60 select-none">
      {/* Giant Stylized Rank Number */}
      <span
        className="font-black text-7xl sm:text-8xl tracking-tighter leading-none text-transparent font-mono select-none -mr-7 sm:-mr-9 z-10 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
        style={{
          WebkitTextStroke: '2.5px #7C5CFC',
          textShadow: '0 0 30px rgba(124, 92, 252, 0.4)',
        }}
      >
        {rankPadded}
      </span>

      {/* 2:3 Vertical Poster */}
      <div className="relative aspect-[2/3] w-36 sm:w-44 rounded-2xl overflow-hidden bg-[#181C26] border border-[#2A3040] group-hover:border-[#7C5CFC] shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#7C5CFC]/20 shrink-0">
        <img
          src={item.poster}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 z-20">
          <Link
            to={detailUrl}
            className="text-xs font-bold text-white hover:text-[#9278FF] line-clamp-1 block mb-2"
          >
            {item.title}
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={`/watch/${item.id}`}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              title="Watch Now"
            >
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </Link>

            <button
              onClick={e => {
                e.preventDefault();
                toggleMyList(item);
              }}
              className="w-8 h-8 rounded-full bg-[#202635] text-white flex items-center justify-center border border-white/20 hover:bg-[#2A3040] transition-colors"
              title={inMyList ? 'In My List' : 'Add to My List'}
            >
              {inMyList ? <Check className="w-3.5 h-3.5 text-[#35C98A]" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
