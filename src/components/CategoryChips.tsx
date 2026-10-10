import React, { useRef } from 'react';
import { VideoCategory } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryChipsProps {
  activeCategory: VideoCategory | string;
  onSelectCategory: (category: VideoCategory | string) => void;
}

const CATEGORIES: (VideoCategory | string)[] = [
  'All',
  'Technology',
  'Gaming',
  'Education',
  'News',
  'Entertainment',
  'Music',
  'Sports',
  'Podcasts',
  'Science',
  'Business',
  'Lifestyle',
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center py-2 mb-4 group/bar">
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 z-10 w-8 h-8 rounded-full bg-[#181C26]/90 border border-[#2A3040] shadow-md items-center justify-center text-[#F5F7FA] hover:bg-[#202635] transition-colors"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map(cat => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-[#7C5CFC] text-white shadow-sm shadow-[#7C5CFC]/30'
                  : 'bg-[#181C26] hover:bg-[#202635] text-[#A3AABD] hover:text-[#F5F7FA] border border-[#2A3040]/70'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 z-10 w-8 h-8 rounded-full bg-[#181C26]/90 border border-[#2A3040] shadow-md items-center justify-center text-[#F5F7FA] hover:bg-[#202635] transition-colors"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
