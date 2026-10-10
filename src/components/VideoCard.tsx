import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { useApp } from '../contexts/AppContext';
import { CheckCircle2, MoreVertical, Clock, ListPlus, Share2, EyeOff, Play } from 'lucide-react';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'horizontal';
  showChannelAvatar?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  layout = 'grid',
  showChannelAvatar = true,
}) => {
  const { isSavedWatchLater, toggleWatchLater, addToast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  if (isHidden) {
    return (
      <div className="p-4 rounded-xl bg-[#12151D] border border-[#2A3040]/50 text-xs text-[#A3AABD] flex items-center justify-between">
        <span>Video hidden from your feed</span>
        <button
          onClick={() => setIsHidden(false)}
          className="text-[#7C5CFC] hover:underline font-medium"
        >
          Undo
        </button>
      </div>
    );
  }

  const handleShare = () => {
    const url = `${window.location.origin}/watch/${video.id}`;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Link copied to clipboard', url, 'success');
    }).catch(() => {
      addToast('Share URL', url, 'info');
    });
    setMenuOpen(false);
  };

  const savedWatchLater = isSavedWatchLater(video.id);

  if (layout === 'horizontal') {
    return (
      <div className="group flex flex-col sm:flex-row gap-4 p-2 rounded-2xl hover:bg-[#181C26]/60 transition-colors">
        {/* 16:9 Thumbnail */}
        <Link
          to={`/watch/${video.id}`}
          className="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-[#181C26] shrink-0 border border-[#2A3040]/50"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#7C5CFC]/90 text-white flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-semibold rounded-md bg-black/80 text-white backdrop-blur-xs">
            {video.duration}
          </span>
        </Link>

        {/* Video Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-start">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/watch/${video.id}`}
              className="text-base font-semibold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-2"
            >
              {video.title}
            </Link>
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-[#A3AABD] hover:text-white hover:bg-[#202635] transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#181C26] border border-[#2A3040] shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      toggleWatchLater(video);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#202635]"
                  >
                    <Clock className="w-4 h-4 text-[#A3AABD]" />
                    {savedWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
                  </button>
                  <button
                    onClick={() => {
                      setPlaylistModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#202635]"
                  >
                    <ListPlus className="w-4 h-4 text-[#A3AABD]" />
                    Add to Playlist
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#202635]"
                  >
                    <Share2 className="w-4 h-4 text-[#A3AABD]" />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      setIsHidden(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F06464] hover:bg-[#202635]"
                  >
                    <EyeOff className="w-4 h-4" />
                    Hide video
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#A3AABD] mt-1">
            <Link
              to={`/channel/${video.channelId}`}
              className="hover:text-[#F5F7FA] font-medium flex items-center gap-1"
            >
              {video.channel.name}
              {video.channel.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7C5CFC]" />
              )}
            </Link>
            <span>·</span>
            <span>{video.viewsFormatted} views</span>
            <span>·</span>
            <span>{video.relativeDate}</span>
          </div>

          <p className="text-xs text-[#A3AABD] line-clamp-2 mt-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        <AddToPlaylistModal
          isOpen={playlistModalOpen}
          onClose={() => setPlaylistModalOpen(false)}
          video={video}
        />
      </div>
    );
  }

  // Standard Grid Card
  return (
    <div className="group flex flex-col gap-3">
      {/* 16:9 Thumbnail Container */}
      <Link
        to={`/watch/${video.id}`}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#181C26] border border-[#2A3040]/40 group-hover:border-[#7C5CFC]/40 transition-colors"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Subtle Play Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-[#7C5CFC]/90 text-white flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-semibold rounded-md bg-black/85 text-white backdrop-blur-xs">
          {video.duration}
        </span>
      </Link>

      {/* Metadata */}
      <div className="flex items-start gap-3 px-0.5">
        {showChannelAvatar && (
          <Link
            to={`/channel/${video.channelId}`}
            className="w-9 h-9 rounded-full overflow-hidden bg-[#202635] shrink-0 border border-[#2A3040] hover:ring-2 hover:ring-[#7C5CFC] transition-all"
          >
            <img
              src={video.channel.avatar}
              alt={video.channel.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </Link>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <Link
              to={`/watch/${video.id}`}
              className="text-sm font-semibold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-2 leading-snug"
              title={video.title}
            >
              {video.title}
            </Link>

            {/* More Menu */}
            <div className="relative shrink-0 -mr-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-[#A3AABD] opacity-80 group-hover:opacity-100 hover:text-white hover:bg-[#202635] transition-all"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#181C26] border border-[#2A3040] shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      toggleWatchLater(video);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#202635]"
                  >
                    <Clock className="w-4 h-4 text-[#A3AABD]" />
                    {savedWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
                  </button>
                  <button
                    onClick={() => {
                      setPlaylistModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#202635]"
                  >
                    <ListPlus className="w-4 h-4 text-[#A3AABD]" />
                    Add to Playlist
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#202635]"
                  >
                    <Share2 className="w-4 h-4 text-[#A3AABD]" />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      setIsHidden(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F06464] hover:bg-[#202635]"
                  >
                    <EyeOff className="w-4 h-4" />
                    Hide video
                  </button>
                </div>
              )}
            </div>
          </div>

          <Link
            to={`/channel/${video.channelId}`}
            className="inline-flex items-center gap-1 text-xs text-[#A3AABD] hover:text-[#F5F7FA] mt-1 transition-colors"
          >
            <span>{video.channel.name}</span>
            {video.channel.verified && (
              <CheckCircle2 className="w-3 h-3 text-[#7C5CFC]" />
            )}
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-[#A3AABD] mt-0.5">
            <span>{video.viewsFormatted} views</span>
            <span>·</span>
            <span>{video.relativeDate}</span>
          </div>
        </div>
      </div>

      <AddToPlaylistModal
        isOpen={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        video={video}
      />
    </div>
  );
};
