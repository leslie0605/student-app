import { 
  MagicalTool, 
  Recommender, 
  CVVersion, 
  SoPVersion, 
  PHSVersion,
  ChatMessage,
  ToolStatus,
  ToolType,
  ToolRarity
} from '@/types/inventory';

// Mock data for the tools
const mockTools: MagicalTool[] = [
  {
    id: 'lor',
    name: 'Letters of Recommendation',
    description: 'Manage your recommendation letters from professors and employers',
    status: 'not-started',
    icon: 'mail'
  },
  {
    id: 'cv',
    name: 'CV/Resume',
    description: 'Upload, format, and improve your academic CV',
    status: 'not-started',
    icon: 'file-text'
  },
  {
    id: 'sop',
    name: 'Statement of Purpose',
    description: 'Create compelling statements for your target programs',
    status: 'not-started',
    icon: 'target'
  },
  {
    id: 'phs',
    name: 'Personal History Statement',
    description: 'Share your personal journey and experiences',
    status: 'not-started',
    icon: 'user'
  },
  {
    id: 'language',
    name: 'TOEFL/IELTS',
    description: 'Check if you need language proficiency tests',
    status: 'not-started',
    icon: 'languages'
  },
  {
    id: 'gpa',
    name: 'GPA',
    description: 'Verify if you need WES evaluation for your transcripts',
    status: 'not-started',
    icon: 'calculator'
  }
];

// Mock data for tool types
const mockToolTypes: ToolType[] = [
  { id: 'wand', name: 'wand' },
  { id: 'potion', name: 'potion' },
  { id: 'book', name: 'book' },
  { id: 'artifact', name: 'artifact' }
];

// Mock data for tool rarities
const mockToolRarities: ToolRarity[] = [
  { id: 'common', name: 'common' },
  { id: 'uncommon', name: 'uncommon' },
  { id: 'rare', name: 'rare' },
  { id: 'legendary', name: 'legendary' }
];

// Mock data for recommenders
const mockRecommenders: Recommender[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'jsmith@university.edu',
    institution: 'University of Research',
    relationship: 'Research Advisor',
    status: 'submitted',
    dateRequested: '2023-10-15',
    dateSubmitted: '2023-11-01',
    notes: 'Sent a thank you email'
  },
  {
    id: '2',
    name: 'Prof. John Doe',
    email: 'jdoe@college.edu',
    institution: 'College of Sciences',
    relationship: 'Course Instructor',
    status: 'in-progress',
    dateRequested: '2023-10-20',
    notes: 'Need to follow up next week'
  }
];

// Mock CV versions
const mockCVVersions: CVVersion[] = [
  {
    id: '1',
    name: 'PhD Applications - General',
    dateCreated: '2023-09-01',
    dateModified: '2023-10-10',
    fileUrl: '/placeholder.svg',
    score: 72,
    feedback: [
      'Add more details to your research experience section',
      'Consider adding relevant coursework',
      'Add publications section, even if it\'s in preparation'
    ]
  },
  {
    id: '2',
    name: 'Research Lab Position',
    dateCreated: '2023-08-15',
    dateModified: '2023-09-05',
    fileUrl: '/placeholder.svg',
    score: 85,
    feedback: [
      'Great technical skills section',
      'Highlight lab equipment proficiency'
    ]
  }
];

// Mock SoP versions
const mockSoPVersions: SoPVersion[] = [
  {
    id: '1',
    name: 'UCLA Psychology',
    targetUniversity: 'UCLA',
    targetProgram: 'Psychology PhD',
    dateCreated: '2023-09-10',
    dateModified: '2023-10-15',
    fileUrl: '/placeholder.svg',
    score: 68,
    feedback: [
      'More specific about research interests',
      'Connect past experience to future goals better',
      'Mention potential faculty collaborators'
    ]
  }
];

// Mock PHS versions
const mockPHSVersions: PHSVersion[] = [
  {
    id: '1',
    name: 'Berkeley Application',
    targetUniversity: 'UC Berkeley',
    targetProgram: 'Psychological Science',
    dateCreated: '2023-09-12',
    dateModified: '2023-10-18',
    fileUrl: '/placeholder.svg',
    score: 75,
    feedback: [
      'Good narrative structure',
      'Consider adding more about overcoming challenges',
      'Connect personal experiences to academic interests'
    ]
  }
];

