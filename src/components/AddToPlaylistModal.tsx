import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../contexts/AppContext';
import { Video } from '../types';
import { Plus, Check, Lock, Globe, EyeOff } from 'lucide-react';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const { userPlaylists, addVideoToPlaylist, removeVideoFromPlaylist, createPlaylist } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrivacy, setNewPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');

  if (!video) return null;

  const handleToggle = (playlistId: string) => {
    const pl = userPlaylists.find(p => p.id === playlistId);
    if (!pl) return;
    const exists = pl.videos.some(v => v.id === video.id);
    if (exists) {
      removeVideoFromPlaylist(playlistId, video.id);
    } else {
      addVideoToPlaylist(playlistId, video);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const pl = createPlaylist(newTitle.trim(), '', newPrivacy);
    addVideoToPlaylist(pl.id, video);
    setNewTitle('');
    setShowCreateForm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save video to playlist">
      <div className="space-y-4">
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {userPlaylists.length === 0 ? (
            <p className="text-sm text-[#A3AABD] py-3 text-center">No playlists created yet.</p>
          ) : (
            userPlaylists.map(pl => {
              const inPlaylist = pl.videos.some(v => v.id === video.id);
              return (
                <button
                  key={pl.id}
                  onClick={() => handleToggle(pl.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                    inPlaylist
                      ? 'bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-white'
                      : 'hover:bg-[#202635] text-[#F5F7FA] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        inPlaylist
                          ? 'bg-[#7C5CFC] border-[#7C5CFC] text-white'
                          : 'border-[#2A3040] bg-[#12151D]'
                      }`}
                    >
                      {inPlaylist && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{pl.title}</p>
                      <p className="text-xs text-[#A3AABD]">
                        {pl.videoCount} {pl.videoCount === 1 ? 'video' : 'videos'} · {pl.visibility}
                      </p>
                    </div>
                  </div>
                  {pl.visibility === 'private' ? (
                    <Lock className="w-4 h-4 text-[#A3AABD]" />
                  ) : pl.visibility === 'unlisted' ? (
                    <EyeOff className="w-4 h-4 text-[#A3AABD]" />
                  ) : (
                    <Globe className="w-4 h-4 text-[#A3AABD]" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#2A3040] hover:border-[#7C5CFC] text-sm font-medium text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#7C5CFC]" />
            Create new playlist
          </button>
        ) : (
          <form onSubmit={handleCreate} className="p-3.5 rounded-xl bg-[#12151D] border border-[#2A3040] space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#A3AABD] mb-1">Playlist Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-3 py-2 bg-[#181C26] border border-[#2A3040] rounded-lg text-sm text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC]"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A3AABD] mb-1">Privacy</label>
              <select
                value={newPrivacy}
                onChange={e => setNewPrivacy(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#181C26] border border-[#2A3040] rounded-lg text-sm text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1.5 text-xs text-[#A3AABD] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-medium rounded-lg"
              >
                Create & Add
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
