import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { channelService } from '../services/channelService';
import { playlistService } from '../services/playlistService';
import { Video, Channel, Playlist } from '../types';
import { VideoCard } from '../components/VideoCard';
import { PlaylistCard } from '../components/PlaylistCard';
import { SubscribeButton } from '../components/SubscribeButton';
import {
  Play,
  Sparkles,
  Flame,
  Cpu,
  Gamepad2,
  Atom,
  Music,
  GraduationCap,
  Clapperboard,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [popularPlaylists, setPopularPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const allVideos = await videoService.getVideos();
      const nonShorts = allVideos.filter(v => !v.isShort);
      if (nonShorts.length > 0) {
        setFeaturedVideo(nonShorts[0]);
        setRecommendedVideos(nonShorts.slice(1, 9));
      }
      const allChannels = await channelService.getChannels();
      setChannels(allChannels.slice(0, 4));
      const allPlaylists = await playlistService.getPlaylists();
      setPopularPlaylists(allPlaylists);
    };
    loadData();
  }, []);

  const exploreCategories = [
    { title: 'Technology', icon: Cpu, slug: 'technology', color: 'from-blue-600/30 to-purple-600/30', border: 'hover:border-blue-500/50' },
    { title: 'Gaming', icon: Gamepad2, slug: 'gaming', color: 'from-purple-600/30 to-pink-600/30', border: 'hover:border-purple-500/50' },
    { title: 'Science', icon: Atom, slug: 'science', color: 'from-emerald-600/30 to-teal-600/30', border: 'hover:border-emerald-500/50' },
    { title: 'Music', icon: Music, slug: 'music', color: 'from-amber-600/30 to-rose-600/30', border: 'hover:border-amber-500/50' },
    { title: 'Education', icon: GraduationCap, slug: 'education', color: 'from-indigo-600/30 to-cyan-600/30', border: 'hover:border-indigo-500/50' },
    { title: 'Entertainment', icon: Clapperboard, slug: 'entertainment', color: 'from-rose-600/30 to-orange-600/30', border: 'hover:border-rose-500/50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Explore & Discover</h1>
          <p className="text-xs text-[#A3AABD]">Spotlight on premier creators, breakthroughs, and curated topics</p>
        </div>
      </div>

      {/* Featured Video Hero Showcase */}
      {featuredVideo && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#12151D] to-[#181C26] border border-[#2A3040] shadow-2xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-center">
          <div className="relative w-full lg:w-3/5 aspect-video rounded-2xl overflow-hidden bg-black shrink-0 border border-[#2A3040] shadow-xl group">
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-black/80 text-white backdrop-blur-xs">
                Featured Spotlight
              </span>
            </div>
            <Link
              to={`/watch/${featuredVideo.id}`}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
            >
              <div className="w-16 h-16 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </Link>
          </div>

          <div className="w-full lg:w-2/5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7C5CFC]/20 text-[#9278FF] border border-[#7C5CFC]/40">
                  {featuredVideo.category}
                </span>
                <span className="text-xs text-[#A3AABD]">{featuredVideo.relativeDate}</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-[#F5F7FA] leading-tight line-clamp-2">
                {featuredVideo.title}
              </h2>
              <p className="text-xs text-[#A3AABD] line-clamp-3 mt-2 leading-relaxed">
                {featuredVideo.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#2A3040]/70 flex items-center justify-between">
              <Link
                to={`/channel/${featuredVideo.channelId}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={featuredVideo.channel.avatar}
                  alt={featuredVideo.channel.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#2A3040]"
                />
                <div>
                  <p className="text-xs font-bold text-[#F5F7FA] flex items-center gap-1">
                    {featuredVideo.channel.name}
                    {featuredVideo.channel.verified && (
                      <CheckCircle2 className="w-3 h-3 text-[#7C5CFC]" />
                    )}
                  </p>
                  <p className="text-[11px] text-[#A3AABD]">{featuredVideo.channel.subscribersCountFormatted} subscribers</p>
                </div>
              </Link>

              <Link
                to={`/watch/${featuredVideo.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold shadow-lg shadow-[#7C5CFC]/30 transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Popular Category Hubs */}
      <div>
        <h3 className="text-base font-bold text-[#F5F7FA] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
          <span>Browse by Category</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {exploreCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} bg-[#181C26] border border-[#2A3040] ${cat.border} transition-all duration-200 hover:-translate-y-1 flex flex-col items-center justify-center text-center gap-2 group`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#202635] flex items-center justify-center text-[#F5F7FA] group-hover:text-[#9278FF] transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#F5F7FA]">{cat.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spotlight Creators */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#7C5CFC]" />
            <span>Spotlight Creators</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map(channel => (
            <div
              key={channel.id}
              className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] flex flex-col items-center text-center hover:border-[#7C5CFC]/40 transition-colors"
            >
              <Link to={`/channel/${channel.id}`} className="relative group mb-3">
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2A3040] group-hover:border-[#7C5CFC] transition-colors"
                />
              </Link>
              <Link
                to={`/channel/${channel.id}`}
                className="text-sm font-bold text-[#F5F7FA] hover:text-[#9278FF] flex items-center gap-1 transition-colors"
              >
                <span>{channel.name}</span>
                {channel.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#7C5CFC]" />}
              </Link>
              <p className="text-xs text-[#A3AABD] mt-0.5">{channel.handle}</p>
              <p className="text-xs text-[#A3AABD] font-mono mt-1">
                {channel.subscribersCountFormatted} subscribers · {channel.videosCount} videos
              </p>
              <p className="text-[11px] text-[#A3AABD] line-clamp-2 my-3 leading-relaxed">
                {channel.description}
              </p>
              <div className="mt-auto w-full pt-1">
                <SubscribeButton channelId={channel.id} channelName={channel.name} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Videos */}
      <div>
        <h3 className="text-base font-bold text-[#F5F7FA] mb-4">Recommended Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Popular Playlists */}
      {popularPlaylists.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-[#F5F7FA] mb-4">Curated Playlists</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
