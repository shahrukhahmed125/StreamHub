import React, { useState, useEffect } from 'react';
import { mediaService } from '../services/mediaService';
import { videoService } from '../services/videoService';
import { Movie, TVSeries, MediaItem, ContinueWatchingItem, Video } from '../types';
import { HeroCarousel } from '../components/HeroCarousel';
import { ContentRow } from '../components/ContentRow';
import { MovieCard } from '../components/MovieCard';
import { SeriesCard } from '../components/SeriesCard';
import { TopTenCard } from '../components/TopTenCard';
import { ContinueWatchingCard } from '../components/ContinueWatchingCard';
import { VideoCard } from '../components/VideoCard';
import { AdvertisementBanner } from '../components/AdvertisementBanner';
import { Link } from 'react-router-dom';
import { Flame, Sparkles, Tv, Film, Compass, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [heroItems, setHeroItems] = useState<MediaItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [top10Items, setTop10Items] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<TVSeries[]>([]);
  const [koreanInternational, setKoreanInternational] = useState<MediaItem[]>([]);
  const [animeHighlights, setAnimeHighlights] = useState<MediaItem[]>([]);
  const [creatorHighlights, setCreatorHighlights] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      const [
        hero,
        cw,
        top10,
        movies,
        series,
        creators,
      ] = await Promise.all([
        mediaService.getFeaturedCarousel(),
        mediaService.getContinueWatching(),
        mediaService.getTop10(),
        mediaService.getMovies(),
        mediaService.getTVSeries(),
        videoService.getVideos(),
      ]);

      if (isMounted) {
        setHeroItems(hero);
        setContinueWatching(cw);
        setTop10Items(top10);
        setTrendingMovies(movies.filter(m => m.trending));
        setPopularSeries(series.filter(s => s.trending));

        // Korean & International rows
        const intl = [...movies, ...series].filter(
          item => item.country === 'Korean' || item.country === 'Turkish' || item.country === 'Bollywood'
        );
        setKoreanInternational(intl);

        // Anime rows
        const anime = [...movies, ...series].filter(item => item.country === 'Anime');
        setAnimeHighlights(anime);

        // Creator UGC videos (secondary layer)
        setCreatorHighlights(creators.filter(v => !v.isShort).slice(0, 6));

        setIsLoading(false);
      }
    };

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="w-full h-[550px] -mx-4 -mt-4 bg-[#12151D] animate-pulse rounded-2xl" />
        <div className="h-48 bg-[#181C26] rounded-2xl animate-pulse" />
        <div className="h-48 bg-[#181C26] rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Full-Width Cinematic Hero Carousel */}
      <HeroCarousel items={heroItems} />

      {/* 2. Continue Watching (if user has in-progress items) */}
      {continueWatching.length > 0 && (
        <ContentRow
          title="Continue Watching"
          subtitle="Pick up right where you left off"
          seeAllHref="/continue-watching"
        >
          {continueWatching.map(item => (
            <ContinueWatchingCard key={item.id} item={item} />
          ))}
        </ContentRow>
      )}

      {/* 3. Top 10 Global Movies & Series Today */}
      {top10Items.length > 0 && (
        <ContentRow
          title="Top 10 on StreamHub Today"
          subtitle="Most watched movies and television series worldwide"
          seeAllHref="/new-and-popular"
        >
          {top10Items.map((item, index) => (
            <TopTenCard key={item.id} item={item} rank={index + 1} />
          ))}
        </ContentRow>
      )}

      {/* 4. Trending Blockbuster Movies */}
      <ContentRow
        title="Trending Movies"
        subtitle="Critically acclaimed cinematic blockbusters"
        seeAllHref="/movies"
      >
        {trendingMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} className="w-36 sm:w-44 lg:w-48" />
        ))}
      </ContentRow>

      {/* 5. Popular Television & Original Series */}
      <ContentRow
        title="Popular TV Shows"
        subtitle="Binge-worthy seasonal dramas and sci-fi sagas"
        seeAllHref="/tv-shows"
      >
        {popularSeries.map(series => (
          <SeriesCard key={series.id} series={series} className="w-36 sm:w-44 lg:w-48" />
        ))}
      </ContentRow>

      {/* 6. Integrated VIP / Cinema Experience Banner */}
      <AdvertisementBanner />

      {/* 7. Korean, Turkish & International Sensations */}
      {koreanInternational.length > 0 && (
        <ContentRow
          title="International & Regional Highlights"
          subtitle="Top Korean thrillers, Turkish historical epics, and Bollywood sagas"
          seeAllHref="/movies"
        >
          {koreanInternational.map(item =>
            item.type === 'movie' ? (
              <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
            ) : (
              <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
            )
          )}
        </ContentRow>
      )}

      {/* 8. Anime & Animation Sagas */}
      {animeHighlights.length > 0 && (
        <ContentRow
          title="Anime & Animated Cinema"
          subtitle="Epic journeys, fantasy realms, and cyberpunk worlds"
          seeAllHref="/movies"
        >
          {animeHighlights.map(item =>
            item.type === 'movie' ? (
              <MovieCard key={item.id} movie={item} className="w-36 sm:w-44 lg:w-48" />
            ) : (
              <SeriesCard key={item.id} series={item} className="w-36 sm:w-44 lg:w-48" />
            )
          )}
        </ContentRow>
      )}

      {/* 9. SECONDARY LAYER: StreamHub Community & Creator Spotlight */}
      <section className="pt-6 border-t border-[#2A3040]/70">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#7C5CFC]/20 text-[#9278FF] border border-[#7C5CFC]/30">
                CREATOR PLATFORM
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#F5F7FA]">
                StreamHub Community & Independent Creators
              </h2>
            </div>
            <p className="text-xs text-[#A3AABD] mt-1">
              Discover engineering masterclasses, gaming tournaments, and tech breakthroughs
            </p>
          </div>

          <Link
            to="/creators"
            className="text-xs font-semibold text-[#7C5CFC] hover:text-[#9278FF] hover:underline"
          >
            Visit Creator Hub →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creatorHighlights.slice(0, 3).map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
};
