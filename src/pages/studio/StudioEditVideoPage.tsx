import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Video, VideoCategory, VideoVisibility } from '../../types';
import { ArrowLeft, Save, Trash2, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ConfirmationDialog } from '../../components/Modal';

export const StudioEditVideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { creatorVideos, updateCreatorVideo, deleteCreatorVideo, addToast } = useApp();

  const video = creatorVideos.find(v => v.id === videoId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<VideoVisibility>('public');
  const [thumbnail, setThumbnail] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
      setCategory(video.category);
      setTagsInput(video.tags.join(', '));
      setVisibility(video.visibility);
      setThumbnail(video.thumbnail);
    }
  }, [video]);

  if (!video) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <AlertCircle className="w-10 h-10 text-[#F06464] mx-auto" />
        <h2 className="text-xl font-bold text-[#F5F7FA]">Video not found</h2>
        <Link to="/studio/content" className="text-xs text-[#7C5CFC] hover:underline">
          Return to Content
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    updateCreatorVideo(video.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tagsArray,
      visibility,
      thumbnail,
    });

    navigate('/studio/content');
  };

  const handleDelete = () => {
    deleteCreatorVideo(video.id);
    navigate('/studio/content');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2A3040]/70">
        <div className="flex items-center gap-3">
          <Link
            to="/studio/content"
            className="p-2 rounded-xl bg-[#181C26] hover:bg-[#202635] text-[#A3AABD] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#F5F7FA]">Video Details</h1>
            <p className="text-xs text-[#A3AABD]">Edit metadata, visibility, and audience settings</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/watch/${video.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#A3AABD] hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Watch Preview</span>
          </Link>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl bg-[#181C26] hover:bg-[#F06464]/20 border border-[#2A3040] text-[#A3AABD] hover:text-[#F06464] transition-colors"
            title="Delete video"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Fields */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
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
                className="w-full px-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Visibility</label>
            <select
              value={visibility}
              onChange={e => setVisibility(e.target.value as VideoVisibility)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A3040]">
            <Link
              to="/studio/content"
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A3AABD] hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Right: Video Card Preview */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-4 h-fit sticky top-20">
          <span className="text-xs font-bold text-[#A3AABD] uppercase tracking-wider block">Video Preview</span>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2A3040]">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 text-xs text-[#A3AABD] font-mono">
            <div className="flex justify-between py-1 border-b border-[#2A3040]">
              <span>Views:</span>
              <span className="text-white font-bold">{video.views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2A3040]">
              <span>Likes:</span>
              <span className="text-white font-bold">{video.likes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2A3040]">
              <span>Comments:</span>
              <span className="text-white font-bold">{video.commentsCount}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Duration:</span>
              <span className="text-white font-bold">{video.duration}</span>
            </div>
          </div>
        </div>
      </form>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Video"
        message={`Are you sure you want to delete "${video.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};
