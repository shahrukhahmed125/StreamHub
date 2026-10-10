import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { channelService } from '../services/channelService';
import { videoService } from '../services/videoService';
import { playlistService } from '../services/playlistService';
import { Channel, Video, Playlist } from '../types';
import { VideoGrid } from '../components/VideoGrid';
import { VideoCard } from '../components/VideoCard';
import { PlaylistCard } from '../components/PlaylistCard';
import { SubscribeButton } from '../components/SubscribeButton';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import {
  CheckCircle2,
  Share2,
  ExternalLink,
  Edit3,
  Calendar,
  Eye,
  Film,
  Play,
  AlertCircle,
} from 'lucide-react';

type ChannelTab = 'home' | 'videos' | 'shorts' | 'playlists' | 'about';

export const ChannelPage: React.FC = () => {
  const { channelId, creatorId } = useParams<{ channelId?: string; creatorId?: string }>();
  const activeId = creatorId || channelId;
  const { user } = useAuth();
  const { addToast } = useApp();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [activeTab, setActiveTab] = useState<ChannelTab>('home');
  const [channelVideos, setChannelVideos] = useState<Video[]>([]);
  const [channelShorts, setChannelShorts] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [channelPlaylists, setChannelPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = user?.channelId === activeId || activeId === 'channel-techmatrix';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadChannel = async () => {
      if (!activeId) return;
      const foundChannel = await channelService.getChannelById(activeId);
      if (isMounted) {
        if (foundChannel) {
          setChannel(foundChannel);
          const videos = await videoService.getVideos({ channelId: foundChannel.id });
          const shorts = videos.filter(v => v.isShort);
          const regular = videos.filter(v => !v.isShort);
          setChannelVideos(regular);
          setChannelShorts(shorts);

          if (foundChannel.featuredVideoId) {
            const feat = await videoService.getVideoById(foundChannel.featuredVideoId);
            setFeaturedVideo(feat || regular[0] || null);
          } else {
            setFeaturedVideo(regular[0] || null);
          }

          const playlists = await playlistService.getPlaylists();
          setChannelPlaylists(playlists);
        } else {
          setChannel(null);
        }
        setIsLoading(false);
      }
    };

    loadChannel();
    return () => {
      isMounted = false;
    };
  }, [channelId]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Channel link copied', url, 'success');
    }).catch(() => {
      addToast('Share URL', url, 'info');
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="w-full h-48 sm:h-64 rounded-3xl bg-[#181C26]" />
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-[#181C26]" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-[#181C26] rounded-md w-1/4" />
            <div className="h-4 bg-[#181C26] rounded-md w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F06464]/20 text-[#F06464] mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#F5F7FA]">Channel not found</h2>
        <p className="text-sm text-[#A3AABD]">
          The channel you are looking for does not exist or may have been deleted.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const tabs: { key: ChannelTab; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'videos', label: `Videos (${channelVideos.length})` },
    { key: 'shorts', label: `Shorts (${channelShorts.length})` },
    { key: 'playlists', label: 'Playlists' },
    { key: 'about', label: 'About' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Channel Banner */}
      <div className="relative w-full h-44 sm:h-64 rounded-3xl overflow-hidden bg-[#181C26] border border-[#2A3040]">
        <img
          src={channel.banner}
          alt={channel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Channel Header Information */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <img
            src={channel.avatar}
            alt={channel.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#0B0D12] shadow-xl shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] flex items-center gap-2">
              <span>{channel.name}</span>
              {channel.verified && (
                <CheckCircle2 className="w-5 h-5 text-[#7C5CFC]" />
              )}
            </h1>
            <p className="text-xs text-[#A3AABD] mt-1 font-mono">
              {channel.handle} · {channel.subscribersCountFormatted} subscribers · {channel.videosCount} videos
            </p>
            <p className="text-xs text-[#A3AABD] line-clamp-1 mt-1 max-w-xl">
              {channel.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {isOwner ? (
            <Link
              to="/studio/customization"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202635] hover:bg-[#2A3040] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] transition-colors"
            >
              <Edit3 className="w-4 h-4 text-[#7C5CFC]" />
              <span>Customize Channel</span>
            </Link>
          ) : (
            <SubscribeButton channelId={channel.id} channelName={channel.name} size="md" />
          )}

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
            title="Share channel"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#2A3040]/70 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-xs font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-[#9278FF]'
                : 'text-[#A3AABD] hover:text-[#F5F7FA]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C5CFC]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* Tab 1: Home (Featured video + recent uploads) */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {featuredVideo && (
              <div className="p-4 sm:p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] flex flex-col md:flex-row gap-6">
                <Link
                  to={`/watch/${featuredVideo.id}`}
                  className="relative w-full md:w-96 aspect-video rounded-xl overflow-hidden bg-black shrink-0 group border border-[#2A3040]"
                >
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-semibold rounded-md bg-black/85 text-white">
                    {featuredVideo.duration}
                  </span>
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C5CFC]">
                      Featured Video
                    </span>
                    <Link
                      to={`/watch/${featuredVideo.id}`}
                      className="text-base sm:text-lg font-bold text-[#F5F7FA] hover:text-[#9278FF] transition-colors block mt-1 line-clamp-2"
                    >
                      {featuredVideo.title}
                    </Link>
                    <p className="text-xs text-[#A3AABD] mt-1 font-mono">
                      {featuredVideo.viewsFormatted} views · {featuredVideo.relativeDate}
                    </p>
                    <p className="text-xs text-[#A3AABD] line-clamp-3 mt-2 leading-relaxed">
                      {featuredVideo.description}
                    </p>
                  </div>

                  <div className="pt-3">
                    <Link
                      to={`/watch/${featuredVideo.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Video</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-[#F5F7FA] mb-4">Latest Uploads</h3>
              <VideoGrid videos={channelVideos} />
            </div>
          </div>
        )}

        {/* Tab 2: All Videos */}
        {activeTab === 'videos' && (
          <VideoGrid
            videos={channelVideos}
            emptyTitle="No videos uploaded yet"
            emptyDescription="This channel has not published any videos yet."
          />
        )}

        {/* Tab 3: Shorts */}
        {activeTab === 'shorts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {channelShorts.map(short => (
              <Link
                key={short.id}
                to={`/shorts/${short.id}`}
                className="group relative aspect-shorts-9-16 rounded-2xl overflow-hidden bg-black border border-[#2A3040] hover:border-[#7C5CFC]"
              >
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                  <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {short.title}
                  </p>
                  <p className="text-[11px] text-white/70 font-mono mt-1">
                    {short.viewsFormatted} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab 4: Playlists */}
        {activeTab === 'playlists' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channelPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        )}

        {/* Tab 5: About */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 rounded-2xl bg-[#12151D] border border-[#2A3040]">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-[#F5F7FA]">Description</h3>
              <p className="text-sm text-[#F5F7FA]/90 leading-relaxed whitespace-pre-line">
                {channel.description}
              </p>

              {channel.links && channel.links.length > 0 && (
                <div className="pt-4 border-t border-[#2A3040]">
                  <h4 className="text-xs font-bold text-[#A3AABD] uppercase tracking-wider mb-2">Links</h4>
                  <div className="space-y-1.5">
                    {channel.links.map(link => (
                      <a
                        key={link.title}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#7C5CFC] hover:underline mr-4"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 md:border-l md:border-[#2A3040] md:pl-6 text-xs text-[#A3AABD]">
              <h3 className="text-sm font-bold text-[#F5F7FA]">Channel Stats</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7C5CFC]" />
                <span>Joined {channel.joinedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#7C5CFC]" />
                <span>{channel.videosCount} total videos</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#7C5CFC]" />
                <span>Verified creator profile</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
