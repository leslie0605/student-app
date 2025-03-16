
import { University, Field, Location } from '@/types/university';
import { ApplicationTask } from '@/types/journey';

// Mock data for universities
const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Stanford University',
    location: 'California, USA',
    fields: ['Computer Science', 'Psychology', 'Engineering'],
    applicationDeadline: new Date(new Date().getFullYear(), 11, 1).toISOString(),
    website: 'https://www.stanford.edu',
    programType: 'Both',
    description: 'Stanford University is a private research university in Stanford, California. It is known for its academic achievements, wealth, close proximity to Silicon Valley, and selectivity.',
    saved: false
  },
  {
    id: '2',
    name: 'MIT',
    location: 'Massachusetts, USA',
    fields: ['Computer Science', 'Engineering', 'Mathematics'],
    applicationDeadline: new Date(new Date().getFullYear(), 11, 15).toISOString(),
    website: 'https://www.mit.edu',
    programType: 'Both',
    description: 'The Massachusetts Institute of Technology is a private land-grant research university in Cambridge, Massachusetts. It is known for its rigorous academic programs in science and engineering.',
    saved: false
  },
  {
    id: '3',
    name: 'UC Berkeley',
    location: 'California, USA',
    fields: ['Psychology', 'Neuroscience', 'Biology'],
    applicationDeadline: new Date(new Date().getFullYear(), 11, 31).toISOString(),
    website: 'https://www.berkeley.edu',
    programType: 'PhD',
    description: 'The University of California, Berkeley is a public research university in Berkeley, California. Berkeley has been ranked among the world\'s top universities by major educational publications.',
    saved: false
  },
  {
    id: '4',
    name: 'Harvard University',
    location: 'Massachusetts, USA',
    fields: ['Psychology', 'Business', 'Law'],
    applicationDeadline: new Date(new Date().getFullYear(), 10, 15).toISOString(),
    website: 'https://www.harvard.edu',
    programType: 'Both',
    description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. It is one of the most prestigious universities in the world.',
    saved: true
  },
  {
    id: '5',
    name: 'University of Oxford',
    location: 'Oxford, UK',
    fields: ['Computer Science', 'Psychology', 'Literature'],
    applicationDeadline: new Date(new Date().getFullYear(), 9, 15).toISOString(),
    website: 'https://www.ox.ac.uk',
    programType: 'Both',
    description: 'The University of Oxford is a collegiate research university in Oxford, England. It is the oldest university in the English-speaking world.',
    saved: false
  },
  {
    id: '6',
    name: 'University of Tokyo',
    location: 'Tokyo, Japan',
    fields: ['Engineering', 'Physics', 'Mathematics'],
    applicationDeadline: new Date(new Date().getFullYear(), 8, 30).toISOString(),
    website: 'https://www.u-tokyo.ac.jp/en/',
    programType: 'Masters',
    description: 'The University of Tokyo is a public research university in Tokyo, Japan. It is a leading research institution and the highest-ranked university in Asia.',
    saved: false
  }
];

// Mock data for fields of study
const mockFields: Field[] = [
  { id: '1', name: 'Computer Science' },
  { id: '2', name: 'Psychology' },
  { id: '3', name: 'Engineering' },
  { id: '4', name: 'Mathematics' },
  { id: '5', name: 'Neuroscience' },
  { id: '6', name: 'Biology' },
  { id: '7', name: 'Business' },
  { id: '8', name: 'Law' },
  { id: '9', name: 'Literature' },
  { id: '10', name: 'Physics' }
];

// Mock data for locations
const mockLocations: Location[] = [
  { id: '1', name: 'California, USA' },
  { id: '2', name: 'Massachusetts, USA' },
  { id: '3', name: 'Oxford, UK' },
  { id: '4', name: 'Tokyo, Japan' }
];

// Function to fetch all universities
export const fetchUniversities = async (): Promise<University[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUniversities);
    }, 1000);
  });
};

// Function to fetch all fields of study
export const fetchFields = async (): Promise<Field[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFields);
    }, 500);
  });
};

// Function to fetch all locations
export const fetchLocations = async (): Promise<Location[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLocations);
    }, 500);
  });
};

// Function to toggle university saved status
export const toggleUniversitySaved = async (
  universityId: string,
  saved: boolean
): Promise<University> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const university = mockUniversities.find(u => u.id === universityId);
      if (university) {
        university.saved = saved;
        resolve(university);
      } else {
        throw new Error('University not found');
      }
    }, 500);
  });
};

// Function to create application task for a university
export const createApplicationTask = async (
  universityId: string
): Promise<ApplicationTask> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const university = mockUniversities.find(u => u.id === universityId);
      if (!university) {
        throw new Error('University not found');
      }
      
      const newTask: ApplicationTask = {
        id: `uni-task-${universityId}`,
        title: `Submit ${university.name} application`,
        description: `Complete and submit application to ${university.name}.`,
        dueDate: university.applicationDeadline || new Date().toISOString(),
        completed: false,
        category: 'Submissions',
        university: university.name,
        priority: 'high'
      };
      
      resolve(newTask);
    }, 500);
  });
};
