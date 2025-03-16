
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainNavbar from '@/components/MainNavbar';
import ToolFilter from '@/components/inventory/ToolFilter';
import ToolGrid from '@/components/inventory/ToolGrid';
import AcquiredTools from '@/components/inventory/AcquiredTools';
import { fetchMagicalTools, updateToolStatus } from '@/services/inventoryService';
import { MagicalTool } from '@/types/inventory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const MagicalInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter states
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [toolStatus, setToolStatus] = useState<string>("all");
  
  // Fetch tools data
  const { data: tools = [], isLoading: isToolsLoading } = useQuery({
    queryKey: ['magical-tools'],
    queryFn: fetchMagicalTools
  });
  
  // Empty types and rarities since we're not using them in this version
  const types: Array<{ id: string; name: string }> = [];
  const rarities: Array<{ id: string; name: string }> = [];
  
  // Mutation for updating tool status
  const updateToolStatusMutation = useMutation({
    mutationFn: ({ toolId, status }: { toolId: string; status: string }) => 
      updateToolStatus(toolId, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['magical-tools'] });
      toast({
        title: 'Success!',
        description: 'Tool status updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update tool status.',
        variant: 'destructive',
      });
    }
  });
  
  // Handle toggling tool status (placeholder function)
  const handleToggleAcquired = (toolId: string, acquired: boolean) => {
    // In our implementation we'll just redirect to the specific tool page
    console.log(`Tool ${toolId} clicked`);
  };
  
  // Filter tools based on selected status
  const filteredTools = tools.filter(tool => {
    let matchesStatus = true;
    
    if (toolStatus && toolStatus !== 'all') {
      matchesStatus = tool.status === toolStatus;
    }
    
    return matchesStatus;
  });
  
  // Get completed tools
  const completedTools = tools.filter(tool => tool.status === 'completed');
  
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
            Track your progress and unlock new possibilities.
          </p>
        </div>
        
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <ToolFilter
              types={types}
              rarities={rarities}
              selectedType={selectedType}
              selectedRarity={selectedRarity}
              acquisitionStatus={toolStatus}
              onTypeChange={setSelectedType}
              onRarityChange={setSelectedRarity}
              onAcquisitionStatusChange={setToolStatus}
              isLoading={isToolsLoading}
            />
            
            <ToolGrid
              tools={filteredTools}
              onToggleAcquired={handleToggleAcquired}
              isLoading={isToolsLoading}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <AcquiredTools
              tools={completedTools}
              onToggleAcquired={handleToggleAcquired}
              isLoading={isToolsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MagicalInventory;
