// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Layout & Components
import Layout from './components/Layout';
import BackgroundAudio from './components/BackgroundAudio';

// Import Pages
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import MapPage from './pages/Map';
import QuestPage from './pages/Quest';
import ProfilePage from './pages/Profile';
import ChatPage from './pages/Chat';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Komponen Audio diletakkan di luar Routes agar tidak mati saat pindah halaman */}
        <BackgroundAudio />
        
        <Routes>
          {/* Halaman Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* REVISI: Memasukkan <Outlet /> ke dalam Layout untuk mengatasi error children */}
          <Route path="/app" element={<Layout><Outlet /></Layout>}>
            <Route index element={<MapPage />} />          {/* AxaraWorld (Peta) */}
            <Route path="quest" element={<QuestPage />} />     {/* AxaraBattle (Games) */}
            <Route path="verse" element={<ChatPage />} />      {/* AxaraVerse (Story/Chat) */}
            <Route path="profile" element={<ProfilePage />} /> {/* AxaraBadge (Profil) */}
          </Route>

          {/* Fallback jika user mengetik URL ngawur, kembalikan ke Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}