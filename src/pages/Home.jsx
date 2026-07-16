import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import QuizCard from '../components/QuizCard';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Rise and Quiz!";
  if (hour < 18) return "Mid-day Brain Teaser!";
  return "Late Night Trivia!";
};

const Home = () => {
  const { quizzes } = useQuiz();
  const [greeting, setGreeting] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % quizzes.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + quizzes.length) % quizzes.length);
  };

  const handleSelect = (index) => {
    setActiveIndex(index);
  };

  const getCircularOffset = (index, activeIndex, length) => {
    let offset = index - activeIndex;
    if (offset > Math.floor(length / 2)) offset -= length;
    if (offset < -Math.floor(length / 2)) offset += length;
    return offset;
  };

  return (
    <div className="w-full relative min-h-screen pb-24 overflow-hidden z-0 bg-background text-text transition-colors duration-500">
      {/* Curved Top Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-96 bg-gradient-to-b from-primary/30 to-background pointer-events-none z-10 opacity-60 rounded-b-[50%]" />
      
      <div className="pt-8 px-4 md:px-8 max-w-7xl mx-auto relative z-20">
        
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-text tracking-tight">
              {greeting}
            </h1>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-text hover:underline cursor-pointer">Your Playlists</h2>
          </div>
          
          {/* Coverflow Carousel Container */}
          <div className="relative w-full max-w-4xl mx-auto h-[420px] md:h-[480px] flex items-center justify-center">
            
            {/* Left Nav Button */}
            <button 
              onClick={handlePrev}
              className="absolute -left-4 md:-left-8 z-40 p-3 rounded-full transition-all transform hover:scale-110 shadow-xl bg-surface hover:bg-surface-hover text-text border border-surface-light"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Cards */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <AnimatePresence>
                {quizzes.map((quiz, index) => {
                  const offset = getCircularOffset(index, activeIndex, quizzes.length);
                  const absOffset = Math.abs(offset);
                  const isCenter = offset === 0;
                  
                  if (absOffset > 2) return null; // Only render nearest neighbors

                  return (
                    <motion.div
                      key={quiz.id}
                      className="absolute w-[260px] md:w-[320px] h-[360px] md:h-[420px]"
                      initial={false}
                      animate={{
                        x: `${offset * 70}%`, // Reduced gap
                        scale: 1 - (absOffset * 0.15),
                        opacity: 1 - (absOffset * 0.25),
                        zIndex: 30 - absOffset
                      }}
                      transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <QuizCard 
                        quiz={quiz} 
                        index={index} 
                        isActive={isCenter}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right Nav Button */}
            <button 
              onClick={handleNext}
              className="absolute -right-4 md:-right-8 z-40 p-3 rounded-full transition-all transform hover:scale-110 shadow-xl bg-surface hover:bg-surface-hover text-text border border-surface-light"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {quizzes.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? 'bg-primary scale-125' : 'bg-surface-light hover:bg-primary/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Home;
