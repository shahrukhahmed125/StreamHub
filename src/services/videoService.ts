import { Video, VideoCategory } from '../types';
import { MOCK_VIDEOS } from '../data/mockData';

export interface VideoFilterOptions {
  category?: VideoCategory | string;
  searchQuery?: string;
  sortBy?: 'relevance' | 'date' | 'views';
  duration?: 'any' | 'short' | 'medium' | 'long';
  uploadDate?: 'any' | 'today' | 'week' | 'month' | 'year';
  channelId?: string;
  excludeId?: string;
}

class VideoService {
  private videos: Video[] = [...MOCK_VIDEOS];

  async getVideos(options?: VideoFilterOptions): Promise<Video[]> {
    let result = [...this.videos];

    if (options?.excludeId) {
      result = result.filter(v => v.id !== options.excludeId);
    }

    if (options?.channelId) {
      result = result.filter(v => v.channelId === options.channelId);
    }

    if (options?.category && options.category !== 'All') {
      result = result.filter(v => v.category.toLowerCase() === options.category?.toLowerCase());
    }

    if (options?.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter(v => 
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.channel.name.toLowerCase().includes(q) ||
        v.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (options?.duration && options.duration !== 'any') {
      if (options.duration === 'short') {
        result = result.filter(v => v.durationSeconds < 240);
      } else if (options.duration === 'medium') {
        result = result.filter(v => v.durationSeconds >= 240 && v.durationSeconds <= 1200);
      } else if (options.duration === 'long') {
        result = result.filter(v => v.durationSeconds > 1200);
      }
    }

    if (options?.sortBy) {
      if (options.sortBy === 'views') {
        result.sort((a, b) => b.views - a.views);
      } else if (options.sortBy === 'date') {
        result.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      }
    }

    return result;
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    return this.videos.find(v => v.id === id);
  }

  async getTrendingVideos(type: 'all' | 'week' | 'views' = 'all'): Promise<Video[]> {
    const list = [...this.videos].filter(v => !v.isShort);
    if (type === 'views') {
      return list.sort((a, b) => b.views - a.views);
    }
    if (type === 'week') {
      return list.sort((a, b) => b.likes - a.likes);
    }
    return list.sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2));
  }

  async getShorts(): Promise<Video[]> {
    return this.videos.filter(v => v.isShort);
  }

  async getRelatedVideos(videoId: string, category: VideoCategory, limit: number = 8): Promise<Video[]> {
    const related = this.videos.filter(v => v.id !== videoId && !v.isShort);
    const sameCategory = related.filter(v => v.category === category);
    const other = related.filter(v => v.category !== category);
    return [...sameCategory, ...other].slice(0, limit);
  }

  async addVideo(video: Video): Promise<Video> {
    this.videos = [video, ...this.videos];
    return video;
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined> {
    const index = this.videos.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    this.videos[index] = { ...this.videos[index], ...updates };
    return this.videos[index];
  }

  async deleteVideo(id: string): Promise<boolean> {
    const initialLen = this.videos.length;
    this.videos = this.videos.filter(v => v.id !== id);
    return this.videos.length < initialLen;
  }
}

export const videoService = new VideoService();
