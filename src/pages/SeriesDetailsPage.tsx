import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mediaService } from '../services/mediaService';
import { TVSeries, Season, Episode, MediaItem } from '../types';
import { useApp } from '../contexts/AppContext';
import { SeriesCard } from '../components/SeriesCard';
import { MovieCard } from '../components/MovieCard';
import { Modal } from '../components/Modal';
import {
  Play,
  Plus,
  Check,
  Share2,
  Star,
  Tv,
  Calendar,
  Layers,
  AlertCircle,
  Copy,
  ChevronRight,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export const SeriesDetailsPage: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const { isInMyList, toggleMyList, addToast } = useApp();

  const [series, setSeries] = useState<TVSeries | null>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [similarSeries, setSimilarSeries] = useState<MediaItem[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (!seriesId) return;

    mediaService.getTVSeriesById(seriesId).then(async found => {
      if (!isMounted) return;
      if (found) {
        setSeries(found);
        if (found.seasons.length > 0) {
          setSelectedSeasonNumber(found.seasons[0].seasonNumber);
        }
        const similar = await mediaService.getSimilarMedia(found.id, found.genres);
        setSimilarSeries(similar);
      } else {
        setSeries(null);
      }
      setIsLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [seriesId]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse pb-16">
        <div className="w-full h-96 bg-[#181C26] rounded-3xl" />
        <div className="h-48 bg-[#181C26] rounded-2xl" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-[#F06464] mx-auto" />
        <h2 className="text-xl font-bold text-white">TV Series Not Found</h2>
        <p className="text-xs text-[#A3AABD]">This series may no longer be available in our catalog.</p>
        <Link
          to="/tv-shows"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold"
        >
          Return to TV Shows
        </Link>
      </div>
    );
  }

  const inMyList = isInMyList(series.id);
  const activeSeason = series.seasons.find(s => s.seasonNumber === selectedSeasonNumber) || series.seasons[0];
  const firstEpisodeId = activeSeason?.episodes[0]?.id || series.id;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      addToast('Series link copied to clipboard', undefined, 'success');
      setShareModalOpen(false);
    });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* Cinematic Hero Backdrop */}
      <div className="relative w-full min-h-[480px] sm:min-h-[560px] -mx-4 md:-mx-8 -mt-4 rounded-b-3xl overflow-hidden bg-black flex flex-col justify-end p-6 md:p-12">
        <img
          src={series.backdrop}
          alt={series.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12] via-[#0B0D12]/80 to-transparent w-full md:w-2/3" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-widest bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30">
              ORIGINAL SERIES
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#181C26]/80 text-amber-400 flex items-center gap-1 font-mono border border-white/10">
              <Star className="w-3.5 h-3.5 fill-current" />
              {series.score}
            </span>
            {series.matchScore && (
              <span className="text-xs font-bold text-[#35C98A] font-mono">
                {series.matchScore}% Match
              </span>
            )}
            <span className="text-xs text-[#A3AABD]">·</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/20">
              {series.rating}
            </span>
            <span className="text-xs text-[#A3AABD]">·</span>
            <span className="text-xs text-white/90 font-medium">{series.year}</span>
            <span className="text-xs text-[#A3AABD]">·</span>
            <span className="text-xs text-white/90 font-medium">
              {series.seasonsCount} {series.seasonsCount === 1 ? 'Season' : 'Seasons'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F5F7FA] tracking-tight leading-tight">
            {series.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#A3AABD] leading-relaxed max-w-2xl line-clamp-3">
            {series.description}
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link
              to={`/watch/${firstEpisodeId}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-xs sm:text-sm shadow-xl transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Watch S{activeSeason?.seasonNumber}:E1</span>
            </Link>

            <button
              onClick={() => toggleMyList(series)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                inMyList
                  ? 'bg-[#35C98A] border-[#35C98A] text-white'
                  : 'bg-[#181C26]/90 hover:bg-[#202635] border-white/20 text-white'
              }`}
            >
              {inMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inMyList ? 'In My List' : 'Add to My List'}</span>
            </button>

            <button
              onClick={() => setTrailerModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#181C26]/90 hover:bg-[#202635] border border-white/20 text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
              <span>Trailer</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="p-3 rounded-xl bg-[#181C26]/90 hover:bg-[#202635] border border-white/20 text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Series Metadata & Cast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            About {series.title}
          </h3>
          <p className="text-sm text-[#A3AABD] leading-relaxed">
            {series.description}
          </p>

          <div className="flex items-center gap-2 pt-2 flex-wrap">
            {series.genres.map(g => (
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
            Series Information
          </h4>
          <div className="text-xs space-y-2">
            {series.creator && (
              <div>
                <span className="text-[#A3AABD]">Creator / Showrunner: </span>
                <span className="text-white font-medium">{series.creator}</span>
              </div>
            )}
            <div>
              <span className="text-[#A3AABD]">Starring: </span>
              <span className="text-white font-medium">{series.cast.join(', ')}</span>
            </div>
            <div>
              <span className="text-[#A3AABD]">Origin: </span>
              <span className="text-white font-medium">{series.country}</span>
            </div>
            <div>
              <span className="text-[#A3AABD]">Original Language: </span>
              <span className="text-white font-medium">{series.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons & Episodes Section */}
      <section className="space-y-6 pt-6 border-t border-[#2A3040]/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7C5CFC]" />
            <h2 className="text-xl font-bold text-[#F5F7FA] tracking-tight">Episodes</h2>
          </div>

          {/* Season Selector */}
          <div className="flex items-center gap-2">
            {series.seasons.map(s => (
              <button
                key={s.seasonNumber}
                onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSeasonNumber === s.seasonNumber
                    ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
                    : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
                }`}
              >
                Season {s.seasonNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes List */}
        <div className="space-y-3">
          {activeSeason?.episodes.map(ep => (
            <div
              key={ep.id}
              className="group p-4 rounded-2xl bg-[#12151D] hover:bg-[#181C26] border border-[#2A3040] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-[#2A3040]">
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Link
                    to={`/watch/${ep.id}`}
                    className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/90 group-hover:bg-[#7C5CFC] text-black group-hover:text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </Link>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#9278FF] font-bold">
                      Episode {ep.episodeNumber}
                    </span>
                    <span className="text-[#A3AABD]">·</span>
                    <span className="text-[#35C98A]">{ep.duration}</span>
                    <span className="text-[#A3AABD]">·</span>
                    <span className="text-[#A3AABD]">{ep.releaseDate}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#9278FF] transition-colors">
                    {ep.title}
                  </h4>
                  <p className="text-xs text-[#A3AABD] line-clamp-2 max-w-2xl leading-relaxed">
                    {ep.description}
                  </p>
                </div>
              </div>

              <Link
                to={`/watch/${ep.id}`}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#202635] hover:bg-[#7C5CFC] hover:text-white text-xs font-bold text-[#F5F7FA] border border-[#2A3040] flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* More Series Like This */}
      {similarSeries.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#2A3040]/70">
          <h3 className="text-lg font-bold text-[#F5F7FA] tracking-tight">
            More Series Like This
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarSeries.map(item =>
              item.type === 'movie' ? (
                <MovieCard key={item.id} movie={item} />
              ) : (
                <SeriesCard key={item.id} series={item} />
              )
            )}
          </div>
        </section>
      )}

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share TV Series"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#A3AABD]">
            Share <strong className="text-white">{series.title}</strong> with friends.
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

      {/* Trailer Modal */}
      <Modal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={`${series.title} — Official Trailer`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-3">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#2A3040]">
            <video
              src={activeSeason?.episodes[0]?.videoUrl}
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
