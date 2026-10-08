export interface User {
  id: string;
  _id?: string;
  username: string;
  name: string;
  email?: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  createdAt?: string;
  stats?: {
    followersCount: number;
    followingCount: number;
    postsCount: number;
  };
  isFollowing?: boolean;
  isSelf?: boolean;
}

export interface Post {
  _id: string;
  author: User;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
