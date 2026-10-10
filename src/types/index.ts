export type VideoCategory =
  | 'All'
  | 'Technology'
  | 'Gaming'
  | 'Education'
  | 'News'
  | 'Entertainment'
  | 'Music'
  | 'Sports'
  | 'Podcasts'
  | 'Science'
  | 'Business'
  | 'Lifestyle';

export type VideoVisibility = 'public' | 'unlisted' | 'private' | 'scheduled';
export type VideoStatus = 'Published' | 'Processing' | 'Draft' | 'Scheduled' | 'Unlisted' | 'Private';

// OTT Movie Entity
export interface Movie {
  id: string;
  title: string;
  type: 'movie';
  poster: string;
  backdrop: string;
  year: number;
  rating: string; // e.g. "PG-13", "TV-MA", "R"
  score: number; // e.g. 8.8
  runtime: string; // e.g. "2h 18m"
  runtimeMinutes: number;
  genres: string[];
  language: string;
  country: 'Hollywood' | 'Bollywood' | 'Korean' | 'Turkish' | 'Anime' | 'British' | 'International';
  description: string;
  tagline?: string;
  cast: string[];
  director: string;
  videoUrl: string;
  trailerUrl?: string;
  featured?: boolean;
  trending?: boolean;
  top10Rank?: number;
  newRelease?: boolean;
  matchScore?: number;
}

// OTT TV Series & Episode Entities
export interface Episode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  releaseDate: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface TVSeries {
  id: string;
  title: string;
  type: 'series';
  poster: string;
  backdrop: string;
  year: number;
  rating: string;
  score: number;
  seasonsCount: number;
  genres: string[];
  language: string;
  country: 'Hollywood' | 'Bollywood' | 'Korean' | 'Turkish' | 'Anime' | 'British' | 'International';
  description: string;
  cast: string[];
  creator?: string;
  seasons: Season[];
  featured?: boolean;
  trending?: boolean;
  top10Rank?: number;
  newRelease?: boolean;
  matchScore?: number;
}

export type MediaItem = Movie | TVSeries;

export interface ContinueWatchingItem {
  id: string;
  contentId: string;
  contentType: 'movie' | 'series';
  title: string;
  backdrop: string;
  poster: string;
  progressPercentage: number;
  remainingTime: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  videoUrl: string;
}

// Creator Channel Entity
export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  description: string;
  subscribersCount: number;
  subscribersCountFormatted: string;
  videosCount: number;
  verified: boolean;
  joinedDate: string;
  links?: { title: string; url: string }[];
  featuredVideoId?: string;
}

// Creator Video Entity (User-Generated Content)
export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  views: number;
  viewsFormatted: string;
  uploadDate: string;
  relativeDate: string;
  thumbnail: string;
  videoUrl: string;
  channelId: string;
  channel: Channel;
  likes: number;
  dislikes: number;
  category: VideoCategory;
  tags: string[];
  visibility: VideoVisibility;
  status?: VideoStatus;
  scheduledDate?: string;
  isShort?: boolean;
  commentsCount: number;
}

export interface Comment {
  id: string;
  videoId: string;
  videoTitle?: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isChannelOwner?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  repliesCount: number;
  replies?: Comment[];
  parentId?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  visibility: 'public' | 'unlisted' | 'private';
  videoCount: number;
  updatedAt: string;
  thumbnail: string;
  videos: Video[];
  ownerId: string;
  ownerName: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: string;
  autoplayNext: boolean;
  defaultQuality: string;
  publicSubscriptions: boolean;
  historyVisibility: boolean;
  likedVideosVisibility: boolean;
  notifyNewVideos: boolean;
  notifyReplies: boolean;
  notifyChannelUpdates: boolean;
  notifyProductUpdates: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  banner?: string;
  bio: string;
  website?: string;
  location?: string;
  channelId?: string;
  isCreator: boolean;
  preferences: UserPreferences;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'video' | 'reply' | 'short' | 'playlist' | 'system';
  timestamp: string;
  read: boolean;
  targetUrl: string;
  avatar: string;
  thumbnail?: string;
}

export interface DailyViewMetric {
  date: string;
  views: number;
  watchTimeHours: number;
}

export interface SubscriberGrowthMetric {
  date: string;
  subscribers: number;
}

export interface AnalyticsSummary {
  range: '7d' | '28d' | '90d';
  totalViews: number;
  viewsChangePercent: number;
  watchTimeHours: number;
  watchTimeChangePercent: number;
  subscribersGained: number;
  subscribersChangePercent: number;
  estimatedRevenue: number;
  revenueChangePercent: number;
  viewsTrend: DailyViewMetric[];
  subscribersTrend: SubscriberGrowthMetric[];
  topVideos: {
    id: string;
    title: string;
    thumbnail: string;
    views: number;
    avgViewDuration: string;
    impressionsCtr: string;
  }[];
  trafficSources: {
    source: string;
    percentage: number;
    views: number;
  }[];
  deviceTypes: {
    device: string;
    percentage: number;
  }[];
  audienceDemographics: {
    ageGroup: string;
    percentage: number;
  }[];
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}
