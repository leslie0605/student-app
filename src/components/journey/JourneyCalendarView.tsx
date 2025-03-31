
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isSameDay } from "date-fns";
import { CalendarDays, CheckCircle2, Clock, PlusCircle } from "lucide-react";
import { ApplicationTask } from "@/types/journey";

interface JourneyCalendarViewProps {
  tasks: ApplicationTask[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  isLoading: boolean;
}

const JourneyCalendarView: React.FC<JourneyCalendarViewProps> = ({
  tasks,
  selectedDate,
  onDateSelect,
  onTaskToggle,
  isLoading,
}) => {
  // Find tasks for the selected date
  const tasksForSelectedDate = selectedDate
    ? tasks.filter(
        (task) =>
          selectedDate && isSameDay(new Date(task.dueDate), selectedDate)
      )
    : [];

  // Create a list of dates that have tasks
  const taskDates = tasks.map((task) => new Date(task.dueDate));

  // Handle checkbox change
  const handleCheckboxChange = (taskId: string, checked: boolean) => {
    onTaskToggle(taskId, checked);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
      {/* Calendar */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Select Date</CardTitle>
          <CardDescription>View tasks by date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            className="rounded-md border"
            modifiers={{
              hasTasks: taskDates,
            }}
            modifiersStyles={{
              hasTasks: {
                fontWeight: "bold",
                backgroundColor: "rgba(155, 135, 245, 0.1)",
                borderRadius: "100%",
                position: "relative",
                color: "#9b87f5",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Tasks for selected date */}
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {selectedDate ? (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-magic-purple" />
                <span>{format(selectedDate, "MMMM d, yyyy")}</span>
              </div>
            ) : (
              "Select a Date"
            )}
          </CardTitle>
          <CardDescription>
            {tasksForSelectedDate.length > 0
              ? `${tasksForSelectedDate.length} task${
                  tasksForSelectedDate.length === 1 ? "" : "s"
                }`
              : selectedDate
              ? "No tasks scheduled for this date"
              : "Please select a date to see tasks"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 bg-gray-50 p-3 rounded-md"
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            handleCheckboxChange(task.id, checked);
                          }
                        }}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`font-medium text-sm cursor-pointer ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}
                        </label>
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Due: {format(new Date(task.dueDate), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {task.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                selectedDate && (
                  <div className="text-center py-8">
                    <PlusCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No tasks for this date
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click "Add Task" to create one
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyCalendarView;
