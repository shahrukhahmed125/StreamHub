import { Movie, TVSeries, MediaItem, ContinueWatchingItem, Episode, Season, Video, Channel } from '../types';
import { MOCK_MOVIES, MOCK_SERIES, MOCK_CONTINUE_WATCHING, MOCK_VIDEOS, MOCK_CHANNELS } from '../data/mockData';

export type WatchItem =
  | {
      kind: 'movie';
      movie: Movie;
      videoUrl: string;
      title: string;
      backdrop: string;
    }
  | {
      kind: 'episode';
      series: TVSeries;
      season: Season;
      episode: Episode;
      allEpisodes: Episode[];
      prevEpisode?: Episode;
      nextEpisode?: Episode;
      videoUrl: string;
      title: string;
      backdrop: string;
    }
  | {
      kind: 'creator-video';
      video: Video;
      channel?: Channel;
      videoUrl: string;
      title: string;
      backdrop: string;
    };

class MediaService {
  private movies: Movie[] = [...MOCK_MOVIES];
  private series: TVSeries[] = [...MOCK_SERIES];
  private continueWatching: ContinueWatchingItem[] = [...MOCK_CONTINUE_WATCHING];

  async getMovies(options?: {
    country?: string;
    genre?: string;
    sort?: 'popular' | 'rating' | 'year';
    search?: string;
  }): Promise<Movie[]> {
    let list = [...this.movies];

    if (options?.country && options.country !== 'All') {
      list = list.filter(m => m.country.toLowerCase() === options.country?.toLowerCase());
    }

    if (options?.genre && options.genre !== 'All') {
      list = list.filter(m =>
        m.genres.some(g => g.toLowerCase() === options.genre?.toLowerCase())
      );
    }

    if (options?.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.cast.some(c => c.toLowerCase().includes(q)) ||
          m.director.toLowerCase().includes(q)
      );
    }

    if (options?.sort) {
      if (options.sort === 'rating') {
        list.sort((a, b) => b.score - a.score);
      } else if (options.sort === 'year') {
        list.sort((a, b) => b.year - a.year);
      }
    }

