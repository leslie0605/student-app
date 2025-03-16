
import React from 'react';
import { cn } from '@/lib/utils';
import { BrainRegion } from '@/data/brainQuizData';
import { Button } from '@/components/ui/button';

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
      
      {/* Display brain region options as rectangular buttons */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {regions.map((region) => (
          <Button
            key={region.id}
            onClick={() => !disabled && onRegionClick(region.id)}
            disabled={disabled}
            variant={
              region.id === selectedRegion 
                ? "default" 
                : region.id === correctRegion && selectedRegion 
                  ? "outline" 
                  : "secondary"
            }
            className={cn(
              "text-xs sm:text-sm p-2 h-auto transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-magic-purple focus:ring-offset-2",
              region.id === selectedRegion 
                ? "bg-magic-pink text-white shadow-lg" 
                : region.id === correctRegion && selectedRegion 
                  ? "bg-green-500 text-white border-green-600" 
                  : "hover:bg-magic-purple/10"
            )}
            aria-label={region.name}
            title={region.name}
          >
            {region.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BrainDiagram;
