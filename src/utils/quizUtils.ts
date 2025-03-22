import { toast } from "sonner";
import { fetchAssignedGames, fetchGameById } from "./api";

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
  image?: string;
  type?: string;
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
  image?: string;
}

// Mapping for game types to icons
const gameTypeIcons: Record<string, string> = {
  Quiz: "brain",
  quiz: "brain",
  Matching: "puzzle",
  matching: "puzzle",
  Flashcard: "book",
  flashcard: "book",
};

// Quiz registry to store all registered quiz modules
export const quizDataRegistry: QuizDataModule[] = [];

// List of quiz files to import
// The only place you need to modify when adding a new quiz file
const quizFiles = ["brainQuizData"];

// Update these interfaces at the top of the file
interface RemoteGameConcept {
  id: string; // Make id required
  name: string; // Make name required
  description: string; // Make description required
}

interface RemoteGameMetadata {
  type?: string;
  title?: string;
  description?: string;
  icon?: string;
  image?: string; // Add image property
}

interface RemoteGameData {
  pairs?: Array<{
    id: string;
    term: string;
    definition: string;
  }>;
  concepts?: RemoteGameConcept[];
  metadata?: RemoteGameMetadata;
  questions?: Array<{
    id: number;
    question: string;
    explanation: string;
    correctConcept: string;
    options: string[];
  }>;
  cards?: Array<{
    id: string;
    front: string;
    back: string;
  }>;
}

interface RemoteGame {
  id: string;
  title?: string;
  description?: string;
  gameType?: string;
  data: RemoteGameData; // Make data required
}

