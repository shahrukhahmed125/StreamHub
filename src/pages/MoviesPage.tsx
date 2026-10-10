import React, { useState, useEffect } from 'react';
import { mediaService } from '../services/mediaService';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { TopTenCard } from '../components/TopTenCard';
import { ContentRow } from '../components/ContentRow';
import { Film, Filter, Search, RotateCcw, Sparkles } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'year'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const genres = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Drama', 'Anime', 'Adventure', 'Fantasy', 'Crime', 'Comedy', 'Documentary'];
  const countries = ['All', 'Hollywood', 'Bollywood', 'Korean', 'Turkish', 'Anime', 'International'];
  const years = ['All', '2026', '2025', '2024'];

  useEffect(() => {
    setIsLoading(true);
    mediaService.getMovies().then(movies => {
      setAllMovies(movies);
      setIsLoading(false);
    });
  }, []);

  const isFiltering =
    selectedGenre !== 'All' ||
    selectedCountry !== 'All' ||
    selectedYear !== 'All' ||
    searchQuery.trim() !== '';

  // Filtered list when searching or filtering
  const filteredMovies = allMovies
    .filter(m => {
      if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) return false;
      if (selectedCountry !== 'All' && m.country !== selectedCountry) return false;
      if (selectedYear !== 'All' && m.year.toString() !== selectedYear) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.cast.some(c => c.toLowerCase().includes(q)) ||
          m.director.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.score - a.score;
      if (sortBy === 'year') return b.year - a.year;
      return (b.top10Rank || 99) - (a.top10Rank || 99);
    });

  // Curated subsets for browsing mode
  const featuredMovies = allMovies.filter(m => m.featured);
  const trendingMovies = allMovies.filter(m => m.trending);
  const newReleases = allMovies.filter(m => m.newRelease);
  const top10Movies = allMovies
    .filter(m => m.top10Rank)
    .sort((a, b) => (a.top10Rank || 99) - (b.top10Rank || 99))
    .slice(0, 10);

  const hollywoodMovies = allMovies.filter(m => m.country === 'Hollywood');
  const bollywoodMovies = allMovies.filter(m => m.country === 'Bollywood');
  const koreanMovies = allMovies.filter(m => m.country === 'Korean');
  const turkishMovies = allMovies.filter(m => m.country === 'Turkish');
  const animeMovies = allMovies.filter(m => m.country === 'Anime');
  const sciFiMovies = allMovies.filter(m => m.genres.includes('Sci-Fi'));
  const actionMovies = allMovies.filter(m => m.genres.includes('Action'));
  const thrillerMovies = allMovies.filter(m => m.genres.includes('Thriller'));
  const dramaMovies = allMovies.filter(m => m.genres.includes('Drama'));
  const recommendedMovies = allMovies.filter(m => (m.matchScore || 0) >= 95);

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedCountry('All');
    setSelectedYear('All');
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header & OTT Filters */}
      <div className="space-y-4 pb-4 border-b border-[#2A3040]/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-[#7C5CFC]" />
              <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">Movies</h1>
            </div>
            <p className="text-xs sm:text-sm text-[#A3AABD] mt-1">
              Explore movies from around the world. Stream award-winning blockbusters and indie gems.
            </p>
          </div>

          {/* Search bar inside movies */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search movie title, director, cast..."
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

          {/* Dropdown Filters (Country, Year, Sort) */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Origins' : c}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              {years.map(y => (
                <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
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

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-[#181C26] animate-pulse" />
          ))}
        </div>
      ) : isFiltering ? (
        /* Filtered Grid View */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#A3AABD]">
            <span>Showing {filteredMovies.length} matching movies</span>
            <button
              onClick={handleResetFilters}
              className="text-[#7C5CFC] hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#12151D] border border-[#2A3040] space-y-3">
              <Film className="w-10 h-10 text-[#7C5CFC] mx-auto" />
              <h3 className="text-base font-bold text-white">No movies match your criteria</h3>
              <p className="text-xs text-[#A3AABD]">Try adjusting your genre, year, or origin filters.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#7C5CFC] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Dynamic Curated Rows for Full OTT Browsing */
        <div className="space-y-8">
          {featuredMovies.length > 0 && (
            <ContentRow title="Featured Movies" subtitle="Spotlight blockbuster releases">
              {featuredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {trendingMovies.length > 0 && (
            <ContentRow title="Trending Movies" subtitle="Audiences are watching these right now">
              {trendingMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {top10Movies.length > 0 && (
            <ContentRow title="Top 10 Movies Today" subtitle="Ranked by total watch hours">
              {top10Movies.map((movie, idx) => (
                <TopTenCard key={movie.id} item={movie} rank={idx + 1} />
              ))}
            </ContentRow>
          )}

          {newReleases.length > 0 && (
            <ContentRow title="New Releases" subtitle="Recently added films">
              {newReleases.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {recommendedMovies.length > 0 && (
            <ContentRow title="Recommended For You" subtitle="Top matched to global critical acclaim">
              {recommendedMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {hollywoodMovies.length > 0 && (
            <ContentRow title="Hollywood Blockbusters" subtitle="High production Western cinema">
              {hollywoodMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {bollywoodMovies.length > 0 && (
            <ContentRow title="Bollywood Cinema" subtitle="Epic drama, mythology, and high octane thrillers">
              {bollywoodMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {koreanMovies.length > 0 && (
            <ContentRow title="Korean Masterpieces" subtitle="Gripping thrillers and neo-noir tales">
              {koreanMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {animeMovies.length > 0 && (
            <ContentRow title="Anime & Japanese Animation" subtitle="Futuristic and fantasy sagas">
              {animeMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {turkishMovies.length > 0 && (
            <ContentRow title="Turkish Cinema" subtitle="Historical spectacles and emotional stories">
              {turkishMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {sciFiMovies.length > 0 && (
            <ContentRow title="Sci-Fi & Cyberpunk" subtitle="Explorations of future tech and outer worlds">
              {sciFiMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {actionMovies.length > 0 && (
            <ContentRow title="Action & Adrenaline" subtitle="Stunts, heists, and battles">
              {actionMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}

          {thrillerMovies.length > 0 && (
            <ContentRow title="Thriller & Mystery" subtitle="Mind-bending twists and conspiracies">
              {thrillerMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
              ))}
            </ContentRow>
          )}
        </div>
      )}
    </div>
  );
};
