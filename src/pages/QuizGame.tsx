
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brainRegions, quizQuestions } from '@/data/brainQuizData';
import BrainDiagram from '@/components/BrainDiagram';
import ProgressBar from '@/components/ProgressBar';
import QuizFeedback from '@/components/QuizFeedback';
import GameStats from '@/components/GameStats';
import { toast } from 'sonner';
import { Brain, ChevronLeft } from 'lucide-react';

const QuizGame = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStats, setGameStats] = useState({
    xp: 0,
    health: 100,
    streak: 0,
    correctAnswers: 0
  });

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const correctRegion = currentQuestion?.correctRegion;
  
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
      // End of quiz
      const score = (gameStats.correctAnswers / quizQuestions.length) * 100;
      toast.success(`Quiz complete! Your score: ${score.toFixed(1)}%`);
      
      // Add achievements based on score
      if (score >= 80) {
        toast("🏆 Achievement unlocked: Brain Master!");
      } else if (score >= 60) {
        toast("🥇 Achievement unlocked: Neuroscience Enthusiast!");
      } else if (score >= 40) {
        toast("🧠 Achievement unlocked: Brain Explorer!");
      }
      
      // Reset for new game or navigate to results
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

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
              <p className="text-sm text-muted-foreground">Click on the brain region you think is responsible:</p>
            </div>
            
            <BrainDiagram 
              regions={brainRegions}
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
      </div>
    </div>
  );
};

export default QuizGame;
