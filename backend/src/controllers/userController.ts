import { Request, Response } from 'express';
import User from '../models/User';
import Follow from '../models/Follow';
import Post from '../models/Post';
import { AuthRequest } from '../middleware/auth';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });
    const postsCount = await Post.countDocuments({ author: user._id });

    let isFollowing = false;
    if (req.userId) {
      const followRecord = await Follow.findOne({ follower: req.userId, following: user._id });
      isFollowing = !!followRecord;
    }

    res.json({
      id: user._id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      coverImage: user.coverImage,
      bio: user.bio,
      createdAt: user.createdAt,
      stats: {
        followersCount,
        followingCount,
        postsCount,
      },
      isFollowing,
      isSelf: req.userId === user._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, avatar, coverImage } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (coverImage) user.coverImage = coverImage;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      coverImage: user.coverImage,
      bio: user.bio,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const toggleFollow = async (req: AuthRequest, res: Response) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId });

    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });
      const followersCount = await Follow.countDocuments({ following: targetUserId });
      return res.json({ message: 'Unfollowed successfully', isFollowing: false, followersCount });
    } else {
      await Follow.create({ follower: currentUserId, following: targetUserId });
      const followersCount = await Follow.countDocuments({ following: targetUserId });
      return res.json({ message: 'Followed successfully', isFollowing: true, followersCount });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling follow state', error });
  }
};

export const getSuggestedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.userId;
    let followingIds: string[] = [];

    if (currentUserId) {
      const follows = await Follow.find({ follower: currentUserId });
      followingIds = follows.map((f) => f.following.toString());
      followingIds.push(currentUserId);
    }

    const users = await User.find({ _id: { $nin: followingIds } })
      .limit(6)
      .select('username name avatar bio');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggested users', error });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    })
      .limit(10)
      .select('username name avatar bio');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error });
  }
};
