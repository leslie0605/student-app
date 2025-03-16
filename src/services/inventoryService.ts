
import { MagicalTool, ToolType, ToolRarity } from '@/types/inventory';

// Mock data for magical tools
const mockTools: MagicalTool[] = [
  {
    id: '1',
    name: 'Wand of Cognitive Enhancement',
    description: 'Enhances focus and memory retention during study sessions.',
    type: 'wand',
    rarity: 'uncommon',
    power: 7,
    acquired: true,
  },
  {
    id: '2',
    name: 'Potion of Deadline Extension',
    description: 'Magically creates more time before important deadlines.',
    type: 'potion',
    rarity: 'rare',
    power: 8,
    acquired: false,
  },
  {
    id: '3',
    name: 'The Comprehensive Compendium',
    description: 'A magical book that contains summaries of all research papers in your field.',
    type: 'book',
    rarity: 'legendary',
    power: 10,
    acquired: false,
  },
  {
    id: '4',
    name: 'Admission Oracle Crystal',
    description: 'Shows visions of your ideal graduate program and path to admission.',
    type: 'artifact',
    rarity: 'rare',
    power: 9,
    acquired: true,
  },
  {
    id: '5',
    name: 'Wand of Reference Management',
    description: 'Instantly organizes and formats references for research papers.',
    type: 'wand',
    rarity: 'common',
    power: 6,
    acquired: true,
  },
  {
    id: '6',
    name: 'Potion of Abstract Inspiration',
    description: 'Helps craft the perfect abstract for academic papers.',
    type: 'potion',
    rarity: 'uncommon',
    power: 7,
    acquired: true,
  },
  {
    id: '7',
    name: 'Tome of Grant Writing',
    description: 'Contains magical formulas for writing successful grant proposals.',
    type: 'book',
    rarity: 'rare',
    power: 9,
    acquired: false,
  },
  {
    id: '8',
    name: 'Interview Confidence Amulet',
    description: 'Bestows confidence and clarity during admissions interviews.',
    type: 'artifact',
    rarity: 'uncommon',
    power: 8,
    acquired: false,
  }
];

// Tool types with descriptions
const toolTypes: ToolType[] = [
  {
    id: '1',
    name: 'wand',
    description: 'Magical wands enhance your academic abilities and skills.'
  },
  {
    id: '2',
    name: 'potion',
    description: 'Potions provide temporary boosts to help overcome specific challenges.'
  },
  {
    id: '3',
    name: 'book',
    description: 'Magical books contain vast knowledge and wisdom for your academic journey.'
  },
  {
    id: '4',
    name: 'artifact',
    description: 'Powerful artifacts provide unique abilities that can transform your grad school experience.'
  }
];

// Tool rarities with colors
const toolRarities: ToolRarity[] = [
  {
    id: '1',
    name: 'common',
    color: 'gray'
  },
  {
    id: '2',
    name: 'uncommon',
    color: 'green'
  },
  {
    id: '3',
    name: 'rare',
    color: 'blue'
  },
  {
    id: '4',
    name: 'legendary',
    color: 'purple'
  }
];

// Function to fetch all magical tools
export const fetchMagicalTools = async (): Promise<MagicalTool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTools);
    }, 1000);
  });
};

// Function to fetch tool types
export const fetchToolTypes = async (): Promise<ToolType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(toolTypes);
    }, 500);
  });
};

// Function to fetch tool rarities
export const fetchToolRarities = async (): Promise<ToolRarity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(toolRarities);
    }, 500);
  });
};

// Function to toggle tool acquisition status
export const toggleToolAcquired = async (
  toolId: string,
  acquired: boolean
): Promise<MagicalTool> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tool = mockTools.find(t => t.id === toolId);
      if (tool) {
        tool.acquired = acquired;
        resolve(tool);
      } else {
        reject(new Error('Tool not found'));
      }
    }, 500);
  });
};
