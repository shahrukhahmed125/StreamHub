import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import {
  LayoutDashboard,
  Film,
  BarChart3,
  MessageSquare,
  Palette,
  Settings,
  ArrowLeft,
  PlusCircle,
  PlaySquare,
  Sparkles,
} from 'lucide-react';

export const StudioSidebar: React.FC = () => {
  const { user } = useAuth();
  const { channelCustomization } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/studio', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/studio/content', label: 'Content', icon: Film },
    { to: '/studio/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/studio/comments', label: 'Comments', icon: MessageSquare },
    { to: '/studio/customization', label: 'Customization', icon: Palette },
    { to: '/studio/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0D12] border-r border-[#2A3040]/70 flex flex-col shrink-0 select-none">
      {/* Studio Brand */}
      <div className="p-4 border-b border-[#2A3040]/70 flex items-center justify-between">
        <Link to="/studio" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#9278FF] flex items-center justify-center text-white shadow-md shadow-[#7C5CFC]/30">
            <PlaySquare className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#F5F7FA] block leading-tight">StreamHub</span>
            <span className="text-[10px] font-semibold text-[#7C5CFC] tracking-wider uppercase">Studio</span>
          </div>
        </Link>
      </div>

      {/* Channel Mini Profile */}
      <div className="p-4 border-b border-[#2A3040]/70 flex items-center gap-3 bg-[#12151D]/40">
        <img
          src={channelCustomization.avatar || user?.avatar}
          alt={channelCustomization.name}
          className="w-10 h-10 rounded-full object-cover border border-[#2A3040]"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#F5F7FA] truncate">{channelCustomization.name}</p>
          <p className="text-[11px] text-[#A3AABD] truncate">{channelCustomization.handle}</p>
        </div>
      </div>

      {/* Upload CTA */}
      <div className="p-3">
        <Link
          to="/studio/upload"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Video</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#7C5CFC]/15 text-[#9278FF] font-semibold border-l-2 border-[#7C5CFC]'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C5CFC]' : ''}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Switch back to Viewer App */}
      <div className="p-3 border-t border-[#2A3040]/70 bg-[#0B0D12]">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to StreamHub</span>
        </Link>
      </div>
    </aside>
  );
};
