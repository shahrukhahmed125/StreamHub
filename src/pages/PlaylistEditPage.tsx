import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Trash2, GripVertical, Save, AlertCircle } from 'lucide-react';
import { Video } from '../types';

export const PlaylistEditPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { userPlaylists, updatePlaylist, addToast } = useApp();

  const playlist = userPlaylists.find(p => p.id === playlistId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
      setDescription(playlist.description);
      setVisibility(playlist.visibility);
      setVideos(playlist.videos);
    }
  }, [playlist]);

  if (!playlist) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <AlertCircle className="w-10 h-10 text-[#F06464] mx-auto" />
        <h2 className="text-xl font-bold text-[#F5F7FA]">Playlist not found</h2>
        <Link to="/playlists" className="text-xs text-[#7C5CFC] hover:underline">
          Return to Playlists
        </Link>
      </div>
    );
  }

  const handleRemoveVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= videos.length) return;
    const copy = [...videos];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setVideos(copy);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlaylist(playlist.id, {
      title: title.trim(),
      description: description.trim(),
      visibility,
      videos,
      videoCount: videos.length,
      thumbnail: videos[0]?.thumbnail || playlist.thumbnail,
    });
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A3040]/70">
        <div className="flex items-center gap-3">
          <Link
            to={`/playlist/${playlist.id}`}
            className="p-2 rounded-xl bg-[#181C26] hover:bg-[#202635] text-[#A3AABD] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#F5F7FA]">Edit Playlist</h1>
            <p className="text-xs text-[#A3AABD]">Update details and reorder videos</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Form fields */}
        <div className="p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Playlist Title</label>
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
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Privacy</label>
            <select
              value={visibility}
              onChange={e => setVisibility(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Video reordering list */}
        <div className="p-6 rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA]">
            Playlist Videos ({videos.length})
          </h3>

          <div className="space-y-2">
            {videos.length === 0 ? (
              <p className="text-xs text-[#A3AABD] py-4 text-center">No videos in playlist.</p>
            ) : (
              videos.map((video, idx) => (
                <div
                  key={video.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#181C26] border border-[#2A3040] justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-[#A3AABD] w-6 text-center">
                      {idx + 1}
                    </span>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 aspect-video rounded-lg object-cover shrink-0 border border-[#2A3040]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#F5F7FA] truncate">{video.title}</p>
                      <p className="text-[11px] text-[#A3AABD] truncate">{video.channel.name} · {video.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveVideo(idx, 'up')}
                      className="p-1 rounded-md text-[#A3AABD] hover:text-white disabled:opacity-30 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === videos.length - 1}
                      onClick={() => moveVideo(idx, 'down')}
                      className="p-1 rounded-md text-[#A3AABD] hover:text-white disabled:opacity-30 text-xs"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(video.id)}
                      className="p-1.5 rounded-lg text-[#A3AABD] hover:text-[#F06464] hover:bg-[#202635] transition-colors ml-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
