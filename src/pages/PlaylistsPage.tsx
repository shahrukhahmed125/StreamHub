import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { PlaylistCard } from '../components/PlaylistCard';
import { ListVideo, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';

export const PlaylistsPage: React.FC = () => {
  const { userPlaylists, createPlaylist } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrivacy, setNewPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim(), newDescription.trim(), newPrivacy);
    setNewTitle('');
    setNewDescription('');
    setCreateModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A3040]/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30">
            <ListVideo className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F5F7FA]">Your Playlists</h1>
            <p className="text-xs text-[#A3AABD]">Organize and manage your video collections</p>
          </div>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Playlist Grid */}
      {userPlaylists.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#12151D] border border-[#2A3040] space-y-3">
          <ListVideo className="w-12 h-12 text-[#7C5CFC] mx-auto" />
          <h3 className="text-base font-bold text-[#F5F7FA]">No playlists found</h3>
          <p className="text-xs text-[#A3AABD] max-w-sm mx-auto">
            Create playlists to organize tutorials, music tracks, or your favorite videos.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold rounded-xl"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {userPlaylists.map(playlist => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Playlist">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Playlist Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Distributed Systems Masterclass"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC]"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Description (optional)</label>
            <textarea
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Give your playlist a description..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Privacy</label>
            <select
              value={newPrivacy}
              onChange={e => setNewPrivacy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151D] border border-[#2A3040] text-sm text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
            >
              <option value="public">Public - Anyone can search and view</option>
              <option value="unlisted">Unlisted - Anyone with the link can view</option>
              <option value="private">Private - Only you can view</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl text-[#A3AABD] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white shadow-md"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
