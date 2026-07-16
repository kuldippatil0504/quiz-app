import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import quizData from '../data/quiz.json';

const QuizContext = createContext(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  // Simulating data fetching readiness by keeping it in state, though it's static
  const [quizzes] = useState(quizData);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const startQuiz = useCallback((quizId) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      console.error(`Quiz with ID ${quizId} not found.`);
      return;
    }
    setCurrentQuiz(quiz);
    setAnswers({});
    setScore(0);
  }, [quizzes]);

  const submitAnswer = useCallback((questionIndex, selectedAnswer) => {
    if (!currentQuiz) return;
    
    const question = currentQuiz.questions[questionIndex];
    const isCorrect = question.correctAnswer === selectedAnswer;
    
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: {
        selected: selectedAnswer,
        isCorrect,
        points: isCorrect ? (question.points || 1) : 0
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + (question.points || 1));
    }
  }, [currentQuiz]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setAnswers({});
    setScore(0);
  }, []);

  const value = useMemo(() => ({
    quizzes,
    currentQuiz,
    answers,
    score,
    startQuiz,
    submitAnswer,
    resetQuiz
  }), [quizzes, currentQuiz, answers, score, startQuiz, submitAnswer, resetQuiz]);

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

