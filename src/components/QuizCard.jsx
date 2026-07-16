import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

const getGradient = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color1 = `hsl(${200 + (Math.abs(hash) % 60)}, 70%, 50%)`;
  const color2 = `hsl(${200 + ((Math.abs(hash) + 30) % 60)}, 80%, 40%)`;
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

const QuizCard = ({ quiz, index, isActive = true, onSelect }) => {
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();

  const handleCardClick = (e) => {
    if (!isActive && onSelect) {
      e.stopPropagation();
      onSelect(index);
      return;
    }
    handlePlay(e);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!isActive) return;
    startQuiz(quiz.id);
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`glass-panel p-4 rounded-xl flex flex-col h-full cursor-pointer group/card hover:bg-surface-hover transition-all duration-300 ${
        isActive ? 'hover:scale-[1.03] hover:-translate-y-3' : ''
      }`}
    >
      <div className="relative w-full aspect-square mb-4 rounded-md overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        {quiz.thumbnail ? (
          <div 
            className={`w-full h-full bg-cover bg-center transition-transform duration-500 ${isActive ? 'group-hover/card:scale-110' : ''}`}
            style={{ backgroundImage: `url(${quiz.thumbnail}), ${getGradient(quiz.title)}` }}
          />
        ) : (
          <div 
            className={`w-full h-full transition-transform duration-500 ${isActive ? 'group-hover/card:scale-110' : ''}`}
            style={{ background: getGradient(quiz.title) }}
          />
        )}
        
        {isActive && (
          <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/30 transition-colors duration-300 flex items-center justify-center z-10">
            <button 
              onClick={handlePlay}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover hover:scale-105 text-black font-bold px-6 py-3 rounded-full opacity-0 translate-y-16 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 ease-out shadow-2xl"
              aria-label="Play Quiz"
            >
              <Play className="w-5 h-5 fill-black" />
              Play
            </button>
          </div>
        )}
      </div>
      
      <h3 className={`text-base font-bold mb-1 text-text truncate transition-colors ${isActive ? 'group-hover/card:text-primary' : ''}`}>
        {quiz.title}
      </h3>
      <p className="text-sm text-text-muted line-clamp-2">
        {quiz.description} • {quiz.questions?.length || quiz.totalQuestions} Qs
      </p>
    </div>
  );
};

export default QuizCard;
