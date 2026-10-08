import { Response } from 'express';
import Post from '../models/Post';
import Like from '../models/Like';
import Follow from '../models/Follow';
import Comment from '../models/Comment';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, image } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    const newPost = await Post.create({
      author: req.userId,
      content: content.trim(),
      image: image || '',
    });

    const populatedPost = await Post.findById(newPost._id).populate('author', 'username name avatar');

    res.status(201).json({
      ...populatedPost?.toObject(),
      isLiked: false,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const filter = req.query.filter as string; // 'following' | 'all'
    let queryFilter: any = {};

    if (filter === 'following' && req.userId) {
      const followingRecords = await Follow.find({ follower: req.userId });
      const followingIds = followingRecords.map((f) => f.following);
      // Include user's own posts in following feed as well
      followingIds.push(req.userId as any);
      queryFilter.author = { $in: followingIds };
    }

    const posts = await Post.find(queryFilter)
      .sort({ createdAt: -1 })
      .populate('author', 'username name avatar bio');

    let userLikedPostIds = new Set<string>();
    if (req.userId) {
      const postIds = posts.map((p) => p._id);
      const likes = await Like.find({ user: req.userId, post: { $in: postIds } });
      likes.forEach((l) => userLikedPostIds.add(l.post.toString()));
    }

    const postsWithLikes = posts.map((post) => ({
      ...post.toObject(),
      isLiked: userLikedPostIds.has(post._id.toString()),
    }));

    res.json(postsWithLikes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username name avatar');

    let userLikedPostIds = new Set<string>();
    if (req.userId) {
      const postIds = posts.map((p) => p._id);
      const likes = await Like.find({ user: req.userId, post: { $in: postIds } });
      likes.forEach((l) => userLikedPostIds.add(l.post.toString()));
    }

    const postsWithLikes = posts.map((post) => ({
      ...post.toObject(),
      isLiked: userLikedPostIds.has(post._id.toString()),
    }));

    res.json(postsWithLikes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error });
  }
};

export const toggleLikePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();
      return res.json({ isLiked: false, likesCount: post.likesCount });
    } else {
      await Like.create({ user: userId, post: postId });
      post.likesCount += 1;
      await post.save();
      return res.json({ isLiked: true, likesCount: post.likesCount });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling post like', error });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await Post.deleteOne({ _id: postId });
    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ post: postId });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};
