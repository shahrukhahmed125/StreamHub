import { AnalyticsSummary } from '../types';
import { MOCK_ANALYTICS } from '../data/mockData';

class AnalyticsService {
  async getAnalytics(range: '7d' | '28d' | '90d' = '28d'): Promise<AnalyticsSummary> {
    return MOCK_ANALYTICS[range];
  }
}

export const analyticsService = new AnalyticsService();
