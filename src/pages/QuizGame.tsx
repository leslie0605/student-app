
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brainRegions, quizQuestions } from '@/data/brainQuizData';
import BrainDiagram from '@/components/BrainDiagram';
import ProgressBar from '@/components/ProgressBar';
import QuizFeedback from '@/components/QuizFeedback';
import GameStats from '@/components/GameStats';
import ResultsScreen, { QuizStats } from '@/components/ResultsScreen';
import QuizReview from '@/components/QuizReview';
import { 
  isQuizCompleted, 
  getCompletedQuiz, 
  saveCompletedQuiz, 
  UserQuizAnswer,
  CompletedQuiz 
} from '@/utils/quizUtils';
import { toast } from 'sonner';
import { Brain, ChevronLeft, Award, Trophy, Star, Badge, Sparkles } from 'lucide-react';

// Define achievements with multiple levels
const ACHIEVEMENTS = [
  // Brain Master achievements (Answer questions)
  ...[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((threshold, index) => ({
    id: `brain_master_${index + 1}`,
    name: 'Brain Master',
    description: `Answer ${threshold} questions correctly`,
    icon: <Brain className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => stats.totalCorrect >= threshold,
    level: index + 1
  })),

  // XP Champ achievements (Total XP)
  ...[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((threshold, index) => ({
    id: `xp_champ_${index + 1}`,
    name: 'XP Champ',
    description: `Earn ${threshold} XP total`,
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => stats.totalXP >= threshold,
    level: index + 1
  })),

  // Streak Legend achievements (Streak totals)
  ...[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((threshold, index) => ({
    id: `streak_legend_${index + 1}`,
    name: 'Streak Legend',
    description: `Achieve a streak of ${threshold}`,
    icon: <Star className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => stats.highestStreak >= threshold,
    level: index + 1
  }))
];

// Default stats
const DEFAULT_STATS: QuizStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  highestStreak: 0,
  totalXP: 0,
  completedQuizzes: 0,
  achievements: []
};

const QUIZ_ID = 'brain-quiz';

const QuizGame = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [gameStats, setGameStats] = useState({
    xp: 0,
    health: 100,
    streak: 0,
    correctAnswers: 0
  });
  const [quizStats, setQuizStats] = useState<QuizStats>(DEFAULT_STATS);
  const [newAchievements, setNewAchievements] = useState<typeof ACHIEVEMENTS>([]);
  const [isQuizAlreadyCompleted, setIsQuizAlreadyCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserQuizAnswer[]>([]);
  const [isInReviewMode, setIsInReviewMode] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const correctRegion = currentQuestion?.correctRegion;

  // Check if the quiz is already completed on component mount
  useEffect(() => {
    const completed = isQuizCompleted(QUIZ_ID);
    setIsQuizAlreadyCompleted(completed);
    
    if (completed) {
      const completedQuiz = getCompletedQuiz(QUIZ_ID);
      if (completedQuiz) {
        setUserAnswers(completedQuiz.userAnswers);
        setIsInReviewMode(true);
      }
    }
    
    // Load saved stats from localStorage
    const savedStats = localStorage.getItem('brainQuizStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setQuizStats(parsedStats);
      } catch (e) {
        console.error('Error parsing saved quiz stats', e);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('brainQuizStats', JSON.stringify(quizStats));
  }, [quizStats]);
  
  const handleRegionClick = (regionId: string) => {
    if (selectedRegion || showFeedback || isInReviewMode) return;
    
    setSelectedRegion(regionId);
    
    const isCorrect = regionId === correctRegion;
    
    // Update game stats
    if (isCorrect) {
      const xpGain = 10 + (gameStats.streak * 2);
      setGameStats(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        streak: prev.streak + 1,
        correctAnswers: prev.correctAnswers + 1
      }));
      toast.success(`+${xpGain} XP gained!`);
    } else {
      setGameStats(prev => ({
        ...prev,
        health: Math.max(0, prev.health - 10),
        streak: 0
      }));
      toast.error("Oops! Lost 10 HP");
    }
    
    // Save user answer
    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedRegionId: regionId,
        isCorrect: isCorrect
      }
    ]);
    
    setShowFeedback(true);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedRegion(null);
      setShowFeedback(false);
    } else {
      // End of quiz - Show results screen
      const updatedStats: QuizStats = {
        totalAnswered: quizStats.totalAnswered + quizQuestions.length,
        totalCorrect: quizStats.totalCorrect + gameStats.correctAnswers,
        highestStreak: Math.max(quizStats.highestStreak, gameStats.streak),
        totalXP: quizStats.totalXP + gameStats.xp,
        completedQuizzes: quizStats.completedQuizzes + 1,
        achievements: [...quizStats.achievements]
      };

      // Check for new achievements
      const newUnlockedAchievements = ACHIEVEMENTS
        .filter(achievement => 
          !updatedStats.achievements.includes(achievement.id) && 
          achievement.condition(updatedStats)
        )
        .map(achievement => ({
          ...achievement,
          isNew: true
        }));

      // Add new achievement IDs to the updated stats
      if (newUnlockedAchievements.length > 0) {
        updatedStats.achievements = [
          ...updatedStats.achievements,
          ...newUnlockedAchievements.map(a => a.id)
        ];

        // Show toast for new achievements
        newUnlockedAchievements.forEach(achievement => {
          toast.success(`🏆 Achievement unlocked: ${achievement.name} Lv.${achievement.level}!`);
        });
      }

      // Save completed quiz data
      const completedQuiz: CompletedQuiz = {
        quizId: QUIZ_ID,
        completedAt: new Date().toISOString(),
        score: gameStats.correctAnswers,
        totalQuestions: quizQuestions.length,
        userAnswers: userAnswers
      };
      
      saveCompletedQuiz(completedQuiz);
      setIsQuizAlreadyCompleted(true);
      
      // Save updated stats
      setQuizStats(updatedStats);
      setNewAchievements(newUnlockedAchievements);
      setShowResults(true);
    }
  };

  const handlePlayAgain = () => {
    navigate('/quiz-selection');
  };
  
  const handleStartNewQuiz = () => {
    setIsInReviewMode(false);
  };

  // Get brain regions for the current question's options
  const displayRegions = currentQuestion 
    ? brainRegions.filter(region => currentQuestion.options.includes(region.id))
    : [];

  // Find the selected and correct brain region objects
  const selectedRegionObject = selectedRegion ? 
    brainRegions.find(region => region.id === selectedRegion) || null : null;
    
  const correctRegionObject = brainRegions.find(region => region.id === correctRegion) || brainRegions[0];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-magic-light to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => navigate('/quiz-selection')}
            className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Quiz Selection</span>
          </button>
        </div>
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-magic-purple/10 px-3 py-1 rounded-full text-magic-purple text-sm font-medium mb-2">
            <Brain className="h-4 w-4" />
            <span>Brain Function Quiz</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Discover How Your Brain Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the fascinating world of neuroscience by identifying which brain regions are responsible for everyday experiences.
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
              <h2 className="text-2xl font-bold mb-2">Quiz Already Completed!</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                You've already completed this quiz. Would you like to review your previous answers or try a different quiz?
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
                onClick={() => navigate('/quiz-selection')}
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
              totalSteps={quizQuestions.length}
              className="mb-8"
            />
            
            {!showFeedback ? (
              <div className="space-y-8 animate-fade-up">
                <div className="p-6 rounded-xl glass-effect shadow-lg border border-magic-blue/20">
                  <h2 className="text-xl font-bold mb-4">Question {currentQuestionIndex + 1}:</h2>
                  <p className="text-lg mb-4">{currentQuestion.question}</p>
                  <p className="text-sm text-muted-foreground">Select the brain region you think is responsible:</p>
                </div>
                
                <BrainDiagram 
                  regions={displayRegions}
                  selectedRegion={selectedRegion}
                  correctRegion={showFeedback ? correctRegion : null}
                  onRegionClick={handleRegionClick}
                  disabled={!!selectedRegion || showFeedback}
                />
              </div>
            ) : (
              <QuizFeedback 
                isCorrect={selectedRegion === correctRegion}
                selectedRegion={selectedRegionObject}
                correctRegion={correctRegionObject}
                explanation={currentQuestion.explanation}
                onNext={handleNextQuestion}
              />
            )}
          </>
        ) : (
          <ResultsScreen 
            score={gameStats.correctAnswers}
            totalQuestions={quizQuestions.length}
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
                <div className="text-2xl font-bold text-magic-purple">{quizStats.totalCorrect}</div>
                <div className="text-xs text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-magic-blue">{quizStats.highestStreak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-magic-pink">{quizStats.totalXP}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-amber-500">{quizStats.achievements.length}</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
