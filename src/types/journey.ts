
export interface ApplicationTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string
  completed: boolean;
  category?: string;
  university?: string;
  priority?: 'low' | 'medium' | 'high';
}

export type ApplicationTaskStatus = 'completed' | 'overdue' | 'upcoming' | 'today';
