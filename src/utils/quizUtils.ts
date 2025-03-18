
import { QuizQuestion } from "@/data/brainQuizData";

export interface UserQuizAnswer {
  questionId: number;
  selectedRegionId: string | null;
  isCorrect: boolean;
}

export interface CompletedQuiz {
  quizId: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  userAnswers: UserQuizAnswer[];
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

// Update App routes to include the quiz selection page
