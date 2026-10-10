import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { Video } from '../types';
import { useApp } from '../contexts/AppContext';
import { SubscribeButton } from '../components/SubscribeButton';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CommentSection } from '../components/CommentSection';

export const ShortsPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { isLiked, isDisliked, toggleLikeVideo, toggleDislikeVideo, addToast } = useApp();

  const [shortsList, setShortsList] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadShorts = async () => {
      const data = await videoService.getShorts();
      setShortsList(data);
      if (videoId) {
        const idx = data.findIndex(v => v.id === videoId);
        if (idx !== -1) setCurrentIndex(idx);
      }
    };
    loadShorts();
  }, [videoId]);

  const currentShort = shortsList[currentIndex];

  const handleNext = () => {
    if (currentIndex < shortsList.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      navigate(`/shorts/${shortsList[nextIdx].id}`, { replace: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      navigate(`/shorts/${shortsList[prevIdx].id}`, { replace: true });
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleShare = () => {
    if (!currentShort) return;
    const url = `${window.location.origin}/shorts/${currentShort.id}`;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Short link copied', url, 'success');
    }).catch(() => {
      addToast('Share URL', url, 'info');
    });
  };

  if (!currentShort) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const liked = isLiked(currentShort.id);
  const disliked = isDisliked(currentShort.id);
  const displayLikes = currentShort.likes + (liked ? 1 : 0);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] py-2">
      <div className="relative flex items-center gap-6">
        {/* Navigation Up / Down Buttons (Desktop) */}
        <div className="hidden md:flex flex-col gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-[#181C26] hover:bg-[#202635] disabled:opacity-30 border border-[#2A3040] flex items-center justify-center text-[#F5F7FA] transition-colors"
            title="Previous short"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === shortsList.length - 1}
            className="w-10 h-10 rounded-full bg-[#181C26] hover:bg-[#202635] disabled:opacity-30 border border-[#2A3040] flex items-center justify-center text-[#F5F7FA] transition-colors"
            title="Next short"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* 9:16 Vertical Video Frame */}
        <div className="relative w-[340px] sm:w-[380px] h-[640px] rounded-3xl overflow-hidden bg-black border border-[#2A3040] shadow-2xl flex items-center justify-center">
          <video
            ref={videoRef}
            key={currentShort.id}
            src={currentShort.videoUrl}
            poster={currentShort.thumbnail}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#7C5CFC]/90 text-white flex items-center justify-center shadow-xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Top Controls: Mute toggle */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-[#F06464]" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Bottom Gradient Scrim & Info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 space-y-3 pointer-events-auto">
            {/* Creator Bar */}
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/channel/${currentShort.channelId}`}
                className="flex items-center gap-2.5 min-w-0"
              >
                <img
                  src={currentShort.channel.avatar}
                  alt={currentShort.channel.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white flex items-center gap-1 truncate">
                    {currentShort.channel.name}
                    {currentShort.channel.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    )}
                  </p>
                  <p className="text-[11px] text-white/70">{currentShort.channel.handle}</p>
                </div>
              </Link>

              <SubscribeButton channelId={currentShort.channelId} channelName={currentShort.channel.name} size="sm" />
            </div>

            {/* Caption */}
            <p className="text-xs text-white leading-relaxed line-clamp-2">
              {currentShort.title}
            </p>
          </div>
        </div>

        {/* Right Side Action Floating Strip */}
        <div className="flex flex-col items-center gap-4">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleLikeVideo(currentShort.id)}
              className={`w-12 h-12 rounded-full border border-[#2A3040] flex items-center justify-center transition-all ${
                liked
                  ? 'bg-[#7C5CFC] text-white'
                  : 'bg-[#181C26] text-[#F5F7FA] hover:bg-[#202635]'
              }`}
              aria-label="Like short"
            >
              <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-[11px] font-mono text-[#A3AABD]">
              {displayLikes.toLocaleString()}
            </span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleDislikeVideo(currentShort.id)}
              className={`w-12 h-12 rounded-full border border-[#2A3040] flex items-center justify-center transition-all ${
                disliked
                  ? 'bg-[#F06464] text-white'
                  : 'bg-[#181C26] text-[#A3AABD] hover:text-white hover:bg-[#202635]'
              }`}
              aria-label="Dislike short"
            >
              <ThumbsDown className={`w-5 h-5 ${disliked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-[11px] text-[#A3AABD]">Dislike</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowComments(!showComments)}
              className="w-12 h-12 rounded-full bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-[#F5F7FA] flex items-center justify-center transition-all"
              aria-label="View comments"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-mono text-[#A3AABD]">
              {currentShort.commentsCount}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-[#F5F7FA] flex items-center justify-center transition-all"
              aria-label="Share short"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[11px] text-[#A3AABD]">Share</span>
          </div>
        </div>

        {/* Slide-out Comments Drawer on Desktop/Tablet */}
        {showComments && (
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#181C26] border-l border-[#2A3040] shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A3040]">
              <h3 className="text-base font-bold text-[#F5F7FA]">Short Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 rounded-lg text-[#A3AABD] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CommentSection videoId={currentShort.id} />
          </div>
        )}
      </div>
    </div>
  );
};
