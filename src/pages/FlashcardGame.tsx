
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ProgressBar";
import {
  loadQuizData,
  saveQuizStats,
  getQuizStats,
  FlashcardGameData,
} from "@/utils/quizUtils";
import { toast } from "sonner";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
}

const FlashcardGame = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<string[]>([]);
  const [knownCards, setKnownCards] = useState<string[]>([]);

  useEffect(() => {
    const loadGame = async () => {
      if (!quizId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await loadQuizData(quizId);

        // Log the received data for debugging
        console.log("Received flashcard game data:", data);

        // Check for valid data structure
        if (!data) {
          setError("Game not found");
          return;
        }

        // Check for redirect
        if ("redirect" in data) {
          // This should not happen if navigation is working correctly
          navigate(`/${data.gameType}-game/${data.gameId}`);
          return;
        }

        // Check for flashcard game data structure
        if (!("data" in data)) {
          setError("Invalid game data format");
          return;
        }

        // Check if it's a flashcard game or matching game
        if ('cards' in data.data) {
          // It's a flashcard game
          setGameTitle(data.metadata?.title || "Flashcard Game");
          setCards(data.data.cards);
        } else if ('pairs' in data.data) {
          // It's a matching game, but we're in FlashcardGame component
          // Convert pairs to flashcard format
          const convertedCards = data.data.pairs.map(pair => ({
            id: pair.id,
            front: pair.term,
            back: pair.definition,
          }));
          setGameTitle(data.metadata?.title || "Flashcard Game");
          setCards(convertedCards);
        } else {
          setError("Invalid game data format for flashcard game");
        }
      } catch (error) {
        console.error("Error loading flashcard game:", error);
        setError("Failed to load game data");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [quizId, navigate]);

  const goToNextCard = () => {
    // First, mark current card as reviewed if not already
    if (!reviewedCards.includes(cards[currentCardIndex].id)) {
      setReviewedCards([...reviewedCards, cards[currentCardIndex].id]);
    }

    // Reset flip state
    setIsFlipped(false);

    // Go to next card or loop back to start
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // If we've gone through all cards once
      if (reviewedCards.length >= cards.length) {
        // Game completed
        updateGameStats();
        toast.success("You've reviewed all flashcards!");
      }

      // Loop back to beginning
      setCurrentCardIndex(0);
    }
  };

  const goToPreviousCard = () => {
    // Reset flip state
    setIsFlipped(false);

    // Go to previous card or loop to end
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(cards.length - 1);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsKnown = () => {
    const currentCardId = cards[currentCardIndex].id;

    // First, mark as reviewed if not already
    if (!reviewedCards.includes(currentCardId)) {
      setReviewedCards([...reviewedCards, currentCardId]);
    }

    // Mark as known
    if (!knownCards.includes(currentCardId)) {
      setKnownCards([...knownCards, currentCardId]);
      toast.success("Card marked as known!");
    }

    // Go to next card
    goToNextCard();
  };

  const resetGame = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setReviewedCards([]);
    setKnownCards([]);

    toast("Game reset", {
      description: "Study all cards from the beginning!",
    });
  };

  const updateGameStats = () => {
    // Calculate score based on known cards
    const score = Math.round((knownCards.length / cards.length) * 100);

    // Update stats in localStorage
    const stats = getQuizStats();
    saveQuizStats({
      ...stats,
      totalAnswered: stats.totalAnswered + reviewedCards.length,
      totalCorrect: stats.totalCorrect + knownCards.length,
      totalXP: stats.totalXP + score,
      completedQuizzes: stats.completedQuizzes + 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-b from-magic-light to-white">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-t-2 border-magic-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-medium">Loading flashcards...</h2>
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
          <h2 className="text-xl font-medium mb-2">Error Loading Flashcards</h2>
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

  if (cards.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-b from-magic-light to-white">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl font-medium mb-2">No Flashcards Available</h2>
          <p className="text-muted-foreground mb-6">
            This game doesn't have any flashcards.
          </p>
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
    (reviewedCards.length / cards.length) * 100
  );
  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24">
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
            <span>Reset</span>
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{gameTitle}</h1>
          <p className="text-muted-foreground">
            Tap the card to flip it and test your knowledge
          </p>

          <div className="flex items-center justify-between mt-6 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Card: </span>
              <span className="font-medium">
                {currentCardIndex + 1} / {cards.length}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Known: </span>
              <span className="font-medium">
                {knownCards.length} / {cards.length}
              </span>
            </div>
          </div>

          <ProgressBar
            progress={progressPercentage}
            className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
            showText={false}
          />
        </div>

        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          <div
            className={cn(
              "w-full max-w-2xl aspect-[3/2] rounded-xl perspective-1000 transition-all duration-500 cursor-pointer",
              isFlipped ? "rotate-y-180" : ""
            )}
            onClick={flipCard}
          >
            {/* Front of card */}
            <div
              className={cn(
                "absolute inset-0 bg-white rounded-xl p-8 flex flex-col items-center justify-center border-2 border-magic-purple/30 shadow-lg backface-hidden transition-all duration-500",
                isFlipped ? "opacity-0" : "opacity-100"
              )}
            >
              <h3 className="text-2xl font-bold mb-2">{currentCard.front}</h3>
              <div className="absolute bottom-4 text-magic-purple/60 flex items-center gap-1">
                <RotateCw className="h-4 w-4" />
                <span className="text-sm">Tap to reveal</span>
              </div>
            </div>

            {/* Back of card */}
            <div
              className={cn(
                "absolute inset-0 bg-magic-purple/5 rounded-xl p-8 flex flex-col items-center justify-center border-2 border-magic-purple shadow-lg backface-hidden rotate-y-180 transition-all duration-500",
                isFlipped ? "opacity-100" : "opacity-0"
              )}
            >
              <p className="text-lg">{currentCard.back}</p>
              {currentCard.category && (
                <div className="mt-4 px-3 py-1 bg-magic-purple/10 rounded-full text-sm text-magic-purple">
                  {currentCard.category}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={goToPreviousCard}
            className="p-3 rounded-full bg-white border border-gray-200 hover:border-magic-purple/50 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-magic-purple" />
          </button>

          <button
            onClick={markAsKnown}
            className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span>I Know This</span>
          </button>

          <button
            onClick={goToNextCard}
            className="p-3 rounded-full bg-white border border-gray-200 hover:border-magic-purple/50 transition-all"
          >
            <ArrowRight className="h-5 w-5 text-magic-purple" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGame;
