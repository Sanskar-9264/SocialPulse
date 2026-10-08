import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Post } from '../types';
import { userAPI, postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { EditProfileModal } from '../components/EditProfileModal';
import { Calendar, Edit3, UserPlus, UserCheck, Layers, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfileData = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const userData = await userAPI.getProfile(username);
      setProfileUser(userData);
      setIsFollowing(!!userData.isFollowing);
      setFollowersCount(userData.stats?.followersCount || 0);

      const postsData = await postAPI.getUserPosts(username);
      setUserPosts(postsData);
    } catch (err) {
      console.error('Error loading profile page', err);
      setProfileUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username, currentUser]);

  const isSelf =
    currentUser && profileUser && (currentUser.username === profileUser.username || currentUser.id === profileUser.id);

  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser) {
      alert('Please log in to follow users');
      return;
    }

    try {
      const res = await userAPI.toggleFollow(profileUser.id || (profileUser._id as string));
      setIsFollowing(res.isFollowing);
      setFollowersCount(res.followersCount);
    } catch (err) {
      console.error('Follow toggle error', err);
    }
  };

  const handlePostDeleted = (deletedId: string) => {
    setUserPosts((prev) => prev.filter((p) => p._id !== deletedId));
    if (profileUser && profileUser.stats) {
      setProfileUser({
        ...profileUser,
        stats: {
          ...profileUser.stats,
          postsCount: Math.max(0, profileUser.stats.postsCount - 1),
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 bg-slate-800 rounded-3xl" />
        <div className="flex gap-4 items-end px-6 -mt-16">
          <div className="w-24 h-24 bg-slate-700 rounded-full border-4 border-slate-900" />
          <div className="space-y-2 flex-1 pb-2">
            <div className="h-6 bg-slate-800 rounded w-1/3" />
            <div className="h-4 bg-slate-800/60 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-xl mx-auto text-center bg-slate-900 border border-slate-800 rounded-3xl p-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">User Not Found</h2>
        <p className="text-sm text-slate-400">The requested profile @{username} does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Banner & Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Cover Header Image */}
        <div className="h-48 sm:h-64 relative bg-slate-950">
          <img
            src={profileUser.coverImage || 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80'}
            alt="Cover Header"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-900 shadow-2xl bg-slate-800"
            />

            <div className="flex items-center gap-3">
              {isSelf ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-full border border-slate-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full transition-all ${
                    isFollowing
                      ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800 text-slate-300 border border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Name & Handle */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-100">{profileUser.name}</h1>
            <p className="text-sm font-medium text-indigo-400">@{profileUser.username}</p>
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <p className="text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed whitespace-pre-line">
              {profileUser.bio}
            </p>
          )}

          {/* Stats & Join Date */}
          <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-slate-800/80 text-sm">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="font-bold text-slate-100">{profileUser.stats?.postsCount || 0}</span>
              <span className="text-slate-400 text-xs">Posts</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="font-bold text-slate-100">{followersCount}</span>
              <span className="text-slate-400 text-xs">Followers</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="font-bold text-slate-100">{profileUser.stats?.followingCount || 0}</span>
              <span className="text-slate-400 text-xs">Following</span>
            </div>
            {profileUser.createdAt && (
              <div className="flex items-center gap-1 text-slate-400 text-xs ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(profileUser.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Posts Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            Posts by @{profileUser.username}
          </h3>
        </div>

        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-sm">
            @{profileUser.username} has not posted anything yet.
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={(updated) => {
            setProfileUser((prev) => (prev ? { ...prev, ...updated } : null));
          }}
        />
      )}
    </div>
  );
};
