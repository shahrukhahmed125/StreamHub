import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Bell, Save } from 'lucide-react';

export const NotificationPreferencesPage: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const { addToast } = useApp();

  const [notifyNewVideos, setNotifyNewVideos] = useState(
    user?.preferences.notifyNewVideos ?? true
  );
  const [notifyReplies, setNotifyReplies] = useState(
    user?.preferences.notifyReplies ?? true
  );
  const [notifyChannelUpdates, setNotifyChannelUpdates] = useState(
    user?.preferences.notifyChannelUpdates ?? true
  );
  const [notifyProductUpdates, setNotifyProductUpdates] = useState(
    user?.preferences.notifyProductUpdates ?? false
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      notifyNewVideos,
      notifyReplies,
      notifyChannelUpdates,
      notifyProductUpdates,
    });
    addToast('Notification preferences saved', undefined, 'success');
  };

  return (
    <div className="p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-6">
      <div className="pb-3 border-b border-[#2A3040]/60">
        <h2 className="text-base font-bold text-[#F5F7FA]">Notification Preferences</h2>
        <p className="text-xs text-[#A3AABD]">Select what notifications you receive via in-app alerts and notifications</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181C26] border border-[#2A3040]">
          <div>
            <p className="text-xs font-bold text-[#F5F7FA]">Subscriptions Activity</p>
            <p className="text-[11px] text-[#A3AABD] mt-0.5">
              Notify me when channels I subscribe to upload new videos or live streams.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifyNewVideos}
            onChange={e => setNotifyNewVideos(e.target.checked)}
            className="w-4 h-4 rounded-md accent-[#7C5CFC]"
          />
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181C26] border border-[#2A3040]">
          <div>
            <p className="text-xs font-bold text-[#F5F7FA]">Replies to my comments</p>
            <p className="text-[11px] text-[#A3AABD] mt-0.5">
              Alert me when someone replies to my comments or mentions my username.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifyReplies}
            onChange={e => setNotifyReplies(e.target.checked)}
            className="w-4 h-4 rounded-md accent-[#7C5CFC]"
          />
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181C26] border border-[#2A3040]">
          <div>
            <p className="text-xs font-bold text-[#F5F7FA]">Channel & Studio Milestones</p>
            <p className="text-[11px] text-[#A3AABD] mt-0.5">
              Updates on subscriber milestones and performance summaries.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifyChannelUpdates}
            onChange={e => setNotifyChannelUpdates(e.target.checked)}
            className="w-4 h-4 rounded-md accent-[#7C5CFC]"
          />
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181C26] border border-[#2A3040]">
          <div>
            <p className="text-xs font-bold text-[#F5F7FA]">StreamHub Product Announcements</p>
            <p className="text-[11px] text-[#A3AABD] mt-0.5">
              Receive news about new creator tools and platform feature releases.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifyProductUpdates}
            onChange={e => setNotifyProductUpdates(e.target.checked)}
            className="w-4 h-4 rounded-md accent-[#7C5CFC]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
