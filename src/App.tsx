// src/App.tsx
// Diupdate: tambah AuthProvider, route /login, dan protected routes.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import MapPage from './pages/Map';
import QuestPage from './pages/Quest';
import ChatPage from './pages/Chat';
import ProfilePage from './pages/Profile';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected - Layout handles auth redirect */}
          <Route path="/app" element={<Layout><MapPage /></Layout>} />
          <Route path="/app/quest" element={<Layout><QuestPage /></Layout>} />
          <Route path="/app/chat" element={<Layout><ChatPage /></Layout>} />
          <Route path="/app/profile" element={<Layout><ProfilePage /></Layout>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
