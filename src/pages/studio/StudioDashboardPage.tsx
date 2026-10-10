import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsSummary, Video } from '../../types';
import { useApp } from '../../contexts/AppContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Eye,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
  BarChart3,
  Film,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const StudioDashboardPage: React.FC = () => {
  const { creatorVideos } = useApp();
  const [dateRange, setDateRange] = useState<'7d' | '28d' | '90d'>('28d');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    analyticsService.getAnalytics(dateRange).then(setAnalytics);
  }, [dateRange]);

  const latestVideo = creatorVideos[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3040]/70">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F5F7FA]">Channel Dashboard</h1>
          <p className="text-xs text-[#A3AABD] mt-0.5">
            Real-time overview of channel performance, audience retention, and latest uploads
          </p>
        </div>

        {/* Date Range Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#12151D] border border-[#2A3040] self-start sm:self-auto">
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

      {/* 4 Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Views */}
          <div className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A3AABD]">Total Views</span>
              <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-[#F5F7FA] tracking-tight">
                {analytics.totalViews.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#35C98A]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{analytics.viewsChangePercent}% vs prior period</span>
              </div>
            </div>
          </div>

          {/* Card 2: Watch Time */}
          <div className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A3AABD]">Watch Time (Hours)</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-[#F5F7FA] tracking-tight">
                {analytics.watchTimeHours.toLocaleString()} hrs
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#35C98A]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{analytics.watchTimeChangePercent}% vs prior period</span>
              </div>
            </div>
          </div>

          {/* Card 3: Subscribers */}
          <div className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A3AABD]">Subscribers Gained</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-[#F5F7FA] tracking-tight">
                +{analytics.subscribersGained.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#35C98A]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{analytics.subscribersChangePercent}% vs prior period</span>
              </div>
            </div>
          </div>

          {/* Card 4: Estimated Demo Revenue */}
          <div className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#A3AABD]">Est. Revenue</span>
                <span className="text-[10px] text-[#A3AABD]/70 font-mono">(Demo)</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-[#F5F7FA] tracking-tight">
                ${analytics.estimatedRevenue.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#35C98A]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{analytics.revenueChangePercent}% demonstration model</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Row */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Views Trend Area Chart */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FA]">Views & Watch Time Trajectory</h3>
                <p className="text-xs text-[#A3AABD]">Aggregated daily audience impressions</p>
              </div>
              <Link
                to="/studio/analytics"
                className="text-xs font-semibold text-[#7C5CFC] hover:underline flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.viewsTrend}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#viewsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscriber Growth Line Chart */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#F5F7FA]">Total Subscribers</h3>
              <p className="text-xs text-[#A3AABD]">Cumulative subscriber channel count</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.subscribersTrend}>
                  <XAxis dataKey="date" stroke="#A3AABD" fontSize={10} tickLine={false} />
                  <YAxis stroke="#A3AABD" fontSize={10} tickLine={false} domain={['dataMin - 2000', 'dataMax + 2000']} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#181C26', borderColor: '#2A3040', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#35C98A"
                    strokeWidth={2.5}
                    dot={{ fill: '#35C98A', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Latest Video Spotlight & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Upload Performance */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F5F7FA]">Latest Published Video</h3>
            <Link
              to="/studio/content"
              className="text-xs font-semibold text-[#7C5CFC] hover:underline"
            >
              Manage all videos
            </Link>
          </div>

          {latestVideo ? (
            <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl bg-[#12151D] border border-[#2A3040]">
              <img
                src={latestVideo.thumbnail}
                alt={latestVideo.title}
                className="w-full sm:w-44 aspect-video rounded-lg object-cover border border-[#2A3040]"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F5F7FA] line-clamp-1">{latestVideo.title}</h4>
                  <p className="text-xs text-[#A3AABD] mt-1 font-mono">
                    {latestVideo.viewsFormatted} views · {latestVideo.likes.toLocaleString()} likes · {latestVideo.commentsCount} comments
                  </p>
                  <p className="text-xs text-[#A3AABD] mt-1">Status: <span className="text-[#35C98A] font-semibold">Published</span></p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/studio/videos/${latestVideo.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-[#202635] hover:bg-[#2A3040] text-xs font-semibold text-white transition-colors"
                  >
                    Edit details
                  </Link>
                  <Link
                    to={`/watch/${latestVideo.id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#9278FF] text-xs font-semibold text-white transition-colors"
                  >
                    View on StreamHub
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#A3AABD]">No videos published yet.</p>
          )}
        </div>

        {/* Quick Studio Actions */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Quick Creator Actions</h3>

          <div className="space-y-2.5">
            <Link
              to="/studio/upload"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#12151D] hover:bg-[#202635] border border-[#2A3040] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <PlusCircle className="w-5 h-5 text-[#7C5CFC]" />
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] block">Upload New Video</span>
                  <span className="text-[11px] text-[#A3AABD]">Publish video to your channel</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A3AABD] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/studio/customization"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#12151D] hover:bg-[#202635] border border-[#2A3040] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#7C5CFC]" />
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] block">Customize Channel</span>
                  <span className="text-[11px] text-[#A3AABD]">Update banner, trailer, and branding</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A3AABD] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/studio/comments"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#12151D] hover:bg-[#202635] border border-[#2A3040] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#7C5CFC]" />
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] block">Review Comments</span>
                  <span className="text-[11px] text-[#A3AABD]">Engage with your audience</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A3AABD] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
