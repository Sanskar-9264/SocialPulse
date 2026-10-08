import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  postId: string;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentAPI.getComments(postId);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const addedComment = await commentAPI.addComment(postId, newComment);
      setComments((prev) => [...prev, addedComment]);
      setNewComment('');
      onCommentAdded();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onCommentDeleted();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-10"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2 bg-slate-950/40 rounded-xl border border-slate-800/40">
          <Link to="/login" className="text-indigo-400 hover:underline">Log in</Link> to leave a comment.
        </p>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="text-xs text-slate-500 text-center py-2">Loading comments...</div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 pl-2 sm:pl-4">
          {comments.map((comment) => {
            const isCommentAuthor =
              user && (user.id === comment.author._id || user._id === comment.author._id || user.id === comment.author.id);

            return (
              <div key={comment._id} className="flex gap-3 group">
                <Link to={`/user/${comment.author.username}`}>
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700 mt-0.5"
                  />
                </Link>
                <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-2xl px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/user/${comment.author.username}`}
                      className="text-xs font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
                    >
                      {comment.author.name} <span className="text-slate-500 font-normal">@{comment.author.username}</span>
                    </Link>
                    {isCommentAuthor && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-slate-500 text-center py-2">No comments yet. Be the first to reply!</div>
      )}
    </div>
  );
};
