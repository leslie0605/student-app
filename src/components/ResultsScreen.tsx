
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Award, Trophy, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: QuizStats) => boolean;
  isNew?: boolean;
  level?: number;
}

export interface QuizStats {
  totalAnswered: number;
  totalCorrect: number;
  highestStreak: number;
  totalXP: number;
  completedQuizzes: number;
  achievements: string[];
}

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  stats: QuizStats;
  newAchievements: Achievement[];
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalQuestions,
  stats,
  newAchievements,
  onPlayAgain
}) => {
  const navigate = useNavigate();
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let feedbackMessage = "Great effort!";
  let feedbackClass = "text-magic-blue";
  
  if (percentage >= 90) {
    feedbackMessage = "Incredible mastery!";
    feedbackClass = "text-magic-purple";
  } else if (percentage >= 70) {
    feedbackMessage = "Well done!";
    feedbackClass = "text-magic-blue";
  } else if (percentage >= 50) {
    feedbackMessage = "Good job!";
    feedbackClass = "text-amber-500";
  } else if (percentage >= 30) {
    feedbackMessage = "Keep practicing!";
    feedbackClass = "text-orange-500";
  } else {
    feedbackMessage = "Don't give up!";
    feedbackClass = "text-magic-pink";
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-up p-6 rounded-xl glass-effect border border-magic-blue/20 shadow-lg">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-magic-purple/10 mb-4">
          <Trophy className="h-8 w-8 text-magic-purple" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p className={cn("text-lg font-medium", feedbackClass)}>{feedbackMessage}</p>
        
        <div className="flex justify-center items-center gap-2 my-4">
          <div className="text-4xl font-bold text-magic-purple">{score}</div>
          <div className="text-2xl text-muted-foreground">/</div>
          <div className="text-2xl text-muted-foreground">{totalQuestions}</div>
        </div>
        
        <p className="text-muted-foreground">
          You've earned <span className="font-medium text-magic-blue">{score * 10} XP</span> this quiz!
        </p>
      </div>
      
      {newAchievements.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span>Achievements Unlocked!</span>
          </h3>
          
          <div className="space-y-3">
            {newAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-pulse"
              >
                <div className="flex-shrink-0">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-amber-600">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.level && (
                  <div className="flex-shrink-0">
                    <Badge className="bg-amber-500 hover:bg-amber-600">Level {achievement.level}</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md",
            "bg-gradient-to-r from-magic-blue to-magic-purple text-white",
            "hover:shadow-lg hover:translate-y-[-2px]",
            "active:translate-y-[0px]",
            "flex items-center justify-center gap-2"
          )}
        >
          <Star className="h-5 w-5" />
          Play Again
        </button>
        
        <button
          onClick={() => navigate('/')}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md",
            "bg-white text-magic-dark border border-magic-blue/20",
            "hover:bg-magic-blue/5 hover:border-magic-blue/30",
            "flex items-center justify-center gap-2"
          )}
        >
          <ArrowRight className="h-5 w-5" />
          Home
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
