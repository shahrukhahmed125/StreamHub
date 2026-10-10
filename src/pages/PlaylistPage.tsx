import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { playlistService } from '../services/playlistService';
import { Playlist, Video } from '../types';
import { useApp } from '../contexts/AppContext';
import {
  Play,
  Share2,
  Trash2,
  Edit2,
  Lock,
  Globe,
  EyeOff,
  MoreVertical,
  AlertCircle,
  ListVideo,
} from 'lucide-react';
import { ConfirmationDialog } from '../components/Modal';

export const PlaylistPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { userPlaylists, deletePlaylist, removeVideoFromPlaylist, addToast } = useApp();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check in AppContext first, otherwise fetch
    const found = userPlaylists.find(p => p.id === playlistId);
    if (found) {
      setPlaylist(found);
      setIsLoading(false);
    } else {
      playlistService.getPlaylistById(playlistId || '').then(res => {
        setPlaylist(res || null);
        setIsLoading(false);
      });
    }
  }, [playlistId, userPlaylists]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Playlist link copied', url, 'success');
    }).catch(() => {
      addToast('Share URL', url, 'info');
    });
  };

  const handleDeletePlaylist = () => {
    if (!playlist) return;
    deletePlaylist(playlist.id);
    navigate('/playlists');
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8 animate-pulse space-y-4">
        <div className="h-64 bg-[#181C26] rounded-2xl" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F06464]/20 text-[#F06464] mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#F5F7FA]">Playlist not found</h2>
        <p className="text-sm text-[#A3AABD]">This playlist does not exist or has been removed.</p>
        <Link
          to="/playlists"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold"
        >
          View My Playlists
        </Link>
      </div>
    );
  }

  const firstVideo = playlist.videos[0];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Left Column: Playlist Card & Summary */}
      <div className="md:col-span-5 lg:col-span-4">
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181C26] to-[#12151D] border border-[#2A3040] shadow-2xl space-y-5 sticky top-20">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#2A3040] shadow-lg">
            <img
              src={playlist.thumbnail}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <ListVideo className="w-10 h-10 text-white/80" />
            </div>
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#F5F7FA] leading-snug">{playlist.title}</h1>
            <p className="text-xs text-[#A3AABD] mt-1">
              Curated by <span className="font-semibold text-white">{playlist.ownerName}</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A3AABD] mt-1.5 font-mono">
              <span>{playlist.videoCount} videos</span>
              <span>·</span>
              <span className="capitalize flex items-center gap-1">
                {playlist.visibility === 'private' ? (
                  <Lock className="w-3 h-3" />
                ) : playlist.visibility === 'unlisted' ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                {playlist.visibility}
              </span>
              <span>·</span>
              <span>Updated {playlist.updatedAt}</span>
            </div>
            {playlist.description && (
              <p className="text-xs text-[#A3AABD] mt-3 leading-relaxed">
                {playlist.description}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-2">
            {firstVideo ? (
              <Link
                to={`/watch/${firstVideo.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold shadow-lg shadow-[#7C5CFC]/25 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play All</span>
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#202635] text-[#A3AABD] text-xs font-semibold opacity-50"
              >
                Empty Playlist
              </button>
            )}

            <Link
              to={`/playlist/${playlist.id}/edit`}
              className="p-2.5 rounded-xl bg-[#202635] hover:bg-[#2A3040] border border-[#2A3040] text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
              title="Edit playlist"
            >
              <Edit2 className="w-4 h-4" />
            </Link>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-[#202635] hover:bg-[#2A3040] border border-[#2A3040] text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
              title="Share playlist"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 rounded-xl bg-[#202635] hover:bg-[#F06464]/20 border border-[#2A3040] text-[#A3AABD] hover:text-[#F06464] transition-colors"
              title="Delete playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Playlist Video List */}
      <div className="md:col-span-7 lg:col-span-8 space-y-3">
        {playlist.videos.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-3">
            <ListVideo className="w-10 h-10 text-[#7C5CFC] mx-auto" />
            <h3 className="text-sm font-bold text-[#F5F7FA]">No videos in this playlist</h3>
            <p className="text-xs text-[#A3AABD] max-w-sm mx-auto">
              Browse videos and use the "Save" button to add videos to this playlist.
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold rounded-xl"
            >
              Explore Feed
            </Link>
          </div>
        ) : (
          playlist.videos.map((video, index) => (
            <div
              key={video.id}
              className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#181C26] transition-colors border border-transparent hover:border-[#2A3040]"
            >
              <span className="w-6 text-center text-xs font-mono font-bold text-[#A3AABD]">
                {index + 1}
              </span>

              <Link
                to={`/watch/${video.id}`}
                className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-[#2A3040]/50"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 text-[10px] font-bold rounded-sm bg-black/80 text-white">
                  {video.duration}
                </span>
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/watch/${video.id}`}
                  className="text-xs sm:text-sm font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-2"
                >
                  {video.title}
                </Link>
                <p className="text-xs text-[#A3AABD] mt-1">{video.channel.name}</p>
              </div>

              <button
                onClick={() => removeVideoFromPlaylist(playlist.id, video.id)}
                className="p-2 rounded-xl text-[#A3AABD] hover:text-[#F06464] hover:bg-[#202635] transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePlaylist}
        title="Delete Playlist"
        message={`Are you sure you want to delete "${playlist.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};
