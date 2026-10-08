# SocialPulse - Mini Social Media Platform

A modern, full-stack **Social Media Application** built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 🌟 Key Features

- **User Authentication & Profiles**:
  - Secure JWT authentication (Register, Login, Logout).
  - Quick 1-click **Demo Login** shortcuts (`@alex_dev`, `@sarah_design`, `@marcus_tech`, `@emma_travel`).
  - Customizable profile info: Name, Bio, Avatar image, and Cover header image.
  - Live profile stats: Followers, Following, and Post counts.
- **Posts & Comments**:
  - Create posts with rich text and optional image URLs.
  - Interactive feed streams: **All Posts** vs **Following Feed**.
  - Threaded comment section on every post with deletion support.
  - Delete post functionality for post owners.
- **Like & Follow System**:
  - Real-time optimistic Like/Unlike system with live counts.
  - Follow/Unfollow user system affecting feed visibility.
  - Suggested creators panel & user search engine.
- **Zero-Config Database**:
  - Seamlessly connects to your `MONGODB_URI` if provided.
  - Features an automatic `mongodb-memory-server` fallback for instant out-of-the-box local testing without installing or launching a MongoDB server.
- **Database Auto-Seeding**:
  - Built-in seed script populating 4 rich sample profiles, posts with high-res photos, comments, likes, and follower relationships.

---

## 📁 Project Architecture

```
social-media-app/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & MongoDB memory server fallback
│   │   ├── controllers/     # Auth, User, Post, and Comment controllers
│   │   ├── middleware/      # JWT verification middleware
│   │   ├── models/          # Mongoose Schemas (User, Post, Comment, Follow, Like)
│   │   ├── routes/          # Express REST API routes
│   │   ├── seed/            # Mock dataset seeder
│   │   └── server.ts        # Express server entry point
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, Sidebar, PostCard, CommentSection, UserCard, Modals
    │   ├── context/         # AuthContext state management
    │   ├── pages/           # HomeFeed, ProfilePage, ExplorePage, LoginPage, RegisterPage
    │   ├── services/        # Axios API client
    │   ├── types/           # Shared TypeScript interfaces
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 🚀 How to Run the Application

### 1. Start the Backend API

```bash
cd backend
npm install
npm run dev
```

The backend server will start at `http://localhost:5000`.

### 2. Start the Frontend React App

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## 🔑 Demo Login Credentials

You can log in using any of the pre-seeded accounts using password `password123` or click the **"Demo User"** buttons in the UI:

| Username | Email | Role |
| :--- | :--- | :--- |
| `alex_dev` | `alex@example.com` | Full Stack Engineer |
| `sarah_design` | `sarah@example.com` | Product Designer |
| `marcus_tech` | `marcus@example.com` | AI & Cloud Architect |
| `emma_travel` | `emma@example.com` | Travel Photographer |

---

## 📦 Production Build Verification

- **Backend Build**: `cd backend && npm run build`
- **Frontend Build**: `cd frontend && npm run build`
