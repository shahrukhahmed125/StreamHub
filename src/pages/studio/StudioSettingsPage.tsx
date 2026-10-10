import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { VideoCategory, VideoVisibility } from '../../types';

export const StudioSettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [defaultVisibility, setDefaultVisibility] = useState<VideoVisibility>('public');
  const [defaultCategory, setDefaultCategory] = useState<VideoCategory>('Technology');
  const [commentModeration, setCommentModeration] = useState('hold-review');
  const [allowEmbedding, setAllowEmbedding] = useState(true);
  const [notifySubscribersByDefault, setNotifySubscribersByDefault] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Studio settings updated', 'Upload defaults and comment moderation saved', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#2A3040]/70">
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Studio Settings</h1>
          <p className="text-xs text-[#A3AABD]">Configure upload defaults, comment filters, and channel preferences</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Upload Defaults */}
        <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Upload Defaults</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Default Visibility</label>
              <select
                value={defaultVisibility}
                onChange={e => setDefaultVisibility(e.target.value as VideoVisibility)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Default Category</label>
              <select
                value={defaultCategory}
                onChange={e => setDefaultCategory(e.target.value as VideoCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              >
                {['Technology', 'Gaming', 'Education', 'Science', 'Music', 'Entertainment', 'News', 'Business'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-[#A3AABD]">
              <input
                type="checkbox"
                checked={notifySubscribersByDefault}
                onChange={e => setNotifySubscribersByDefault(e.target.checked)}
                className="w-4 h-4 rounded-md accent-[#7C5CFC]"
              />
              <span className="text-[#F5F7FA]">Publish to subscriptions feed and notify subscribers</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-[#A3AABD]">
              <input
                type="checkbox"
                checked={allowEmbedding}
                onChange={e => setAllowEmbedding(e.target.checked)}
                className="w-4 h-4 rounded-md accent-[#7C5CFC]"
              />
              <span className="text-[#F5F7FA]">Allow video embedding on third-party sites</span>
            </label>
          </div>
        </div>

        {/* Comment Moderation Defaults */}
        <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Comment Moderation</h3>

          <div className="space-y-3">
            {[
              { id: 'allow-all', label: 'Allow all comments', desc: 'All viewer comments appear immediately on your videos.' },
              { id: 'hold-review', label: 'Hold potentially inappropriate comments for review', desc: 'Filtered comments require creator approval before becoming public.' },
              { id: 'disable', label: 'Disable comments', desc: 'Viewers cannot leave new comments on your videos.' },
            ].map(item => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  commentModeration === item.id
                    ? 'bg-[#12151D] border-[#7C5CFC]'
                    : 'bg-[#12151D]/60 border-[#2A3040] hover:bg-[#12151D]'
                }`}
              >
                <input
                  type="radio"
                  name="moderation"
                  value={item.id}
                  checked={commentModeration === item.id}
                  onChange={() => setCommentModeration(item.id)}
                  className="mt-1 accent-[#7C5CFC]"
                />
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] block">{item.label}</span>
                  <span className="text-[11px] text-[#A3AABD] mt-0.5 block">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
