import React, { useState, useEffect } from 'react';
import { mediaService } from '../services/mediaService';
import { Movie, TVSeries, MediaItem } from '../types';
import { MovieCard } from '../components/MovieCard';
import { SeriesCard } from '../components/SeriesCard';
import { TopTenCard } from '../components/TopTenCard';
import { ContentRow } from '../components/ContentRow';
import { Flame, Sparkles, TrendingUp, Calendar, Globe, Film, Tv, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewAndPopularPage: React.FC = () => {
  const [top10, setTop10] = useState<MediaItem[]>([]);
  const [newReleases, setNewReleases] = useState<MediaItem[]>([]);
  const [trendingNow, setTrendingNow] = useState<MediaItem[]>([]);
  const [popularThisWeek, setPopularThisWeek] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<TVSeries[]>([]);

  // Country / Region groupings
  const [hollywoodItems, setHollywoodItems] = useState<MediaItem[]>([]);
  const [bollywoodItems, setBollywoodItems] = useState<MediaItem[]>([]);
  const [koreanItems, setKoreanItems] = useState<MediaItem[]>([]);
  const [turkishItems, setTurkishItems] = useState<MediaItem[]>([]);
  const [japaneseAnimeItems, setJapaneseAnimeItems] = useState<MediaItem[]>([]);
  const [intlItems, setIntlItems] = useState<MediaItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      mediaService.getTop10(),
      mediaService.getMovies(),
      mediaService.getTVSeries(),
    ]).then(([top, movies, series]) => {
      setTop10(top);
      const all: MediaItem[] = [...movies, ...series];

      setNewReleases(all.filter(i => i.newRelease));
      setTrendingNow(all.filter(i => i.trending));
      setPopularThisWeek(all.filter(i => (i.matchScore || 0) >= 94));

      setPopularMovies(movies.filter(m => m.trending || m.featured));
      setPopularSeries(series.filter(s => s.trending || s.featured));

      setHollywoodItems(all.filter(i => i.country === 'Hollywood'));
      setBollywoodItems(all.filter(i => i.country === 'Bollywood'));
      setKoreanItems(all.filter(i => i.country === 'Korean'));
      setTurkishItems(all.filter(i => i.country === 'Turkish'));
      setJapaneseAnimeItems(all.filter(i => i.country === 'Anime'));
      setIntlItems(all.filter(i => i.country === 'International' || i.country === 'British'));

      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-16 bg-[#181C26] rounded-2xl" />
        <div className="h-64 bg-[#181C26] rounded-3xl" />
        <div className="h-64 bg-[#181C26] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-[#2A3040]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#7C5CFC]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">New & Popular</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A3AABD] mt-1">
            Editorially curated charts, new seasonal releases, and viral cinematic blockbusters worldwide.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/movies"
            className="px-3.5 py-1.5 rounded-xl bg-[#181C26] hover:bg-[#202635] text-[#F5F7FA] text-xs font-bold border border-[#2A3040] transition-colors"
          >
            Movies
          </Link>
          <Link
            to="/tv-shows"
            className="px-3.5 py-1.5 rounded-xl bg-[#181C26] hover:bg-[#202635] text-[#F5F7FA] text-xs font-bold border border-[#2A3040] transition-colors"
          >
            TV Shows
          </Link>
        </div>
      </div>

      {/* 1. Visually Impressive Numbered Top 10 Section */}
      {top10.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#7C5CFC]" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#F5F7FA] tracking-tight">
                Top 10 Global Titles Today
              </h2>
              <p className="text-xs text-[#A3AABD]">Ranked by total hours viewed across all territories</p>
            </div>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {top10.map((item, index) => (
              <TopTenCard key={item.id} item={item} rank={index + 1} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Trending Now */}
      {trendingNow.length > 0 && (
        <ContentRow
          title="Trending Now"
          subtitle="Highest audience acceleration this week across all media"
        >
          {trendingNow.map(item =>
            item.type === 'movie' ? (
              <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
            ) : (
              <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
            )
          )}
        </ContentRow>
      )}

      {/* 3. Brand New Releases */}
      {newReleases.length > 0 && (
        <ContentRow
          title="New Releases"
          subtitle="Recently added movies and serialized sagas in 2025 & 2026"
        >
          {newReleases.map(item =>
            item.type === 'movie' ? (
              <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
            ) : (
              <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
            )
          )}
        </ContentRow>
      )}

      {/* 4. Popular This Week */}
      {popularThisWeek.length > 0 && (
        <ContentRow
          title="Popular This Week"
          subtitle="Consistently in the top 5% of viewer ratings"
        >
          {popularThisWeek.map(item =>
            item.type === 'movie' ? (
              <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
            ) : (
              <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
            )
          )}
        </ContentRow>
      )}

      {/* 5. Popular Movies Row */}
      {popularMovies.length > 0 && (
        <ContentRow
          title="Popular Movies"
          subtitle="Feature-length cinema currently dominating watchlists"
        >
          {popularMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
          ))}
        </ContentRow>
      )}

      {/* 6. Popular TV Shows Row */}
      {popularSeries.length > 0 && (
        <ContentRow
          title="Popular TV Shows"
          subtitle="Binge-worthy seasonal episodic releases"
        >
          {popularSeries.map(series => (
            <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
          ))}
        </ContentRow>
      )}

      {/* 7. Popular By Country / Region */}
      <div className="space-y-8 pt-4 border-t border-[#2A3040]/70">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#7C5CFC]" />
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#F5F7FA] tracking-tight">
              Popular Around The World
            </h2>
            <p className="text-xs text-[#A3AABD]">Discover international storytelling by territory</p>
          </div>
        </div>

        {koreanItems.length > 0 && (
          <ContentRow title="South Korea (K-Content)" subtitle="Seoul neo-noir thrillers, prestige drama, and cyber sagas">
            {koreanItems.map(item =>
              item.type === 'movie' ? (
                <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
              ) : (
                <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
              )
            )}
          </ContentRow>
        )}

        {japaneseAnimeItems.length > 0 && (
          <ContentRow title="Japan (Anime & Cinema)" subtitle="Original animation, fantasy realms, and cyberpunk Shinjuku">
            {japaneseAnimeItems.map(item =>
              item.type === 'movie' ? (
                <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
              ) : (
                <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
              )
            )}
          </ContentRow>
        )}

        {bollywoodItems.length > 0 && (
          <ContentRow title="India (Bollywood & Mythological Epics)" subtitle="Massive spectacles, mythology, and multi-city heists">
            {bollywoodItems.map(item =>
              item.type === 'movie' ? (
                <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
              ) : (
                <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
              )
            )}
          </ContentRow>
        )}

        {turkishItems.length > 0 && (
          <ContentRow title="Turkey (Historical & Dramatic Sagas)" subtitle="Court intrigues, dynastic battles, and coastal mysteries">
            {turkishItems.map(item =>
              item.type === 'movie' ? (
                <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
              ) : (
                <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
              )
            )}
          </ContentRow>
        )}

        {hollywoodItems.length > 0 && (
          <ContentRow title="Hollywood & United States" subtitle="Blockbuster sci-fi and large-scale action">
            {hollywoodItems.map(item =>
              item.type === 'movie' ? (
                <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
              ) : (
                <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
              )
            )}
          </ContentRow>
        )}
      </div>

      {/* 8. Coming Soon Editorial Teasers */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#181C26] via-[#12151D] to-[#181C26] border border-[#2A3040] space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#7C5CFC]" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Coming Soon to StreamHub</h2>
            <p className="text-xs text-[#A3AABD]">Add upcoming releases to your radar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B0D12]/70 border border-[#2A3040] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#35C98A] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Arriving May 1, 2026
            </span>
            <h4 className="text-sm font-bold text-white">Project Centauri: Horizon Zero</h4>
            <p className="text-xs text-[#A3AABD] leading-relaxed">
              Deep space hard sci-fi thriller about the first antimatter engine voyage to Alpha Centauri.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0D12]/70 border border-[#2A3040] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#35C98A] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Arriving May 8, 2026
            </span>
            <h4 className="text-sm font-bold text-white">Seoul Cyber Crimes: Season 3</h4>
            <p className="text-xs text-[#A3AABD] leading-relaxed">
              The much anticipated conclusion to the Korean corporate espionage trilogy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0D12]/70 border border-[#2A3040] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#35C98A] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Arriving May 15, 2026
            </span>
            <h4 className="text-sm font-bold text-white">Shinjuku Syndicate: Zero Day</h4>
            <p className="text-xs text-[#A3AABD] leading-relaxed">
              Cyber-noir action anime feature from legendary animation director Shinichiro Watanabe.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
