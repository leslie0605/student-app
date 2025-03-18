import { toast } from "sonner";

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
  correctConcept: string;
  options: string[];
}

// Quiz metadata interface
export interface QuizMetadata {
  id: string;
  title: string;
  description: string;
  icon?: string;
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
export interface QuizDataModule {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  concepts: Concept[];
  icon?: string;
}

// Quiz registry to store all registered quiz modules
const quizDataRegistry: QuizDataModule[] = [];

// List of quiz files to import
// The only place you need to modify when adding a new quiz file
const quizFiles = [
  "brainQuizData",
  "physicsQuizData",
  "mathQuizData",
  "biologyQuizData",
  "musicQuizData",
];

// Function to initialize and load all quizzes
export const initializeQuizzes = async (): Promise<void> => {
  try {
    // Clear the registry first
    quizDataRegistry.length = 0;

    // Dynamically import and register each quiz file
    for (const fileName of quizFiles) {
      try {
        // Use dynamic import to load the quiz file - fix path to use relative path instead of alias
        const module = await import(/* @vite-ignore */ `../data/${fileName}`);

        if (module.quizMetadata && module.concepts && module.quizQuestions) {
          const quizModule: QuizDataModule = {
            ...module.quizMetadata,
            questions: module.quizQuestions,
            concepts: module.concepts,
          };

          // Register the quiz
          registerQuizModule(quizModule);
        } else {
          console.warn(`Quiz file ${fileName} has invalid format`);
        }
      } catch (error) {
        console.error(`Failed to load quiz file: ${fileName}`, error);
      }
    }

    console.log(`Successfully loaded ${quizDataRegistry.length} quizzes`);
  } catch (error) {
    console.error("Failed to initialize quizzes:", error);
  }
};

// Function to dynamically register a new quiz module
export const registerQuizModule = (module: QuizDataModule) => {
  // Check if a module with this ID already exists
  if (!quizDataRegistry.some((quiz) => quiz.id === module.id)) {
    quizDataRegistry.push(module);
    console.log(`Quiz module registered: ${module.id}`);
  } else {
    console.log(`Quiz module ${module.id} already registered`);
  }
};

// Get quiz title based on quiz ID
export const getQuizTitle = (quizId: string): string => {
  const quiz = quizDataRegistry.find((q) => q.id === quizId);
  if (!quiz) {
    return "Knowledge Quiz";
  }
  return quiz.title;
};

// Get quiz description based on quiz ID
export const getQuizDescriptions = (quizId: string): string => {
  const quiz = quizDataRegistry.find((q) => q.id === quizId);
  if (!quiz) {
    return "Explore various topics and test your knowledge.";
  }
  return quiz.description;
};

// Get quiz icon based on quiz ID
export const getQuizIcon = (quizId: string): string | undefined => {
  const quiz = quizDataRegistry.find((q) => q.id === quizId);
  return quiz?.icon;
};

// Load quiz data dynamically based on quizId
export const loadQuizData = (quizId: string) => {
  const quiz = quizDataRegistry.find((q) => q.id === quizId);

  if (!quiz) {
    console.error(`Quiz data for ${quizId} not found`);
    return null;
  }

  return {
    questions: quiz.questions,
    options: quiz.concepts,
  };
};

// Get available quiz IDs based on registered modules
export const getAvailableQuizIds = (): string[] => {
  return quizDataRegistry.map((quiz) => quiz.id);
};

// Local storage key for completed quizzes
const COMPLETED_QUIZZES_KEY = "completed_quizzes";
const QUIZ_STATS_KEY = "quiz_stats";

// Check if a quiz has been completed
export const isQuizCompleted = (quizId: string): boolean => {
  const completedQuizzes = getCompletedQuizzes();
  return completedQuizzes.some((quiz) => quiz.quizId === quizId);
};

// Get all completed quizzes
export const getCompletedQuizzes = (): CompletedQuiz[] => {
  const storedData = localStorage.getItem(COMPLETED_QUIZZES_KEY);
  if (!storedData) return [];

  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error("Error parsing completed quizzes data:", e);
    return [];
  }
};

// Get a specific completed quiz
export const getCompletedQuiz = (quizId: string): CompletedQuiz | null => {
  const completedQuizzes = getCompletedQuizzes();
  return completedQuizzes.find((quiz) => quiz.quizId === quizId) || null;
};

// Save a completed quiz
export const saveCompletedQuiz = (completedQuiz: CompletedQuiz): void => {
  const completedQuizzes = getCompletedQuizzes();

  // Replace if exists, otherwise add
  const quizIndex = completedQuizzes.findIndex(
    (quiz) => quiz.quizId === completedQuiz.quizId
  );
  if (quizIndex >= 0) {
    completedQuizzes[quizIndex] = completedQuiz;
  } else {
    completedQuizzes.push(completedQuiz);
  }

  try {
    localStorage.setItem(
      COMPLETED_QUIZZES_KEY,
      JSON.stringify(completedQuizzes)
    );
    toast.success("Quiz progress saved!");
  } catch (e) {
    console.error("Error saving completed quiz:", e);
    toast.error("Failed to save quiz progress");
  }
};

// Default quiz stats
const DEFAULT_QUIZ_STATS: QuizStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  highestStreak: 0,
  totalXP: 0,
  completedQuizzes: 0,
  achievements: [],
};

// Get quiz statistics
export const getQuizStats = (): QuizStats => {
  const storedData = localStorage.getItem(QUIZ_STATS_KEY);
  if (!storedData) return DEFAULT_QUIZ_STATS;

  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error("Error parsing quiz stats data:", e);
    return DEFAULT_QUIZ_STATS;
  }
};

// Save quiz statistics
export const saveQuizStats = (stats: QuizStats): void => {
  try {
    localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Error saving quiz stats:", e);
    toast.error("Failed to save quiz statistics");
  }
};
