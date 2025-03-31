import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getQuizTitle,
  getQuizDescriptions,
  isQuizCompleted,
  getAvailableQuizIds,
  getQuizIcon,
  initializeQuizzes,
  quizDataRegistry,
  QuizDataModule,
} from "@/utils/quizUtils";
import { fetchGameById } from "@/utils/api";

// Use dynamic icons from Lucide React
import * as LucideIcons from "lucide-react";

// Interface for quiz data
interface QuizData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Default icon for quizzes without a specific icon
const defaultQuizIcon = <BookOpen className="h-8 w-8 text-magic-purple" />;

// Get the proper icon based on icon name
const getQuizIconComponent = (quizId: string): React.ReactNode => {
  const iconName = getQuizIcon(quizId);

  if (iconName) {
    // Try to get the icon from Lucide dynamically
    // Use unknown as intermediate type to avoid TS errors
    const iconMap = LucideIcons as unknown as Record<
      string,
      React.FC<{ className?: string }>
    >;
    const IconComponent =
      iconMap[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    if (IconComponent) {
      return <IconComponent className="h-8 w-8 text-magic-purple" />;
    }
  }

  return defaultQuizIcon;
};

const QuizSelection = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      // Initialize the quizzes
      await initializeQuizzes();

      // Get the available quiz IDs
      const availableQuizIds = getAvailableQuizIds();

      // Map the IDs to quiz data
      const availableQuizzes: QuizData[] = availableQuizIds.map((quizId) => ({
        id: quizId,
        title: getQuizTitle(quizId),
        description: getQuizDescriptions(quizId),
        icon: getQuizIconComponent(quizId),
      }));

      setQuizzes(availableQuizzes);
    } catch (error) {
      console.error("Failed to load quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of quizzes
  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleQuizSelect = (quizId: string) => {
    console.log(`Selecting quiz with ID: ${quizId}`);

    // Determine which game type to navigate to based on quiz ID
    if (quizId.startsWith("remote-")) {
      // For remote games, check the actual game type from the registry
      const gameModule = quizDataRegistry.find((q) => q.id === quizId);
      console.log(`Found game module in registry:`, gameModule ? "Yes" : "No");

      if (gameModule) {
        const gameType = getGameTypeFromModule(gameModule);
        console.log(`Game module details:`, {
          id: gameModule.id,
          title: gameModule.title,
          icon: gameModule.icon,
          type: gameType,
        });

        // Route to the correct game type based on the detected type
        if (gameType === "matching") {
          console.log(`Navigating to matching game from registry: ${quizId}`);
          navigate(`/matching-game/${quizId}`);
        } else if (gameType === "flashcard") {
          console.log(`Navigating to flashcard game from registry: ${quizId}`);
          navigate(`/flashcard-game/${quizId}`);
        } else {
          // Default to quiz game
          console.log(`Navigating to quiz game from registry: ${quizId}`);
          navigate(`/quiz-game/${quizId}`);
        }
        return;
      }

      // If we don't have the game in registry yet, we need to fetch it
      console.log(`Game not in registry, fetching from backend...`);
      const remoteId = quizId.replace("remote-", "");
      fetchGameById(remoteId)
        .then((game) => {
          console.log(
            `Fetched game from backend:`,
            game
              ? {
                  id: game.id,
                  title: game.title,
                  gameType: game.gameType,
                }
              : "Not found"
          );

          if (game) {
            const gameType = game.gameType?.toLowerCase();
            console.log(`Game type detected: ${gameType}`);

            // Navigate to the appropriate game page based on type
            if (gameType === "matching") {
              console.log(`Navigating to matching game: ${quizId}`);
              navigate(`/matching-game/${quizId}`);
            } else if (gameType === "flashcard") {
              console.log(`Navigating to flashcard game: ${quizId}`);
              navigate(`/flashcard-game/${quizId}`);
            } else {
              // Default to quiz game
              console.log(`Navigating to quiz game (default): ${quizId}`);
              navigate(`/quiz-game/${quizId}`);
            }
          } else {
            // If game not found, just use quiz game as fallback
            console.log(`Game not found, using quiz game as fallback`);
            navigate(`/quiz-game/${quizId}`); // Fallback
          }
        })
        .catch((error) => {
          console.error("Error fetching game details:", error);
          console.log(`Error occurred, falling back to quiz game`);
          navigate(`/quiz-game/${quizId}`); // Fallback
        });
    } else {
      // For local games, we assume they're quiz games
      console.log(`Navigating to local quiz game: ${quizId}`);
      navigate(`/quiz-game/${quizId}`);
    }
  };

  // Helper function to determine game type from module
  const getGameTypeFromModule = (module: QuizDataModule): string => {
    // Try to infer game type from icon
    if (module.icon) {
      if (module.icon.toLowerCase() === "puzzle") return "matching";
      if (module.icon.toLowerCase() === "book") return "flashcard";
      if (module.icon.toLowerCase() === "brain") return "quiz";
    }

    // Otherwise, assume it's a quiz based on having questions
    return module.questions && module.questions.length > 0 ? "quiz" : "unknown";
  };

  const handleRefresh = () => {
    loadQuizzes();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-magic-light to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
            disabled={loading}
          >
            <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
            <span>Refresh Games</span>
          </button>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-magic-purple/10 px-3 py-1 rounded-full text-magic-purple text-sm font-medium mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Educational Games</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Choose Your Knowledge Challenge
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a quiz category to test your knowledge and learn interesting
            facts across different subjects.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p>Loading available quizzes...</p>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {quizzes.map((quiz) => {
              const completed = isQuizCompleted(quiz.id);
              const isRemoteQuiz = quiz.id.startsWith("remote-");

              return (
                <div
                  key={quiz.id}
                  className={cn(
                    "p-6 rounded-xl border transition-all duration-300",
                    "bg-white border-magic-purple/30 cursor-pointer",
                    "hover:shadow-lg hover:translate-y-[-2px]",
                    isRemoteQuiz && "border-green-300" // Highlight remote quizzes
                  )}
                  onClick={() => handleQuizSelect(quiz.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center",
                        isRemoteQuiz ? "bg-green-100" : "bg-magic-purple/10"
                      )}
                    >
                      {quiz.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                        {isRemoteQuiz && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                            From Mentor
                          </span>
                        )}
                        {completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {quiz.description}
                      </p>

                      <button
                        className={cn(
                          "mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          completed
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : isRemoteQuiz
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-magic-purple/10 text-magic-purple hover:bg-magic-purple/20"
                        )}
                      >
                        {completed ? "Review Quiz" : "Start Quiz"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>
              No quizzes available. Your mentor hasn't assigned any games yet.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-magic-purple text-white rounded-lg hover:bg-magic-purple/90"
            >
              Check Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSelection;
