import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainNavbar from "@/components/MainNavbar";
import UniversityFilter from "@/components/university/UniversityFilter";
import UniversityGrid from "@/components/university/UniversityGrid";
import SavedUniversities from "@/components/university/SavedUniversities";
import { universityService } from "@/services/universityService";
import { University, Department } from "@/types/university";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { addApplicationTask } from "@/services/journeyService";
import { ApplicationTask } from "@/types/journey";
import { TooltipProvider } from "@/components/ui/tooltip";

const UniversityBucket = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filter states with valid default values
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch universities with filters
  const { data: universitiesResponse, isLoading: isUnisLoading } = useQuery({
    queryKey: [
      "universities",
      selectedCountry,
      selectedDepartment,
      selectedDegree,
      page,
      limit,
    ],
    queryFn: () =>
      universityService.getAllUniversities({
        country: selectedCountry !== "all" ? selectedCountry : undefined,
        department:
          selectedDepartment !== "all" ? selectedDepartment : undefined,
        degree: selectedDegree !== "all" ? selectedDegree : undefined,
        page,
        limit,
      }),
  });

  const universities = universitiesResponse?.data || [];
  const totalPages = universitiesResponse?.pagination?.pages || 1;

  // Create arrays of unique departments and countries from university data
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const allDepts = new Set<string>();
      universities.forEach((uni) =>
        uni.departments.forEach((dept) => allDepts.add(dept.name))
      );
      return Array.from(allDepts).map((name) => ({ id: name, name }));
    },
    enabled: !!universities.length,
  });

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const allCountries = new Set<string>();
      universities.forEach((uni) => allCountries.add(uni.location.country));
      return Array.from(allCountries).map((name) => ({ id: name, name }));
    },
    enabled: !!universities.length,
  });

  const { data: degreesData } = useQuery({
    queryKey: ["degrees"],
    queryFn: async () => {
      const degrees = new Set<string>();
      universities.forEach((uni) =>
        uni.departments.forEach((dept) =>
          dept.programs.forEach((prog) => degrees.add(prog.degree))
        )
      );
      return Array.from(degrees).map((name) => ({ id: name, name }));
    },
    enabled: !!universities.length,
  });

  // Maintain client-side saved universities
  const [savedUniversityIds, setSavedUniversityIds] = useState<Set<string>>(
    new Set()
  );

  // Mutation for creating application tasks
  const createTaskMutation = useMutation({
    mutationFn: (university: University) => {
      // Find the closest deadline from all programs
      const deadlines = university.departments
        .flatMap((dept) => dept.programs.map((prog) => prog.deadlines.regular))
        .filter((date) => date)
        .sort();

      const nearestDeadline =
        deadlines.length > 0 ? deadlines[0] : new Date().toISOString();

      const task: Omit<ApplicationTask, "id"> = {
        title: `Submit ${university.name} application`,
        description: `Complete and submit application to ${university.name}.`,
        dueDate: nearestDeadline.toString(),
        completed: false,
        category: "Submissions",
        university: university.name,
        priority: "high",
      };
      return addApplicationTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicationTasks"] });
    },
  });

  // Handle toggling university saved status
  const handleToggleSaved = (universityId: string, saved: boolean) => {
    // Update client-side saved state
    const newSavedIds = new Set(savedUniversityIds);
    if (saved) {
      newSavedIds.add(universityId);

      // Find the university to create a task for it
      const university = universities.find((uni) => uni._id === universityId);
      if (university) {
        createTaskMutation.mutate(university, {
          onSuccess: () => {
            toast({
              title: "Success!",
              description:
                "University added to your bucket and application task created in your journey.",
            });
          },
          onError: () => {
            toast({
              title: "Warning",
              description:
                "University added to bucket, but failed to create application task.",
              variant: "destructive",
            });
          },
        });
      }
    } else {
      newSavedIds.delete(universityId);
      toast({
        title: "Success!",
        description: "University removed from your bucket.",
      });
    }
    setSavedUniversityIds(newSavedIds);
  };

  // Add saved property to universities
  const enhancedUniversities = universities.map((uni) => ({
    ...uni,
    saved: savedUniversityIds.has(uni._id),
  }));

  // Get saved universities
  const savedUniversities = enhancedUniversities.filter((uni) => uni.saved);

  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
            University Bucket
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore universities, filter by field and location, and save your
            target schools. Track application deadlines automatically.
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
                fields={departmentsData || []}
                locations={countriesData || []}
                selectedField={selectedDepartment}
                selectedLocation={selectedCountry}
                programType={selectedDegree}
                onFieldChange={setSelectedDepartment}
                onLocationChange={setSelectedCountry}
                onProgramTypeChange={setSelectedDegree}
                isLoading={isUnisLoading}
              />

              <UniversityGrid
                universities={enhancedUniversities}
                onToggleSaved={handleToggleSaved}
                isLoading={isUnisLoading}
              />

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
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
