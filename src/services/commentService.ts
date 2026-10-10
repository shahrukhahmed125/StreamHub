import { Comment } from '../types';
import { MOCK_COMMENTS } from '../data/mockData';

class CommentService {
  private comments: Comment[] = [...MOCK_COMMENTS];

  async getCommentsByVideoId(videoId: string): Promise<Comment[]> {
    return this.comments.filter(c => c.videoId === videoId && !c.parentId);
  }

  async getAllStudioComments(): Promise<Comment[]> {
    // Return flat list of comments with video context for studio
    return [...this.comments];
  }

  async addComment(comment: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'repliesCount'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: `comm-${Date.now()}`,
      timestamp: 'Just now',
      likes: 0,
      repliesCount: 0,
      replies: [],
    };

    if (comment.parentId) {
      const parent = this.comments.find(c => c.id === comment.parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
        parent.repliesCount += 1;
      }
    } else {
      this.comments = [newComment, ...this.comments];
    }

    return newComment;
  }

  async toggleLike(commentId: string): Promise<{ liked: boolean; likes: number }> {
    const findAndToggle = (list: Comment[]): { found: boolean; liked: boolean; likes: number } => {
      for (const c of list) {
        if (c.id === commentId) {
          c.isLiked = !c.isLiked;
          c.likes += c.isLiked ? 1 : -1;
          return { found: true, liked: !!c.isLiked, likes: c.likes };
        }
        if (c.replies && c.replies.length > 0) {
          const res = findAndToggle(c.replies);
          if (res.found) return res;
        }
      }
      return { found: false, liked: false, likes: 0 };
    };

    const res = findAndToggle(this.comments);
    return { liked: res.liked, likes: res.likes };
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const initialLen = this.comments.length;
    this.comments = this.comments.filter(c => c.id !== commentId);
    return this.comments.length < initialLen;
  }
}

export const commentService = new CommentService();
