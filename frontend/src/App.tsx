import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import YearPage from './pages/YearPage';
import MyRankPage from './pages/MyRankPage';
import ViewRankingPage from './pages/ViewRankingPage';
import OfficialResultsPage from './pages/OfficialResultsPage';
import { NavBar } from './components/NavBar';
import { YearSubNav } from './components/YearSubNav';
import { useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScrollToTop } from './components/ScrollToTop';
import ComparePage from './pages/ComparePage';

const queryClient = new QueryClient();

const App = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => setAuthModalOpen(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <BrowserRouter>
          <ScrollToTop />
          <NavBar onLoginClick={handleOpenAuthModal} />
          <YearSubNav />
          <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
          <div className="min-h-screen text-white">
            <Routes>
              <Route path="*" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/year/:year" element={<YearPage />} />
              <Route path="/year/:year/my-rank" element={<MyRankPage />} />
              <Route path="/year/:year/my-rank/view" element={<ViewRankingPage />} />
              <Route path="/year/:year/official-rank" element={<OfficialResultsPage />} />
              <Route path="/year/:year/compare" element={<ComparePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default App;
