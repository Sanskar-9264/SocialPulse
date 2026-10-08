import axios from 'axios';
import { User, Post, Comment, AuthResponse } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach Authorization header automatically if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('social_app_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { emailOrUsername, password });
    return res.data;
  },
  register: async (userData: { username: string; email: string; password: string; name: string; bio?: string; avatar?: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const userAPI = {
  getProfile: async (username: string): Promise<User> => {
    const res = await api.get(`/users/${username}`);
    return res.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
  toggleFollow: async (userId: string): Promise<{ isFollowing: boolean; followersCount: number }> => {
    const res = await api.post(`/users/${userId}/follow`);
    return res.data;
  },
  getSuggestedUsers: async (): Promise<User[]> => {
    const res = await api.get('/users/suggested');
    return res.data;
  },
  searchUsers: async (query: string): Promise<User[]> => {
    const res = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
    return res.data;
  },
};

export const postAPI = {
  getPosts: async (filter: 'all' | 'following' = 'all'): Promise<Post[]> => {
    const res = await api.get(`/posts?filter=${filter}`);
    return res.data;
  },
  getUserPosts: async (username: string): Promise<Post[]> => {
    const res = await api.get(`/posts/user/${username}`);
    return res.data;
  },
  createPost: async (content: string, image?: string): Promise<Post> => {
    const res = await api.post('/posts', { content, image });
    return res.data;
  },
  toggleLike: async (postId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const res = await api.post(`/posts/${postId}/like`);
    return res.data;
  },
  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },
};

export const commentAPI = {
  getComments: async (postId: string): Promise<Comment[]> => {
    const res = await api.get(`/comments/post/${postId}`);
    return res.data;
  },
  addComment: async (postId: string, content: string): Promise<Comment> => {
    const res = await api.post(`/comments/post/${postId}`, { content });
    return res.data;
  },
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};

export default api;