// Types for quiz data - add these interfaces
export interface MatchingGameData {
  data: {
    pairs: Array<{
      id: string;
      term: string;
      definition: string;
    }>;
  };
  metadata: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

export interface FlashcardGameData {
  data: {
    cards: Array<{
      id: string;
      front: string;
      back: string;
      category?: string;
    }>;
  };
  metadata: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

export interface QuizGameData {
  questions: QuizQuestion[];
  options: Concept[];
  metadata: {
    id: string;
    title: string;
    description: string;
    icon?: string;
    image?: string;
  };
}

export interface RedirectData {
  redirect: true;
  gameType: string;
  gameId: string;
}

export type GameData =
  | MatchingGameData
  | FlashcardGameData
  | QuizGameData
  | RedirectData
  | null;

// Function to initialize and load all quizzes
export const initializeQuizzes = async (): Promise<void> => {
  try {
    console.log("Starting quiz initialization");

    // Clear the registry first
    quizDataRegistry.length = 0;

    // First, load local quiz files
    for (const fileName of quizFiles) {
      try {
        // Use dynamic import to load the quiz file - fix path to use relative path instead of alias
        const module = await import(/* @vite-ignore */ `../data/${fileName}`);

        if (module.concepts && (module.questions || module.quizQuestions)) {
          const quizModule: QuizDataModule = {
            id: module.Metadata?.id || fileName,
            title: module.Metadata?.title || "Knowledge Quiz",
            description: module.Metadata?.description || "Test your knowledge",
            icon: module.Metadata?.icon || "brain",
            questions: module.questions || module.quizQuestions || [],
            concepts: module.concepts || [],
            image: module.Metadata?.image,
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

    // Then, load remote games from the backend
    try {
      console.log("Fetching remote games from backend...");
      const remoteGames = await fetchAssignedGames();
      console.log(`Received ${remoteGames.length} remote games:`, remoteGames);

      for (const game of remoteGames) {
        console.log(`Processing remote game: ${game.id} (${game.gameType})`);
        // Convert remote game format to local format
        const gameModule = convertRemoteGameToModule(game);
        if (gameModule) {
          console.log(`Successfully converted game ${game.id} to module`);
          registerQuizModule(gameModule);
        } else {
          console.warn(`Failed to convert game ${game.id} to module`);
        }
      }
    } catch (error) {
      console.error("Failed to load remote games:", error);
    }

    console.log(`Successfully loaded ${quizDataRegistry.length} quizzes`);
    console.log(
      "Quiz IDs in registry:",
      quizDataRegistry.map((q) => q.id)
    );
  } catch (error) {
    console.error("Failed to initialize quizzes:", error);
  }
};

/**
 * Convert a remote game object to the local QuizDataModule format
 */
export const convertRemoteGameToModule = (
  remoteGame: RemoteGame
): QuizDataModule | null => {
  try {
    console.log(
      "Converting remote game to module:",
      remoteGame.id,
      remoteGame.title,
      remoteGame.gameType
    );

    // Check if the game has the required data structure
    if (!remoteGame || !remoteGame.data) {
      console.error("Invalid remote game data:", remoteGame);
      return null;
    }

    const gameData = remoteGame.data;
    const gameType = remoteGame.gameType || gameData.metadata?.type || "Quiz";

    // Case insensitive check for game types
    const gameTypeLower =
      typeof gameType === "string" ? gameType.toLowerCase() : "quiz";

    // Create a module structure based on the game type
    if (gameTypeLower === "quiz" && gameData.questions && gameData.concepts) {
      // Handle quiz games
      return {
        id: `remote-${remoteGame.id}`,
        title: remoteGame.title || "Knowledge Quiz",
        description: remoteGame.description || "Test your knowledge",
        icon: gameTypeIcons[gameType] || "brain",
        questions: gameData.questions,
        concepts: gameData.concepts as Concept[],
        image: gameData.metadata?.image,
      };
    } else if (gameTypeLower === "matching") {
      // Handle matching games
      // For matching games, we'll create placeholder questions and concepts
      // since QuizDataModule requires them
      let concepts: Concept[] = [];

      // Convert pairs to concepts if they exist
      if (gameData.pairs) {
        concepts = gameData.pairs.map((pair, index) => ({
          id: pair.id || `concept-${index}`,
          name: pair.term || `Term ${index}`,
          description: pair.definition || `Definition ${index}`,
        }));
      }
      // Or use existing concepts if available
      else if (gameData.concepts) {
        concepts = gameData.concepts as Concept[];
      }
      // Create dummy concepts if neither exists (shouldn't happen normally)
      else {
        concepts = [
          {
            id: "placeholder-concept",
            name: "Placeholder Term",
            description: "This is a placeholder for a matching game",
          },
        ];
      }

      // Create placeholder questions using the concepts
      const placeholderQuestions: QuizQuestion[] = concepts
        .slice(0, 1)
        .map((concept, index) => ({
          id: index + 1,
          question: "This is a matching game - launch it to play!",
          explanation: "Match terms with their definitions",
          correctConcept: concept.id,
          options: [concept.id],
        }));

      return {
        id: `remote-${remoteGame.id}`,
        title: remoteGame.title || "Matching Game",
        description:
          remoteGame.description || "Match terms with their definitions",
        icon: gameTypeIcons[gameType] || "puzzle",
        questions: placeholderQuestions,
        concepts: concepts,
        image: gameData.metadata?.image,
      };
    } else if (gameTypeLower === "flashcard") {
      // Handle flashcard games
      // For flashcard games, we'll also create placeholder questions and concepts
      let concepts: Concept[] = [];

      // Convert cards to concepts if they exist
      if (gameData.cards) {
        concepts = gameData.cards.map((card, index) => ({
          id: card.id || `concept-${index}`,
          name: card.front || `Front ${index}`,
          description: card.back || `Back ${index}`,
        }));
      }
      // Or use existing concepts if available
      else if (gameData.concepts) {
        concepts = gameData.concepts as Concept[];
      }
      // Create dummy concepts if neither exists
      else {
        concepts = [
          {
            id: "placeholder-concept",
            name: "Placeholder Card Front",
            description: "This is a placeholder for a flashcard game",
          },
        ];
      }

      // Create placeholder questions using the concepts
      const placeholderQuestions: QuizQuestion[] = concepts
        .slice(0, 1)
        .map((concept, index) => ({
          id: index + 1,
          question: "This is a flashcard game - launch it to play!",
          explanation: "Review with flashcards",
          correctConcept: concept.id,
          options: [concept.id],
        }));

      return {
        id: `remote-${remoteGame.id}`,
        title: remoteGame.title || "Flashcard Game",
        description: remoteGame.description || "Review with flashcards",
        icon: gameTypeIcons[gameType] || "book",
        questions: placeholderQuestions,
        concepts: concepts,
        image: gameData.metadata?.image,
      };
    }

    // If we reach here, we couldn't create a module
    console.warn(`Unsupported game type: ${gameType}`);
    return null;
  } catch (error) {
    console.error("Error converting remote game:", error);
    return null;
  }
};

/**
 * Add options to questions for quiz display
 * Each question needs 4 options, with one being the correct answer
 */
const addOptionsToQuestions = (
  questions: Array<{
    id: number;
    question: string;
    explanation: string;
    correctConcept: string;
    options?: string[];
  }>,
  concepts: Concept[]
): QuizQuestion[] => {
  return questions.map((question) => {
    // If options are already defined, use them
    if (question.options && question.options.length > 0) {
      return question as QuizQuestion;
    }

    // Get the correct concept
    const correctConcept = concepts.find(
      (c) => c.id === question.correctConcept
    );
    if (!correctConcept) {
      console.error(`Correct concept not found for question: ${question.id}`);
      return question as QuizQuestion;
    }

    // Get 3 random incorrect options
    const incorrectOptions = concepts
      .filter((c) => c.id !== question.correctConcept)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((c) => c.id);

    // Create options array with correct option at random position
    const randomPosition = Math.floor(Math.random() * 4);
    const options = [...incorrectOptions];
    options.splice(randomPosition, 0, question.correctConcept);

    return {
      ...question,
      options: options.slice(0, 4), // Ensure we have exactly 4 options
    };
  });
};

// Function to dynamically register a new quiz module
export const registerQuizModule = (module: QuizDataModule) => {
  // Check if a module with this ID already exists
  if (!quizDataRegistry.some((quiz) => quiz.id === module.id)) {
    quizDataRegistry.push(module);
    console.log(
      `Quiz module registered: ${module.id} (${module.title}) - Game type: ${
        module.icon || "unknown"
      }`
    );
  } else {
    console.log(
      `Quiz module ${module.id} (${module.title}) already registered`
    );
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

/**
 * Transform API data structure into matching game format
 */
export const transformMatchingGameData = (
  remoteGame: RemoteGame
): MatchingGameData => {
  if (!remoteGame || !remoteGame.data) {
    console.error("Invalid remote game data for matching game:", remoteGame);
    return null;
  }

  const gameData = remoteGame.data;

  // Ensure we have pairs with the right structure
  let pairs = gameData.pairs;
  if (!pairs && gameData.concepts) {
    // If we have concepts but no pairs, convert concepts to pairs format
    pairs = gameData.concepts.map((concept) => ({
      id: concept.id,
      term: concept.name,
      definition: concept.description,
    }));
  } else if (!pairs) {
    // If no pairs and no concepts, create dummy pairs for testing
    console.warn("No pairs or concepts found for matching game");
    pairs = [
      {
        id: "dummy-1",
        term: "Sample Term",
        definition: "Sample Definition",
      },
    ];
  }

  return {
    data: { pairs },
    metadata: {
      id: `remote-${remoteGame.id}`,
      title: remoteGame.title || "Matching Game",
      description:
        remoteGame.description || "Match terms with their definitions",
      icon:
        gameTypeIcons[remoteGame.gameType?.toLowerCase() || "matching"] ||
        "puzzle",
    },
  };
};

/**
 * Transform API data structure into flashcard game format
 */
export const transformFlashcardGameData = (
  remoteGame: RemoteGame
): FlashcardGameData => {
  if (!remoteGame || !remoteGame.data) {
    console.error("Invalid remote game data for flashcard game:", remoteGame);
    return null;
  }

  const gameData = remoteGame.data;

  // Ensure we have cards with the right structure
  let cards = gameData.cards;
  if (!cards && gameData.concepts) {
    // If we have concepts but no cards, convert concepts to cards format
    cards = gameData.concepts.map((concept) => ({
      id: concept.id,
      front: concept.name,
      back: concept.description,
    }));
  } else if (!cards) {
    // If no cards, create dummy cards for testing
    console.warn("No cards or concepts found for flashcard game");
    cards = [
      {
        id: "dummy-1",
        front: "Sample Front",
        back: "Sample Back",
      },
    ];
  }

  return {
    data: { cards },
    metadata: {
      id: `remote-${remoteGame.id}`,
      title: remoteGame.title || "Flashcard Game",
      description: remoteGame.description || "Review with flashcards",
      icon:
        gameTypeIcons[remoteGame.gameType?.toLowerCase() || "flashcard"] ||
        "book",
    },
  };
};

/**
 * Transform API data structure into quiz game format
 */
export const transformQuizGameData = (
  remoteGame: RemoteGame
): QuizGameData | null => {
  if (!remoteGame || !remoteGame.data) {
    console.error("Invalid remote game data for quiz game:", remoteGame);
    return null;
  }

  const gameModule = convertRemoteGameToModule(remoteGame);
  if (!gameModule) {
    console.error("Failed to convert remote game to module:", remoteGame);
    return null;
  }

  return {
    questions: gameModule.questions,
    options: gameModule.concepts,
    metadata: {
      id: gameModule.id,
      title: gameModule.title,
      description: gameModule.description,
      icon: gameModule.icon,
      image: gameModule.image,
    },
  };
};

// Load quiz data dynamically based on quizId
export const loadQuizData = async (quizId: string): Promise<GameData> => {
  // If this is a remote game (ID starts with "remote-"), fetch from API
  if (quizId.startsWith("remote-")) {
    try {
      const remoteId = quizId.replace("remote-", "");
      const remoteGame = (await fetchGameById(remoteId)) as RemoteGame;

      if (!remoteGame) {
        console.error(`Game with ID ${remoteId} not found`);
        return null;
      }

      // Get the game type (case-insensitive)
      const gameType = remoteGame.gameType?.toLowerCase() || "quiz";

      // Get current page path to determine what component we're in
      const currentPath = window.location.pathname;
      const isInQuizGame = currentPath.includes("quiz-game");
      const isInMatchingGame = currentPath.includes("matching-game");
      const isInFlashcardGame = currentPath.includes("flashcard-game");

      // Determine if we need to redirect based on game type and current path
      const shouldRedirect =
        (gameType === "matching" && !isInMatchingGame) ||
        (gameType === "flashcard" && !isInFlashcardGame) ||
        (gameType === "quiz" && !isInQuizGame);

      // If redirection is needed, return the redirect object
      if (shouldRedirect) {
        return {
          redirect: true,
          gameType: gameType,
          gameId: quizId,
        };
      }

      // Process the data according to the game type
      if (gameType === "matching" && isInMatchingGame) {
        return transformMatchingGameData(remoteGame);
      } else if (gameType === "flashcard" && isInFlashcardGame) {
        return transformFlashcardGameData(remoteGame);
      } else if (gameType === "quiz" && isInQuizGame) {
        // Register the module for quiz games if not already registered
        const gameModule = convertRemoteGameToModule(remoteGame);
        if (gameModule && !quizDataRegistry.some((q) => q.id === quizId)) {
          registerQuizModule(gameModule);
        }

        return transformQuizGameData(remoteGame);
      }
    } catch (error) {
      console.error(`Error loading remote game ${quizId}:`, error);
      return null;
    }
  }

  // For local quiz games (non-remote IDs)
  const quiz = quizDataRegistry.find((q) => q.id === quizId);

  if (!quiz) {
    console.error(`Quiz data for ${quizId} not found`);
    return null;
  }

  return {
    questions: quiz.questions,
    options: quiz.concepts,
    metadata: {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      icon: quiz.icon,
      image: quiz.image,
    },
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
  }
};
