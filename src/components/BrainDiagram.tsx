
import React from 'react';
import { cn } from '@/lib/utils';
import { BrainRegion } from '@/data/brainQuizData';

interface BrainDiagramProps {
  regions: BrainRegion[];
  selectedRegion: string | null;
  correctRegion: string | null;
  onRegionClick: (regionId: string) => void;
  disabled: boolean;
}

const BrainDiagram: React.FC<BrainDiagramProps> = ({
  regions,
  selectedRegion,
  correctRegion,
  onRegionClick,
  disabled
}) => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square bg-magic-light rounded-full overflow-hidden glass-effect shadow-lg animate-fade-in">
      {/* Brain background image would typically go here - for now using a placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-magic-purple/10 to-magic-blue/20 rounded-full"></div>
      
      {regions.map((region) => (
        <button
          key={region.id}
          onClick={() => !disabled && onRegionClick(region.id)}
          disabled={disabled}
          style={{
            position: 'absolute',
            left: `${region.coordinates.x}%`,
            top: `${region.coordinates.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all-300 text-xs font-medium",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-magic-purple focus:ring-offset-2",
            disabled ? "cursor-default" : "cursor-pointer",
            region.id === selectedRegion 
              ? "bg-magic-pink text-white shadow-lg scale-110" 
              : region.id === correctRegion && selectedRegion 
                ? "bg-green-500 text-white shadow-lg scale-110" 
                : "bg-white/80 text-magic-dark shadow hover:shadow-md hover:bg-white"
          )}
          aria-label={region.name}
        >
          <span className="text-xs pointer-events-none">{region.name.split(' ')[0]}</span>
        </button>
      ))}

      {/* Brain region connections - simplified visual representation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" viewBox="0 0 100 100">
        <path d="M30,40 Q50,30 70,50" className="stroke-magic-purple/30 stroke-2 fill-none" />
        <path d="M35,60 Q50,50 65,60" className="stroke-magic-blue/30 stroke-2 fill-none" />
        <path d="M50,30 Q60,50 75,50" className="stroke-magic-pink/30 stroke-2 fill-none" />
        <path d="M45,65 Q55,75 60,90" className="stroke-magic-purple/30 stroke-2 fill-none" />
      </svg>
    </div>
  );
};

export default BrainDiagram;
