import { Playlist, Video } from '../types';
import { MOCK_PLAYLISTS, CURRENT_USER } from '../data/mockData';

class PlaylistService {
  private playlists: Playlist[] = [...MOCK_PLAYLISTS];

  async getPlaylists(): Promise<Playlist[]> {
    return [...this.playlists];
  }

  async getPlaylistById(id: string): Promise<Playlist | undefined> {
    return this.playlists.find(p => p.id === id);
  }

  async createPlaylist(title: string, description: string, visibility: 'public' | 'unlisted' | 'private'): Promise<Playlist> {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      title,
      description,
      visibility,
      videoCount: 0,
      updatedAt: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      videos: [],
      ownerId: CURRENT_USER.id,
      ownerName: CURRENT_USER.name,
    };
    this.playlists = [newPlaylist, ...this.playlists];
    return newPlaylist;
  }

  async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const idx = this.playlists.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.playlists[idx] = { ...this.playlists[idx], ...updates, updatedAt: 'Just now' };
    return this.playlists[idx];
  }

  async deletePlaylist(id: string): Promise<boolean> {
    const initLen = this.playlists.length;
    this.playlists = this.playlists.filter(p => p.id !== id);
    return this.playlists.length < initLen;
  }

  async addVideoToPlaylist(playlistId: string, video: Video): Promise<boolean> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) return false;
    if (playlist.videos.some(v => v.id === video.id)) return false;
    playlist.videos.push(video);
    playlist.videoCount = playlist.videos.length;
    playlist.updatedAt = 'Just now';
    if (!playlist.thumbnail && video.thumbnail) {
      playlist.thumbnail = video.thumbnail;
    }
    return true;
  }

  async removeVideoFromPlaylist(playlistId: string, videoId: string): Promise<boolean> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) return false;
    playlist.videos = playlist.videos.filter(v => v.id !== videoId);
    playlist.videoCount = playlist.videos.length;
    playlist.updatedAt = 'Just now';
    return true;
  }
}

export const playlistService = new PlaylistService();
