import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Bell, CheckCheck, Trash2, Check } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#2A3040]/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F5F7FA]">Notification Center</h1>
            <p className="text-xs text-[#A3AABD]">Stay updated on creator uploads, comments, and milestones</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-[#12151D] border border-[#2A3040]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'unread'
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#A3AABD] hover:text-[#F5F7FA]'
              }`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-medium text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-[#7C5CFC]" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-3">
            <Bell className="w-10 h-10 text-[#7C5CFC] mx-auto" />
            <h3 className="text-sm font-bold text-[#F5F7FA]">No notifications to display</h3>
            <p className="text-xs text-[#A3AABD]">
              {filter === 'unread'
                ? 'You have caught up with all notifications.'
                : 'Activity and updates from your subscriptions will show up here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`group flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                !notification.read
                  ? 'bg-[#181C26] border-[#7C5CFC]/40 shadow-sm'
                  : 'bg-[#12151D] border-[#2A3040]/60 hover:bg-[#181C26]'
              }`}
              onClick={() => {
                markNotificationRead(notification.id);
                navigate(notification.targetUrl);
              }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={notification.avatar}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-[#2A3040]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#F5F7FA] truncate">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-[#7C5CFC] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#A3AABD] line-clamp-1 mt-0.5">
                    {notification.message}
                  </p>
                  <span className="text-[11px] text-[#A3AABD]/70 font-mono mt-1 block">
                    {notification.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                {notification.thumbnail && (
                  <img
                    src={notification.thumbnail}
                    alt=""
                    className="w-16 aspect-video rounded-lg object-cover border border-[#2A3040]"
                  />
                )}

                {!notification.read && (
                  <button
                    onClick={() => markNotificationRead(notification.id)}
                    className="p-1.5 rounded-lg text-[#A3AABD] hover:text-[#35C98A] hover:bg-[#202635] transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1.5 rounded-lg text-[#A3AABD] hover:text-[#F06464] hover:bg-[#202635] transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
