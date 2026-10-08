import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Follow from '../models/Follow';
import Like from '../models/Like';

export const seedDatabase = async () => {
  console.log('[Seed] Starting database seeding...');

  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await Follow.deleteMany({});
  await Like.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const users = await User.create([
    {
      username: 'alex_dev',
      email: 'alex@example.com',
      password: hashedPassword,
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      bio: 'Full Stack Engineer & Open Source Enthusiast 🚀 Building the modern web with React & TypeScript.',
    },
    {
      username: 'sarah_design',
      email: 'sarah@example.com',
      password: hashedPassword,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      bio: 'Product Designer & UI/UX Specialist ✨ Crafting beautiful digital experiences.',
    },
    {
      username: 'marcus_tech',
      email: 'marcus@example.com',
      password: hashedPassword,
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      bio: 'AI researcher & Cloud Architect. Passionate about scalable systems & machine learning.',
    },
    {
      username: 'emma_travel',
      email: 'emma@example.com',
      password: hashedPassword,
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      bio: 'Travel photographer & storyteller 📷 Exploring the world one camera shot at a time.',
    },
  ]);

  const [alex, sarah, marcus, emma] = users;

  // 2. Create Follow relationships
  await Follow.create([
    { follower: alex._id, following: sarah._id },
    { follower: alex._id, following: marcus._id },
    { follower: sarah._id, following: alex._id },
    { follower: sarah._id, following: emma._id },
    { follower: marcus._id, following: alex._id },
    { follower: emma._id, following: sarah._id },
  ]);

  // 3. Create Posts
  const posts = await Post.create([
    {
      author: alex._id,
      content: 'Just launched our new React + TypeScript dashboard! 🚀 Loving the type safety and component structure.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      likesCount: 3,
      commentsCount: 2,
    },
    {
      author: sarah._id,
      content: 'Exploring minimalist design trends for 2026. Clean typography and subtle micro-interactions make all the difference!',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      likesCount: 2,
      commentsCount: 1,
    },
    {
      author: emma._id,
      content: 'Golden hour views from the mountain summit. Fresh air and breathtaking scenery! 🌄✨',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      likesCount: 4,
      commentsCount: 1,
    },
    {
      author: marcus._id,
      content: 'Deep dive into MongoDB indexing and query execution plans today. Performance optimization is an art form.',
      image: '',
      likesCount: 1,
      commentsCount: 1,
    },
  ]);

  const [post1, post2, post3, post4] = posts;

  // 4. Create Likes
  await Like.create([
    { user: sarah._id, post: post1._id },
    { user: marcus._id, post: post1._id },
    { user: emma._id, post: post1._id },
    { user: alex._id, post: post2._id },
    { user: emma._id, post: post2._id },
    { user: alex._id, post: post3._id },
    { user: sarah._id, post: post3._id },
    { user: marcus._id, post: post3._id },
    { user: emma._id, post: post3._id },
    { user: alex._id, post: post4._id },
  ]);

  // 5. Create Comments
  await Comment.create([
    {
      post: post1._id,
      author: sarah._id,
      content: 'Looks awesome Alex! Clean UI design.',
    },
    {
      post: post1._id,
      author: marcus._id,
      content: 'TypeScript is definitely a game changer for large codebases.',
    },
    {
      post: post2._id,
      author: alex._id,
      content: 'Totally agree! Typography brings the whole layout together.',
    },
    {
      post: post3._id,
      author: sarah._id,
      content: 'Incredible shot Emma! Which lens did you use?',
    },
    {
      post: post4._id,
      author: alex._id,
      content: 'Compound indexes saved our production latency last month!',
    },
  ]);

  console.log('[Seed] Database seeded successfully with 4 users, 4 posts, comments, likes, and follow links!');
};

// Run script if executed directly
if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
