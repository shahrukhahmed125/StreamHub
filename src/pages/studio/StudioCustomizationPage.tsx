import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Palette, Upload, Save, CheckCircle2, Video, Globe, AtSign } from 'lucide-react';

export const StudioCustomizationPage: React.FC = () => {
  const { channelCustomization, updateChannelCustomization, creatorVideos, addToast } = useApp();

  const [name, setName] = useState(channelCustomization.name);
  const [handle, setHandle] = useState(channelCustomization.handle);
  const [description, setDescription] = useState(channelCustomization.description);
  const [avatar, setAvatar] = useState(channelCustomization.avatar);
  const [banner, setBanner] = useState(channelCustomization.banner);
  const [accentColor, setAccentColor] = useState(channelCustomization.accentColor);
  const [featuredVideoId, setFeaturedVideoId] = useState(channelCustomization.featuredVideoId || '');

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(URL.createObjectURL(file));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateChannelCustomization({
      name: name.trim(),
      handle: handle.trim(),
      description: description.trim(),
      avatar,
      banner,
      accentColor,
      featuredVideoId,
    });
    addToast('Channel customization saved', 'Public channel page has been updated', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A3040]/70">
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Channel Customization</h1>
          <p className="text-xs text-[#A3AABD]">Personalize your channel branding, layout, and featured presentation</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Publish Changes</span>
        </button>
      </div>

      {/* Live Header Preview */}
      <div className="p-4 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-3">
        <span className="text-xs font-bold text-[#A3AABD] uppercase tracking-wider block">Live Header Preview</span>
        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black border border-[#2A3040]">
          <img src={banner} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-4 flex items-center gap-3">
            <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white" />
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                {name} <CheckCircle2 className="w-3.5 h-3.5 text-[#7C5CFC]" />
              </p>
              <p className="text-xs text-white/80 font-mono">{handle}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding Assets */}
        <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-5">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Branding & Imagery</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar Upload */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#A3AABD] block">Profile Picture</span>
              <div className="flex items-center gap-4">
                <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-[#2A3040]" />
                <label className="px-3.5 py-2 rounded-xl bg-[#12151D] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 inline mr-1.5 text-[#7C5CFC]" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                </label>
              </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#A3AABD] block">Banner Image</span>
              <div className="flex items-center gap-4">
                <img src={banner} alt="Banner" className="w-24 h-14 rounded-lg object-cover border border-[#2A3040]" />
                <label className="px-3.5 py-2 rounded-xl bg-[#12151D] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 inline mr-1.5 text-[#7C5CFC]" />
                  <span>Upload Banner</span>
                  <input type="file" accept="image/*" onChange={handleBannerFile} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Basic Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Channel Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Handle</label>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Channel Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC] resize-none"
            />
          </div>
        </div>

        {/* Featured Content Assignment */}
        <div className="p-6 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">Featured Video Spotlight</h3>
          <p className="text-xs text-[#A3AABD]">Select which of your videos appears at the top of your channel home tab.</p>

          <select
            value={featuredVideoId}
            onChange={e => setFeaturedVideoId(e.target.value)}
            className="w-full max-w-md px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
          >
            {creatorVideos.map(vid => (
              <option key={vid.id} value={vid.id}>
                {vid.title} ({vid.duration})
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};
