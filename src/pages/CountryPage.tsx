import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mediaService } from '../services/mediaService';
import { Movie, TVSeries } from '../types';
import { MovieCard } from '../components/MovieCard';
import { SeriesCard } from '../components/SeriesCard';
import { Globe, Film, Tv, Sparkles, AlertCircle } from 'lucide-react';

export const CountryPage: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<TVSeries[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Map slug or name to country label
  const countryNameMap: Record<string, string> = {
    hollywood: 'Hollywood & North America',
    bollywood: 'Bollywood & India',
    korean: 'South Korea (K-Cinema & K-Drama)',
    turkish: 'Turkey (Turkish Dramas & Sagas)',
    anime: 'Japan (Anime & Japanese Cinema)',
    international: 'International Cinema',
    british: 'United Kingdom & Europe',
  };

  const rawKey = country?.toLowerCase().trim() || '';
  const displayName = countryNameMap[rawKey] || (country ? country.charAt(0).toUpperCase() + country.slice(1) : 'International');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (!country) return;

    // Normalizing country filter
    let lookup = country;
    if (rawKey === 'india') lookup = 'Bollywood';
    if (rawKey === 'korea' || rawKey === 'south-korea') lookup = 'Korean';
    if (rawKey === 'japan') lookup = 'Anime';
    if (rawKey === 'turkey') lookup = 'Turkish';
    if (rawKey === 'us' || rawKey === 'usa') lookup = 'Hollywood';

    mediaService.getMediaByCountry(lookup).then(data => {
      if (isMounted) {
        setMovies(data.movies);
        setSeries(data.series);
        setIsLoading(false);
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [country]);

  const totalCount = movies.length + series.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Header */}
      <div className="pb-4 border-b border-[#2A3040]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#7C5CFC]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">
              {displayName}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A3AABD] mt-1">
            Stream acclaimed storytelling, blockbusters, and television productions from {displayName}.
          </p>
        </div>

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
              <span>Movies ({movies.length})</span>
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
              <span>TV Shows ({series.length})</span>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-[#181C26]" />
          ))}
        </div>
      ) : totalCount === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#12151D] border border-[#2A3040] space-y-4 max-w-xl mx-auto my-12">
          <AlertCircle className="w-12 h-12 text-[#A3AABD] mx-auto" />
          <h3 className="text-xl font-bold text-white">No titles available for this territory</h3>
          <p className="text-xs text-[#A3AABD] leading-relaxed">
            Check back soon as we continuously expand our international cinema collection.
          </p>
          <div className="pt-2">
            <Link
              to="/new-and-popular"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold"
            >
              Explore New & Popular
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {(activeTab === 'all' || activeTab === 'movies') && movies.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-[#7C5CFC]" />
                <span>Feature Films ({movies.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'series') && series.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#7C5CFC]" />
                <span>TV Series & Sagas ({series.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {series.map(s => (
                  <SeriesCard key={s.id} series={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
