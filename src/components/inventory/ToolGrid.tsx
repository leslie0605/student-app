
import React from 'react';
import { MagicalTool } from '@/types/inventory';
import ToolCard from './ToolCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolGridProps {
  tools: MagicalTool[];
  onToggleAcquired: (toolId: string, acquired: boolean) => void;
  isLoading: boolean;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, onToggleAcquired, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <h3 className="text-xl font-bold text-gray-700 mb-2">No magical tools found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or discover new tools on your journey.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard 
          key={tool.id} 
          tool={tool} 
          onToggleAcquired={onToggleAcquired} 
        />
      ))}
    </div>
  );
};

export default ToolGrid;
