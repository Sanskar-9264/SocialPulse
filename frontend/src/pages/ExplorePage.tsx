import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userAPI } from '../services/api';
import { UserCard } from '../components/UserCard';
import { Search, Compass, Sparkles } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        if (searchQuery.trim()) {
          const results = await userAPI.searchUsers(searchQuery);
          setUsers(results);
        } else {
          const suggested = await userAPI.getSuggestedUsers();
          setUsers(suggested);
        }
      } catch (err) {
        console.error('Error fetching explore users', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Explore Creators</h1>
            <p className="text-xs text-slate-400">Discover new people, creators, and developers to follow on SocialPulse</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, username (@alex_dev), or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            {searchQuery ? `Search Results (${users.length})` : 'Recommended Profiles'}
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-900/40 border border-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map((u) => (
              <UserCard key={u._id || u.id} user={u} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 text-sm">
            No matching users found for "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
