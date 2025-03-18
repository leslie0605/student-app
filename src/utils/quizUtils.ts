
import { QuizQuestion } from "@/data/brainQuizData";

export interface UserQuizAnswer {
  questionId: number;
  selectedOptionId: string | null;
  isCorrect: boolean;
}

export interface CompletedQuiz {
  quizId: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  userAnswers: UserQuizAnswer[];
}

export interface QuizStats {
  totalAnswered: number;
  totalCorrect: number;
  highestStreak: number;
  totalXP: number;
  completedQuizzes: number;
  achievements: string[];
}

// Check if a quiz has been completed
export const isQuizCompleted = (quizId: string): boolean => {
  const completedQuizzes = getCompletedQuizzes();
  return completedQuizzes.some(quiz => quiz.quizId === quizId);
};

// Get all completed quizzes
export const getCompletedQuizzes = (): CompletedQuiz[] => {
  const saved = localStorage.getItem('completedQuizzes');
  if (!saved) return [];
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing completed quizzes', e);
    return [];
  }
};

// Get a specific completed quiz by ID
export const getCompletedQuiz = (quizId: string): CompletedQuiz | null => {
  const completedQuizzes = getCompletedQuizzes();
  return completedQuizzes.find(quiz => quiz.quizId === quizId) || null;
};

// Save a completed quiz
export const saveCompletedQuiz = (quiz: CompletedQuiz): void => {
  const completedQuizzes = getCompletedQuizzes();
  
  // Check if this quiz is already completed
  const existingIndex = completedQuizzes.findIndex(q => q.quizId === quiz.quizId);
  
  if (existingIndex >= 0) {
    // Update existing quiz
    completedQuizzes[existingIndex] = quiz;
  } else {
    // Add new quiz
    completedQuizzes.push(quiz);
  }
  
  localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
};

// Get or create quiz stats
export const getQuizStats = (): QuizStats => {
  const saved = localStorage.getItem('quizStats');
  if (!saved) {
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      highestStreak: 0,
      totalXP: 0,
      completedQuizzes: 0,
      achievements: []
    };
  }
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing quiz stats', e);
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      highestStreak: 0,
      totalXP: 0,
      completedQuizzes: 0,
      achievements: []
    };
  }
};

// Save quiz stats
export const saveQuizStats = (stats: QuizStats): void => {
  localStorage.setItem('quizStats', JSON.stringify(stats));
};

// Load quiz data based on quiz ID
export const loadQuizData = (quizId: string): { questions: QuizQuestion[], options: any[] } | null => {
  try {
    if (quizId === 'brain-quiz') {
      const { quizQuestions, brainRegions } = require('@/data/brainQuizData');
      return { 
        questions: quizQuestions,
        options: brainRegions
      };
    } else if (quizId === 'math-quiz') {
      // This would be implemented when the mathQuizData.ts file is created
      // const { mathQuestions, mathOptions } = require('@/data/mathQuizData');
      // return { questions: mathQuestions, options: mathOptions };
      return null;
    } else if (quizId === 'psychology-quiz') {
      // This would be implemented when the psychologyQuizData.ts file is created
      // const { psychologyQuestions, psychologyOptions } = require('@/data/psychologyQuizData');
      // return { questions: psychologyQuestions, options: psychologyOptions };
      return null;
    } else if (quizId === 'science-quiz') {
      // This would be implemented when the scienceQuizData.ts file is created
      // const { scienceQuestions, scienceOptions } = require('@/data/scienceQuizData');
      // return { questions: scienceQuestions, options: scienceOptions };
      return null;
    }
    return null;
  } catch (e) {
    console.error(`Error loading quiz data for ${quizId}`, e);
    return null;
  }
};

// Get quiz title based on quiz ID
export const getQuizTitle = (quizId: string): string => {
  switch (quizId) {
    case 'brain-quiz': return 'Brain Function Quiz';
    case 'psychology-quiz': return 'Psychology Concepts';
    case 'science-quiz': return 'Science Fundamentals';
    case 'math-quiz': return 'Mathematical Reasoning';
    default: return 'Quiz';
  }
};

// Get quiz icon based on quiz ID (React components would be passed elsewhere)
export const getQuizDescriptions = (quizId: string): string => {
  switch (quizId) {
    case 'brain-quiz': 
      return 'Test your knowledge about different brain regions and their functions.';
    case 'psychology-quiz': 
      return 'Learn about fundamental psychological theories and principles.';
    case 'science-quiz': 
      return 'Test your knowledge of basic scientific principles and discoveries.';
    case 'math-quiz': 
      return 'Challenge yourself with mathematical problems and concepts.';
    default: 
      return 'Test your knowledge in this quiz.';
  }
};
