
import React from 'react';
import { MagicalTool } from '@/types/inventory';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Beaker, BookOpen, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: MagicalTool;
  onToggleAcquired: (toolId: string, acquired: boolean) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onToggleAcquired }) => {
  // Get icon based on tool type
  const getToolIcon = () => {
    switch (tool.type) {
      case 'wand':
        return <Wand2 className="h-5 w-5" />;
      case 'potion':
        return <Beaker className="h-5 w-5" />;
      case 'book':
        return <BookOpen className="h-5 w-5" />;
      case 'artifact':
        return <Sparkles className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // Get color based on rarity
  const getRarityColor = () => {
    switch (tool.rarity) {
      case 'common':
        return 'bg-gray-500 text-white';
      case 'uncommon':
        return 'bg-green-500 text-white';
      case 'rare':
        return 'bg-blue-500 text-white';
      case 'legendary':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg", 
      tool.acquired ? "border-green-200" : "border-gray-200"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "p-2 rounded-lg",
            tool.acquired ? "bg-green-100" : "bg-gray-100"
          )}>
            {getToolIcon()}
          </div>
          <h3 className="font-semibold text-lg">{tool.name}</h3>
        </div>
        <Badge className={getRarityColor()}>
          {tool.rarity.charAt(0).toUpperCase() + tool.rarity.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Power:</span>
          <div className="flex">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < tool.power ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={tool.acquired ? "outline" : "default"}
          onClick={() => onToggleAcquired(tool.id, !tool.acquired)}
          className="w-full"
        >
          {tool.acquired ? "Mark as Unacquired" : "Mark as Acquired"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
