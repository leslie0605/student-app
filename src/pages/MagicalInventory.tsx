
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainNavbar from '@/components/MainNavbar';
import ToolFilter from '@/components/inventory/ToolFilter';
import ToolGrid from '@/components/inventory/ToolGrid';
import AcquiredTools from '@/components/inventory/AcquiredTools';
import { fetchMagicalTools, fetchToolTypes, fetchToolRarities, toggleToolAcquired } from '@/services/inventoryService';
import { MagicalTool } from '@/types/inventory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const MagicalInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter states
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [acquisitionStatus, setAcquisitionStatus] = useState<string>("all");
  
  // Fetch data
  const { data: tools = [], isLoading: isToolsLoading } = useQuery({
    queryKey: ['magical-tools'],
    queryFn: fetchMagicalTools
  });
  
  const { data: types = [], isLoading: isTypesLoading } = useQuery({
    queryKey: ['tool-types'],
    queryFn: fetchToolTypes
  });
  
  const { data: rarities = [], isLoading: isRaritiesLoading } = useQuery({
    queryKey: ['tool-rarities'],
    queryFn: fetchToolRarities
  });
  
  // Mutation for toggling acquisition status
  const toggleAcquiredMutation = useMutation({
    mutationFn: ({ toolId, acquired }: { toolId: string; acquired: boolean }) => 
      toggleToolAcquired(toolId, acquired),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['magical-tools'] });
      toast({
        title: 'Success!',
        description: 'Tool acquisition status updated.',
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
  
  // Handle toggling tool acquisition status
  const handleToggleAcquired = (toolId: string, acquired: boolean) => {
    toggleAcquiredMutation.mutate({ toolId, acquired });
  };
  
  // Filter tools based on selected criteria
  const filteredTools = tools.filter(tool => {
    let matchesType = true;
    let matchesRarity = true;
    let matchesAcquisition = true;
    
    if (selectedType && selectedType !== 'all') {
      matchesType = tool.type === selectedType;
    }
    
    if (selectedRarity && selectedRarity !== 'all') {
      matchesRarity = tool.rarity === selectedRarity;
    }
    
    if (acquisitionStatus && acquisitionStatus !== 'all') {
      matchesAcquisition = acquisitionStatus === 'acquired' ? tool.acquired : !tool.acquired;
    }
    
    return matchesType && matchesRarity && matchesAcquisition;
  });
  
  // Get acquired tools
  const acquiredTools = tools.filter(tool => tool.acquired);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
            Magical Tools Inventory
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and collect magical tools to aid your graduate school journey.
            Track your arsenal and unlock new possibilities.
          </p>
        </div>
        
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="inventory">My Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <ToolFilter
              types={types}
              rarities={rarities}
              selectedType={selectedType}
              selectedRarity={selectedRarity}
              acquisitionStatus={acquisitionStatus}
              onTypeChange={setSelectedType}
              onRarityChange={setSelectedRarity}
              onAcquisitionStatusChange={setAcquisitionStatus}
              isLoading={isTypesLoading || isRaritiesLoading}
            />
            
            <ToolGrid
              tools={filteredTools}
              onToggleAcquired={handleToggleAcquired}
              isLoading={isToolsLoading}
            />
          </TabsContent>
          
          <TabsContent value="inventory">
            <AcquiredTools
              tools={acquiredTools}
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
