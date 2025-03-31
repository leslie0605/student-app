
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isBefore, isAfter } from 'date-fns';
import { CheckCircle2, Clock, FileText, CheckCheck } from 'lucide-react';
import { ApplicationTask } from '@/types/journey';

interface JourneyRoadmapViewProps {
  tasks: ApplicationTask[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  isLoading: boolean;
}

const JourneyRoadmapView: React.FC<JourneyRoadmapViewProps> = ({
  tasks,
  onTaskToggle,
  isLoading
}) => {
  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Group tasks by month/year
  const groupedTasks: Record<string, ApplicationTask[]> = {};
  
  sortedTasks.forEach(task => {
    const date = new Date(task.dueDate);
    const key = format(date, 'MMMM yyyy');
    
    if (!groupedTasks[key]) {
      groupedTasks[key] = [];
    }
    
    groupedTasks[key].push(task);
  });
  
  // Get ordered keys
  const orderedTimeKeys = Object.keys(groupedTasks).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
  
  const now = new Date();

  // Handle checkbox change
  const handleCheckboxChange = (taskId: string, checked: boolean) => {
    onTaskToggle(taskId, checked);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-7 w-48" />
            <div className="ml-6 pl-6 border-l-2 border-gray-200 space-y-6">
              {[1, 2].map(j => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-5 w-full max-w-md" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-12">
      {orderedTimeKeys.map(timeKey => (
        <div key={timeKey} className="relative">
          <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple inline-block">
            {timeKey}
          </h3>
          
          <div className="ml-6 pl-6 border-l-2 border-magic-purple/30 space-y-6">
            {groupedTasks[timeKey].map(task => {
              const taskDate = new Date(task.dueDate);
              const isPast = isBefore(taskDate, now) && !isSameDay(taskDate, now);
              const isFuture = isAfter(taskDate, now) && !isSameDay(taskDate, now);
              const isToday = isSameDay(taskDate, now);
              
              return (
                <Card 
                  key={task.id} 
                  className={`
                    relative overflow-hidden
                    ${isPast && !task.completed ? 'border-red-200 bg-red-50/50' : ''}
                    ${isToday ? 'border-yellow-200 bg-yellow-50/50' : ''}
                    ${task.completed ? 'border-green-200 bg-green-50/50' : ''}
                    ${isFuture && !task.completed ? 'border-magic-purple/20 bg-magic-purple/5' : ''}
                  `}
                >
                  {/* Status indicator */}
                  <div 
                    className={`absolute top-0 left-0 w-1 h-full
                      ${isPast && !task.completed ? 'bg-red-400' : ''}
                      ${isToday ? 'bg-yellow-400' : ''}
                      ${task.completed ? 'bg-green-400' : ''}
                      ${isFuture && !task.completed ? 'bg-magic-purple' : ''}
                    `}
                  />
                  
                  <CardContent className="p-4 pl-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            id={`roadmap-task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={(checked) => {
                              if (typeof checked === 'boolean') {
                                handleCheckboxChange(task.id, checked);
                              }
                            }}
                            className="mt-1"
                          />
                          
                          <div>
                            <label
                              htmlFor={`roadmap-task-${task.id}`}
                              className={`font-medium cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.title}
                            </label>
                            
                            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                              </div>
                              
                              {task.category && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3.5 w-3.5" />
                                  <span>{task.category}</span>
                                </div>
                              )}
                            </div>
                            
                            {task.description && (
                              <p className="text-sm mt-2 text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        {task.completed ? (
                          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCheck className="h-3.5 w-3.5" />
                            <span>Completed</span>
                          </div>
                        ) : isPast ? (
                          <div className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            <span>Overdue</span>
                          </div>
                        ) : isToday ? (
                          <div className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                            <span>Today</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-medium text-magic-purple bg-magic-purple/10 px-2 py-1 rounded-full">
                            <span>Upcoming</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
      {orderedTimeKeys.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No tasks added yet</h3>
          <p className="text-muted-foreground">Add your first application task to get started</p>
        </div>
      )}
    </div>
  );
};

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default JourneyRoadmapView;
