import React, { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import { Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import {
  MessageSquare,
  Search,
  CornerDownRight,
  Trash2,
  CheckCircle,
  ThumbsUp,
  Filter,
  Send,
} from 'lucide-react';
import { ConfirmationDialog } from '../../components/Modal';

export const StudioCommentsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useApp();

  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<'all' | 'unreplied'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  useEffect(() => {
    commentService.getAllStudioComments().then(setComments);
  }, []);

  const handleReplySubmit = async (commentId: string, videoId: string) => {
    if (!replyText.trim() || !user) return;

    await commentService.addComment({
      videoId,
      parentId: commentId,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isChannelOwner: true,
      },
      content: replyText.trim(),
    });

    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            repliesCount: c.repliesCount + 1,
          };
        }
        return c;
      })
    );

    setReplyingId(null);
    setReplyText('');
    addToast('Reply sent', undefined, 'success');
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    await commentService.deleteComment(commentToDelete);
    setComments(prev => prev.filter(c => c.id !== commentToDelete));
    setCommentToDelete(null);
    addToast('Comment deleted', undefined, 'info');
  };

  const filteredComments = comments.filter(c => {
    const matchesSearch =
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unreplied' && c.repliesCount === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#2A3040]/70">
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">Channel Comments</h1>
          <p className="text-xs text-[#A3AABD]">Review and respond to audience discussions across all videos</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#12151D] border border-[#2A3040]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all' ? 'bg-[#7C5CFC] text-white' : 'text-[#A3AABD] hover:text-[#F5F7FA]'
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilter('unreplied')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'unreplied' ? 'bg-[#7C5CFC] text-white' : 'text-[#A3AABD] hover:text-[#F5F7FA]'
            }`}
          >
            Unreplied ({comments.filter(c => c.repliesCount === 0).length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search comments by author or keyword..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC]"
        />
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3">
            <MessageSquare className="w-10 h-10 text-[#7C5CFC] mx-auto" />
            <h3 className="text-sm font-bold text-[#F5F7FA]">No comments found</h3>
            <p className="text-xs text-[#A3AABD]">Try adjusting your search query or filter.</p>
          </div>
        ) : (
          filteredComments.map(comment => (
            <div
              key={comment.id}
              className="p-5 rounded-2xl bg-[#181C26] border border-[#2A3040] space-y-3 hover:border-[#7C5CFC]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2A3040]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#F5F7FA] block">
                      {comment.author.name}
                    </span>
                    <span className="text-[11px] text-[#A3AABD]">
                      @{comment.author.username} · {comment.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCommentToDelete(comment.id)}
                    className="p-1.5 rounded-lg text-[#A3AABD] hover:text-[#F06464] hover:bg-[#202635] transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#F5F7FA]/90 leading-relaxed">
                {comment.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#2A3040]/60 text-xs">
                <div className="flex items-center gap-3 text-[#A3AABD]">
                  <span className="flex items-center gap-1 font-mono">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {comment.likes}
                  </span>
                  <span>·</span>
                  <span>
                    {comment.repliesCount > 0 ? (
                      <span className="text-[#35C98A] font-semibold">
                        {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                      </span>
                    ) : (
                      'No replies'
                    )}
                  </span>
                </div>

                <button
                  onClick={() => setReplyingId(replyingId === comment.id ? null : comment.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202635] hover:bg-[#2A3040] text-xs font-semibold text-[#F5F7FA] transition-colors"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-[#7C5CFC]" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Inline Reply Form */}
              {replyingId === comment.id && (
                <div className="pt-2 flex gap-2 items-center">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Reply as ${user?.name}...`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#12151D] border border-[#2A3040] text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                    autoFocus
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.id, comment.videoId)}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] disabled:opacity-50 text-white text-xs font-semibold"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                  <button
                    onClick={() => setReplyingId(null)}
                    className="px-3 py-2 text-xs text-[#A3AABD] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Comment"
        message="Are you sure you want to remove this comment from your video?"
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};
