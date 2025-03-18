
import { concepts as brainConcepts, quizQuestions as brainQuestions } from '@/data/brainQuizData';
import { concepts as physicsConcepts, quizQuestions as physicsQuestions } from '@/data/physicsQuizData';
import { toast } from 'sonner';

// Types for quiz data
export interface Concept {
  id: string;
  name: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  explanation: string;
  correctRegion: string;
  options: string[];
}

// User answer tracking
export interface UserQuizAnswer {
  questionId: number;
  selectedOptionId: string | null;
  isCorrect: boolean;
}

// Completed quiz tracking
export interface CompletedQuiz {
  quizId: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  userAnswers: UserQuizAnswer[];
}

// Quiz stats tracking
export interface QuizStats {
  totalAnswered: number;
  totalCorrect: number;
  highestStreak: number;
  totalXP: number;
  completedQuizzes: number;
  achievements: string[];
}

// Define available quiz data modules
interface QuizDataModule {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  concepts: Concept[];
}

// Registry of available quiz data modules
const quizDataRegistry: QuizDataModule[] = [
  {
    id: 'brain-quiz',
    title: 'Brain Function Quiz',
    description: 'Test your knowledge about different brain regions and their functions.',
    questions: brainQuestions,
    concepts: brainConcepts
  },
  {
    id: 'physics-quiz',
    title: 'Physics Concepts Quiz',
    description: 'Learn about fundamental physics concepts and phenomena.',
    questions: physicsQuestions,
    concepts: physicsConcepts
  }
];

// Get quiz title based on quiz ID
export const getQuizTitle = (quizId: string): string => {
  const quiz = quizDataRegistry.find(q => q.id === quizId);
  return quiz?.title || "Knowledge Quiz";
};

// Get quiz description based on quiz ID
export const getQuizDescriptions = (quizId: string): string => {
  const quiz = quizDataRegistry.find(q => q.id === quizId);
  return quiz?.description || "Test your knowledge in this quiz.";
};

// Load quiz data dynamically based on quizId
export const loadQuizData = (quizId: string) => {
  const quiz = quizDataRegistry.find(q => q.id === quizId);
  
  if (!quiz) {
    console.error(`Quiz data for ${quizId} not found`);
    return null;
  }
  
  return {
    questions: quiz.questions,
    options: quiz.concepts
  };
};

// Get available quiz IDs based on implemented data files
export const getAvailableQuizIds = (): string[] => {
  return quizDataRegistry.map(quiz => quiz.id);
};

// Local storage key for completed quizzes
const COMPLETED_QUIZZES_KEY = 'completed_quizzes';
const QUIZ_STATS_KEY = 'quiz_stats';

// Check if a quiz has been completed
export const isQuizCompleted = (quizId: string): boolean => {
  const completedQuizzes = getCompletedQuizzes();
  return completedQuizzes.some(quiz => quiz.quizId === quizId);
};

// Get all completed quizzes
export const getCompletedQuizzes = (): CompletedQuiz[] => {
  const storedData = localStorage.getItem(COMPLETED_QUIZZES_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error('Error parsing completed quizzes data:', e);
    return [];
  }
};

// Get a specific completed quiz
export const getCompletedQuiz = (quizId: string): CompletedQuiz | null => {
  const completedQuizzes = getCompletedQuizzes();
  return completedQuizzes.find(quiz => quiz.quizId === quizId) || null;
};

// Save a completed quiz
export const saveCompletedQuiz = (completedQuiz: CompletedQuiz): void => {
  const completedQuizzes = getCompletedQuizzes();
  
  // Replace if exists, otherwise add
  const quizIndex = completedQuizzes.findIndex(quiz => quiz.quizId === completedQuiz.quizId);
  if (quizIndex >= 0) {
    completedQuizzes[quizIndex] = completedQuiz;
  } else {
    completedQuizzes.push(completedQuiz);
  }
  
  try {
    localStorage.setItem(COMPLETED_QUIZZES_KEY, JSON.stringify(completedQuizzes));
    toast.success('Quiz progress saved!');
  } catch (e) {
    console.error('Error saving completed quiz:', e);
    toast.error('Failed to save quiz progress');
  }
};

// Default quiz stats
const DEFAULT_QUIZ_STATS: QuizStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  highestStreak: 0,
  totalXP: 0,
  completedQuizzes: 0,
  achievements: []
};

// Get quiz statistics
export const getQuizStats = (): QuizStats => {
  const storedData = localStorage.getItem(QUIZ_STATS_KEY);
  if (!storedData) return DEFAULT_QUIZ_STATS;
  
  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error('Error parsing quiz stats data:', e);
    return DEFAULT_QUIZ_STATS;
  }
};

// Save quiz statistics
export const saveQuizStats = (stats: QuizStats): void => {
  try {
    localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving quiz stats:', e);
    toast.error('Failed to save quiz statistics');
  }
};
