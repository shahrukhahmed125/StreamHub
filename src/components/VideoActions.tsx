import React, { useState } from 'react';
import { Video } from '../types';
import { useApp } from '../contexts/AppContext';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  Clock,
  Check,
  Copy,
} from 'lucide-react';
import { AddToPlaylistModal } from './AddToPlaylistModal';
import { Modal } from './Modal';

interface VideoActionsProps {
  video: Video;
}

export const VideoActions: React.FC<VideoActionsProps> = ({ video }) => {
  const {
    isLiked,
    isDisliked,
    toggleLikeVideo,
    toggleDislikeVideo,
    isSavedWatchLater,
    toggleWatchLater,
    addToast,
  } = useApp();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content');

  const liked = isLiked(video.id);
  const disliked = isDisliked(video.id);
  const savedWatchLater = isSavedWatchLater(video.id);

  // Compute live displayed likes
  const displayLikes = video.likes + (liked ? 1 : 0);

  const shareUrl = `${window.location.origin}/watch/${video.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      addToast('Link copied to clipboard', undefined, 'success');
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      addToast('Share link', shareUrl, 'info');
    });
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportModalOpen(false);
    addToast('Report submitted', 'Thank you. Our moderation team will review this video.', 'info');
  };

  return (
    <>
      <div className="flex items-center flex-wrap gap-2">
        {/* Like / Dislike Segmented Pill */}
        <div className="flex items-center bg-[#181C26] border border-[#2A3040] rounded-xl overflow-hidden">
          <button
            onClick={() => toggleLikeVideo(video.id)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-[#202635] ${
              liked ? 'text-[#7C5CFC]' : 'text-[#F5F7FA]'
            }`}
            aria-label="Like video"
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-[#7C5CFC]' : ''}`} />
            <span>{displayLikes.toLocaleString()}</span>
          </button>
          <div className="w-[1px] h-5 bg-[#2A3040]" />
          <button
            onClick={() => toggleDislikeVideo(video.id)}
            className={`px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#202635] ${
              disliked ? 'text-[#F06464]' : 'text-[#A3AABD] hover:text-[#F5F7FA]'
            }`}
            aria-label="Dislike video"
          >
            <ThumbsDown className={`w-4 h-4 ${disliked ? 'fill-[#F06464]' : ''}`} />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={() => setShareModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] transition-colors"
        >
          <Share2 className="w-4 h-4 text-[#A3AABD]" />
          <span>Share</span>
        </button>

        {/* Watch Later */}
        <button
          onClick={() => toggleWatchLater(video)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
            savedWatchLater
              ? 'bg-[#7C5CFC]/15 border-[#7C5CFC]/40 text-[#9278FF]'
              : 'bg-[#181C26] hover:bg-[#202635] border-[#2A3040] text-[#F5F7FA]'
          }`}
          title="Save to Watch Later"
        >
          <Clock className="w-4 h-4" />
          <span>{savedWatchLater ? 'Saved' : 'Watch Later'}</span>
        </button>

        {/* Save to Playlist */}
        <button
          onClick={() => setPlaylistModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-semibold text-[#F5F7FA] transition-colors"
        >
          <Bookmark className="w-4 h-4 text-[#A3AABD]" />
          <span>Save</span>
        </button>

        {/* Report Button */}
        <button
          onClick={() => setReportModalOpen(true)}
          className="p-2 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-[#A3AABD] hover:text-[#F06464] transition-colors"
          title="Report video"
          aria-label="Report video"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Share Dialog */}
      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share this video">
        <div className="space-y-4">
          <p className="text-xs text-[#A3AABD]">Copy the link below to share this video with others:</p>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#12151D] border border-[#2A3040]">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-[#F5F7FA] focus:outline-hidden font-mono px-2"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-[#35C98A] text-white'
                  : 'bg-[#7C5CFC] hover:bg-[#9278FF] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report video">
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <p className="text-xs text-[#A3AABD]">Select the issue with this video:</p>
          <div className="space-y-2">
            {[
              'Inappropriate or offensive content',
              'Spam or misleading information',
              'Violates intellectual property',
              'Harassment or harmful acts',
            ].map(reason => (
              <label key={reason} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#202635] cursor-pointer text-xs text-[#F5F7FA]">
                <input
                  type="radio"
                  name="reportReason"
                  checked={reportReason === reason}
                  onChange={() => setReportReason(reason)}
                  className="accent-[#7C5CFC]"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl text-[#A3AABD] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#F06464] hover:bg-[#F06464]/80 text-white"
            >
              Submit Report
            </button>
          </div>
        </form>
      </Modal>

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        video={video}
      />
    </>
  );
};
