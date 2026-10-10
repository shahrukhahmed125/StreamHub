import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { MOCK_CHANNELS } from '../data/mockData';
import {
  Home,
  Film,
  Tv,
  Sparkles,
  Bookmark,
  Clock,
  Users,
  Compass,
  Flame,
  Zap,
  FolderHeart,
  History,
  ThumbsUp,
  ListVideo,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Gaming',
  'Education',
  'News',
  'Entertainment',
  'Music',
  'Sports',
  'Science',
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, subscribedChannelIds } = useApp();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const location = useLocation();

  const subscribedChannels = MOCK_CHANNELS.filter(c => subscribedChannelIds.includes(c.id));

  const ottLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/tv-shows', label: 'TV Shows', icon: Tv },
    { to: '/new-and-popular', label: 'New & Popular', icon: Sparkles },
    { to: '/continue-watching', label: 'Continue Watching', icon: Clock },
    { to: '/my-list', label: 'My List', icon: Bookmark },
  ];

  const creatorLinks = [
    { to: '/creators', label: 'Creators', icon: Users },
    { to: '/shorts', label: 'Shorts', icon: Zap },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/trending', label: 'Trending', icon: Flame },
  ];

  const libraryLinks = [
    { to: '/library', label: 'Library', icon: FolderHeart },
    { to: '/history', label: 'History', icon: History },
    { to: '/watch-later', label: 'Watch Later', icon: Clock },
    { to: '/liked-videos', label: 'Liked Videos', icon: ThumbsUp },
  ];

  if (sidebarCollapsed) {
    // Collapsed Icon-Only Strip
    return (
      <aside className="hidden md:flex flex-col items-center w-20 bg-[#0B0D12] border-r border-[#2A3040]/70 py-3 shrink-0 select-none z-30">
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {ottLinks.slice(0, 4).map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center justify-center w-full py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'text-[#7C5CFC] bg-[#181C26]'
                    : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#12151D]'
                }`}
                title={link.label}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium tracking-tight truncate max-w-full">
                  {link.label}
                </span>
              </NavLink>
            );
          })}
          <div className="w-8 h-[1px] bg-[#2A3040] my-2" />
          <NavLink
            to="/my-list"
            className={`flex flex-col items-center justify-center w-full py-3 rounded-xl transition-colors ${
              location.pathname === '/my-list'
                ? 'text-[#7C5CFC] bg-[#181C26]'
                : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#12151D]'
            }`}
            title="My List"
          >
            <Bookmark className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">My List</span>
          </NavLink>
          <NavLink
            to="/creators"
            className={`flex flex-col items-center justify-center w-full py-3 rounded-xl transition-colors ${
              location.pathname === '/creators'
                ? 'text-[#7C5CFC] bg-[#181C26]'
                : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#12151D]'
            }`}
            title="Creators"
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">Creators</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  // Expanded Sidebar
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0B0D12] border-r border-[#2A3040]/70 py-4 px-3 shrink-0 overflow-y-auto z-30 select-none">
      {/* Primary OTT Cinema Links */}
      <div className="space-y-1 mb-4">
        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#7C5CFC]">
          Streaming Hub
        </div>
        {ottLinks.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#7C5CFC]/15 text-[#9278FF] border-l-2 border-[#7C5CFC]'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#7C5CFC]' : ''}`} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="h-[1px] bg-[#2A3040]/70 my-1 mx-2" />

      {/* Creator Ecosystem */}
      <div className="py-2.5 space-y-1">
        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#A3AABD]/70">
          Creators & Discovery
        </div>
        {creatorLinks.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#7C5CFC]/15 text-[#9278FF] font-semibold border-l-2 border-[#7C5CFC]'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#7C5CFC]' : ''}`} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="h-[1px] bg-[#2A3040]/70 my-1 mx-2" />

      {/* Personal Library Section */}
      <div className="py-2.5 space-y-1">
        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#A3AABD]/70">
          Personal Library
        </div>
        {libraryLinks.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#7C5CFC]/15 text-[#9278FF] font-semibold border-l-2 border-[#7C5CFC]'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#7C5CFC]' : ''}`} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="h-[1px] bg-[#2A3040]/70 my-1 mx-2" />

      {/* Subscribed Channels List */}
      <div className="py-2.5">
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A3AABD]/70">
            Subscriptions
          </span>
          <span className="text-[10px] text-[#A3AABD]">({subscribedChannels.length})</span>
        </div>

        <div className="space-y-1">
          {subscribedChannels.length === 0 ? (
            <p className="px-3 py-2 text-xs text-[#A3AABD]">No subscriptions yet</p>
          ) : (
            subscribedChannels.map(channel => (
              <NavLink
                key={channel.id}
                to={`/creator/${channel.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-[#181C26] text-[#F5F7FA] font-medium'
                      : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26]/70'
                  }`
                }
              >
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0 border border-[#2A3040]"
                />
                <span className="truncate flex-1">{channel.name}</span>
                {channel.verified && (
                  <CheckCircle2 className="w-3 h-3 text-[#7C5CFC] shrink-0" />
                )}
              </NavLink>
            ))
          )}
        </div>
      </div>

      <div className="h-[1px] bg-[#2A3040]/70 my-1 mx-2" />

      {/* Collapsible Categories Section */}
      <div className="py-2.5">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="w-full flex items-center justify-between px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#A3AABD]/70 hover:text-white"
        >
          <span>Categories</span>
          {categoriesOpen ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>

        {categoriesOpen && (
          <div className="space-y-1">
            {CATEGORIES.map(category => (
              <NavLink
                key={category}
                to={`/genres/${category.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#7C5CFC]/15 text-[#9278FF] font-semibold'
                      : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26]'
                  }`
                }
              >
                {category}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-[#2A3040]/70 px-2 text-[11px] text-[#A3AABD]/60">
        <p>© 2026 StreamHub Cinema & OTT</p>
      </div>
    </aside>
  );
};
