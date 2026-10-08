import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeFeed } from './pages/HomeFeed';
import { ProfilePage } from './pages/ProfilePage';
import { ExplorePage } from './pages/ExplorePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePostModal } from './components/CreatePostModal';

export const AppContent: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [feedRefreshTrigger, setFeedRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setFeedRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex gap-8">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <Routes>
            <Route
              path="/"
              element={
                <HomeFeed
                  onOpenCreatePost={() => setIsCreatePostOpen(true)}
                  feedRefreshTrigger={feedRefreshTrigger}
                />
              }
            />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/user/:username" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
