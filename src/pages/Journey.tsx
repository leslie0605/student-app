
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Map } from "lucide-react";
import { toast } from "sonner";

import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressBar from "@/components/ProgressBar";
import JourneyCalendarView from "@/components/journey/JourneyCalendarView";
import JourneyRoadmapView from "@/components/journey/JourneyRoadmapView";
import { AddTaskDialog } from "@/components/journey/AddTaskDialog";
import {
  fetchApplicationTasks,
  toggleTaskCompletion,
  addApplicationTask
} from "@/services/journeyService";
import { ApplicationTask } from "@/types/journey";

const Journey = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [viewMode, setViewMode] = useState<"calendar" | "roadmap">("calendar");
  const queryClient = useQueryClient();

  // Fetch application tasks
  const { data: applicationTasks = [], isLoading } = useQuery({
    queryKey: ["applicationTasks"],
    queryFn: fetchApplicationTasks,
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      completed,
    }: {
      taskId: string;
      completed: boolean;
    }) => toggleTaskCompletion(taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicationTasks"] });
    },
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: (task: Omit<ApplicationTask, 'id'>) => addApplicationTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicationTasks"] });
      toast.success("Task added successfully!");
    },
    onError: () => {
      toast.error("Failed to add task");
    }
  });

  // Calculate progress
  const completedTasks = applicationTasks.filter(
    (task) => task.completed
  ).length;
  const totalTasks = applicationTasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    toggleTaskMutation.mutate(
      { taskId, completed },
      {
        onSuccess: () => {
          toast.success(`Task ${completed ? "completed" : "uncompleted"}!`);
        },
        onError: () => {
          toast.error("Failed to update task status");
        },
      }
    );
  };

  const handleAddTask = (task: Omit<ApplicationTask, 'id'>) => {
    addTaskMutation.mutate(task);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />

      <div className="container mx-auto pt-24 px-4 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
                Grad School Journey
              </span>
            </h1>
            <p className="text-muted-foreground">
              Track your application progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() => setViewMode("calendar")}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "roadmap" ? "default" : "outline"}
              onClick={() => setViewMode("roadmap")}
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Roadmap
            </Button>
            <AddTaskDialog onAddTask={handleAddTask} />
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Your Application Progress
          </h2>
          <ProgressBar
            currentStep={completedTasks}
            totalSteps={totalTasks}
            className="mb-2"
          />
          <p className="text-sm text-muted-foreground">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        {/* Main content based on view mode */}
        {viewMode === "calendar" ? (
          <JourneyCalendarView
            tasks={applicationTasks}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onTaskToggle={handleTaskToggle}
            isLoading={isLoading}
          />
        ) : (
          <JourneyRoadmapView
            tasks={applicationTasks}
            onTaskToggle={handleTaskToggle}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Journey;
