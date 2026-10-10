import React, { createContext, useContext, useState, useEffect } from 'react';
import { Video, Playlist, Notification, ToastMessage, VideoCategory, MediaItem, ContinueWatchingItem } from '../types';
import {
  MOCK_VIDEOS,
  MOCK_PLAYLISTS,
  MOCK_NOTIFICATIONS,
  TECH_CHANNEL_BANNER,
  MOCK_CONTINUE_WATCHING,
} from '../data/mockData';

export interface ChannelCustomizationState {
  name: string;
  handle: string;
  description: string;
  avatar: string;
  banner: string;
  accentColor: string;
  trailerId?: string;
  featuredVideoId?: string;
}

interface AppContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  activeCategory: VideoCategory | string;
  setActiveCategory: (cat: VideoCategory | string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // OTT My List (Watchlist)
  myListIds: string[];
  isInMyList: (id: string) => boolean;
  toggleMyList: (item: MediaItem) => void;

  // OTT Continue Watching
  continueWatchingList: ContinueWatchingItem[];
  removeFromContinueWatching: (id: string) => void;
  
  // Creator Interactions
  subscribedChannelIds: string[];
  isSubscribed: (channelId: string) => boolean;
  toggleSubscribe: (channelId: string, channelName?: string) => void;
  
  likedVideoIds: string[];
  dislikedVideoIds: string[];
  isLiked: (videoId: string) => boolean;
  isDisliked: (videoId: string) => boolean;
  toggleLikeVideo: (videoId: string) => void;
  toggleDislikeVideo: (videoId: string) => void;
  
  savedWatchLaterIds: string[];
  isSavedWatchLater: (videoId: string) => boolean;
  toggleWatchLater: (video: Video) => void;
  
  watchHistory: { videoId: string; watchedAt: string; video: Video }[];
  addToHistory: (video: Video) => void;
  removeFromHistory: (videoId: string) => void;
  clearHistory: () => void;
  
  userPlaylists: Playlist[];
  createPlaylist: (title: string, description: string, visibility: 'public' | 'unlisted' | 'private') => Playlist;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addVideoToPlaylist: (playlistId: string, video: Video) => boolean;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  
  notifications: Notification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  
  // Creator Studio State
  creatorVideos: Video[];
  addCreatorVideo: (video: Video) => void;
  updateCreatorVideo: (id: string, updates: Partial<Video>) => void;
  deleteCreatorVideo: (id: string) => void;
  
  channelCustomization: ChannelCustomizationState;
  updateChannelCustomization: (updates: Partial<ChannelCustomizationState>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true); // OTT default clean view
  const [activeCategory, setActiveCategory] = useState<VideoCategory | string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // OTT My List (Watchlist)
  const [myListIds, setMyListIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sh_my_list');
      return saved ? JSON.parse(saved) : ['movie-eventide', 'series-cyber-heir', 'movie-sky-islands'];
    } catch {
      return ['movie-eventide', 'series-cyber-heir', 'movie-sky-islands'];
    }
  });

  // OTT Continue Watching List
  const [continueWatchingList, setContinueWatchingList] = useState<ContinueWatchingItem[]>(() => {
    try {
      const saved = localStorage.getItem('sh_continue_watching');
      return saved ? JSON.parse(saved) : MOCK_CONTINUE_WATCHING;
    } catch {
      return MOCK_CONTINUE_WATCHING;
    }
  });

  // Persistent user activity
  const [subscribedChannelIds, setSubscribedChannelIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sh_subscriptions');
      return saved ? JSON.parse(saved) : ['channel-techmatrix', 'channel-cyberpulse', 'channel-frontiersci'];
    } catch {
      return ['channel-techmatrix', 'channel-cyberpulse', 'channel-frontiersci'];
    }
  });

  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sh_liked_videos');
      return saved ? JSON.parse(saved) : ['vid-quantum-01', 'vid-science-01'];
    } catch {
      return ['vid-quantum-01', 'vid-science-01'];
    }
  });

  const [dislikedVideoIds, setDislikedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sh_disliked_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedWatchLaterIds, setSavedWatchLaterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sh_watch_later');
      return saved ? JSON.parse(saved) : ['vid-tech-02', 'vid-tech-03'];
    } catch {
      return ['vid-tech-02', 'vid-tech-03'];
    }
  });

  const [watchHistory, setWatchHistory] = useState<{ videoId: string; watchedAt: string; video: Video }[]>(() => {
    try {
      const saved = localStorage.getItem('sh_watch_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { videoId: 'vid-quantum-01', watchedAt: 'Today at 2:15 PM', video: MOCK_VIDEOS[0] },
      { videoId: 'vid-gaming-01', watchedAt: 'Yesterday at 9:40 PM', video: MOCK_VIDEOS[1] },
      { videoId: 'vid-science-01', watchedAt: '3 days ago', video: MOCK_VIDEOS[2] },
    ];
  });

  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('sh_playlists');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOCK_PLAYLISTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('sh_notifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOCK_NOTIFICATIONS;
  });

  // Creator uploaded videos
  const [creatorVideos, setCreatorVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem('sh_creator_videos');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOCK_VIDEOS.filter(v => v.channelId === 'channel-techmatrix');
  });

  const [channelCustomization, setChannelCustomization] = useState<ChannelCustomizationState>(() => {
    try {
      const saved = localStorage.getItem('sh_channel_customization');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: 'TechMatrix Media',
      handle: '@techmatrix',
      description: 'Deep dives into quantum processors, high-performance distributed systems, AI acceleration engines, and edge silicon architectures.',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
      banner: TECH_CHANNEL_BANNER,
      accentColor: '#7C5CFC',
      trailerId: 'vid-quantum-01',
      featuredVideoId: 'vid-quantum-01',
    };
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('sh_my_list', JSON.stringify(myListIds));
  }, [myListIds]);

  useEffect(() => {
    localStorage.setItem('sh_continue_watching', JSON.stringify(continueWatchingList));
  }, [continueWatchingList]);

  useEffect(() => {
    localStorage.setItem('sh_subscriptions', JSON.stringify(subscribedChannelIds));
  }, [subscribedChannelIds]);

  useEffect(() => {
    localStorage.setItem('sh_liked_videos', JSON.stringify(likedVideoIds));
  }, [likedVideoIds]);

  useEffect(() => {
    localStorage.setItem('sh_disliked_videos', JSON.stringify(dislikedVideoIds));
  }, [dislikedVideoIds]);

  useEffect(() => {
    localStorage.setItem('sh_watch_later', JSON.stringify(savedWatchLaterIds));
  }, [savedWatchLaterIds]);

  useEffect(() => {
    localStorage.setItem('sh_watch_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('sh_playlists', JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  useEffect(() => {
    localStorage.setItem('sh_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sh_creator_videos', JSON.stringify(creatorVideos));
  }, [creatorVideos]);

  useEffect(() => {
    localStorage.setItem('sh_channel_customization', JSON.stringify(channelCustomization));
  }, [channelCustomization]);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // OTT My List methods
  const isInMyList = (id: string) => myListIds.includes(id);

  const toggleMyList = (item: MediaItem) => {
    if (myListIds.includes(item.id)) {
      setMyListIds(prev => prev.filter(i => i !== item.id));
      addToast('Removed from My List', item.title, 'info');
    } else {
      setMyListIds(prev => [item.id, ...prev]);
      addToast('Added to My List', item.title, 'success');
    }
  };

  const removeFromContinueWatching = (id: string) => {
    setContinueWatchingList(prev => prev.filter(i => i.id !== id));
    addToast('Removed from Continue Watching', undefined, 'info');
  };

  // Subscriptions
  const isSubscribed = (channelId: string) => subscribedChannelIds.includes(channelId);
  
  const toggleSubscribe = (channelId: string, channelName?: string) => {
    if (subscribedChannelIds.includes(channelId)) {
      setSubscribedChannelIds(prev => prev.filter(id => id !== channelId));
      addToast('Unsubscribed', channelName ? `Unsubscribed from ${channelName}` : undefined, 'info');
    } else {
      setSubscribedChannelIds(prev => [...prev, channelId]);
      addToast('Subscribed', channelName ? `Added ${channelName} to your subscriptions` : 'Subscription added', 'success');
    }
  };

  // Likes & Dislikes
  const isLiked = (videoId: string) => likedVideoIds.includes(videoId);
  const isDisliked = (videoId: string) => dislikedVideoIds.includes(videoId);

  const toggleLikeVideo = (videoId: string) => {
    if (likedVideoIds.includes(videoId)) {
      setLikedVideoIds(prev => prev.filter(id => id !== videoId));
    } else {
      setLikedVideoIds(prev => [...prev, videoId]);
      setDislikedVideoIds(prev => prev.filter(id => id !== videoId));
      addToast('Added to Liked Videos', undefined, 'success');
    }
  };

  const toggleDislikeVideo = (videoId: string) => {
    if (dislikedVideoIds.includes(videoId)) {
      setDislikedVideoIds(prev => prev.filter(id => id !== videoId));
    } else {
      setDislikedVideoIds(prev => [...prev, videoId]);
      setLikedVideoIds(prev => prev.filter(id => id !== videoId));
    }
  };

  // Watch Later
  const isSavedWatchLater = (videoId: string) => savedWatchLaterIds.includes(videoId);

  const toggleWatchLater = (video: Video) => {
    if (savedWatchLaterIds.includes(video.id)) {
      setSavedWatchLaterIds(prev => prev.filter(id => id !== video.id));
      addToast('Removed from Watch Later', undefined, 'info');
    } else {
      setSavedWatchLaterIds(prev => [...prev, video.id]);
      addToast('Saved to Watch Later', video.title, 'success');
    }
  };

  // Watch History
  const addToHistory = (video: Video) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.videoId !== video.id);
      return [{ videoId: video.id, watchedAt: 'Just now', video }, ...filtered];
    });
  };

  const removeFromHistory = (videoId: string) => {
    setWatchHistory(prev => prev.filter(item => item.videoId !== videoId));
    addToast('Removed from history', undefined, 'info');
  };

  const clearHistory = () => {
    setWatchHistory([]);
    addToast('Watch history cleared', undefined, 'info');
  };

  // Playlists
  const createPlaylist = (title: string, description: string, visibility: 'public' | 'unlisted' | 'private'): Playlist => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title,
      description,
      visibility,
      videoCount: 0,
      updatedAt: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      videos: [],
      ownerId: 'user-alex-rivera',
      ownerName: 'Alex Rivera',
    };
    setUserPlaylists(prev => [newPl, ...prev]);
    addToast('Playlist created', `"${title}" has been created`, 'success');
    return newPl;
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setUserPlaylists(prev => prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: 'Just now' } : p)));
    addToast('Playlist updated', undefined, 'success');
  };

  const deletePlaylist = (id: string) => {
    setUserPlaylists(prev => prev.filter(p => p.id !== id));
    addToast('Playlist deleted', undefined, 'info');
  };

  const addVideoToPlaylist = (playlistId: string, video: Video): boolean => {
    let added = false;
    setUserPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          if (p.videos.some(v => v.id === video.id)) return p;
          added = true;
          return {
            ...p,
            videos: [...p.videos, video],
            videoCount: p.videos.length + 1,
            thumbnail: p.videos.length === 0 ? video.thumbnail : p.thumbnail,
            updatedAt: 'Just now',
          };
        }
        return p;
      })
    );
    if (added) {
      addToast('Added to playlist', video.title, 'success');
    } else {
      addToast('Already in playlist', undefined, 'info');
    }
    return added;
  };

  const removeVideoFromPlaylist = (playlistId: string, videoId: string) => {
    setUserPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          const nextVideos = p.videos.filter(v => v.id !== videoId);
          return {
            ...p,
            videos: nextVideos,
            videoCount: nextVideos.length,
            updatedAt: 'Just now',
          };
        }
        return p;
      })
    );
    addToast('Video removed from playlist', undefined, 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', undefined, 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Creator studio videos
  const addCreatorVideo = (video: Video) => {
    setCreatorVideos(prev => [video, ...prev]);
    addToast('Video Published', `"${video.title}" is now available on StreamHub`, 'success');
  };

  const updateCreatorVideo = (id: string, updates: Partial<Video>) => {
    setCreatorVideos(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
    addToast('Video updated', 'Changes have been saved successfully', 'success');
  };

  const deleteCreatorVideo = (id: string) => {
    setCreatorVideos(prev => prev.filter(v => v.id !== id));
    addToast('Video deleted', 'The video was removed from your channel', 'info');
  };

  const updateChannelCustomization = (updates: Partial<ChannelCustomizationState>) => {
    setChannelCustomization(prev => ({ ...prev, ...updates }));
    addToast('Channel customization saved', undefined, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        myListIds,
        isInMyList,
        toggleMyList,
        continueWatchingList,
        removeFromContinueWatching,
        subscribedChannelIds,
        isSubscribed,
        toggleSubscribe,
        likedVideoIds,
        dislikedVideoIds,
        isLiked,
        isDisliked,
        toggleLikeVideo,
        toggleDislikeVideo,
        savedWatchLaterIds,
        isSavedWatchLater,
        toggleWatchLater,
        watchHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
        userPlaylists,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        creatorVideos,
        addCreatorVideo,
        updateCreatorVideo,
        deleteCreatorVideo,
        channelCustomization,
        updateChannelCustomization,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
