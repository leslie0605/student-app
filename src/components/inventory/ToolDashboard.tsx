
import React from 'react';
import { MagicalTool } from '@/types/inventory';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, FileText, Target, User, Languages, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolDashboardProps {
  tools: MagicalTool[];
  onSelectTool: (toolId: string) => void;
  isLoading: boolean;
}

const ToolDashboard: React.FC<ToolDashboardProps> = ({ tools, onSelectTool, isLoading }) => {
  // Get icon based on tool id
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return <Mail className="h-6 w-6" />;
      case 'file-text':
        return <FileText className="h-6 w-6" />;
      case 'target':
        return <Target className="h-6 w-6" />;
      case 'user':
        return <User className="h-6 w-6" />;
      case 'languages':
        return <Languages className="h-6 w-6" />;
      case 'calculator':
        return <Calculator className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  
  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-500';
      case 'in-progress':
        return 'bg-blue-100 text-blue-500';
      case 'completed':
        return 'bg-green-100 text-green-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Not Started';
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Card 
          key={tool.id}
          className="transition-all duration-300 hover:shadow-lg hover:border-primary/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "p-2 rounded-lg",
                getStatusColor(tool.status)
              )}>
                {getToolIcon(tool.icon)}
              </div>
              <div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <CardDescription className="mt-1">
                  Status: {getStatusLabel(tool.status)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tool.description}</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onSelectTool(tool.id)}
              className="w-full"
            >
              Open Tool
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ToolDashboard;
