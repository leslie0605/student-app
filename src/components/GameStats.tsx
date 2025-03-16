
import React from 'react';
import { cn } from '@/lib/utils';
import { Trophy, Heart, Zap } from 'lucide-react';

interface GameStatsProps {
  xp: number;
  health: number;
  streak: number;
}

const GameStats: React.FC<GameStatsProps> = ({ xp, health, streak }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 my-4">
      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
        <Zap className="h-5 w-5 text-magic-blue" />
        <span className="font-medium">{xp} XP</span>
      </div>
      
      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
        <Heart className="h-5 w-5 text-magic-pink" />
        <span className="font-medium">{health} HP</span>
      </div>
      
      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
        <Trophy className="h-5 w-5 text-magic-purple" />
        <span className="font-medium">Streak: {streak}</span>
      </div>
    </div>
  );
};

export default GameStats;
