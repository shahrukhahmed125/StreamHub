import { Channel } from '../types';
import { MOCK_CHANNELS } from '../data/mockData';

class ChannelService {
  private channels: Channel[] = [...MOCK_CHANNELS];

  async getChannels(): Promise<Channel[]> {
    return [...this.channels];
  }

  async getChannelById(id: string): Promise<Channel | undefined> {
    return this.channels.find(c => c.id === id || c.handle.toLowerCase() === id.toLowerCase());
  }

  async updateChannel(id: string, updates: Partial<Channel>): Promise<Channel | undefined> {
    const index = this.channels.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.channels[index] = { ...this.channels[index], ...updates };
    return this.channels[index];
  }
}

export const channelService = new ChannelService();