// Mock chat messages
const mockChatMessages: Record<string, ChatMessage[]> = {
  'lor': [
    {
      id: '1',
      sender: 'mentor',
      message: 'Hello! I\'m Dr. Morgan, your PhD mentor. How can I help with your recommendation letters today?',
      timestamp: '2023-10-20T14:30:00Z'
    },
    {
      id: '2',
      sender: 'user',
      message: 'Hi Dr. Morgan! I\'m not sure how to approach my professor for a recommendation letter.',
      timestamp: '2023-10-20T14:32:00Z'
    },
    {
      id: '3',
      sender: 'mentor',
      message: 'Great question! It\'s best to schedule a meeting in person if possible. Come prepared with your CV and a brief explanation of why you\'re applying to these programs. Also mention specific classes or projects where you worked with them, to refresh their memory.',
      timestamp: '2023-10-20T14:35:00Z'
    }
  ],
  'cv': [],
  'sop': [],
  'phs': [],
  'language': [],
  'gpa': []
};

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
      resolve(mockToolTypes);
    }, 800);
  });
};

// Function to fetch tool rarities
export const fetchToolRarities = async (): Promise<ToolRarity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockToolRarities);
    }, 800);
  });
};

// Add the missing updateToolStatus function
export const updateToolStatus = async (
  toolId: string,
  status: ToolStatus
): Promise<MagicalTool> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const toolIndex = mockTools.findIndex(t => t.id === toolId);
      if (toolIndex >= 0) {
        mockTools[toolIndex].status = status;
        resolve(mockTools[toolIndex]);
      } else {
        reject(new Error('Tool not found'));
      }
    }, 500);
  });
};

// Function to toggle tool acquired status (this is a placeholder as our tools don't have an acquired property)
export const toggleToolAcquired = async (
  toolId: string,
  acquired: boolean
): Promise<MagicalTool> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const toolIndex = mockTools.findIndex(t => t.id === toolId);
      if (toolIndex >= 0) {
        // Just return the tool as is since we don't have an acquired property
        resolve(mockTools[toolIndex]);
      } else {
        reject(new Error('Tool not found'));
      }
    }, 500);
  });
};

// Function to fetch recommenders
export const fetchRecommenders = async (): Promise<Recommender[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecommenders);
    }, 800);
  });
};

// Function to add a new recommender
export const addRecommender = async (recommender: Omit<Recommender, 'id'>): Promise<Recommender> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecommender: Recommender = {
        ...recommender,
        id: Math.random().toString(36).substring(2, 9)
      };
      mockRecommenders.push(newRecommender);
      resolve(newRecommender);
    }, 800);
  });
};

// Function to update a recommender's status
export const updateRecommenderStatus = async (
  id: string,
  status: Recommender['status']
): Promise<Recommender> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const recommenderIndex = mockRecommenders.findIndex(r => r.id === id);
      if (recommenderIndex >= 0) {
        mockRecommenders[recommenderIndex].status = status;
        if (status === 'submitted') {
          mockRecommenders[recommenderIndex].dateSubmitted = new Date().toISOString().split('T')[0];
        }
        resolve(mockRecommenders[recommenderIndex]);
      } else {
        reject(new Error('Recommender not found'));
      }
    }, 500);
  });
};

// Function to fetch CV versions
export const fetchCVVersions = async (): Promise<CVVersion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCVVersions);
    }, 800);
  });
};

// Function to fetch SoP versions
export const fetchSoPVersions = async (): Promise<SoPVersion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSoPVersions);
    }, 800);
  });
};

// Function to fetch PHS versions
export const fetchPHSVersions = async (): Promise<PHSVersion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPHSVersions);
    }, 800);
  });
};

// Function to fetch chat messages for a specific tool
export const fetchChatMessages = async (toolId: string): Promise<ChatMessage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChatMessages[toolId] || []);
    }, 600);
  });
};

// Function to add a new chat message
export const addChatMessage = async (
  toolId: string,
  message: string,
  sender: 'user' | 'mentor'
): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender,
        message,
        timestamp: new Date().toISOString()
      };
      
      if (!mockChatMessages[toolId]) {
        mockChatMessages[toolId] = [];
      }
      
      mockChatMessages[toolId].push(newMessage);
      resolve(newMessage);
    }, 500);
  });
};

