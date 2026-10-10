import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Video, VideoVisibility } from '../../types';
import {
  Film,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
  ExternalLink,
  Lock,
  Globe,
  EyeOff,
  Clock,
  PlusCircle,
} from 'lucide-react';
import { ConfirmationDialog } from '../../components/Modal';

export const StudioContentPage: React.FC = () => {
  const { creatorVideos, deleteCreatorVideo, updateCreatorVideo, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | VideoVisibility>('all');
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const filteredVideos = creatorVideos.filter(v => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility =
      visibilityFilter === 'all' || v.visibility === visibilityFilter;
    return matchesSearch && matchesVisibility;
  });

  const handleVisibilityChange = (videoId: string, newVisibility: VideoVisibility) => {
    updateCreatorVideo(videoId, { visibility: newVisibility });
  };

  const confirmDelete = () => {
    if (!videoToDelete) return;
    deleteCreatorVideo(videoToDelete.id);
    setVideoToDelete(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#2A3040]/70">
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Channel Content</h1>
          <p className="text-xs text-[#A3AABD]">Manage your uploaded videos, live streams, and visibility status</p>
        </div>

        <Link
          to="/studio/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Video</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter videos by title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#A3AABD] font-semibold whitespace-nowrap">Visibility:</span>
          <select
            value={visibilityFilter}
            onChange={e => setVisibilityFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
          >
            <option value="all">All Visibilities</option>
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Content Table (Desktop) / Cards (Mobile) */}
      <div className="rounded-2xl bg-[#181C26] border border-[#2A3040] overflow-hidden shadow-xl">
        {filteredVideos.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Film className="w-10 h-10 text-[#7C5CFC] mx-auto" />
            <h3 className="text-sm font-bold text-[#F5F7FA]">No content found</h3>
            <p className="text-xs text-[#A3AABD] max-w-sm mx-auto">
              No videos matched your filter or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12151D] border-b border-[#2A3040] text-[#A3AABD] font-semibold">
                <tr>
                  <th className="py-3 px-4 min-w-[320px]">Video</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Comments</th>
                  <th className="py-3 px-4">Likes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3040]/50">
                {filteredVideos.map(video => (
                  <tr key={video.id} className="hover:bg-[#202635]/60 transition-colors group">
                    {/* Video Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/watch/${video.id}`}
                          className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-[#2A3040]"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded-sm text-[9px] font-bold bg-black/80 text-white">
                            {video.duration}
                          </span>
                        </Link>
                        <div className="min-w-0">
                          <Link
                            to={`/studio/videos/${video.id}/edit`}
                            className="font-bold text-[#F5F7FA] hover:text-[#9278FF] transition-colors line-clamp-1 block"
                          >
                            {video.title}
                          </Link>
                          <p className="text-[11px] text-[#A3AABD] line-clamp-1 mt-0.5">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Visibility Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={video.visibility}
                        onChange={e => handleVisibilityChange(video.id, e.target.value as VideoVisibility)}
                        className="px-2 py-1 rounded-lg bg-[#12151D] border border-[#2A3040] text-[11px] font-semibold text-[#F5F7FA] focus:outline-hidden capitalize"
                      >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[#A3AABD]">
                      {video.uploadDate}
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-4 font-mono text-[#F5F7FA]">
                      {video.views.toLocaleString()}
                    </td>

                    {/* Comments */}
                    <td className="py-3.5 px-4 font-mono text-[#F5F7FA]">
                      {video.commentsCount.toLocaleString()}
                    </td>

                    {/* Likes */}
                    <td className="py-3.5 px-4 font-mono text-[#F5F7FA]">
                      {video.likes.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/studio/videos/${video.id}/edit`}
                          className="p-1.5 rounded-lg text-[#A3AABD] hover:text-white hover:bg-[#12151D] transition-colors"
                          title="Edit video"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/watch/${video.id}`}
                          className="p-1.5 rounded-lg text-[#A3AABD] hover:text-[#7C5CFC] hover:bg-[#12151D] transition-colors"
                          title="Watch preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setVideoToDelete(video)}
                          className="p-1.5 rounded-lg text-[#A3AABD] hover:text-[#F06464] hover:bg-[#12151D] transition-colors"
                          title="Delete video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!videoToDelete}
        onClose={() => setVideoToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Video"
        message={`Are you sure you want to delete "${videoToDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};
