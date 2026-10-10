import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Video, VideoCategory, VideoVisibility } from '../../types';
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Image as ImageIcon,
  Sparkles,
  Clock,
  Layers,
} from 'lucide-react';
import { DEMO_VIDEOS } from '../../data/mockData';

type UploadStep = 1 | 2 | 3 | 4;

export const StudioUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCreatorVideo, userPlaylists, addToast } = useApp();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<UploadStep>(1);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>(DEMO_VIDEOS.sample1);

  // Form Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Technology');
  const [tagsInput, setTagsInput] = useState('quantum, silicon, hardware');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [visibility, setVisibility] = useState<VideoVisibility>('public');
  const [scheduledDate, setScheduledDate] = useState('2026-04-15T14:00');

  // Upload Progress Simulation
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({ name: file.name, size: `${sizeMb} MB` });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      try {
        const objectUrl = URL.createObjectURL(file);
        setPreviewVideoUrl(objectUrl);
      } catch {
        // fallback
      }
      setCurrentStep(2);
    }
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setThumbnailUrl(preview);
    }
  };

  const handleSimulatedPublish = () => {
    setCurrentStep(4);
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            finishUpload();
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const finishUpload = () => {
    setIsUploading(false);

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const newVideo: Video = {
      id: `vid-upload-${Date.now()}`,
      title: title.trim() || 'Untitled Video',
      description: description.trim() || 'Uploaded via StreamHub Creator Studio.',
      duration: '14:20',
      durationSeconds: 860,
      views: 1,
      viewsFormatted: '1',
      uploadDate: new Date().toISOString().split('T')[0],
      relativeDate: 'Just now',
      thumbnail: thumbnailUrl,
      videoUrl: previewVideoUrl,
      channelId: user?.channelId || 'channel-techmatrix',
      channel: {
        id: user?.channelId || 'channel-techmatrix',
        name: user?.name || 'TechMatrix Media',
        handle: user?.username ? `@${user.username}` : '@techmatrix',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        banner: '',
        description: '',
        subscribersCount: 842000,
        subscribersCountFormatted: '842K',
        videosCount: 143,
        verified: true,
        joinedDate: 'Jan 2023',
      },
      likes: 1,
      dislikes: 0,
      category,
      tags: tagsArray,
      visibility,
      status: visibility === 'scheduled' ? 'Scheduled' : 'Published',
      commentsCount: 0,
    };

    addCreatorVideo(newVideo);
    addToast('Upload successful', `"${newVideo.title}" has been added to your channel!`, 'success');
    navigate('/studio/content');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Progress Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2A3040]/70">
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Upload New Video</h1>
          <p className="text-xs text-[#A3AABD]">Prototype video ingestion workflow with local media preview</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(stepNum => (
            <div
              key={stepNum}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                currentStep === stepNum
                  ? 'bg-[#7C5CFC] text-white'
                  : currentStep > stepNum
                  ? 'bg-[#35C98A]/20 text-[#35C98A]'
                  : 'bg-[#181C26] text-[#A3AABD]'
              }`}
            >
              <span>{stepNum}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: File Selection Dropzone */}
      {currentStep === 1 && (
        <div className="p-12 rounded-3xl bg-[#12151D] border-2 border-dashed border-[#2A3040] hover:border-[#7C5CFC] transition-colors text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30 shadow-xl">
            <UploadCloud className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#F5F7FA]">Drag and drop video files to upload</h3>
            <p className="text-xs text-[#A3AABD] mt-1">
              Your video will remain private until you publish it.
            </p>
          </div>

          <div className="pt-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold shadow-lg shadow-[#7C5CFC]/30 transition-all hover:scale-105"
            >
              Select Local Video File
            </button>
          </div>

          <div className="text-[11px] text-[#A3AABD]/70 pt-4 border-t border-[#2A3040]/50 max-w-sm mx-auto space-y-1">
            <p>Supported Formats: MP4, MOV, WebM</p>
            <p>Demo Limit: Up to 500 MB (simulated upload pipeline)</p>
          </div>
        </div>
      )}

      {/* Step 2: Metadata & Details */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Form */}
          <div className="md:col-span-8 p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Video Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your video a compelling title..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Tell viewers what your video is about..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as VideoCategory)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                >
                  {['Technology', 'Gaming', 'Education', 'Science', 'Music', 'Entertainment', 'News', 'Business'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. quantum, physics, hardware"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                />
              </div>
            </div>

            {/* Thumbnail upload */}
            <div>
              <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Thumbnail</label>
              <div className="flex items-center gap-4">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail Preview"
                  className="w-32 aspect-video rounded-lg object-cover border border-[#2A3040]"
                />
                <input
                  type="file"
                  ref={thumbInputRef}
                  accept="image/*"
                  onChange={handleThumbSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-medium text-[#F5F7FA]"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#7C5CFC]" />
                  <span>Upload Custom Thumbnail</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#2A3040]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1 text-xs text-[#A3AABD] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md"
              >
                <span>Next: Visibility</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="md:col-span-4 p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3">
            <span className="text-xs font-bold text-[#A3AABD] uppercase tracking-wider block">Local Media Preview</span>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2A3040]">
              <video
                src={previewVideoUrl}
                poster={thumbnailUrl}
                controls
                className="w-full h-full object-cover"
              />
            </div>
            {selectedFile && (
              <div className="text-[11px] text-[#A3AABD] font-mono space-y-1">
                <p className="truncate">File: {selectedFile.name}</p>
                <p>Size: {selectedFile.size}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Visibility & Schedule */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-6">
          <div className="pb-3 border-b border-[#2A3040]/70">
            <h2 className="text-base font-bold text-[#F5F7FA]">Visibility and Publishing</h2>
            <p className="text-xs text-[#A3AABD]">Choose when to publish and who can see your video</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'public', label: 'Public', desc: 'Everyone can search, view, and share your video instantly.' },
              { id: 'unlisted', label: 'Unlisted', desc: 'Anyone with the direct link can watch your video.' },
              { id: 'private', label: 'Private', desc: 'Only you and authorized members can view this video.' },
              { id: 'scheduled', label: 'Schedule', desc: 'Set a future release date and time for automatic publication.' },
            ].map(item => (
              <label
                key={item.id}
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  visibility === item.id
                    ? 'bg-[#181C26] border-[#7C5CFC]'
                    : 'bg-[#12151D] border-[#2A3040] hover:bg-[#181C26]'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={item.id}
                  checked={visibility === item.id}
                  onChange={() => setVisibility(item.id as VideoVisibility)}
                  className="mt-1 accent-[#7C5CFC]"
                />
                <div>
                  <span className="text-xs font-bold text-[#F5F7FA] block">{item.label}</span>
                  <span className="text-xs text-[#A3AABD] mt-0.5 block">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>

          {visibility === 'scheduled' && (
            <div className="p-4 rounded-xl bg-[#181C26] border border-[#2A3040] space-y-2">
              <label className="block text-xs font-semibold text-[#A3AABD]">Select Release Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#2A3040]">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1 text-xs text-[#A3AABD] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleSimulatedPublish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-bold shadow-lg shadow-[#7C5CFC]/30 transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Video</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Simulated Ingestion Progress */}
      {currentStep === 4 && (
        <div className="p-12 rounded-3xl bg-[#12151D] border border-[#2A3040] text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#F5F7FA]">Processing Video Ingestion</h3>
            <p className="text-xs text-[#A3AABD] mt-1">
              Frontend demonstration: Simulating high-definition transcode and asset packaging...
            </p>
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="h-3 w-full bg-[#181C26] rounded-full overflow-hidden border border-[#2A3040]">
              <div
                className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9278FF] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-[#A3AABD]">
              <span>Ingestion status</span>
              <span>{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
