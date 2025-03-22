import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw, Check, X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ProgressBar";
import {
  loadQuizData,
  saveQuizStats,
  getQuizStats,
  MatchingGameData,
} from "@/utils/quizUtils";
import { toast } from "sonner";

interface MatchingPair {
  id: string;
  term: string;
  definition: string;
}

interface MatchingGameState {
  pairs: MatchingPair[];
  shuffledDefinitions: MatchingPair[];
  selectedTerm: string | null;
  selectedDefinition: string | null;
  matchedPairs: string[];
  attempts: number;
  correctMatches: number;
  isCompleted: boolean;
}

const MatchingGame = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameState, setGameState] = useState<MatchingGameState>({
    pairs: [],
    shuffledDefinitions: [],
    selectedTerm: null,
    selectedDefinition: null,
    matchedPairs: [],
    attempts: 0,
    correctMatches: 0,
    isCompleted: false,
  });

  useEffect(() => {
    const loadGame = async () => {
      if (!quizId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await loadQuizData(quizId);

        // Log the received data for debugging
        console.log("Received matching game data:", data);

        // Check for valid data structure
        if (!data) {
          setError("No game data received");
          return;
        }

        // Check for redirect
        if ("redirect" in data) {
          // This should not happen if navigation is working correctly
          navigate(`/${data.gameType}-game/${data.gameId}`);
          return;
        }

        // Check for matching game data structure
        if (!("data" in data) || !data.data.pairs) {
          setError("Invalid game data format for matching game");
          return;
        }

        // We now know it's matching game data
        const matchingData = data as MatchingGameData;

        setGameTitle(matchingData.metadata?.title || "Matching Game");

        // Initialize game with pairs from the data
        const pairs = matchingData.data.pairs;
        const shuffledDefinitions = [...pairs].sort(() => Math.random() - 0.5);

        setGameState({
          pairs,
          shuffledDefinitions,
          selectedTerm: null,
          selectedDefinition: null,
          matchedPairs: [],
          attempts: 0,
          correctMatches: 0,
          isCompleted: false,
        });
      } catch (error) {
        console.error("Error loading matching game:", error);
        setError("Failed to load game data");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [quizId, navigate]);

  const handleTermSelect = (pairId: string) => {
    if (gameState.matchedPairs.includes(pairId) || gameState.isCompleted)
      return;

    if (gameState.selectedTerm === pairId) {
      // Deselect if already selected
      setGameState((prev) => ({
        ...prev,
        selectedTerm: null,
      }));
    } else {
      // Select new term and check for match if a definition is already selected
      setGameState((prev) => {
        const newState = { ...prev, selectedTerm: pairId };

        if (prev.selectedDefinition) {
          return checkForMatch(newState);
        }

        return newState;
      });
    }
  };

  const handleDefinitionSelect = (pairId: string) => {
    if (gameState.matchedPairs.includes(pairId) || gameState.isCompleted)
      return;

    if (gameState.selectedDefinition === pairId) {
      // Deselect if already selected
      setGameState((prev) => ({
        ...prev,
        selectedDefinition: null,
      }));
    } else {
      // Select new definition and check for match if a term is already selected
      setGameState((prev) => {
        const newState = { ...prev, selectedDefinition: pairId };

        if (prev.selectedTerm) {
          return checkForMatch(newState);
        }

        return newState;
      });
    }
  };

  const checkForMatch = (state: MatchingGameState): MatchingGameState => {
    const { selectedTerm, selectedDefinition, pairs, matchedPairs } = state;

    if (!selectedTerm || !selectedDefinition) return state;

    const newState = {
      ...state,
      attempts: state.attempts + 1,
    };

    // Check if the term and definition belong to the same pair
    if (selectedTerm === selectedDefinition) {
      // It's a match!
      toast.success("Correct match!");

      const newMatchedPairs = [...matchedPairs, selectedTerm];
      const isCompleted = newMatchedPairs.length === pairs.length;

      if (isCompleted) {
        // Game completed
        toast.success("Congratulations! You've matched all pairs!");
        updateGameStats(newState.attempts, pairs.length);
      }

      return {
        ...newState,
        matchedPairs: newMatchedPairs,
        selectedTerm: null,
        selectedDefinition: null,
        correctMatches: newState.correctMatches + 1,
        isCompleted,
      };
    } else {
      // Not a match
      toast.error("Not a match. Try again!");

      return {
        ...newState,
        selectedTerm: null,
        selectedDefinition: null,
      };
    }
  };

  const updateGameStats = (attempts: number, totalPairs: number) => {
    // Calculate score: 100% for perfect matching, reduced for more attempts
    const perfectScore = totalPairs;
    const score = Math.max(50, Math.round(100 * (perfectScore / attempts)));

    // Update stats in localStorage
    const stats = getQuizStats();
    saveQuizStats({
      ...stats,
      totalAnswered: stats.totalAnswered + attempts,
      totalCorrect: stats.totalCorrect + totalPairs,
      totalXP: stats.totalXP + score,
      completedQuizzes: stats.completedQuizzes + 1,
    });
  };

  const resetGame = () => {
    // Shuffle definitions again
    const shuffledDefinitions = [...gameState.pairs].sort(
      () => Math.random() - 0.5
    );

    setGameState({
      ...gameState,
      shuffledDefinitions,
      selectedTerm: null,
      selectedDefinition: null,
      matchedPairs: [],
      attempts: 0,
      correctMatches: 0,
      isCompleted: false,
    });

    toast("Game reset", {
      description: "Try to match all terms with their definitions!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-b from-magic-light to-white">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-t-2 border-magic-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-medium">Loading game...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-b from-magic-light to-white">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-medium mb-2">Error Loading Game</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate("/quiz-selection")}
            className="px-4 py-2 bg-magic-purple text-white rounded-lg hover:bg-magic-purple/90 transition-colors"
          >
            Back to Game Selection
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(
    (gameState.matchedPairs.length / gameState.pairs.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <div className="container mx-auto max-w-5xl px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/quiz-selection")}
            className="flex items-center gap-1 text-muted-foreground hover:text-magic-purple transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Selection</span>
          </button>

          <button
            onClick={resetGame}
            className="flex items-center gap-1 text-muted-foreground hover:text-magic-purple transition-all"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            <span>Reset Game</span>
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{gameTitle}</h1>
          <p className="text-muted-foreground">
            Match each term with its correct definition
          </p>

          <div className="flex items-center justify-between mt-6 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Matched: </span>
              <span className="font-medium">
                {gameState.matchedPairs.length} / {gameState.pairs.length}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Attempts: </span>
              <span className="font-medium">{gameState.attempts}</span>
            </div>
          </div>

          <ProgressBar
            progress={progressPercentage}
            className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
            showText={false}
          />
        </div>

        {gameState.isCompleted ? (
          <div className="glass-effect rounded-xl p-8 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Game Completed!</h2>
            <p className="text-lg mb-4">
              You matched all {gameState.pairs.length} pairs in{" "}
              {gameState.attempts} attempts!
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-magic-purple text-white rounded-lg hover:bg-magic-purple/90 transition-colors"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Terms Column */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-center mb-2">Terms</h2>
              {gameState.pairs.map((pair) => (
                <div
                  key={`term-${pair.id}`}
                  className={cn(
                    "p-4 rounded-lg cursor-pointer transition-all",
                    gameState.matchedPairs.includes(pair.id)
                      ? "bg-green-100 border-2 border-green-500"
                      : gameState.selectedTerm === pair.id
                      ? "bg-magic-purple/10 border-2 border-magic-purple"
                      : "bg-white border border-gray-200 hover:border-magic-purple/50"
                  )}
                  onClick={() => handleTermSelect(pair.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{pair.term}</span>
                    {gameState.matchedPairs.includes(pair.id) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Definitions Column */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-center mb-2">
                Definitions
              </h2>
              {gameState.shuffledDefinitions.map((pair) => (
                <div
                  key={`def-${pair.id}`}
                  className={cn(
                    "p-4 rounded-lg cursor-pointer transition-all",
                    gameState.matchedPairs.includes(pair.id)
                      ? "bg-green-100 border-2 border-green-500"
                      : gameState.selectedDefinition === pair.id
                      ? "bg-magic-purple/10 border-2 border-magic-purple"
                      : "bg-white border border-gray-200 hover:border-magic-purple/50"
                  )}
                  onClick={() => handleDefinitionSelect(pair.id)}
                >
                  <div className="flex items-center justify-between">
                    <p>{pair.definition}</p>
                    {gameState.matchedPairs.includes(pair.id) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingGame;
