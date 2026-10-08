import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { UserPlus, UserCheck } from 'lucide-react';

interface UserCardProps {
  user: User;
  onFollowToggled?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user: initialUser, onFollowToggled }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(!!initialUser.isFollowing);
  const [loading, setLoading] = useState<boolean>(false);

  const isSelf = currentUser && (currentUser.id === initialUser._id || currentUser._id === initialUser._id || currentUser.username === initialUser.username);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert('Please log in to follow users');
      return;
    }

    const userIdToFollow = initialUser._id || initialUser.id;
    if (!userIdToFollow) return;

    setLoading(true);
    try {
      const res = await userAPI.toggleFollow(userIdToFollow);
      setIsFollowing(res.isFollowing);
      if (onFollowToggled) onFollowToggled();
    } catch (err) {
      console.error('Follow toggle error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex items-center justify-between gap-3 hover:border-slate-700/80 transition-all">
      <Link to={`/user/${initialUser.username}`} className="flex items-center gap-3 overflow-hidden">
        <img
          src={initialUser.avatar}
          alt={initialUser.name}
          className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
        />
        <div className="truncate">
          <h4 className="font-semibold text-slate-100 text-sm truncate hover:text-indigo-400 transition-colors">
            {initialUser.name}
          </h4>
          <p className="text-xs text-slate-400 truncate">@{initialUser.username}</p>
          {initialUser.bio && (
            <p className="text-xs text-slate-500 truncate mt-0.5 max-w-xs">{initialUser.bio}</p>
          )}
        </div>
      </Link>

      {!isSelf && currentUser && (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            isFollowing
              ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800/60 text-slate-300 border border-slate-700'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>Follow</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
