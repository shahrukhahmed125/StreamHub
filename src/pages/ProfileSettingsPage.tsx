import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Save, Upload, User, Globe, MapPin, AtSign } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      website: website.trim(),
      location: location.trim(),
      avatar: avatarPreview,
    });

    addToast('Profile updated', 'Your changes have been saved', 'success');
  };

  return (
    <div className="p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-6">
      <div className="pb-3 border-b border-[#2A3040]/60">
        <h2 className="text-base font-bold text-[#F5F7FA]">Public Profile</h2>
        <p className="text-xs text-[#A3AABD]">This information will be displayed publicly across StreamHub</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Avatar edit */}
        <div className="flex items-center gap-5">
          <img
            src={avatarPreview}
            alt="Profile Avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#7C5CFC]"
          />
          <div>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#7C5CFC]" />
              <span>Change Avatar</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
            <p className="text-[11px] text-[#A3AABD] mt-1">Recommended: 400x400 PNG or JPG</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Username Handle</label>
            <div className="relative">
              <span className="text-[#A3AABD] absolute left-3 top-1/2 -translate-y-1/2 text-xs">@</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-full pl-7 pr-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Biography</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Website URL</label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-[#A3AABD] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Location</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-[#A3AABD] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
