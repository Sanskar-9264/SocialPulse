import React, { useState, useEffect } from 'react';
import { Post, User } from '../types';
import { postAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { UserCard } from '../components/UserCard';
import { PlusSquare, Sparkles, Users, Globe } from 'lucide-react';

interface HomeFeedProps {
  onOpenCreatePost: () => void;
  feedRefreshTrigger: number;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ onOpenCreatePost, feedRefreshTrigger }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const postsData = await postAPI.getPosts(filter);
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching feed posts', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggested = async () => {
    try {
      const usersData = await userAPI.getSuggestedUsers();
      setSuggestedUsers(usersData);
    } catch (err) {
      console.error('Error fetching suggested users', err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [filter, feedRefreshTrigger, user]);

  useEffect(() => {
    fetchSuggested();
  }, [user]);

  const handlePostDeleted = (deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed Column (2 cols wide on large screens) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Post Prompt Bar */}
        {user && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex items-center gap-3 shadow-lg">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <button
              onClick={onOpenCreatePost}
              className="flex-1 text-left bg-slate-950/70 hover:bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-full px-4 py-2.5 text-sm transition-all"
            >
              What's on your mind, {user.name.split(' ')[0]}?
            </button>
            <button
              onClick={onOpenCreatePost}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shrink-0"
            >
              <PlusSquare className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Feed Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Posts</span>
            </button>
            {user && (
              <button
                onClick={() => setFilter('following')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === 'following'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Following</span>
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {/* Feed Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="h-3 bg-slate-800/60 rounded w-1/6" />
                  </div>
                </div>
                <div className="h-12 bg-slate-800/40 rounded-xl" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-indigo-400 mx-auto opacity-70" />
            <h3 className="text-base font-semibold text-slate-200">No posts to display</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === 'following'
                ? "You aren't following anyone yet or your followed users haven't posted. Explore suggested users!"
                : 'Be the first person to publish a post on SocialPulse!'}
            </p>
          </div>
        )}
      </div>

      {/* Suggested Users Sidebar (1 col wide on large screens) */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 sticky top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Suggested Creators
            </h3>
          </div>

          {suggestedUsers.length > 0 ? (
            <div className="space-y-3">
              {suggestedUsers.map((u) => (
                <UserCard key={u._id || u.id} user={u} onFollowToggled={fetchFeed} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No new user recommendations right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};
