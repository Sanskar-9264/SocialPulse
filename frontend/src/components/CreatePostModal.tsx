import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import { Post } from '../types';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const createdPost = await postAPI.createPost(content, imageUrl);
      onPostCreated(createdPost);
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      onClose();
    } catch (err) {
      console.error('Failed to create post', err);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100">Create New Post</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-3 items-start">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{user.name}</p>
              <p className="text-xs text-slate-400">@{user.username}</p>
            </div>
          </div>

          <textarea
            rows={4}
            placeholder="What's happening? Share your thoughts, ideas, or updates..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            autoFocus
          />

          {showImageInput && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-400">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Quick sample images:
                </span>
                {sampleImages.map((url, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setImageUrl(url)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2 py-0.5 rounded border border-slate-700"
                  >
                    Sample {i + 1}
                  </button>
                ))}
              </div>

              {imageUrl && (
                <div className="mt-2 relative rounded-2xl overflow-hidden border border-slate-800 max-h-48">
                  <img src={imageUrl} alt="Preview" className="w-full object-cover max-h-48" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1 bg-slate-950/80 text-slate-200 rounded-full hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/40 px-3 py-2 rounded-xl transition-colors border border-indigo-800/40"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{showImageInput ? 'Hide Image Field' : 'Add Image'}</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                {isSubmitting ? 'Publishing...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
