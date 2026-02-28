import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import YearPage from './pages/YearPage';
import MyRankPage from './pages/MyRankPage';
import OfficialResultsPage from './pages/OfficialResultsPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/year/:year" element={<YearPage />} />
          <Route path="/year/:year/my-rank" element={<MyRankPage />} />
          <Route path="/year/:year/official-rank" element={<OfficialResultsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
