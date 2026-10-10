import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Film, Tv, Search, Bookmark, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const MobileNavigation: React.FC = () => {
  const { myListIds } = useApp();

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/tv-shows', label: 'TV Shows', icon: Tv },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/my-list', label: 'My List', icon: Bookmark, badge: myListIds.length },
    { to: '/creators', label: 'Creators', icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0D12]/95 backdrop-blur-lg border-t border-[#2A3040] px-2 py-1.5 flex items-center justify-around">
      {links.map(link => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive ? 'text-[#7C5CFC] font-bold' : 'text-[#A3AABD] hover:text-[#F5F7FA]'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {link.badge && link.badge > 0 ? (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#7C5CFC] text-white text-[9px] font-bold flex items-center justify-center">
                  {link.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
