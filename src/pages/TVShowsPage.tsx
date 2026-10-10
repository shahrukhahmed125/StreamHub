import React, { useState, useEffect } from 'react';
import { mediaService } from '../services/mediaService';
import { TVSeries } from '../types';
import { SeriesCard } from '../components/SeriesCard';
import { TopTenCard } from '../components/TopTenCard';
import { ContentRow } from '../components/ContentRow';
import { Tv, Search, RotateCcw, Sparkles } from 'lucide-react';

export const TVShowsPage: React.FC = () => {
  const [allSeries, setAllSeries] = useState<TVSeries[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'year'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const genres = ['All', 'Thriller', 'Drama', 'Sci-Fi', 'Action', 'Anime', 'Crime', 'Comedy', 'Espionage', 'Historical'];
  const countries = ['All', 'Korean', 'Turkish', 'Bollywood', 'Hollywood', 'Anime', 'British'];

  useEffect(() => {
    setIsLoading(true);
    mediaService.getTVSeries().then(series => {
      setAllSeries(series);
      setIsLoading(false);
    });
  }, []);

  const isFiltering =
    selectedGenre !== 'All' ||
    selectedCountry !== 'All' ||
    searchQuery.trim() !== '';

  const filteredSeries = allSeries
    .filter(s => {
      if (selectedGenre !== 'All' && !s.genres.includes(selectedGenre)) return false;
      if (selectedCountry !== 'All' && s.country !== selectedCountry) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.cast.some(c => c.toLowerCase().includes(q)) ||
          (s.creator && s.creator.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.score - a.score;
      if (sortBy === 'year') return b.year - a.year;
      return (b.top10Rank || 99) - (a.top10Rank || 99);
    });

  // Curated subsets
  const featuredSeries = allSeries.filter(s => s.featured);
  const trendingSeries = allSeries.filter(s => s.trending);
  const newReleases = allSeries.filter(s => s.newRelease);
  const top10Series = allSeries
    .filter(s => s.top10Rank)
    .sort((a, b) => (a.top10Rank || 99) - (b.top10Rank || 99));

  const koreanSeries = allSeries.filter(s => s.country === 'Korean');
  const turkishSeries = allSeries.filter(s => s.country === 'Turkish');
  const bollywoodSeries = allSeries.filter(s => s.country === 'Bollywood');
  const animeSeries = allSeries.filter(s => s.country === 'Anime');
  const sciFiSeries = allSeries.filter(s => s.genres.includes('Sci-Fi'));
  const thrillerSeries = allSeries.filter(s => s.genres.includes('Thriller'));
  const crimeSeries = allSeries.filter(s => s.genres.includes('Crime') || s.genres.includes('Espionage'));

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedCountry('All');
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-4 pb-4 border-b border-[#2A3040]/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Tv className="w-6 h-6 text-[#7C5CFC]" />
              <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">TV Shows & Series</h1>
            </div>
            <p className="text-xs sm:text-sm text-[#A3AABD] mt-1">
              Binge global television sagas, Korean dramas, serialized sci-fi, and historical epics.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search series titles, creators, cast..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC]"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
                    : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Regions' : c}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Newest First</option>
            </select>

            {isFiltering && (
              <button
                onClick={handleResetFilters}
                className="p-1.5 rounded-xl bg-[#202635] text-[#A3AABD] hover:text-white border border-[#2A3040]"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-[#181C26] animate-pulse" />
          ))}
        </div>
      ) : isFiltering ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#A3AABD]">
            <span>Showing {filteredSeries.length} matching television series</span>
            <button
              onClick={handleResetFilters}
              className="text-[#7C5CFC] hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>

          {filteredSeries.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#12151D] border border-[#2A3040] space-y-3">
              <Tv className="w-10 h-10 text-[#7C5CFC] mx-auto" />
              <h3 className="text-base font-bold text-white">No series match your criteria</h3>
              <p className="text-xs text-[#A3AABD]">Try adjusting your genre or region filters.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#7C5CFC] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {filteredSeries.map(series => (
                <SeriesCard key={series.id} series={series} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Netflix-style horizontal rows */
        <div className="space-y-8">
          {featuredSeries.length > 0 && (
            <ContentRow title="Featured Series" subtitle="StreamHub Original serialized productions">
              {featuredSeries.map(series => (
                <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {trendingSeries.length > 0 && (
            <ContentRow title="Trending Series" subtitle="Most watched episodes this week">
              {trendingSeries.map(series => (
                <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {top10Series.length > 0 && (
            <ContentRow title="Top 10 Series Today" subtitle="Global viewer rankings">
              {top10Series.map((series, idx) => (
                <TopTenCard key={series.id} item={series} rank={idx + 1} />
              ))}
            </ContentRow>
          )}

          {koreanSeries.length > 0 && (
            <ContentRow title="Korean Dramas (K-Drama)" subtitle="Addictive Seoul television series & thrillers">
              {koreanSeries.map(series => (
                <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {turkishSeries.length > 0 && (
            <ContentRow title="Turkish Historical Sagas" subtitle="Epic dynasties, honor, and intrigue">
              {turkishSeries.map(series => (
                <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {sciFiSeries.length > 0 && (
            <ContentRow title="Sci-Fi & Cyberpunk Sagas" subtitle="Future dystopias and neural frontiers">
              {sciFiSeries.map(series => (
                <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {thrillerSeries.length > 0 && (
            <ContentRow title="Suspense & Thrillers" subtitle="Psychological drama and crime investigations">
              {thrillerSeries.map(series => (
                <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {animeSeries.length > 0 && (
            <ContentRow title="Anime Series" subtitle="Serialized Japanese animation">
              {animeSeries.map(series => (
                <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}
        </div>
      )}
    </div>
  );
};
