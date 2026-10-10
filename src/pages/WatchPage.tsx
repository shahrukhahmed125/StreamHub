import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mediaService, WatchItem } from '../services/mediaService';
import { videoService } from '../services/videoService';
import { Movie, TVSeries, MediaItem, Video } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { VideoActions } from '../components/VideoActions';
import { SubscribeButton } from '../components/SubscribeButton';
import { CommentSection } from '../components/CommentSection';
import { MovieCard } from '../components/MovieCard';
import { SeriesCard } from '../components/SeriesCard';
import { VideoCard } from '../components/VideoCard';
import { useApp } from '../contexts/AppContext';
import {
  Star,
  Calendar,
  Clock,
  Globe,
  Share2,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Tv,
  Film,
  Sparkles,
  AlertCircle,
  Copy,
  Layers,
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { isInMyList, toggleMyList, addToHistory, addToast } = useApp();

  const [watchItem, setWatchItem] = useState<WatchItem | null>(null);
  const [similarMedia, setSimilarMedia] = useState<MediaItem[]>([]);
  const [relatedCreatorVideos, setRelatedCreatorVideos] = useState<Video[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      if (!videoId) return;

      const item = await mediaService.getWatchItem(videoId);
      if (isMounted) {
        if (item) {
          setWatchItem(item);

          if (item.kind === 'movie') {
            const similar = await mediaService.getSimilarMedia(item.movie.id, item.movie.genres);
            setSimilarMedia(similar);
          } else if (item.kind === 'episode') {
            const similar = await mediaService.getSimilarMedia(item.series.id, item.series.genres);
            setSimilarMedia(similar);
          } else if (item.kind === 'creator-video') {
            addToHistory(item.video);
            const related = await videoService.getRelatedVideos(item.video.id, item.video.category, 8);
            setRelatedCreatorVideos(related);
          }
        } else {
          setWatchItem(null);
        }
        setIsLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      addToast('Share link copied to clipboard', undefined, 'success');
      setShareModalOpen(false);
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse pb-16">
        <div className="w-full aspect-video rounded-3xl bg-[#181C26]" />
        <div className="h-8 bg-[#181C26] rounded-xl w-2/3" />
        <div className="h-4 bg-[#181C26] rounded-md w-1/3" />
      </div>
    );
  }

  if (!watchItem) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F06464]/20 text-[#F06464] mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#F5F7FA]">Content Not Available</h2>
        <p className="text-xs text-[#A3AABD]">
          We couldn't locate media for identifier "{videoId}". It may have moved or been retired.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/movies"
            className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold"
          >
            Browse Movies
          </Link>
          <Link
            to="/tv-shows"
            className="px-5 py-2.5 rounded-xl bg-[#181C26] hover:bg-[#202635] text-white text-xs font-semibold border border-[#2A3040]"
          >
            Browse TV Shows
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: MOVIE WATCH EXPERIENCE (OTT CINEMA)
  // =========================================================================
  if (watchItem.kind === 'movie') {
    const movie = watchItem.movie;
    const inList = isInMyList(movie.id);

    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Cinematic Video Player */}
        <div className="relative">
          <VideoPlayer
            videoUrl={watchItem.videoUrl}
            poster={movie.backdrop}
            title={movie.title}
          />
        </div>

        {/* Movie Title & Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2A3040]/70">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-widest bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30">
                MOVIE
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#181C26] border border-[#2A3040] text-amber-400 flex items-center gap-1 font-mono">
                <Star className="w-3.5 h-3.5 fill-current" />
                {movie.score}
              </span>
              <span className="text-xs font-bold text-[#35C98A] font-mono">
                {movie.matchScore || 98}% Match
              </span>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                {movie.rating}
              </span>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="text-xs text-[#F5F7FA] font-medium">{movie.year}</span>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="text-xs text-[#F5F7FA] font-medium">{movie.runtime}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#F5F7FA] tracking-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-xs sm:text-sm font-medium text-[#9278FF] italic">
                "{movie.tagline}"
              </p>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleMyList(movie)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                inList
                  ? 'bg-[#35C98A] border-[#35C98A] text-white'
                  : 'bg-[#181C26] hover:bg-[#202635] border-[#2A3040] text-[#F5F7FA]'
              }`}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inList ? 'In My List' : 'Add to My List'}</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-[#F5F7FA] text-xs font-bold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202635] hover:bg-[#2A3040] border border-[#2A3040] text-[#9278FF] text-xs font-bold transition-colors"
            >
              <Film className="w-4 h-4" />
              <span>Full Details</span>
            </Link>
          </div>
        </div>

        {/* Synopsis & Cast Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
              Synopsis
            </h3>
            <p className="text-sm text-[#A3AABD] leading-relaxed">
              {movie.description}
            </p>

            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {movie.genres.map(g => (
                <Link
                  key={g}
                  to={`/genres/${g.toLowerCase()}`}
                  className="px-3 py-1 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#A3AABD] hover:text-white hover:border-[#7C5CFC] transition-colors"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3">
            <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider border-b border-[#2A3040] pb-2">
              Production Information
            </h4>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-[#A3AABD]">Director: </span>
                <span className="text-white font-medium">{movie.director}</span>
              </div>
              <div>
                <span className="text-[#A3AABD]">Cast: </span>
                <span className="text-white font-medium">{movie.cast.join(', ')}</span>
              </div>
              <div>
                <span className="text-[#A3AABD]">Country of Origin: </span>
                <span className="text-white font-medium">{movie.country}</span>
              </div>
              <div>
                <span className="text-[#A3AABD]">Language: </span>
                <span className="text-white font-medium">{movie.language}</span>
              </div>
            </div>
          </div>
        </div>

        {/* More Like This (Similar Movies) */}
        {similarMedia.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#2A3040]/70">
            <h3 className="text-lg font-bold text-[#F5F7FA] tracking-tight">
              More Like This
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMedia.map(item =>
                item.type === 'movie' ? (
                  <MovieCard key={item.id} movie={item} />
                ) : (
                  <SeriesCard key={item.id} series={item} />
                )
              )}
            </div>
          </div>
        )}

        {/* Share Modal */}
        <Modal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title="Share Movie"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#A3AABD]">
              Copy the direct link to stream <strong className="text-white">{movie.title}</strong> on StreamHub.
            </p>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#12151D] border border-[#2A3040]">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: TV EPISODE WATCH EXPERIENCE
  // =========================================================================
  if (watchItem.kind === 'episode') {
    const { series, season, episode, prevEpisode, nextEpisode, allEpisodes } = watchItem;
    const inList = isInMyList(series.id);

    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Video Player */}
        <div className="relative">
          <VideoPlayer
            videoUrl={watchItem.videoUrl}
            poster={episode.thumbnail || series.backdrop}
            title={`${series.title}: ${episode.title}`}
            onNext={() => {
              if (nextEpisode) navigate(`/watch/${nextEpisode.id}`);
            }}
            hasNext={!!nextEpisode}
          />
        </div>

        {/* Series & Episode Navigation Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2A3040]/70">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/series/${series.id}`}
                className="text-xs font-bold text-[#7C5CFC] hover:underline uppercase tracking-wider"
              >
                {series.title}
              </Link>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="text-xs font-bold text-white/90">
                Season {episode.seasonNumber}, Episode {episode.episodeNumber}
              </span>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="text-xs text-[#35C98A] font-mono">{episode.duration}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">
              {episode.title}
            </h1>
          </div>

          {/* Episode Next / Previous Controls & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {prevEpisode ? (
              <Link
                to={`/watch/${prevEpisode.id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-white transition-colors"
                title={`Previous: ${prevEpisode.title}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Episode</span>
              </Link>
            ) : null}

            {nextEpisode ? (
              <Link
                to={`/watch/${nextEpisode.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold transition-all shadow-md shadow-[#7C5CFC]/20"
                title={`Next: ${nextEpisode.title}`}
              >
                <span>Next Episode</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null}

            <button
              onClick={() => toggleMyList(series)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                inList
                  ? 'bg-[#35C98A] border-[#35C98A] text-white'
                  : 'bg-[#181C26] hover:bg-[#202635] border-[#2A3040] text-[#F5F7FA]'
              }`}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inList ? 'In My List' : 'Add Series'}</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-white transition-colors"
              title="Share Episode"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Episode Description & Other Episodes in Season */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
              Episode Overview
            </h3>
            <p className="text-sm text-[#A3AABD] leading-relaxed">
              {episode.description}
            </p>

            <div className="pt-2 text-xs text-[#A3AABD] space-y-1">
              <p>
                <span className="text-white font-medium">Original Broadcast Date:</span> {episode.releaseDate}
              </p>
              <p>
                <span className="text-white font-medium">Starring:</span> {series.cast.join(', ')}
              </p>
            </div>
          </div>

          {/* Season Episode List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A3040]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#7C5CFC]" />
                <span>{season.title} ({allEpisodes.length} Episodes)</span>
              </h4>
              <Link
                to={`/series/${series.id}`}
                className="text-xs text-[#7C5CFC] hover:underline font-semibold"
              >
                All Seasons
              </Link>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {allEpisodes.map(ep => {
                const isCurrent = ep.id === episode.id;
                return (
                  <Link
                    key={ep.id}
                    to={`/watch/${ep.id}`}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all border ${
                      isCurrent
                        ? 'bg-[#7C5CFC]/20 border-[#7C5CFC] text-white'
                        : 'bg-[#181C26] hover:bg-[#202635] border-[#2A3040] text-[#A3AABD]'
                    }`}
                  >
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-20 aspect-video rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className={isCurrent ? 'text-[#9278FF] font-bold' : 'text-[#A3AABD]'}>
                          Ep. {ep.episodeNumber}
                        </span>
                        <span className="text-[#35C98A]">{ep.duration}</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-0.5">
                        {ep.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* More Like This (Similar Series) */}
        {similarMedia.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#2A3040]/70">
            <h3 className="text-lg font-bold text-[#F5F7FA] tracking-tight">
              More Series Like This
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMedia.map(item =>
                item.type === 'movie' ? (
                  <MovieCard key={item.id} movie={item} />
                ) : (
                  <SeriesCard key={item.id} series={item} />
                )
              )}
            </div>
          </div>
        )}

        {/* Share Modal */}
        <Modal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title="Share Episode"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#A3AABD]">
              Share <strong className="text-white">{series.title}: {episode.title}</strong> with friends.
            </p>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#12151D] border border-[#2A3040]">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: CREATOR VIDEO WATCH EXPERIENCE
  // =========================================================================
  const { video, channel } = watchItem;

  return (
    <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
      {/* Left Column: Player, Video Info, Comments */}
      <div className="lg:col-span-8 space-y-5">
        <VideoPlayer
          videoUrl={watchItem.videoUrl}
          poster={video.thumbnail}
          title={video.title}
        />

        <h1 className="text-lg md:text-2xl font-bold text-[#F5F7FA] leading-tight">
          {video.title}
        </h1>

        {/* Channel row + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-y border-[#2A3040]/70">
          <div className="flex items-center gap-3">
            <Link to={`/creator/${video.channelId}`}>
              <img
                src={video.channel?.avatar || channel?.avatar || ''}
                alt={video.channel?.name || channel?.name || 'Creator'}
                className="w-11 h-11 rounded-full object-cover border border-[#2A3040]"
              />
            </Link>
            <div>
              <Link
                to={`/creator/${video.channelId}`}
                className="text-sm font-bold text-[#F5F7FA] hover:text-[#7C5CFC] transition-colors block leading-tight"
              >
                {video.channel?.name || channel?.name || 'Creator'}
              </Link>
              <p className="text-xs text-[#A3AABD]">
                {channel?.subscribersCountFormatted || video.channel?.subscribersCountFormatted || '120K subscribers'}
              </p>
            </div>

            <div className="ml-2">
              <SubscribeButton channelId={video.channelId} channelName={video.channel?.name || channel?.name} />
            </div>
          </div>

          <VideoActions video={video} />
        </div>

        {/* Video Description Box */}
        <div className="p-4 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-2">
          <div className="flex items-center gap-3 text-xs font-mono text-[#A3AABD]">
            <span className="text-white font-bold">{video.viewsFormatted} views</span>
            <span>•</span>
            <span>{video.relativeDate || video.uploadDate}</span>
            <span>•</span>
            <span className="text-[#9278FF] font-semibold">{video.category}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#F5F7FA]/90 whitespace-pre-line leading-relaxed">
            {video.description}
          </p>
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            {video.tags.map(t => (
              <span key={t} className="text-xs text-[#7C5CFC]">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection videoId={video.id} />
      </div>

      {/* Right Column: Recommended Creator Videos */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
          Recommended Videos
        </h3>
        <div className="space-y-3">
          {relatedCreatorVideos.map(relVideo => (
            <VideoCard key={relVideo.id} video={relVideo} layout="horizontal" />
          ))}
        </div>
      </div>
    </div>
  );
};