// Function to get AI mentor response
export const getMentorResponse = async (toolId: string, userMessage: string): Promise<string> => {
  // In a real app, this would call an AI service
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: Record<string, string[]> = {
        'lor': [
          "That's a great question about recommendation letters. Make sure to give your recommenders at least 4-6 weeks notice before the deadline.",
          "When approaching professors for letters, remind them of specific projects or classes where you performed well.",
          "It's helpful to provide your recommenders with your CV, personal statement, and information about the programs you're applying to."
        ],
        'cv': [
          "For academic CVs, make sure to highlight your research experience, publications, and presentations prominently.",
          "Unlike resumes, academic CVs can be multiple pages and should be comprehensive about your academic achievements.",
          "Consider organizing your CV with these sections: Education, Research Experience, Publications, Presentations, Teaching Experience, and Skills."
        ],
        'sop': [
          "Your statement of purpose should clearly articulate your research interests and how they align with the program's strengths.",
          "Make connections between your past experiences and future goals, showing a logical progression in your academic journey.",
          "Tailor each statement to the specific program by mentioning faculty whose research interests align with yours."
        ],
        'phs': [
          "In your personal history statement, reflect on experiences that have shaped your academic journey and perspective.",
          "This is a good place to discuss challenges you've overcome, especially if they're relevant to your academic interests.",
          "Connect your personal experiences to your academic goals and show how they've prepared you for graduate studies."
        ],
        'language': [
          "Most U.S. graduate programs require TOEFL scores of at least 100 (internet-based) or IELTS scores of 7.0 or higher.",
          "Some programs may waive the TOEFL/IELTS requirement if you've completed a degree at an English-speaking institution.",
          "Check each program's requirements carefully, as they can vary widely between institutions."
        ],
        'gpa': [
          "WES evaluation is typically needed if your degree is from a non-U.S. institution to convert your grades to the U.S. 4.0 scale.",
          "The evaluation process can take several weeks, so plan ahead if you need this service.",
          "Some universities have their own evaluation processes and may not require WES specifically."
        ]
      };
      
      const toolResponses = responses[toolId] || responses['cv'];
      const randomIndex = Math.floor(Math.random() * toolResponses.length);
      
      resolve(toolResponses[randomIndex]);
    }, 1000);
  });
};

// TOEFL/IELTS checker function
export interface LanguageTestCheckResult {
  required: boolean;
  reason: string;
  recommendations?: string[];
}

export const checkLanguageTestRequirement = async (
  isNativeSpeaker: boolean,
  hasEnglishDegree: boolean,
  targetCountry: string
): Promise<LanguageTestCheckResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isNativeSpeaker) {
        resolve({
          required: false,
          reason: "You indicated that English is your native language.",
          recommendations: ["Double-check specific program requirements as some might still require test scores."]
        });
      } else if (hasEnglishDegree) {
        resolve({
          required: false,
          reason: "You've completed a degree program taught in English.",
          recommendations: [
            "Verify that your target programs accept this in lieu of test scores.",
            "Some may still require scores depending on when you completed your degree."
          ]
        });
      } else {
        resolve({
          required: true,
          reason: "Based on your answers, you will likely need to take an English proficiency test.",
          recommendations: [
            "TOEFL and IELTS are generally the most widely accepted tests.",
            `For most programs in ${targetCountry}, aim for TOEFL scores above 100 or IELTS scores above 7.0.`,
            "Check each program's specific requirements as they can vary."
          ]
        });
      }
    }, 800);
  });
};

// WES GPA check function
export interface GPACheckResult {
  wesNeeded: boolean;
  reason: string;
  recommendations?: string[];
}

export const checkWESRequirement = async (
  isUSInstitution: boolean,
  hasTranscriptTranslation: boolean
): Promise<GPACheckResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isUSInstitution) {
        resolve({
          wesNeeded: false,
          reason: "Your degree is from a U.S. institution, so WES evaluation is typically not required.",
          recommendations: [
            "Check if your target programs have specific GPA requirements.",
            "Some competitive programs may require a minimum GPA of 3.0 or higher."
          ]
        });
      } else if (hasTranscriptTranslation) {
        resolve({
          wesNeeded: true,
          reason: "While you have transcript translations, most U.S. graduate programs will still require a credential evaluation.",
          recommendations: [
            "WES is widely accepted, but some institutions may prefer different evaluation services.",
            "The evaluation process typically takes 2-4 weeks, so plan accordingly.",
            "You'll need official transcripts sent directly from your institution to WES."
          ]
        });
      } else {
        resolve({
          wesNeeded: true,
          reason: "You'll need both transcript translation and credential evaluation for your international degree.",
          recommendations: [
            "Start the WES process early, as it can take 2-4 weeks after they receive all documents.",
            "You'll need to arrange for official transcripts to be sent directly to WES.",
            "Check if your target programs have specific evaluation service preferences."
          ]
        });
      }
    }, 800);
  });
};
