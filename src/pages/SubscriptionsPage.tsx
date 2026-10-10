import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { channelService } from '../services/channelService';
import { Video, Channel } from '../types';
import { VideoGrid } from '../components/VideoGrid';
import { useApp } from '../contexts/AppContext';
import { Users, CheckCircle2 } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const { subscribedChannelIds } = useApp();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [feedVideos, setFeedVideos] = useState<Video[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubs = async () => {
      setIsLoading(true);
      const allChannels = await channelService.getChannels();
      const subscribed = allChannels.filter(c => subscribedChannelIds.includes(c.id));
      setChannels(subscribed);

      const allVideos = await videoService.getVideos();
      const subsVideos = allVideos.filter(v => subscribedChannelIds.includes(v.channelId));
      setFeedVideos(subsVideos);
      setIsLoading(false);
    };
    loadSubs();
  }, [subscribedChannelIds]);

  const filteredVideos =
    selectedChannelId === 'all'
      ? feedVideos
      : feedVideos.filter(v => v.channelId === selectedChannelId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#2A3040]/70">
        <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Subscriptions Feed</h1>
          <p className="text-xs text-[#A3AABD]">Latest uploads from channels you follow</p>
        </div>
      </div>

      {/* Subscribed Channels Avatar Bar */}
      {channels.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setSelectedChannelId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedChannelId === 'all'
                ? 'bg-[#7C5CFC] text-white border-[#7C5CFC]'
                : 'bg-[#181C26] text-[#A3AABD] border-[#2A3040] hover:text-white'
            }`}
          >
            All Channels
          </button>

          {channels.map(channel => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannelId(channel.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors shrink-0 ${
                selectedChannelId === channel.id
                  ? 'bg-[#7C5CFC]/15 border-[#7C5CFC] text-white'
                  : 'bg-[#181C26] border-[#2A3040] text-[#A3AABD] hover:text-white'
              }`}
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-6 h-6 rounded-full object-cover border border-[#2A3040]"
              />
              <span className="text-xs font-medium">{channel.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Video Grid */}
      <VideoGrid
        videos={filteredVideos}
        isLoading={isLoading}
        emptyTitle="No subscription updates"
        emptyDescription="You haven't subscribed to any creators yet, or your subscribed channels haven't posted recently."
      />
    </div>
  );
};