    return list;
  }

  async getMovieById(id: string): Promise<Movie | undefined> {
    return this.movies.find(m => m.id === id);
  }

  async getTVSeries(options?: {
    country?: string;
    genre?: string;
    sort?: 'popular' | 'rating' | 'year';
    search?: string;
  }): Promise<TVSeries[]> {
    let list = [...this.series];

    if (options?.country && options.country !== 'All') {
      list = list.filter(s => s.country.toLowerCase() === options.country?.toLowerCase());
    }

    if (options?.genre && options.genre !== 'All') {
      list = list.filter(s =>
        s.genres.some(g => g.toLowerCase() === options.genre?.toLowerCase())
      );
    }

    if (options?.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.cast.some(c => c.toLowerCase().includes(q))
      );
    }

    if (options?.sort) {
      if (options.sort === 'rating') {
        list.sort((a, b) => b.score - a.score);
      } else if (options.sort === 'year') {
        list.sort((a, b) => b.year - a.year);
      }
    }

    return list;
  }

  async getTVSeriesById(id: string): Promise<TVSeries | undefined> {
    return this.series.find(s => s.id === id);
  }

  async getEpisodeById(episodeId: string): Promise<{
    series: TVSeries;
    season: Season;
    episode: Episode;
    prevEpisode?: Episode;
    nextEpisode?: Episode;
    allEpisodes: Episode[];
  } | undefined> {
    for (const s of this.series) {
      for (const season of s.seasons) {
        const epIndex = season.episodes.findIndex(e => e.id === episodeId);
        if (epIndex !== -1) {
          const episode = season.episodes[epIndex];
          const prevEpisode = epIndex > 0 ? season.episodes[epIndex - 1] : undefined;
          const nextEpisode = epIndex < season.episodes.length - 1 ? season.episodes[epIndex + 1] : undefined;
          return {
            series: s,
            season,
            episode,
            prevEpisode,
            nextEpisode,
            allEpisodes: season.episodes,
          };
        }
      }
    }
    return undefined;
  }

  async getWatchItem(id: string): Promise<WatchItem | null> {
    if (!id) return null;

    // 1. Check Movie by ID
    const movie = this.movies.find(m => m.id === id);
    if (movie) {
      return {
        kind: 'movie',
        movie,
        videoUrl: movie.videoUrl,
        title: movie.title,
        backdrop: movie.backdrop,
      };
    }

    // 2. Check TV Episode by ID
    const epData = await this.getEpisodeById(id);
    if (epData) {
      return {
        kind: 'episode',
        series: epData.series,
        season: epData.season,
        episode: epData.episode,
        allEpisodes: epData.allEpisodes,
        prevEpisode: epData.prevEpisode,
        nextEpisode: epData.nextEpisode,
        videoUrl: epData.episode.videoUrl,
        title: `${epData.series.title}: ${epData.episode.title}`,
        backdrop: epData.series.backdrop,
      };
    }

    // 3. Check TV Series by ID (defaults to Season 1, Episode 1)
    const series = this.series.find(s => s.id === id);
    if (series && series.seasons.length > 0 && series.seasons[0].episodes.length > 0) {
      const season = series.seasons[0];
      const episode = season.episodes[0];
      const nextEpisode = season.episodes[1];
      return {
        kind: 'episode',
        series,
        season,
        episode,
        allEpisodes: season.episodes,
        prevEpisode: undefined,
        nextEpisode,
        videoUrl: episode.videoUrl,
        title: `${series.title}: ${episode.title}`,
        backdrop: series.backdrop,
      };
    }

    // 4. Check Creator Video by ID
    const video = MOCK_VIDEOS.find(v => v.id === id);
    if (video) {
      const channel = MOCK_CHANNELS.find(c => c.id === video.channelId);
      return {
        kind: 'creator-video',
        video,
        channel,
        videoUrl: video.videoUrl,
        title: video.title,
        backdrop: video.thumbnail,
      };
    }

    return null;
  }

  async getFeaturedCarousel(): Promise<MediaItem[]> {
    const featMovies = this.movies.filter(m => m.featured);
    const featSeries = this.series.filter(s => s.featured);
    return [...featMovies, ...featSeries];
  }

  async getTop10(): Promise<MediaItem[]> {
    const all: MediaItem[] = [...this.movies, ...this.series].filter(item => item.top10Rank);
    return all.sort((a, b) => (a.top10Rank || 99) - (b.top10Rank || 99)).slice(0, 10);
  }

  async getContinueWatching(): Promise<ContinueWatchingItem[]> {
    return [...this.continueWatching];
  }

  async getSimilarMedia(currentId: string, genres: string[]): Promise<MediaItem[]> {
    const all: MediaItem[] = [...this.movies, ...this.series].filter(i => i.id !== currentId);
    return all
      .filter(item => item.genres.some(g => genres.includes(g)))
      .slice(0, 8);
  }

  async getMediaByGenre(genre: string): Promise<{
    genre: string;
    movies: Movie[];
    series: TVSeries[];
  }> {
    const gLower = genre.toLowerCase().trim();
    const movies = this.movies.filter(m =>
      m.genres.some(g => g.toLowerCase() === gLower)
    );
    const series = this.series.filter(s =>
      s.genres.some(g => g.toLowerCase() === gLower)
    );
    return { genre, movies, series };
  }

  async getMediaByCountry(country: string): Promise<{
    country: string;
    movies: Movie[];
    series: TVSeries[];
  }> {
    const cLower = country.toLowerCase().trim();
    const movies = this.movies.filter(m => m.country.toLowerCase() === cLower);
    const series = this.series.filter(s => s.country.toLowerCase() === cLower);
    return { country, movies, series };
  }

  async searchAllMedia(query: string): Promise<{
    movies: Movie[];
    series: TVSeries[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) return { movies: [], series: [] };

    const movies = this.movies.filter(
      m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.cast.some(c => c.toLowerCase().includes(q)) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q)
    );

    const series = this.series.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.cast.some(c => c.toLowerCase().includes(q)) ||
        s.genres.some(g => g.toLowerCase().includes(q)) ||
        (s.creator && s.creator.toLowerCase().includes(q))
    );

    return { movies, series };
  }
}

export const mediaService = new MediaService();
