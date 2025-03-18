
import React from "react";
import { cn } from "@/lib/utils";
import { Concept } from "@/utils/quizUtils";
import { Button } from "@/components/ui/button";

interface QuizDiagramProps {
  regions: Concept[];
  selectedRegion: string | null;
  correctConcept: string | null;
  onRegionClick: (regionId: string) => void;
  disabled: boolean;
  quizId: string;
}

const QuizDiagram: React.FC<QuizDiagramProps> = ({
  regions,
  selectedRegion,
  correctConcept,
  onRegionClick,
  disabled,
  quizId,
}) => {
  // Map quiz IDs to their corresponding diagram images
  const quizImages: Record<string, string> = {
    "brain-quiz": "/lovable-uploads/22d2e7af-4b10-4247-b980-a365152c6ff1.png",
    "physics-quiz": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    "music-quiz": "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80",
    "math-quiz": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    "biology-quiz": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80",
  };

  const defaultImage = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80";
  const imageUrl = quizImages[quizId] || defaultImage;

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-auto shadow-lg animate-fade-in">
      {/* Quiz diagram image */}
      <img
        src={imageUrl}
        alt="Quiz Diagram"
        className="w-full h-auto rounded-lg mb-4 object-cover aspect-video"
      />

      {/* Display options as rectangular buttons */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {regions.map((region) => (
          <Button
            key={region.id}
            onClick={() => !disabled && onRegionClick(region.id)}
            disabled={disabled}
            variant={
              region.id === selectedRegion
                ? "default"
                : region.id === correctConcept && selectedRegion
                ? "outline"
                : "secondary"
            }
            className={cn(
              "text-xs sm:text-sm p-2 h-auto transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-magic-purple focus:ring-offset-2",
              region.id === selectedRegion
                ? "bg-magic-pink text-white shadow-lg"
                : region.id === correctConcept && selectedRegion
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

export default QuizDiagram;
