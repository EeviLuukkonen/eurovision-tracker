import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import YearPage from './pages/YearPage';
import MyRankPage from './pages/MyRankPage';
import ViewRankingPage from './pages/ViewRankingPage';
import OfficialResultsPage from './pages/OfficialResultsPage';
import { NavBar } from './components/NavBar';
import { useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => setAuthModalOpen(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <BrowserRouter>
          <NavBar onLoginClick={handleOpenAuthModal} />
          <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
          <div className="min-h-screen text-white">
            <Routes>
              <Route path="*" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/year/:year" element={<YearPage />} />
              <Route path="/year/:year/my-rank" element={<MyRankPage />} />
              <Route path="/year/:year/my-rank/view" element={<ViewRankingPage />} />
              <Route path="/year/:year/official-rank" element={<OfficialResultsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default App;
