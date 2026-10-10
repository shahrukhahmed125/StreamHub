import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { channelService } from '../services/channelService';
import { videoService } from '../services/videoService';
import { Channel, Video } from '../types';
import { SubscribeButton } from '../components/SubscribeButton';
import { VideoCard } from '../components/VideoCard';
import { ContentRow } from '../components/ContentRow';
import {
  Users,
  CheckCircle2,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  Film,
  Compass,
} from 'lucide-react';

export const CreatorsPage: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [popularShorts, setPopularShorts] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All',
    'Technology',
    'Gaming',
    'Education',
    'Podcasts',
    'Entertainment',
    'Science',
    'Music',
    'Sports',
    'Lifestyle',
  ];

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      channelService.getChannels(),
      videoService.getVideos(),
      videoService.getShorts(),
    ]).then(([chans, vids, shorts]) => {
      setChannels(chans);
      setFeaturedVideos(vids.filter(v => !v.isShort).slice(0, 8));
      setPopularShorts(shorts.slice(0, 6));
      setIsLoading(false);
    });
  }, []);

  const featuredCreators = channels.slice(0, 2);
  const trendingCreators = channels.slice(2, 6);
  const risingCreators = channels.slice(1, 5);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-[#2A3040]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#7C5CFC]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] tracking-tight">Creators & Channels</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A3AABD] mt-1">
            Follow independent tech visionaries, scientific filmmakers, esports legends, and cultural commentators.
          </p>
        </div>

        <Link
          to="/studio"
          className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold transition-all shadow-md shadow-[#7C5CFC]/20 self-start sm:self-auto"
        >
          Open Creator Studio
        </Link>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
                : 'bg-[#181C26] text-[#A3AABD] hover:text-white border border-[#2A3040]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 1. Featured Creators (Large Premium Cards) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7C5CFC]" />
          <h2 className="text-base sm:text-lg font-bold text-[#F5F7FA]">Featured Creators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCreators.map(channel => (
            <div
              key={channel.id}
              className="group relative rounded-3xl overflow-hidden bg-[#181C26] border border-[#2A3040] hover:border-[#7C5CFC] transition-all shadow-xl"
            >
              {/* Cover Banner */}
              <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-[#12151D]">
                <img
                  src={channel.banner}
                  alt={channel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181C26] via-transparent to-transparent" />
              </div>

              {/* Profile Details & Subscribe */}
              <div className="p-6 pt-0 relative flex flex-col justify-between -mt-10 space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <Link to={`/creator/${channel.id}`} className="relative group/avatar">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-[#181C26] shadow-xl"
                    />
                  </Link>
                  <SubscribeButton channelId={channel.id} channelName={channel.name} size="md" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/creator/${channel.id}`}
                      className="text-lg font-bold text-[#F5F7FA] hover:text-[#9278FF] transition-colors"
                    >
                      {channel.name}
                    </Link>
                    {channel.verified && (
                      <CheckCircle2 className="w-4 h-4 text-[#7C5CFC] fill-current" />
                    )}
                  </div>
                  <p className="text-xs font-mono text-[#A3AABD]">
                    {channel.handle} • {channel.subscribersCountFormatted} • {channel.videosCount} videos
                  </p>
                  <p className="text-xs text-[#A3AABD] line-clamp-2 leading-relaxed pt-1">
                    {channel.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/creator/${channel.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#7C5CFC] hover:underline"
                  >
                    <span>View Channel & Series</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Trending Creators Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#7C5CFC]" />
          <h2 className="text-base sm:text-lg font-bold text-[#F5F7FA]">Trending Creators</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingCreators.map(channel => (
            <div
              key={channel.id}
              className="p-5 rounded-2xl bg-[#12151D] border border-[#2A3040] hover:border-[#7C5CFC]/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-3">
                <Link to={`/creator/${channel.id}`}>
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#2A3040]"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/creator/${channel.id}`}
                    className="text-sm font-bold text-[#F5F7FA] hover:text-[#9278FF] truncate block"
                  >
                    {channel.name}
                  </Link>
                  <p className="text-[11px] font-mono text-[#A3AABD] truncate">
                    {channel.subscribersCountFormatted}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#A3AABD] line-clamp-2 leading-relaxed">
                {channel.description}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <SubscribeButton channelId={channel.id} channelName={channel.name} size="sm" />
                <Link
                  to={`/creator/${channel.id}`}
                  className="text-xs text-[#A3AABD] hover:text-white font-medium"
                >
                  Visit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Creator Videos */}
      <section className="space-y-4 pt-4 border-t border-[#2A3040]/70">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-[#7C5CFC]" />
          <h2 className="text-base sm:text-lg font-bold text-[#F5F7FA]">Featured Creator Productions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredVideos.map(vid => (
            <VideoCard key={vid.id} video={vid} />
          ))}
        </div>
      </section>

      {/* 4. Popular Shorts */}
      {popularShorts.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#2A3040]/70">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#7C5CFC]" />
            <h2 className="text-base sm:text-lg font-bold text-[#F5F7FA]">Popular Creator Shorts</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {popularShorts.map(short => (
              <Link
                key={short.id}
                to={`/shorts/${short.id}`}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-[#2A3040] hover:border-[#7C5CFC] transition-all shadow-lg"
              >
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-3">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {short.title}
                  </h4>
                  <span className="text-[10px] text-[#A3AABD] font-mono mt-1">
                    {short.viewsFormatted} views
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
