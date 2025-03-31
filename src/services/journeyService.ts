import { ApplicationTask } from "@/types/journey";

// Mock data for application tasks
const mockApplicationTasks: ApplicationTask[] = [
  {
    id: "1",
    title: "Research potential advisors",
    description:
      "Look up faculty members and research interests at target universities.",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 10
    ).toISOString(),
    completed: true,
    category: "Research",
    priority: "high",
  },
  {
    id: "2",
    title: "Take GRE exam",
    description: "Schedule and complete GRE general test.",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 5
    ).toISOString(),
    completed: false,
    category: "Tests",
    priority: "high",
  },
  {
    id: "3",
    title: "Request transcripts",
    description:
      "Contact undergraduate institution to request official transcripts.",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).toISOString(),
    completed: false,
    category: "Documents",
    priority: "medium",
  },
  {
    id: "4",
    title: "Draft statement of purpose",
    description: "Write initial draft of statement of purpose.",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 10
    ).toISOString(),
    completed: false,
    category: "Writing",
    priority: "high",
  },
  {
    id: "5",
    title: "Contact recommenders",
    description:
      "Reach out to potential recommenders and provide necessary information.",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 15
    ).toISOString(),
    completed: false,
    category: "Recommendations",
    priority: "medium",
  },
  {
    id: "6",
    title: "Submit Stanford application",
    description: "Complete and submit application to Stanford University.",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      15
    ).toISOString(),
    completed: false,
    category: "Submissions",
    university: "Stanford University",
    priority: "high",
  },
  {
    id: "7",
    title: "Submit MIT application",
    description: "Complete and submit application to MIT.",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 2,
      1
    ).toISOString(),
    completed: false,
    category: "Submissions",
    university: "MIT",
    priority: "high",
  },
  {
    id: "8",
    title: "Schedule campus tour",
    dueDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      5
    ).toISOString(),
    completed: false,
    category: "Visits",
    priority: "low",
  },
];

// Function to fetch application tasks
export const fetchApplicationTasks = async (): Promise<ApplicationTask[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockApplicationTasks);
    }, 1000);
  });
};

// Function to toggle task completion (mock implementation)
export const toggleTaskCompletion = async (
  taskId: string,
  completed: boolean
): Promise<ApplicationTask> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = mockApplicationTasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = completed;
        resolve(task);
      } else {
        throw new Error("Task not found");
      }
    }, 500);
  });
};

// Function to add a new application task
export const addApplicationTask = async (
  task: Omit<ApplicationTask, "id">
): Promise<ApplicationTask> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTask = {
        ...task,
        id: `task-${Date.now()}`,
      };
      mockApplicationTasks.push(newTask);
      resolve(newTask);
    }, 500);
  });
};
