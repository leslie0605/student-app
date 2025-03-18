
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainNavbar from '@/components/MainNavbar';
import UniversityFilter from '@/components/university/UniversityFilter';
import UniversityGrid from '@/components/university/UniversityGrid';
import SavedUniversities from '@/components/university/SavedUniversities';
import { fetchUniversities, fetchFields, fetchLocations, toggleUniversitySaved, createApplicationTask } from '@/services/universityService';
import { University, Field, Location } from '@/types/university';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { addApplicationTask } from '@/services/journeyService';
import { ApplicationTask } from '@/types/journey';
import { TooltipProvider } from '@/components/ui/tooltip';

const UniversityBucket = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter states with valid default values
  const [selectedField, setSelectedField] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [programType, setProgramType] = useState<string>("all");
  
  // Fetch universities, fields, and locations
  const { data: universities = [], isLoading: isUnisLoading } = useQuery({
    queryKey: ['universities'],
    queryFn: fetchUniversities
  });
  
  const { data: fields = [], isLoading: isFieldsLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: fetchFields
  });
  
  const { data: locations = [], isLoading: isLocationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations
  });
  
  // Mutation for creating application tasks
  const createTaskMutation = useMutation({
    mutationFn: (university: University) => {
      const task: Omit<ApplicationTask, 'id'> = {
        title: `Submit ${university.name} application`,
        description: `Complete and submit application to ${university.name}.`,
        dueDate: university.applicationDeadline || new Date().toISOString(),
        completed: false,
        category: 'Submissions',
        university: university.name,
        priority: 'high'
      };
      return addApplicationTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicationTasks'] });
    }
  });
  
  // Mutation for toggling saved status
  const toggleSavedMutation = useMutation({
    mutationFn: ({ universityId, saved }: { universityId: string; saved: boolean }) => 
      toggleUniversitySaved(universityId, saved),
    onSuccess: (updatedUniversity, { saved }) => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      
      // If university was saved (not removed), create a task for it
      if (saved) {
        createTaskMutation.mutate(updatedUniversity, {
          onSuccess: () => {
            toast({
              title: 'Success!',
              description: 'University added to your bucket and application task created in your journey.',
            });
          },
          onError: () => {
            toast({
              title: 'Warning',
              description: 'University added to bucket, but failed to create application task.',
              variant: 'destructive',
            });
          }
        });
      } else {
        toast({
          title: 'Success!',
          description: 'University removed from your bucket.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update university bucket.',
        variant: 'destructive',
      });
    }
  });
  
  // Handle toggling university saved status
  const handleToggleSaved = (universityId: string, saved: boolean) => {
    toggleSavedMutation.mutate({ universityId, saved });
  };
  
  // Filter universities based on selected criteria
  const filteredUniversities = universities.filter(university => {
    let matchesField = true;
    let matchesLocation = true;
    let matchesProgramType = true;
    
    if (selectedField && selectedField !== 'all') {
      matchesField = university.fields.includes(selectedField);
    }
    
    if (selectedLocation && selectedLocation !== 'all') {
      matchesLocation = university.location === selectedLocation;
    }
    
    if (programType && programType !== 'all') {
      matchesProgramType = university.programType === programType || university.programType === 'Both';
    }
    
    return matchesField && matchesLocation && matchesProgramType;
  });
  
  // Get saved universities
  const savedUniversities = universities.filter(uni => uni.saved);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
            University Bucket
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore universities, filter by field and location, and save your target schools.
            Track application deadlines automatically.
          </p>
        </div>
        
        <TooltipProvider>
          <Tabs defaultValue="explore" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="saved">My Bucket</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explore">
              <UniversityFilter
                fields={fields}
                locations={locations}
                selectedField={selectedField}
                selectedLocation={selectedLocation}
                programType={programType}
                onFieldChange={setSelectedField}
                onLocationChange={setSelectedLocation}
                onProgramTypeChange={setProgramType}
                isLoading={isFieldsLoading || isLocationsLoading}
              />
              
              <UniversityGrid
                universities={filteredUniversities}
                onToggleSaved={handleToggleSaved}
                isLoading={isUnisLoading}
              />
            </TabsContent>
            
            <TabsContent value="saved">
              <SavedUniversities
                universities={savedUniversities}
                onToggleSaved={handleToggleSaved}
                isLoading={isUnisLoading}
              />
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default UniversityBucket;
