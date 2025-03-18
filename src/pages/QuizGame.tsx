import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuizDiagram from "@/components/QuizDiagram";
import ProgressBar from "@/components/ProgressBar";
import QuizFeedback from "@/components/QuizFeedback";
import GameStats from "@/components/GameStats";
import ResultsScreen from "@/components/ResultsScreen";
import QuizReview from "@/components/QuizReview";
import {
  isQuizCompleted,
  getCompletedQuiz,
  saveCompletedQuiz,
  UserQuizAnswer,
  CompletedQuiz,
  loadQuizData,
  getQuizTitle,
  getQuizDescriptions,
  getQuizStats,
  saveQuizStats,
} from "@/utils/quizUtils";
import { toast } from "sonner";
import {
  Brain,
  ChevronLeft,
  Award,
  Trophy,
  Star,
  Badge,
  Sparkles,
  PieChart,
  Atom,
  Calculator,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define achievements with multiple levels
const ACHIEVEMENTS = [
  // Brain Master achievements (Answer questions)
  ...[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((threshold, index) => ({
    id: `quiz_master_${index + 1}`,
    name: "Quiz Master",
    description: `Answer ${threshold} questions correctly`,
    icon: <Brain className="h-5 w-5 text-amber-500" />,
    condition: (stats: any) => stats.totalCorrect >= threshold,
    level: index + 1,
  })),

  // XP Champ achievements (Total XP)
  ...[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map(
    (threshold, index) => ({
      id: `xp_champ_${index + 1}`,
      name: "XP Champ",
      description: `Earn ${threshold} XP total`,
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      condition: (stats: any) => stats.totalXP >= threshold,
      level: index + 1,
    })
  ),

  // Streak Legend achievements (Streak totals)
  ...[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((threshold, index) => ({
    id: `streak_legend_${index + 1}`,
    name: "Streak Legend",
    description: `Achieve a streak of ${threshold}`,
    icon: <Star className="h-5 w-5 text-amber-500" />,
    condition: (stats: any) => stats.highestStreak >= threshold,
    level: index + 1,
  })),
];

// Map of quiz icons by quiz ID
const quizIconMap: Record<string, React.ReactNode> = {
  "brain-quiz": <Brain className="h-4 w-4" />,
  "physics-quiz": <Atom className="h-4 w-4" />,
};

// Default icon for quizzes without a specific icon
const defaultQuizIcon = <BookOpen className="h-4 w-4" />;

const QuizGame = () => {
  const navigate = useNavigate();
  const { quizId = "" } = useParams<{ quizId: string }>();

  const [quizData, setQuizData] = useState<{
    questions: any[];
    options: any[];
  } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [gameStats, setGameStats] = useState({
    xp: 0,
    health: 100,
    streak: 0,
    correctAnswers: 0,
  });
  const [quizStats, setQuizStats] = useState(getQuizStats());
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [isQuizAlreadyCompleted, setIsQuizAlreadyCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserQuizAnswer[]>([]);
  const [isInReviewMode, setIsInReviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load quiz data and check if it's already completed
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load quiz data based on quizId
        const data = loadQuizData(quizId);
        if (!data) {
          setError(`Quiz data for ${quizId} not found or not yet implemented.`);
          return;
        }

        setQuizData(data);

        // Check if quiz is already completed
        const completed = isQuizCompleted(quizId);
        setIsQuizAlreadyCompleted(completed);

        if (completed) {
          const completedQuiz = getCompletedQuiz(quizId);
          if (completedQuiz) {
            setUserAnswers(completedQuiz.userAnswers);
            setIsInReviewMode(true);
          }
        }
      } catch (e) {
        console.error("Error loading quiz:", e);
        setError("Failed to load quiz data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Early returns for loading and error states
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-magic-light to-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-magic-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-magic-light to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 flex items-center">
            <button
              onClick={() => navigate("/quiz-selection")}
              className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Quiz Selection</span>
            </button>
          </div>

          <div className="w-full max-w-lg mx-auto p-6 rounded-xl glass-effect border border-magic-pink/20 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-magic-pink">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={() => navigate("/quiz-selection")}
                className="mt-6 py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md bg-gradient-to-r from-magic-blue to-magic-purple text-white hover:shadow-lg hover:translate-y-[-2px]"
              >
                Return to Quiz Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-magic-light to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 flex items-center">
            <button
              onClick={() => navigate("/quiz-selection")}
              className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Quiz Selection</span>
            </button>
          </div>

          <div className="w-full max-w-lg mx-auto p-6 rounded-xl glass-effect border border-magic-pink/20 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-magic-pink">
                Quiz Not Available
              </h2>
              <p className="text-muted-foreground">
                This quiz is not yet available or under development.
              </p>
              <button
                onClick={() => navigate("/quiz-selection")}
                className="mt-6 py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md bg-gradient-to-r from-magic-blue to-magic-purple text-white hover:shadow-lg hover:translate-y-[-2px]"
              >
                Return to Quiz Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { questions, options } = quizData;
  const currentQuestion = questions[currentQuestionIndex];
  const correctOptionId = currentQuestion?.correctConcept;

  // Find the selected and correct option objects
  const selectedOptionObject = selectedOption
    ? options.find((option: any) => option.id === selectedOption) || null
    : null;

  const correctOptionObject =
    options.find((option: any) => option.id === correctOptionId) || options[0];

  const handleOptionClick = (optionId: string) => {
    if (selectedOption || showFeedback || isInReviewMode) return;

    setSelectedOption(optionId);

    const isCorrect = optionId === correctOptionId;

    // Update game stats
    if (isCorrect) {
      const xpGain = 10 + gameStats.streak * 2;
      setGameStats((prev) => ({
        ...prev,
        xp: prev.xp + xpGain,
        streak: prev.streak + 1,
        correctAnswers: prev.correctAnswers + 1,
      }));
      toast.success(`+${xpGain} XP gained!`);
    } else {
      setGameStats((prev) => ({
        ...prev,
        health: Math.max(0, prev.health - 10),
        streak: 0,
      }));
      toast.error("Oops! Lost 10 HP");
    }

    // Save user answer
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        isCorrect: isCorrect,
      },
    ]);

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // End of quiz - Show results screen
      const updatedStats = {
        totalAnswered: quizStats.totalAnswered + questions.length,
        totalCorrect: quizStats.totalCorrect + gameStats.correctAnswers,
        highestStreak: Math.max(quizStats.highestStreak, gameStats.streak),
        totalXP: quizStats.totalXP + gameStats.xp,
        completedQuizzes: quizStats.completedQuizzes + 1,
        achievements: [...quizStats.achievements],
      };

      // Check for new achievements
      const newUnlockedAchievements = ACHIEVEMENTS.filter(
        (achievement) =>
          !updatedStats.achievements.includes(achievement.id) &&
          achievement.condition(updatedStats)
      ).map((achievement) => ({
        ...achievement,
        isNew: true,
      }));

      // Add new achievement IDs to the updated stats
      if (newUnlockedAchievements.length > 0) {
        updatedStats.achievements = [
          ...updatedStats.achievements,
          ...newUnlockedAchievements.map((a) => a.id),
        ];

        // Show toast for new achievements
        newUnlockedAchievements.forEach((achievement) => {
          toast.success(
            `🏆 Achievement unlocked: ${achievement.name} Lv.${achievement.level}!`
          );
        });
      }

      // Save completed quiz data
      const completedQuiz: CompletedQuiz = {
        quizId,
        completedAt: new Date().toISOString(),
        score: gameStats.correctAnswers,
        totalQuestions: questions.length,
        userAnswers: userAnswers,
      };

      saveCompletedQuiz(completedQuiz);
      setIsQuizAlreadyCompleted(true);

      // Save updated stats
      setQuizStats(updatedStats);
      saveQuizStats(updatedStats);
      setNewAchievements(newUnlockedAchievements);
      setShowResults(true);
    }
  };

  const handlePlayAgain = () => {
    navigate("/quiz-selection");
  };

  const handleStartNewQuiz = () => {
    setIsInReviewMode(false);
  };

  // Get options for the current question
  const displayOptions = currentQuestion
    ? options.filter((option: any) =>
        currentQuestion.options.includes(option.id)
      )
    : [];

  // Get quiz title and icon based on quiz ID
  const quizTitle = getQuizTitle(quizId);
  const quizDescription = getQuizDescriptions(quizId);

  // Get quiz icon based on quiz ID
  const getQuizIcon = () => {
    return quizIconMap[quizId] || defaultQuizIcon;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-magic-light to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate("/quiz-selection")}
            className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Quiz Selection</span>
          </button>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-magic-purple/10 px-3 py-1 rounded-full text-magic-purple text-sm font-medium mb-2">
            {getQuizIcon()}
            <span>{quizTitle}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Test Your Knowledge
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {quizDescription}
          </p>
        </div>

        {!isInReviewMode && !isQuizAlreadyCompleted && (
          <GameStats
            xp={gameStats.xp}
            health={gameStats.health}
            streak={gameStats.streak}
          />
        )}

        {isInReviewMode ? (
          <QuizReview
            userAnswers={userAnswers}
            onStartNewQuiz={handleStartNewQuiz}
          />
        ) : isQuizAlreadyCompleted && !showResults ? (
          <div className="w-full max-w-lg mx-auto p-6 rounded-xl glass-effect border border-magic-blue/20 shadow-lg animate-fade-up">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-magic-purple/10 mb-4">
                <Trophy className="h-8 w-8 text-magic-purple" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Quiz Already Completed!
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                You've already completed this quiz. Would you like to review
                your previous answers or try a different quiz?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsInReviewMode(true)}
                className="flex-1 py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md bg-gradient-to-r from-magic-blue to-magic-purple text-white hover:shadow-lg hover:translate-y-[-2px] flex items-center justify-center gap-2"
              >
                <Star className="h-5 w-5" />
                Review Answers
              </button>

              <button
                onClick={() => navigate("/quiz-selection")}
                className="flex-1 py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md bg-white text-magic-dark border border-magic-blue/20 hover:bg-magic-blue/5 hover:border-magic-blue/30 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Quiz Selection
              </button>
            </div>
          </div>
        ) : !showResults ? (
          <>
            <ProgressBar
              currentStep={currentQuestionIndex + 1}
              totalSteps={questions.length}
              className="mb-8"
            />

            {!showFeedback ? (
              <div className="space-y-8 animate-fade-up">
                <div className="p-6 rounded-xl glass-effect shadow-lg border border-magic-blue/20">
                  <h2 className="text-xl font-bold mb-4">
                    Question {currentQuestionIndex + 1}:
                  </h2>
                  <p className="text-lg mb-4">{currentQuestion.question}</p>
                  <p className="text-sm text-muted-foreground">
                    Select the correct answer:
                  </p>
                </div>

                <QuizDiagram
                  regions={displayOptions}
                  selectedRegion={selectedOption}
                  correctConcept={showFeedback ? correctOptionId : null}
                  onRegionClick={handleOptionClick}
                  disabled={!!selectedOption || showFeedback}
                  quizId={quizId}
                />
              </div>
            ) : (
              <QuizFeedback
                isCorrect={selectedOption === correctOptionId}
                selectedRegion={selectedOptionObject}
                correctConcept={correctOptionObject}
                explanation={currentQuestion.explanation}
                onNext={handleNextQuestion}
              />
            )}
          </>
        ) : (
          <ResultsScreen
            score={gameStats.correctAnswers}
            totalQuestions={questions.length}
            stats={quizStats}
            newAchievements={newAchievements}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {/* Stats Summary (visible on larger screens) */}
        <div className="mt-12 hidden md:block">
          <div className="p-6 rounded-xl glass-effect shadow-sm border border-magic-blue/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-magic-blue" />
              Your Progress
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-magic-purple">
                  {quizStats.totalCorrect}
                </div>
                <div className="text-xs text-muted-foreground">
                  Correct Answers
                </div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-magic-blue">
                  {quizStats.highestStreak}
                </div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-magic-pink">
                  {quizStats.totalXP}
                </div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-amber-500">
                  {quizStats.achievements.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Achievements
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
