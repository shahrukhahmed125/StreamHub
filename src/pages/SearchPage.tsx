import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mediaService } from '../services/mediaService';
import { channelService } from '../services/channelService';
import { videoService } from '../services/videoService';
import { Movie, TVSeries, Channel, Video } from '../types';
import { MovieCard } from '../components/MovieCard';
import { SeriesCard } from '../components/SeriesCard';
import { VideoCard } from '../components/VideoCard';
import { SubscribeButton } from '../components/SubscribeButton';
import { ContentRow } from '../components/ContentRow';
import {
  Search,
  Filter,
  Film,
  Tv,
  Users,
  Zap,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query);

  const [contentType, setContentType] = useState<'all' | 'movies' | 'series' | 'creators' | 'videos'>('all');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [seriesResults, setSeriesResults] = useState<TVSeries[]>([]);
  const [channelResults, setChannelResults] = useState<Channel[]>([]);
  const [videoResults, setVideoResults] = useState<Video[]>([]);
  const [shortsResults, setShortsResults] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const genres = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Drama', 'Anime', 'Adventure', 'Crime'];
  const countries = ['All', 'Hollywood', 'Bollywood', 'Korean', 'Turkish', 'Anime', 'International'];
  const years = ['All', '2026', '2025', '2024'];

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const runSearch = async () => {
      const q = query.trim().toLowerCase();

      // Search Movies & TV
      const [allMovies, allSeries, allChannels, allVideos] = await Promise.all([
        mediaService.getMovies(),
        mediaService.getTVSeries(),
        channelService.getChannels(),
        videoService.getVideos(),
      ]);

      if (!isMounted) return;

      if (!q) {
        // When query is empty, show popular discoverable content
        setMovieResults(allMovies.slice(0, 6));
        setSeriesResults(allSeries.slice(0, 6));
        setChannelResults(allChannels.slice(0, 4));
        setVideoResults(allVideos.filter(v => !v.isShort).slice(0, 6));
        setShortsResults(allVideos.filter(v => v.isShort).slice(0, 6));
      } else {
        // Grouped match filtering
        const matchedMovies = allMovies.filter(m => {
          const matchText =
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.cast.some(c => c.toLowerCase().includes(q)) ||
            m.director.toLowerCase().includes(q) ||
            m.genres.some(g => g.toLowerCase().includes(q));

          if (!matchText) return false;
          if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) return false;
          if (selectedCountry !== 'All' && m.country !== selectedCountry) return false;
          if (selectedYear !== 'All' && m.year.toString() !== selectedYear) return false;
          return true;
        });

        const matchedSeries = allSeries.filter(s => {
          const matchText =
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.cast.some(c => c.toLowerCase().includes(q)) ||
            (s.creator && s.creator.toLowerCase().includes(q)) ||
            s.genres.some(g => g.toLowerCase().includes(q));

          if (!matchText) return false;
          if (selectedGenre !== 'All' && !s.genres.includes(selectedGenre)) return false;
          if (selectedCountry !== 'All' && s.country !== selectedCountry) return false;
          if (selectedYear !== 'All' && s.year.toString() !== selectedYear) return false;
          return true;
        });

        const matchedChannels = allChannels.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );

        const matchedVideos = allVideos.filter(v =>
          !v.isShort &&
          (v.title.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q) ||
            v.tags.some(t => t.toLowerCase().includes(q)))
        );

        const matchedShorts = allVideos.filter(v =>
          v.isShort &&
          (v.title.toLowerCase().includes(q) ||
            v.tags.some(t => t.toLowerCase().includes(q)))
        );

        setMovieResults(matchedMovies);
        setSeriesResults(matchedSeries);
        setChannelResults(matchedChannels);
        setVideoResults(matchedVideos);
        setShortsResults(matchedShorts);
      }

      setIsLoading(false);
    };

    runSearch();
    return () => {
      isMounted = false;
    };
  }, [query, selectedGenre, selectedCountry, selectedYear]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedCountry('All');
    setSelectedYear('All');
    setContentType('all');
  };

  const totalHits =
    movieResults.length +
    seriesResults.length +
    channelResults.length +
    videoResults.length +
    shortsResults.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Search Bar & Header */}
      <div className="space-y-4 pb-4 border-b border-[#2A3040]/70">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-5 h-5 text-[#7C5CFC] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localQuery}
            onChange={e => setLocalQuery(e.target.value)}
            placeholder="Search across movies, series, cast, directors, creators, and videos..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[#12151D] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC] shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold transition-all shadow-md shadow-[#7C5CFC]/20"
          >
            Search
          </button>
        </form>

        {/* Content Type Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setContentType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                contentType === 'all'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
              }`}
            >
              All Results ({totalHits})
            </button>
            <button
              onClick={() => setContentType('movies')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                contentType === 'movies'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies ({movieResults.length})</span>
            </button>
            <button
              onClick={() => setContentType('series')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                contentType === 'series'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV Series ({seriesResults.length})</span>
            </button>
            <button
              onClick={() => setContentType('creators')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                contentType === 'creators'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Creators ({channelResults.length})</span>
            </button>
            <button
              onClick={() => setContentType('videos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                contentType === 'videos'
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
              }`}
            >
              Videos & Shorts ({videoResults.length + shortsResults.length})
            </button>
          </div>

          {/* Genre / Country dropdown filters */}
          <div className="flex items-center gap-2 justify-end">
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              {genres.map(g => (
                <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Origins' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Rendering */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-[#181C26]" />
          ))}
        </div>
      ) : totalHits === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#12151D] border border-[#2A3040] space-y-4 max-w-xl mx-auto my-12">
          <AlertCircle className="w-12 h-12 text-[#A3AABD] mx-auto" />
          <h3 className="text-xl font-bold text-white">No results found for "{query}"</h3>
          <p className="text-xs text-[#A3AABD] leading-relaxed">
            Try checking for spelling errors, using different keywords, or resetting filter constraints.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 1. Movies Group */}
          {(contentType === 'all' || contentType === 'movies') && movieResults.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A3040]">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-[#7C5CFC]" />
                  <span>Movies ({movieResults.length})</span>
                </h2>
                <Link to="/movies" className="text-xs text-[#7C5CFC] hover:underline font-semibold">
                  Browse Catalog
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movieResults.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {/* 2. TV Series Group */}
          {(contentType === 'all' || contentType === 'series') && seriesResults.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A3040]">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#7C5CFC]" />
                  <span>TV Series ({seriesResults.length})</span>
                </h2>
                <Link to="/tv-shows" className="text-xs text-[#7C5CFC] hover:underline font-semibold">
                  Browse Series
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {seriesResults.map(series => (
                  <SeriesCard key={series.id} series={series} />
                ))}
              </div>
            </section>
          )}

          {/* 3. Creators Group */}
          {(contentType === 'all' || contentType === 'creators') && channelResults.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A3040]">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#7C5CFC]" />
                  <span>Creators & Channels ({channelResults.length})</span>
                </h2>
                <Link to="/creators" className="text-xs text-[#7C5CFC] hover:underline font-semibold">
                  All Creators
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {channelResults.map(channel => (
                  <div
                    key={channel.id}
                    className="p-4 rounded-2xl bg-[#12151D] border border-[#2A3040] hover:border-[#7C5CFC] transition-all flex items-center justify-between gap-3"
                  >
                    <Link to={`/creator/${channel.id}`} className="flex items-center gap-3 min-w-0">
                      <img
                        src={channel.avatar}
                        alt={channel.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#2A3040] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-white truncate hover:text-[#9278FF]">
                            {channel.name}
                          </p>
                          {channel.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#7C5CFC] fill-current shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-[#A3AABD] truncate">
                          {channel.subscribersCountFormatted}
                        </p>
                      </div>
                    </Link>
                    <SubscribeButton channelId={channel.id} channelName={channel.name} size="sm" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Creator Videos Group */}
          {(contentType === 'all' || contentType === 'videos') && videoResults.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A3040]">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#7C5CFC]" />
                  <span>Creator Videos ({videoResults.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videoResults.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          )}

          {/* 5. Creator Shorts */}
          {(contentType === 'all' || contentType === 'videos') && shortsResults.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A3040]">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#7C5CFC]" />
                  <span>Shorts ({shortsResults.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {shortsResults.map(short => (
                  <Link
                    key={short.id}
                    to={`/shorts/${short.id}`}
                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-[#2A3040] hover:border-[#7C5CFC] transition-all shadow-lg"
                  >
                    <img
                      src={short.thumbnail}
                      alt={short.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2.5">
                      <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                        {short.title}
                      </p>
                      <span className="text-[9px] font-mono text-[#A3AABD] mt-1">
                        {short.viewsFormatted}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
