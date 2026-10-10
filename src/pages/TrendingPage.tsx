import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { Video } from '../types';
import { Flame, CheckCircle2, Play, Clock, ListPlus, Share2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AddToPlaylistModal } from '../components/AddToPlaylistModal';

type TrendingTab = 'now' | 'week' | 'views' | 'recent';

export const TrendingPage: React.FC = () => {
  const { isSavedWatchLater, toggleWatchLater, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<TrendingTab>('now');
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState<Video | null>(null);

  useEffect(() => {
    const loadTrending = async () => {
      const type = activeTab === 'views' ? 'views' : activeTab === 'week' ? 'week' : 'all';
      const videos = await videoService.getTrendingVideos(type);
      setTrendingVideos(videos);
    };
    loadTrending();
  }, [activeTab]);

  const handleShare = (video: Video) => {
    const url = `${window.location.origin}/watch/${video.id}`;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Link copied to clipboard', url, 'success');
    }).catch(() => {
      addToast('Share URL', url, 'info');
    });
  };

  const tabs: { key: TrendingTab; label: string }[] = [
    { key: 'now', label: 'Trending Now' },
    { key: 'week', label: 'Popular This Week' },
    { key: 'views', label: 'Most Viewed' },
    { key: 'recent', label: 'Recently Trending' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2A3040]/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F5F7FA]">Trending</h1>
            <p className="text-xs text-[#A3AABD]">Ranked popular videos across the StreamHub network</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#12151D] border border-[#2A3040]">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Video List */}
      <div className="space-y-4">
        {trendingVideos.map((video, index) => {
          const rank = index + 1;
          const isWatchLater = isSavedWatchLater(video.id);

          return (
            <div
              key={video.id}
              className="group flex flex-col md:flex-row gap-4 p-3.5 rounded-2xl bg-[#12151D]/60 hover:bg-[#181C26] border border-[#2A3040]/50 hover:border-[#7C5CFC]/40 transition-all"
            >
              {/* Rank Number */}
              <div className="flex md:flex-col items-center justify-center w-8 shrink-0">
                <span
                  className={`font-black text-xl md:text-2xl font-mono ${
                    rank === 1
                      ? 'text-amber-400'
                      : rank === 2
                      ? 'text-slate-300'
                      : rank === 3
                      ? 'text-amber-600'
                      : 'text-[#A3AABD]/50'
                  }`}
                >
                  #{rank}
                </span>
              </div>

              {/* 16:9 Thumbnail */}
              <Link
                to={`/watch/${video.id}`}
                className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-[#2A3040]/60"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-semibold rounded-md bg-black/85 text-white backdrop-blur-xs">
                  {video.duration}
                </span>
              </Link>

              {/* Video Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#7C5CFC]/20 text-[#9278FF]">
                      {video.category}
                    </span>
                    <span className="text-xs text-[#A3AABD]">·</span>
                    <span className="text-xs text-[#A3AABD]">{video.relativeDate}</span>
                  </div>

                  <Link
                    to={`/watch/${video.id}`}
                    className="text-base font-bold text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors line-clamp-2 leading-snug"
                  >
                    {video.title}
                  </Link>

                  <Link
                    to={`/channel/${video.channelId}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#A3AABD] hover:text-[#F5F7FA] mt-1.5 font-medium transition-colors"
                  >
                    <img
                      src={video.channel.avatar}
                      alt={video.channel.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#2A3040]"
                    />
                    <span>{video.channel.name}</span>
                    {video.channel.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    )}
                    <span className="text-[#A3AABD]/60">·</span>
                    <span className="font-mono text-[#A3AABD]">{video.viewsFormatted} views</span>
                  </Link>

                  <p className="text-xs text-[#A3AABD] line-clamp-2 mt-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-[#2A3040]/50">
                  <button
                    onClick={() => toggleWatchLater(video)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isWatchLater
                        ? 'bg-[#7C5CFC]/20 text-[#9278FF]'
                        : 'hover:bg-[#202635] text-[#A3AABD] hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isWatchLater ? 'Saved' : 'Watch Later'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedVideoForPlaylist(video)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#202635] text-[#A3AABD] hover:text-white transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>Add to Playlist</span>
                  </button>

                  <button
                    onClick={() => handleShare(video)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#202635] text-[#A3AABD] hover:text-white transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddToPlaylistModal
        isOpen={!!selectedVideoForPlaylist}
        onClose={() => setSelectedVideoForPlaylist(null)}
        video={selectedVideoForPlaylist}
      />
    </div>
  );
};
