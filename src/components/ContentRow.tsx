import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  children: React.ReactNode;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  subtitle,
  seeAllHref,
  children,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-3 my-6 group/row relative">
      {/* Row Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#F5F7FA] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#A3AABD] mt-0.5">{subtitle}</p>
          )}
        </div>

        {seeAllHref && (
          <Link
            to={seeAllHref}
            className="text-xs font-semibold text-[#7C5CFC] hover:text-[#9278FF] hover:underline transition-colors"
          >
            Explore all →
          </Link>
        )}
      </div>

      {/* Horizontal Scroll Track */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 hover:bg-[#7C5CFC] border border-white/20 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-all z-30 shadow-xl"
          aria-label="Scroll row left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          className="flex items-start gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 hover:bg-[#7C5CFC] border border-white/20 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-all z-30 shadow-xl"
          aria-label="Scroll row right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
