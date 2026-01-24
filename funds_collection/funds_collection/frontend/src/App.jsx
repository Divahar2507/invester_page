import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import RaiseFundsPage from './pages/RaiseFundsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="funding" element={<RaiseFundsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="success-stories" element={<SuccessStoriesPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
