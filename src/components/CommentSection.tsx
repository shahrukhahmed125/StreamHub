import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { commentService } from '../services/commentService';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import {
  ThumbsUp,
  MessageSquare,
  ArrowUpDown,
  CornerDownRight,
  Trash2,
  Send,
  MoreVertical,
} from 'lucide-react';

interface CommentSectionProps {
  videoId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const data = await commentService.getCommentsByVideoId(videoId);
      setComments(data);
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user) return;

    const newComment = await commentService.addComment({
      videoId,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isChannelOwner: user.id === 'user-alex-rivera',
      },
      content: newCommentText.trim(),
    });

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setIsInputFocused(false);
    addToast('Comment added', undefined, 'success');
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim() || !user) return;

    const newReply = await commentService.addComment({
      videoId,
      parentId,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isChannelOwner: user.id === 'user-alex-rivera',
      },
      content: replyText.trim(),
    });

    setComments(prev =>
      prev.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            repliesCount: c.repliesCount + 1,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );

    setReplyingToId(null);
    setReplyText('');
    addToast('Reply posted', undefined, 'success');
  };

  const handleLike = async (commentId: string) => {
    const res = await commentService.toggleLike(commentId);
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return { ...c, isLiked: res.liked, likes: res.likes };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => (r.id === commentId ? { ...r, isLiked: res.liked, likes: res.likes } : r)),
          };
        }
        return c;
      })
    );
  };

  const handleDelete = async (commentId: string) => {
    await commentService.deleteComment(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
    addToast('Comment deleted', undefined, 'info');
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.id.localeCompare(a.id);
    }
    return b.likes - a.likes;
  });

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="space-y-6 pt-4">
      {/* Header & Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#F5F7FA]">
          {totalCount} {totalCount === 1 ? 'Comment' : 'Comments'}
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy(sortBy === 'top' ? 'newest' : 'top')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs font-medium text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by: {sortBy === 'top' ? 'Top comments' : 'Newest first'}</span>
          </button>
        </div>
      </div>

      {/* Add Top-Level Comment */}
      <form onSubmit={handleAddComment} className="flex gap-3 items-start">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={user?.name || 'User'}
          className="w-10 h-10 rounded-full object-cover border border-[#2A3040] shrink-0 mt-1"
        />
        <div className="flex-1 space-y-2">
          <textarea
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            placeholder="Add a public comment..."
            rows={isInputFocused ? 3 : 1}
            className="w-full px-4 py-2.5 rounded-xl bg-[#12151D] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/60 focus:outline-hidden focus:border-[#7C5CFC] transition-all resize-none"
          />

          {isInputFocused && (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewCommentText('');
                  setIsInputFocused(false);
                }}
                className="px-4 py-2 text-xs font-medium rounded-xl text-[#A3AABD] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Comment</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 divide-y divide-[#2A3040]/50">
        {sortedComments.map(comment => (
          <div key={comment.id} className="pt-4 flex gap-3 items-start group">
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-9 h-9 rounded-full object-cover border border-[#2A3040] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#F5F7FA]">{comment.author.name}</span>
                {comment.author.isChannelOwner && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#7C5CFC]/20 text-[#9278FF] border border-[#7C5CFC]/40">
                    Creator
                  </span>
                )}
                <span className="text-[11px] text-[#A3AABD]">@{comment.author.username}</span>
                <span className="text-[11px] text-[#A3AABD]">·</span>
                <span className="text-[11px] text-[#A3AABD]">{comment.timestamp}</span>
              </div>

              <p className="text-sm text-[#F5F7FA]/90 mt-1 leading-relaxed whitespace-pre-line">
                {comment.content}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                    comment.isLiked ? 'text-[#7C5CFC]' : 'text-[#A3AABD] hover:text-[#F5F7FA]'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>

                {user?.id === comment.author.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-[#A3AABD] hover:text-[#F06464] transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Reply Form */}
              {replyingToId === comment.id && (
                <div className="mt-3 flex gap-2 items-center animate-in fade-in duration-150">
                  <CornerDownRight className="w-4 h-4 text-[#A3AABD] shrink-0" />
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Reply to @${comment.author.username}...`}
                    className="flex-1 px-3 py-1.5 bg-[#12151D] border border-[#2A3040] rounded-lg text-xs text-[#F5F7FA] focus:outline-hidden focus:border-[#7C5CFC]"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyText.trim()}
                    className="px-3 py-1.5 bg-[#7C5CFC] hover:bg-[#9278FF] disabled:opacity-50 text-white text-xs font-medium rounded-lg"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setReplyingToId(null)}
                    className="text-xs text-[#A3AABD] hover:text-white px-2"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-[#2A3040] space-y-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex gap-2.5 items-start">
                      <img
                        src={reply.author.avatar}
                        alt={reply.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#2A3040] shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-[#F5F7FA]">{reply.author.name}</span>
                          {reply.author.isChannelOwner && (
                            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-[#7C5CFC]/20 text-[#9278FF] border border-[#7C5CFC]/40">
                              Creator
                            </span>
                          )}
                          <span className="text-[10px] text-[#A3AABD]">· {reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#F5F7FA]/90 mt-0.5 leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
