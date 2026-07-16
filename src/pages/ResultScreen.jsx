import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, List } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ResultScreen = () => {
  const navigate = useNavigate();
  const { currentQuiz, score, resetQuiz } = useQuiz();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!currentQuiz) {
      navigate('/');
      return;
    }
    
    const maxScore = currentQuiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) {
      triggerConfetti();
    }
  }, [currentQuiz, navigate, score]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handlePlayAgain = () => {
    resetQuiz();
    navigate('/');
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!name.trim() || !currentQuiz) return;
    
    setIsSubmitting(true);
    const maxScore = currentQuiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = (score / maxScore) * 100;

    try {
      const docData = {
        name: name.trim(),
        quizId: currentQuiz.id,
        quizTitle: currentQuiz.title,
        score: score,
        percentage: percentage,
        completedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'leaderboard'), docData);

      setSubmitted(true);
      navigate(`/leaderboard/${currentQuiz.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit score. Make sure Firestore rules are set to Test Mode.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuiz) return null;

  const totalQuestions = currentQuiz.questions.length;
  const maxScore = currentQuiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const percentage = (score / maxScore) * 100;
  
  let message = "Good effort!";
  if (percentage === 100) message = "Flawless.";
  else if (percentage >= 80) message = "Excellent.";
  else if (percentage >= 50) message = "Not bad.";

  return (
    <div className="w-full min-h-[calc(100vh-80px)] -mt-8 flex flex-col justify-center items-center bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#0ea5e9] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] text-center shadow-2xl border border-white/10 my-8"
      >
        <div className="inline-block p-4 bg-white/10 rounded-full mb-6">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">{message}</h1>
        <p className="text-white/80 font-medium text-lg mb-8">You listened to <span className="text-white font-bold">{currentQuiz.title}</span></p>
        
        <div className="bg-black/20 rounded-2xl p-6 mb-10 flex justify-around items-center">
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1">{score}</div>
            <div className="text-xs text-white/60 uppercase tracking-widest font-bold">Points</div>
          </div>
          <div className="w-px h-12 bg-white/20"></div>
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1">{percentage.toFixed(0)}%</div>
            <div className="text-xs text-white/60 uppercase tracking-widest font-bold">Accuracy</div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmitScore} className="bg-black/30 p-6 rounded-2xl mb-8 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Add to Leaderboard</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-colors font-medium"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="bg-white hover:scale-105 text-black px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white/20 text-white font-bold p-4 rounded-xl mb-8 backdrop-blur-md border border-white/10">
            Score submitted successfully!
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/leaderboard/${currentQuiz.id}`)}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold bg-white text-black hover:scale-[1.02] transition-all"
          >
            <List className="w-5 h-5" />
            View Leaderboard
          </button>
          
          <button
            onClick={handlePlayAgain}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border-2 border-white/20 text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white/70 hover:text-white transition-all mt-2"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;
