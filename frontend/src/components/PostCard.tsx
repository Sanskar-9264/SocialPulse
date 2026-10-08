import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import { CommentSection } from './CommentSection';
import { Heart, MessageCircle, Trash2, Share2 } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post: initialPost, onPostDeleted }) => {
  const { user } = useAuth();
  const [post, setPost] = useState<Post>(initialPost);
  const [isLiked, setIsLiked] = useState<boolean>(!!initialPost.isLiked);
  const [likesCount, setLikesCount] = useState<number>(initialPost.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState<number>(initialPost.commentsCount || 0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const isAuthor = user && (user.id === post.author._id || user._id === post.author._id || user.id === post.author.id);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like posts!');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;
    setIsLiked(!previousIsLiked);
    setLikesCount(previousIsLiked ? previousLikesCount - 1 : previousLikesCount + 1);

    try {
      const res = await postAPI.toggleLike(post._id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch (error) {
      // Rollback on error
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
      console.error('Like toggle failed', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await postAPI.deletePost(post._id);
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (error) {
      console.error('Delete post failed', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <article className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 shadow-lg hover:border-slate-700/80 transition-all duration-200">
      {/* Post Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link to={`/user/${post.author.username}`} className="flex items-center gap-3 group">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors"
          />
          <div>
            <h4 className="font-semibold text-slate-100 text-base leading-tight group-hover:text-indigo-400 transition-colors">
              {post.author.name}
            </h4>
            <p className="text-xs text-slate-400">
              @{post.author.username} • {formatDate(post.createdAt)}
            </p>
          </div>
        </Link>

        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete post"
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Post Content */}
      <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4">
        {post.content}
      </p>

      {/* Media Image */}
      {post.image && (
        <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950">
          <img
            src={post.image}
            alt="Post media"
            className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Actions & Counters Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-slate-400">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isLiked ? 'text-rose-500' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''} transition-transform`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm font-medium hover:text-indigo-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{commentsCount}</span>
          </button>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            alert('Post link copied to clipboard!');
          }}
          className="p-2 hover:text-slate-200 hover:bg-slate-800/50 rounded-full transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <CommentSection
            postId={post._id}
            onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
            onCommentDeleted={() => setCommentsCount((prev) => Math.max(0, prev - 1))}
          />
        </div>
      )}
    </article>
  );
};
