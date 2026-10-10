import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  Bookmark,
  Bell,
  X,
  User,
  Tv,
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  Clapperboard,
  Film,
  Menu,
  ChevronDown,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    myListIds,
    toggleSidebar,
  } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tv-shows', label: 'TV Shows' },
    { to: '/new-and-popular', label: 'New & Popular' },
    { to: '/creators', label: 'Creators' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 h-16 transition-all duration-300 px-4 sm:px-8 flex items-center justify-between gap-4 ${
        isScrolled
          ? 'bg-[#0B0D12]/95 backdrop-blur-md border-b border-[#2A3040]/70 shadow-2xl'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      }`}
    >
      {/* Left: Brand & Primary OTT Navigation */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#9278FF] flex items-center justify-center text-white shadow-lg shadow-[#7C5CFC]/30 group-hover:scale-105 transition-transform">
            <Clapperboard className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#F5F7FA] leading-none">
              Stream<span className="text-[#7C5CFC]">Hub</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#A3AABD] uppercase">
              CINEMA & OTT
            </span>
          </div>
        </Link>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#A3AABD]">
          {navLinks.map(link => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`transition-colors whitespace-nowrap hover:text-white ${
                  isActive ? 'text-white font-bold' : ''
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Right: Search, My List, Studio, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Bar / Icon */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          {searchOpen ? (
            <div className="flex items-center bg-[#181C26] border border-[#2A3040] rounded-xl pl-3 pr-2 py-1.5 shadow-lg animate-in fade-in duration-200">
              <Search className="w-4 h-4 text-[#A3AABD] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Movies, shows, actors..."
                className="w-48 sm:w-64 bg-transparent text-xs text-white placeholder-[#A3AABD]/60 focus:outline-hidden ml-2"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#A3AABD] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="p-2 rounded-xl text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26] transition-colors"
              title="Search catalog"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* My List Shortcut */}
        <Link
          to="/my-list"
          className="relative p-2 rounded-xl text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26] transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
          title="My List"
        >
          <Bookmark className="w-4 h-4" />
          <span>My List</span>
          {myListIds.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#7C5CFC] text-white text-[10px] font-bold flex items-center justify-center">
              {myListIds.length}
            </span>
          )}
        </Link>

        {/* Creator Studio Quick Trigger */}
        <Link
          to="/studio"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#A3AABD] hover:text-white transition-colors"
        >
          <Film className="w-3.5 h-3.5 text-[#7C5CFC]" />
          <span>Creator Studio</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#A3AABD] hover:text-[#F5F7FA] hover:bg-[#181C26] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#7C5CFC] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0B0D12]">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#181C26] border border-[#2A3040] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between p-3.5 border-b border-[#2A3040]">
                <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
                  Notifications
                </h4>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#7C5CFC] hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#2A3040]/50">
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setShowNotifications(false);
                      navigate(n.targetUrl);
                    }}
                    className={`p-3 flex items-start gap-3 hover:bg-[#202635] cursor-pointer transition-colors ${
                      !n.read ? 'bg-[#7C5CFC]/10' : ''
                    }`}
                  >
                    <img
                      src={n.avatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-[#2A3040]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#F5F7FA] leading-tight line-clamp-1">
                        {n.title}
                      </p>
                      <p className="text-xs text-[#A3AABD] line-clamp-1 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-[#A3AABD]/70 mt-1 block font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative" ref={userMenuRef}>
          {isAuthenticated && user ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#181C26] transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-[#2A3040]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#A3AABD]" />
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold transition-all shadow-md shadow-[#7C5CFC]/20"
            >
              Sign In
            </Link>
          )}

          {showUserMenu && user && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-[#181C26] border border-[#2A3040] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-[#2A3040]">
                <p className="text-sm font-bold text-[#F5F7FA] truncate">{user.name}</p>
                <p className="text-xs text-[#A3AABD] truncate">VIP Member</p>
              </div>

              <div className="py-1">
                <Link
                  to="/my-list"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#F5F7FA] hover:bg-[#202635] transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-[#7C5CFC]" />
                  <span>My List</span>
                </Link>

                <Link
                  to="/continue-watching"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#F5F7FA] hover:bg-[#202635] transition-colors"
                >
                  <Tv className="w-4 h-4 text-[#35C98A]" />
                  <span>Continue Watching</span>
                </Link>

                <Link
                  to="/studio"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-[#9278FF] hover:bg-[#202635] transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#7C5CFC]" />
                  <span>StreamHub Studio</span>
                </Link>

                <Link
                  to="/channel/channel-techmatrix"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#F5F7FA] hover:bg-[#202635] transition-colors"
                >
                  <Tv className="w-4 h-4 text-[#A3AABD]" />
                  <span>My Creator Channel</span>
                </Link>

                <Link
                  to="/library"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#F5F7FA] hover:bg-[#202635] transition-colors"
                >
                  <Film className="w-4 h-4 text-[#A3AABD]" />
                  <span>Personal Library</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#F5F7FA] hover:bg-[#202635] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#A3AABD]" />
                  <span>Account & Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-[#2A3040]">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#F06464] hover:bg-[#202635] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
