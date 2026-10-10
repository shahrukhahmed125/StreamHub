import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, Shield, Bell, Sliders, ChevronRight } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/settings/profile', label: 'Profile Settings', icon: User, desc: 'Display name, avatar, bio, and links' },
    { to: '/settings/privacy', label: 'Privacy & Visibility', icon: Shield, desc: 'Subscriptions, history, and search visibility' },
    { to: '/settings/notifications', label: 'Notification Preferences', icon: Bell, desc: 'Email and in-app alert triggers' },
  ];

  const isRootSettings = location.pathname === '/settings';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="pb-3 border-b border-[#2A3040]/70">
        <h1 className="text-xl font-bold text-[#F5F7FA]">Account & Preferences</h1>
        <p className="text-xs text-[#A3AABD]">Manage your public profile, privacy controls, and playback preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <aside className="md:col-span-4 space-y-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-[#181C26] border-[#7C5CFC] text-white shadow-sm'
                    : 'bg-[#12151D] border-[#2A3040]/60 text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26]'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${isActive ? 'bg-[#7C5CFC]/20 text-[#7C5CFC]' : 'bg-[#202635]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#F5F7FA] block">{link.label}</span>
                  <span className="text-[11px] text-[#A3AABD] line-clamp-1 mt-0.5">{link.desc}</span>
                </div>
              </NavLink>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="md:col-span-8">
          {isRootSettings ? (
            <div className="p-8 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-4">
              <h2 className="text-base font-bold text-[#F5F7FA]">General Preferences</h2>
              <div className="space-y-4 text-xs text-[#A3AABD]">
                <div className="flex items-center justify-between py-2 border-b border-[#2A3040]/60">
                  <div>
                    <span className="font-semibold text-white block">Theme Mode</span>
                    <span>System default with Dark-First priority</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#181C26] border border-[#2A3040] font-mono text-white">
                    Dark
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#2A3040]/60">
                  <div>
                    <span className="font-semibold text-white block">Language</span>
                    <span>Interface and recommendation localization</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#181C26] border border-[#2A3040] font-mono text-white">
                    English (US)
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#2A3040]/60">
                  <div>
                    <span className="font-semibold text-white block">Default Video Quality</span>
                    <span>Highest available resolution on high-speed network</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#181C26] border border-[#2A3040] font-mono text-white">
                    1080p HD
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="font-semibold text-white block">Autoplay Next Video</span>
                    <span>Queue recommended videos automatically after playback finishes</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#35C98A]/20 text-[#35C98A] border border-[#35C98A]/30 font-semibold">
                    Enabled
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};
