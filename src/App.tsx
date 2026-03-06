/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MapPage from './pages/Map';
import QuestPage from './pages/Quest';
import ChatPage from './pages/Chat';
import ProfilePage from './pages/Profile';
import LandingPage from './pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Layout><MapPage /></Layout>} />
        <Route path="/app/quest" element={<Layout><QuestPage /></Layout>} />
        <Route path="/app/chat" element={<Layout><ChatPage /></Layout>} />
        <Route path="/app/profile" element={<Layout><ProfilePage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
