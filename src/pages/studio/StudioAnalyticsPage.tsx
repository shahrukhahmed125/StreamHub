import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsSummary } from '../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Users,
  Smartphone,
  Globe,
  Monitor,
  Info,
} from 'lucide-react';

type AnalyticsTab = 'overview' | 'content' | 'audience';

const COLORS = ['#7C5CFC', '#35C98A', '#3B82F6', '#F59E0B', '#EC4899'];

export const StudioAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7d' | '28d' | '90d'>('28d');
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    analyticsService.getAnalytics(dateRange).then(setData);
  }, [dateRange]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3040]/70">
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Channel Analytics</h1>
          <p className="text-xs text-[#A3AABD]">Track viewer retention, traffic funnels, and reach metrics</p>
        </div>

        {/* Date Range Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#12151D] border border-[#2A3040]">
          {(['7d', '28d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                dateRange === range
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA]'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '28d' ? 'Last 28 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Prototype Metric Notice */}
      <div className="p-3.5 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 flex items-center gap-2.5 text-xs text-[#A3AABD]">
        <Info className="w-4 h-4 text-[#7C5CFC] shrink-0" />
        <span>Demonstration analytics dataset modeled for high-volume video streaming platforms.</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A3040]/70">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'content', label: 'Content Performance' },
          { key: 'audience', label: 'Audience & Devices' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as AnalyticsTab)}
            className={`px-4 py-3 text-xs font-bold transition-all relative ${
              activeTab === tab.key ? 'text-[#9278FF]' : 'text-[#A3AABD] hover:text-[#F5F7FA]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C5CFC]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-2">
              <span className="text-xs text-[#A3AABD] font-semibold">Total Views</span>
              <p className="text-2xl font-bold font-mono text-[#F5F7FA]">{data.totalViews.toLocaleString()}</p>
              <span className="text-xs text-[#35C98A]">+{data.viewsChangePercent}% this period</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-2">
              <span className="text-xs text-[#A3AABD] font-semibold">Watch Time</span>
              <p className="text-2xl font-bold font-mono text-[#F5F7FA]">{data.watchTimeHours.toLocaleString()} hrs</p>
              <span className="text-xs text-[#35C98A]">+{data.watchTimeChangePercent}% this period</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-2">
              <span className="text-xs text-[#A3AABD] font-semibold">Subscribers Gained</span>
              <p className="text-2xl font-bold font-mono text-[#F5F7FA]">+{data.subscribersGained.toLocaleString()}</p>
              <span className="text-xs text-[#35C98A]">+{data.subscribersChangePercent}% this period</span>
            </div>
          </div>

          {/* Large Views Trend Area Chart */}
          <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA]">Daily Audience Impressions</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.viewsTrend}>
                  <defs>
                    <linearGradient id="anViewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#A3AABD" fontSize={11} tickLine={false} />
                  <YAxis stroke="#A3AABD" fontSize={11} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#181C26', borderColor: '#2A3040', borderRadius: '0.75rem', fontSize: '12px' }}
                    itemStyle={{ color: '#F5F7FA' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#7C5CFC"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#anViewsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Content Performance */}
      {activeTab === 'content' && (
        <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Top Performing Content</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12151D] border-b border-[#2A3040] text-[#A3AABD]">
                <tr>
                  <th className="py-3 px-4">Video</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Avg Duration</th>
                  <th className="py-3 px-4">Impressions CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3040]/50 font-mono">
                {data.topVideos.map(vid => (
                  <tr key={vid.id} className="hover:bg-[#202635]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-20 aspect-video rounded-lg object-cover shrink-0 border border-[#2A3040]"
                        />
                        <span className="font-sans font-semibold text-[#F5F7FA] line-clamp-1">{vid.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#F5F7FA] font-bold">{vid.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#A3AABD]">{vid.avgViewDuration}</td>
                    <td className="py-3 px-4 text-[#35C98A] font-bold">{vid.impressionsCtr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Audience & Demographics */}
      {activeTab === 'audience' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA]">Traffic Sources</h3>
            <div className="space-y-3">
              {data.trafficSources.map((source, idx) => (
                <div key={source.source} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#F5F7FA]">{source.source}</span>
                    <span className="font-mono text-[#7C5CFC]">{source.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#12151D] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7C5CFC]"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Types */}
          <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FA]">Device Breakdown</h3>
            <div className="space-y-3">
              {data.deviceTypes.map(dev => (
                <div key={dev.device} className="flex items-center justify-between p-3 rounded-xl bg-[#12151D] border border-[#2A3040]">
                  <span className="text-xs font-semibold text-[#F5F7FA]">{dev.device}</span>
                  <span className="text-xs font-bold font-mono text-[#35C98A]">{dev.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
