
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
  // Get icon based on tool icon property
  const getToolIcon = () => {
    switch (tool.icon) {
      case 'mail':
        return <Wand2 className="h-5 w-5" />;
      case 'file-text':
        return <Beaker className="h-5 w-5" />;
      case 'target':
        return <BookOpen className="h-5 w-5" />;
      case 'user':
        return <Sparkles className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gray-100">
            {getToolIcon()}
          </div>
          <h3 className="font-semibold text-lg">{tool.name}</h3>
        </div>
        <Badge className="bg-gray-500 text-white">
          {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default"
          onClick={() => onToggleAcquired(tool.id, true)}
          className="w-full"
        >
          Open Tool
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
