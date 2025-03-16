import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brainRegions, quizQuestions } from '@/data/brainQuizData';
import BrainDiagram from '@/components/BrainDiagram';
import ProgressBar from '@/components/ProgressBar';
import QuizFeedback from '@/components/QuizFeedback';
import GameStats from '@/components/GameStats';
import ResultsScreen, { QuizStats } from '@/components/ResultsScreen';
import { toast } from 'sonner';
import { Brain, ChevronLeft, Award, Trophy, Star, Badge } from 'lucide-react';

// Define achievements
const ACHIEVEMENTS = [
  {
    id: 'brain_beginner_1',
    name: 'Brain Beginner Lv.1',
    description: 'Answer 5 questions correctly',
    icon: <Brain className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => stats.totalCorrect >= 5
  },
  {
    id: 'brain_explorer_1',
    name: 'Brain Explorer Lv.1',
    description: 'Complete 1 full quiz',
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => stats.completedQuizzes >= 1
  },
  {
    id: 'brain_master_1',
    name: 'Brain Master Lv.1',
    description: 'Achieve a streak of 3 correct answers',
    icon: <Star className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => stats.highestStreak >= 3
  },
  {
    id: 'brain_genius_1',
    name: 'Brain Genius Lv.1',
    description: 'Earn 100 XP total',
    icon: <Badge className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => stats.totalXP >= 100
  },
  {
    id: 'brain_expert_1',
    name: 'Brain Expert Lv.1',
    description: 'Get 90% correct in a quiz',
    icon: <Award className="h-5 w-5 text-amber-500" />,
    condition: (stats: QuizStats) => (stats.totalCorrect / quizQuestions.length) >= 0.9
  }
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

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const correctRegion = currentQuestion?.correctRegion;

  // Load saved stats from localStorage on component mount
  useEffect(() => {
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
    if (selectedRegion || showFeedback) return;
    
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
          toast.success(`🏆 Achievement unlocked: ${achievement.name}!`);
        });
      }

      // Save updated stats
      setQuizStats(updatedStats);
      setNewAchievements(newUnlockedAchievements);
      setShowResults(true);
    }
  };

  const handlePlayAgain = () => {
    // Reset quiz state but keep overall stats
    setCurrentQuestionIndex(0);
    setSelectedRegion(null);
    setShowFeedback(false);
    setShowResults(false);
    setGameStats({
      xp: 0,
      health: 100,
      streak: 0,
      correctAnswers: 0
    });
    setNewAchievements([]);
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
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Home</span>
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
        
        <GameStats 
          xp={gameStats.xp} 
          health={gameStats.health} 
          streak={gameStats.streak} 
        />
        
        {!showResults ? (
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
