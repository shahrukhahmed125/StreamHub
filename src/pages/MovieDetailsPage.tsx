import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mediaService } from '../services/mediaService';
import { Movie, MediaItem } from '../types';
import { useApp } from '../contexts/AppContext';
import { MovieCard } from '../components/MovieCard';
import {
  Play,
  Plus,
  Check,
  Share2,
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { isInMyList, toggleMyList, addToast } = useApp();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<MediaItem[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    if (!movieId) return;

    mediaService.getMovieById(movieId).then(async found => {
      if (!isMounted) return;
      if (found) {
        setMovie(found);
        const similar = await mediaService.getSimilarMedia(found.id, found.genres);
        setSimilarMovies(similar);
      } else {
        setMovie(null);
      }
      setIsLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="w-full h-96 bg-[#181C26] rounded-3xl" />
        <div className="h-48 bg-[#181C26] rounded-2xl" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-[#F06464] mx-auto" />
        <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
        <p className="text-xs text-[#A3AABD]">This movie may no longer be available in our catalog.</p>
        <Link to="/movies" className="inline-block px-4 py-2 rounded-xl bg-[#7C5CFC] text-white text-xs font-semibold">
          Return to Movies
        </Link>
      </div>
    );
  }

  const inMyList = isInMyList(movie.id);
  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      addToast('Movie link copied', undefined, 'success');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* Cinematic Hero Backdrop Container */}
      <div className="relative w-full min-h-[480px] sm:min-h-[560px] -mx-4 md:-mx-8 -mt-4 rounded-b-3xl overflow-hidden bg-black flex flex-col justify-end p-6 md:p-12">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12] via-[#0B0D12]/80 to-transparent w-full md:w-2/3" />

        {/* Content Overlap Layer */}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
          {/* Poster Card */}
          <div className="w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden bg-[#181C26] border-2 border-white/20 shadow-2xl shrink-0 hidden sm:block">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Details Column */}
          <div className="space-y-4 max-w-3xl">
            {/* Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#7C5CFC] text-white">
                STREAMHUB CINEMA
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/20">
                {movie.rating}
              </span>
              <span className="text-xs text-[#35C98A] font-bold font-mono">
                {movie.matchScore}% Match
              </span>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="text-xs text-white/90 font-medium">{movie.year}</span>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="text-xs text-white/90 font-medium">{movie.runtime}</span>
              <span className="text-xs text-[#A3AABD]">·</span>
              <span className="text-amber-400 font-bold flex items-center gap-1 font-mono text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                {movie.score}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-xs sm:text-sm text-[#9278FF] font-medium italic">
                "{movie.tagline}"
              </p>
            )}

            <p className="text-xs sm:text-sm text-[#A3AABD] leading-relaxed max-w-2xl">
              {movie.description}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                to={`/watch/${movie.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold shadow-xl transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Movie</span>
              </Link>

              <button
                onClick={() => toggleMyList(movie)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#202635]/90 hover:bg-[#2A3040] border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
              >
                {inMyList ? (
                  <>
                    <Check className="w-4 h-4 text-[#35C98A]" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>My List</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setTrailerModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#202635]/90 hover:bg-[#2A3040] border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
              >
                <Film className="w-4 h-4 text-[#7C5CFC]" />
                <span>Trailer</span>
              </button>

              <button
                onClick={() => setShareModalOpen(true)}
                className="p-3 rounded-xl bg-[#181C26]/80 hover:bg-[#202635] border border-white/20 text-white transition-colors"
                title="Share Movie"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cast, Director & Meta Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 rounded-3xl bg-[#12151D] border border-[#2A3040]">
        <div className="md:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cast & Starring</h3>
          <div className="flex flex-wrap gap-2">
            {movie.cast.map(actor => (
              <span
                key={actor}
                className="px-3 py-1.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA]"
              >
                {actor}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-[#2A3040]">
            <h4 className="text-xs font-bold text-[#A3AABD] uppercase tracking-wider mb-2">Director</h4>
            <p className="text-sm font-bold text-white">{movie.director}</p>
          </div>
        </div>

        <div className="md:col-span-4 md:border-l md:border-[#2A3040] md:pl-8 space-y-3 text-xs text-[#A3AABD]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Information</h3>
          <div>
            <span className="font-semibold text-white block">Genres:</span>
            <span>{movie.genres.join(', ')}</span>
          </div>
          <div>
            <span className="font-semibold text-white block">Country of Origin:</span>
            <span>{movie.country}</span>
          </div>
          <div>
            <span className="font-semibold text-white block">Audio Language:</span>
            <span>{movie.language} (5.1 Surround, Dolby Atmos)</span>
          </div>
          <div>
            <span className="font-semibold text-white block">Subtitles:</span>
            <span>English, Spanish, French, Korean, Arabic, Turkish</span>
          </div>
        </div>
      </div>

      {/* More Like This */}
      {similarMovies.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">More Like This</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarMovies.map(item =>
              item.type === 'movie' ? (
                <MovieCard key={item.id} movie={item} />
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Share Dialog */}
      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share Movie">
        <div className="space-y-4">
          <p className="text-xs text-[#A3AABD]">Share this movie title with your friends:</p>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#12151D] border border-[#2A3040]">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-white focus:outline-hidden font-mono px-2"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </Modal>
      {/* Trailer Modal */}
      <Modal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={`${movie.title} — Official Trailer`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-3">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#2A3040]">
            <video
              src={movie.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-[#A3AABD]">
            Streaming exclusively in 4K Ultra HD and Dolby Atmos on StreamHub.
          </p>
        </div>
      </Modal>
    </div>
  );
};
