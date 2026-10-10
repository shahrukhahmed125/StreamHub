import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Shield, Save } from 'lucide-react';

export const PrivacySettingsPage: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const { addToast } = useApp();

  const [publicSubscriptions, setPublicSubscriptions] = useState(
    user?.preferences.publicSubscriptions ?? false
  );
  const [historyVisibility, setHistoryVisibility] = useState(
    user?.preferences.historyVisibility ?? true
  );
  const [likedVideosVisibility, setLikedVideosVisibility] = useState(
    user?.preferences.likedVideosVisibility ?? false
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      publicSubscriptions,
      historyVisibility,
      likedVideosVisibility,
    });
    addToast('Privacy preferences saved', undefined, 'success');
  };

  return (
    <div className="p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-6">
      <div className="pb-3 border-b border-[#2A3040]/60">
        <h2 className="text-base font-bold text-[#F5F7FA]">Privacy & Visibility</h2>
        <p className="text-xs text-[#A3AABD]">Control who can see your activity, subscriptions, and playlists</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181C26] border border-[#2A3040]">
            <div>
              <p className="text-xs font-bold text-[#F5F7FA]">Keep my subscriptions public</p>
              <p className="text-[11px] text-[#A3AABD] mt-0.5">
                When enabled, channels you follow are shown on your public profile.
              </p>
            </div>
            <input
              type="checkbox"
              checked={publicSubscriptions}
              onChange={e => setPublicSubscriptions(e.target.checked)}
              className="w-4 h-4 rounded-md accent-[#7C5CFC]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181C26] border border-[#2A3040]">
            <div>
              <p className="text-xs font-bold text-[#F5F7FA]">Record watch history</p>
              <p className="text-[11px] text-[#A3AABD] mt-0.5">
                Keep track of videos you watch to improve recommendations.
              </p>
            </div>
            <input
              type="checkbox"
              checked={historyVisibility}
              onChange={e => setHistoryVisibility(e.target.checked)}
              className="w-4 h-4 rounded-md accent-[#7C5CFC]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181C26] border border-[#2A3040]">
            <div>
              <p className="text-xs font-bold text-[#F5F7FA]">Keep my liked videos public</p>
              <p className="text-[11px] text-[#A3AABD] mt-0.5">
                Allow other viewers to see videos you have upvoted.
              </p>
            </div>
            <input
              type="checkbox"
              checked={likedVideosVisibility}
              onChange={e => setLikedVideosVisibility(e.target.checked)}
              className="w-4 h-4 rounded-md accent-[#7C5CFC]"
            />
          </div>
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
