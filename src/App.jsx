import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Home from './pages/Home';
import QuizPlayer from './pages/QuizPlayer';
import ResultScreen from './pages/ResultScreen';
import LeaderboardPage from './pages/LeaderboardPage';
import Layout from './components/Layout';

function App() {
  return (
    <QuizProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:id" element={<QuizPlayer />} />
            <Route path="/result" element={<ResultScreen />} />
            <Route path="/leaderboard/:id" element={<LeaderboardPage />} />
          </Routes>
        </Layout>
      </Router>
    </QuizProvider>
  );
}

export default App;
