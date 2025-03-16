
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
    <div className="relative w-full max-w-3xl mx-auto aspect-auto shadow-lg animate-fade-in">
      {/* Brain diagram image */}
      <img 
        src="/lovable-uploads/22d2e7af-4b10-4247-b980-a365152c6ff1.png" 
        alt="Brain Diagram" 
        className="w-full h-auto rounded-lg"
      />
      
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
            "w-8 h-8 rounded-full flex items-center justify-center transition-all-300 text-xs font-medium",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-magic-purple focus:ring-offset-2",
            disabled ? "cursor-default" : "cursor-pointer",
            region.id === selectedRegion 
              ? "bg-magic-pink text-white shadow-lg scale-110" 
              : region.id === correctRegion && selectedRegion 
                ? "bg-green-500 text-white shadow-lg scale-110" 
                : "bg-white/80 text-magic-dark shadow hover:shadow-md hover:bg-white"
          )}
          aria-label={region.name}
          title={region.name}
        >
          <span className="text-[10px] pointer-events-none">{region.id.charAt(0).toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default BrainDiagram;
