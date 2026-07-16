import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, ChevronDown, Clock } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getBlueGradient = () => {
  // Deep blue to background (slate-900)
  return `linear-gradient(to bottom, #1e3a8a 0%, var(--color-background) 100%)`;
};

const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, submitAnswer, startQuiz } = useQuiz();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);

  const timerRef = useRef(null);
  const optionsContainerRef = useRef(null);

  useEffect(() => {
    if (!currentQuiz) {
      startQuiz(id);
    }
  }, [id, currentQuiz, startQuiz]);

  useEffect(() => {
    if (currentQuiz && shuffledQuestions.length === 0) {
      setShuffledQuestions(shuffleArray(currentQuiz.questions));
    }
  }, [currentQuiz, shuffledQuestions.length]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuiz && currentQuestion) {
      setTimeLeft(currentQuiz.timePerQuestion);
      setSelectedOption(null);
      setIsSubmitting(false);
      
      const optionsWithIndices = currentQuestion.options.map((opt, idx) => ({ 
        text: opt, 
        originalIndex: idx 
      }));
      setShuffledOptions(shuffleArray(optionsWithIndices));

      if (optionsContainerRef.current) {
        optionsContainerRef.current.focus();
      }
    }
  }, [currentQuestionIndex, currentQuestion, currentQuiz]);

  useEffect(() => {
    if (!currentQuestion || isSubmitting) return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, currentQuestion, isSubmitting]);

  const handleNext = useCallback(() => {
    if (isSubmitting || !currentQuiz || !currentQuestion) return;
    setIsSubmitting(true);
    
    if (timerRef.current) clearInterval(timerRef.current);

    const selectedAnswerText = selectedOption !== null ? shuffledOptions[selectedOption].text : "";
    const originalQuestionIndex = currentQuiz.questions.findIndex(q => q.id === currentQuestion.id);
    
    submitAnswer(originalQuestionIndex, selectedAnswerText);

    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        navigate('/result');
      }
    }, 150);
  }, [isSubmitting, currentQuiz, currentQuestion, selectedOption, shuffledOptions, submitAnswer, currentQuestionIndex, shuffledQuestions.length, navigate]);

  const handleSkip = useCallback(() => {
    if (isSubmitting || !currentQuiz || !currentQuestion) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const originalQuestionIndex = currentQuiz.questions.findIndex(q => q.id === currentQuestion.id);
    submitAnswer(originalQuestionIndex, ""); // Skipped

    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        navigate('/result');
      }
    }, 150);
  }, [isSubmitting, currentQuiz, currentQuestion, submitAnswer, currentQuestionIndex, shuffledQuestions.length, navigate]);

  const handleQuitRequest = () => {
    setShowQuitModal(true);
  };

  const confirmQuit = () => {
    navigate('/');
  };

  const cancelQuit = () => {
    setShowQuitModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentQuestion || isSubmitting) return;
      if (e.key === 'Enter' && selectedOption !== null) {
        handleNext();
        return;
      }
      const numKey = parseInt(e.key);
      if (numKey >= 1 && numKey <= shuffledOptions.length) {
        setSelectedOption(numKey - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isSubmitting, selectedOption, handleNext, shuffledOptions.length]);

  if (!currentQuiz || !currentQuestion) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mr-3"></div>
      </div>
    );
  }

  const timePercentage = (timeLeft / currentQuiz.timePerQuestion) * 100;

  return (
    <div 
      className="min-h-[calc(100vh-80px)] -mt-8 flex flex-col items-center transition-colors duration-1000 pb-12 pt-8 px-4"
      style={{ background: getBlueGradient() }}
    >
      <div className="w-full max-w-2xl flex flex-col h-full mt-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8 text-text gap-2">
          <button onClick={handleQuitRequest} className="bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95 text-white px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full font-bold shadow-lg shadow-red-500/20 transition-all border border-red-400 shrink-0">
            Quit
          </button>
          <div className="text-center flex-1 flex items-center justify-center gap-3 bg-surface rounded-xl md:rounded-2xl p-2 md:pr-6 shadow-md border border-surface-light min-w-0">
            <div className="hidden sm:block w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0 shadow-lg">
               {currentQuiz.thumbnail ? (
                 <img src={currentQuiz.thumbnail} alt="Quiz Art" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
               )}
            </div>
            <div className="text-center sm:text-left min-w-0">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-text-muted">PLAYING FROM</p>
              <p className="text-xs md:text-sm font-bold truncate text-text">{currentQuiz.title}</p>
            </div>
          </div>
          <div className="w-8 hidden sm:block shrink-0" />
        </div>

        {/* Question & Meta */}
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-primary font-bold text-sm mb-2 tracking-wider uppercase">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</p>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl md:text-4xl font-bold text-text leading-snug"
              >
                {currentQuestion.question}
              </motion.h2>
            </AnimatePresence>
          </div>
          
          {/* Explicit Timer */}
          <div className="flex flex-col items-center bg-surface p-3 rounded-2xl border border-surface-light shadow-lg shrink-0 w-24">
            <Clock className={`w-6 h-6 mb-1 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
            <span className={`text-2xl font-black ${timeLeft <= 5 ? 'text-red-500' : 'text-text'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Time Bar */}
        <div className="h-1.5 w-full bg-surface-light rounded-full overflow-hidden mb-8 shadow-inner">
           <motion.div 
             className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-primary'}`}
             initial={{ width: '0%' }}
             animate={{ width: `${100 - timePercentage}%` }}
             transition={{ duration: 1, ease: 'linear' }}
           />
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3 mb-6 md:mb-8 flex-1" ref={optionsContainerRef} tabIndex={-1}>
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              {shuffledOptions.map((option, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    disabled={isSubmitting}
                    className={`w-full text-left px-4 py-4 md:px-5 md:py-6 rounded-xl transition-all duration-200 border-2 flex items-center gap-3 md:gap-4 ${
                      isSelected 
                        ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]' 
                        : 'bg-surface border-surface-light text-text hover:bg-surface-hover'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base shrink-0 transition-colors ${
                      isSelected ? 'bg-white text-primary' : 'bg-surface-light text-text-muted'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`font-semibold text-base md:text-xl flex-1 ${isSelected ? 'text-white' : 'text-text'}`}>
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-auto flex gap-3 w-full pt-2">
           <button 
              onClick={handleSkip}
              disabled={isSubmitting}
              className={`flex-[1] px-2 py-3 md:px-6 md:py-4 rounded-full font-bold text-sm md:text-base transition-colors border border-surface-light hover:bg-surface-hover text-text-muted hover:text-text ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
              Skip
           </button>
           <button 
              onClick={handleNext}
              disabled={selectedOption === null || isSubmitting}
              className={`flex-[2] px-4 py-3 md:px-8 md:py-4 rounded-full flex items-center justify-center transition-all font-bold text-sm md:text-lg gap-2 ${
                selectedOption !== null && !isSubmitting
                  ? 'bg-primary hover:bg-primary-hover hover:scale-105 active:scale-95 text-white shadow-xl shadow-primary/30'
                  : 'bg-surface border border-surface-light text-text-muted opacity-50 cursor-not-allowed'
              }`}
           >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : (
                <>
                  <span className="truncate">{currentQuestionIndex === shuffledQuestions.length - 1 ? 'Finish' : 'Next Question'}</span>
                  <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current shrink-0" />
                </>
              )}
           </button>
        </div>

      </div>

      {/* Quit Modal */}
      <AnimatePresence>
        {showQuitModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface border border-surface-light rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-text mb-2">Give up already?</h3>
              <p className="text-text-muted mb-8">Your progress will be lost. Are you sure you want to quit?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={cancelQuit}
                  className="flex-1 bg-surface-light hover:bg-surface-hover text-text font-bold py-3 rounded-xl transition-colors border border-surface-light"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmQuit}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/20"
                >
                  Yes, Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPlayer;
