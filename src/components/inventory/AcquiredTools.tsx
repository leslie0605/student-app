
import React from 'react';
import { MagicalTool } from '@/types/inventory';
import ToolCard from './ToolCard';
import { Skeleton } from '@/components/ui/skeleton';

interface AcquiredToolsProps {
  tools: MagicalTool[];
  onToggleAcquired: (toolId: string, acquired: boolean) => void;
  isLoading: boolean;
}

const AcquiredTools: React.FC<AcquiredToolsProps> = ({ tools, onToggleAcquired, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-2">No tools acquired yet</h3>
        <p className="text-muted-foreground">
          Start collecting magical tools to aid your graduate school journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Magical Arsenal</h2>
      <p className="text-muted-foreground mb-6">
        These are the magical tools you've acquired to aid your grad school journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onToggleAcquired={onToggleAcquired} 
          />
        ))}
      </div>
    </div>
  );
};

export default AcquiredTools;
