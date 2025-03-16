
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import ToolDashboard from '@/components/inventory/ToolDashboard';
import { fetchMagicalTools } from '@/services/inventoryService';
import { useToast } from '@/components/ui/use-toast';

const MagicalInventory = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch tools data
  const { data: tools = [], isLoading: isToolsLoading } = useQuery({
    queryKey: ['magical-tools'],
    queryFn: fetchMagicalTools
  });
  
  // Handle selecting a tool
  const handleSelectTool = (toolId: string) => {
    // Log which tool was clicked
    console.info(`Tool ${toolId} clicked`);
    
    // Handle navigation based on tool ID
    switch(toolId) {
      case 'lor':
        navigate('/magical-inventory/lor');
        break;
      case 'cv':
        navigate('/magical-inventory/cv');
        break;
      case 'sop':
        navigate('/magical-inventory/sop');
        break;
      case 'phs':
        navigate('/magical-inventory/phs');
        break;
      case 'language':
        navigate('/magical-inventory/language');
        break;
      case 'gpa':
        navigate('/magical-inventory/gpa');
        break;
      default:
        toast({
          title: 'Tool not implemented',
          description: 'This tool is not yet implemented.',
          variant: 'destructive',
        });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
            Magical Tools Inventory
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and use magical tools to aid your graduate school journey.
            Each tool helps you prepare different aspects of your application.
          </p>
        </div>
        
        <ToolDashboard
          tools={tools}
          onSelectTool={handleSelectTool}
          isLoading={isToolsLoading}
        />
      </div>
    </div>
  );
};

export default MagicalInventory;
