import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { videoService } from '../services/videoService';
import { Video } from '../types';
import { VideoCard } from '../components/VideoCard';
import { PlaylistCard } from '../components/PlaylistCard';
import {
  FolderHeart,
  History,
  Clock,
  ThumbsUp,
  ListVideo,
  ChevronRight,
  User,
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const { watchHistory, savedWatchLaterIds, likedVideoIds, userPlaylists } = useApp();
  const [allVideos, setAllVideos] = useState<Video[]>([]);

  useEffect(() => {
    videoService.getVideos().then(setAllVideos);
  }, []);

  const historyVideos = watchHistory.map(h => h.video).slice(0, 4);
  const watchLaterVideos = allVideos.filter(v => savedWatchLaterIds.includes(v.id)).slice(0, 4);
  const likedVideos = allVideos.filter(v => likedVideoIds.includes(v.id)).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Profile Mini Header */}
      {user && (
        <div className="p-6 rounded-3xl bg-[#12151D] border border-[#2A3040] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#7C5CFC]"
            />
            <div>
              <h1 className="text-xl font-bold text-[#F5F7FA]">{user.name}</h1>
              <p className="text-xs text-[#A3AABD]">@{user.username} · {user.email}</p>
            </div>
          </div>
          <Link
            to="/settings/profile"
            className="px-4 py-2 rounded-xl bg-[#202635] hover:bg-[#2A3040] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] transition-colors"
          >
            Manage Account
          </Link>
        </div>
      )}

      {/* History Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/history" className="flex items-center gap-2 group">
            <History className="w-5 h-5 text-[#7C5CFC]" />
            <h2 className="text-base font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors">
              History
            </h2>
            <ChevronRight className="w-4 h-4 text-[#A3AABD] group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/history" className="text-xs font-semibold text-[#7C5CFC] hover:underline">
            See all ({watchHistory.length})
          </Link>
        </div>

        {historyVideos.length === 0 ? (
          <p className="text-xs text-[#A3AABD] py-4">No recently watched videos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {historyVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Watch Later Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/watch-later" className="flex items-center gap-2 group">
            <Clock className="w-5 h-5 text-[#7C5CFC]" />
            <h2 className="text-base font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors">
              Watch Later
            </h2>
            <ChevronRight className="w-4 h-4 text-[#A3AABD] group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/watch-later" className="text-xs font-semibold text-[#7C5CFC] hover:underline">
            See all ({savedWatchLaterIds.length})
          </Link>
        </div>

        {watchLaterVideos.length === 0 ? (
          <p className="text-xs text-[#A3AABD] py-4">No videos saved for later</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {watchLaterVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Liked Videos Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/liked-videos" className="flex items-center gap-2 group">
            <ThumbsUp className="w-5 h-5 text-[#7C5CFC]" />
            <h2 className="text-base font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors">
              Liked Videos
            </h2>
            <ChevronRight className="w-4 h-4 text-[#A3AABD] group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/liked-videos" className="text-xs font-semibold text-[#7C5CFC] hover:underline">
            See all ({likedVideoIds.length})
          </Link>
        </div>

        {likedVideos.length === 0 ? (
          <p className="text-xs text-[#A3AABD] py-4">No liked videos yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {likedVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Playlists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/playlists" className="flex items-center gap-2 group">
            <ListVideo className="w-5 h-5 text-[#7C5CFC]" />
            <h2 className="text-base font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors">
              Playlists
            </h2>
            <ChevronRight className="w-4 h-4 text-[#A3AABD] group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/playlists" className="text-xs font-semibold text-[#7C5CFC] hover:underline">
            See all ({userPlaylists.length})
          </Link>
        </div>

        {userPlaylists.length === 0 ? (
          <p className="text-xs text-[#A3AABD] py-4">No playlists created yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
