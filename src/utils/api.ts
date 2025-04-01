// API service with mock data for demo purposes
import { User } from "../contexts/AuthContext";

// Define the base URL for API calls (not actually used in demo mode)
const API_BASE_URL = "http://localhost:3000/api";

// Mock data for the application
const MOCK_GAMES = [
  {
    id: "game1",
    title: "GRE Vocabulary Quiz",
    description: "Test your GRE vocabulary knowledge",
    type: "quiz",
    questions: [
      {
        id: "q1",
        question: "What does 'ubiquitous' mean?",
        options: [
          "Present everywhere",
          "Unique and rare",
          "Unclear or ambiguous",
          "Unnecessary or redundant",
        ],
        correctAnswer: "Present everywhere",
      },
      {
        id: "q2",
        question: "What does 'ephemeral' mean?",
        options: [
          "Lasting a very short time",
          "Extremely important",
          "Difficult to understand",
          "Visually beautiful",
        ],
        correctAnswer: "Lasting a very short time",
      },
      {
        id: "q3",
        question: "What does 'verbose' mean?",
        options: [
          "Using more words than needed",
          "Very precise",
          "Truthful and honest",
          "Loud and noticeable",
        ],
        correctAnswer: "Using more words than needed",
      },
    ],
    createdAt: "2023-01-15T08:30:00.000Z",
    updatedAt: "2023-01-15T08:30:00.000Z",
  },
  {
    id: "game2",
    title: "Graduate School Terminology",
    description: "Learn the key terms for graduate school applications",
    type: "matching",
    pairs: [
      { id: "p1", term: "GRE", definition: "Graduate Record Examination" },
      { id: "p2", term: "CV", definition: "Curriculum Vitae" },
      { id: "p3", term: "SOP", definition: "Statement of Purpose" },
      { id: "p4", term: "LoR", definition: "Letter of Recommendation" },
    ],
    createdAt: "2023-01-20T10:15:00.000Z",
    updatedAt: "2023-01-20T10:15:00.000Z",
  },
  {
    id: "game3",
    title: "Application Flashcards",
    description: "Master important application concepts",
    type: "flashcard",
    cards: [
      {
        id: "c1",
        front: "What is a Statement of Purpose?",
        back: "An essay detailing your academic interests, research experience, and career goals for graduate school applications.",
      },
      {
        id: "c2",
        front: "What is a Personal History Statement?",
        back: "An essay describing how your personal background and experiences have shaped your decision to pursue graduate study.",
      },
      {
        id: "c3",
        front: "What should be included in a CV for graduate applications?",
        back: "Education, research experience, publications, presentations, awards, and relevant skills or certifications.",
      },
    ],
    createdAt: "2023-02-05T14:45:00.000Z",
    updatedAt: "2023-02-05T14:45:00.000Z",
  },
];

// Get current user from localStorage
export const getCurrentUser = () => {
  const userString = localStorage.getItem("currentUser");
  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Set current user to localStorage with proper typing
export const setCurrentUser = (user: User) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

// Remove current user from localStorage
export const clearCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

/**
 * Mock login function that always succeeds
 */
export const login = async (
  email: string,
  password: string,
  role: "student" | "mentor"
) => {
  // Create a demo user
  const mockUser = {
    id: "student-123",
    name: "Demo Student",
    email: email || "demo@student.edu",
    role: role || "student",
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Store user data in localStorage
  setCurrentUser(mockUser);

  return {
    success: true,
    message: "Login successful",
    user: mockUser,
  };
};

/**
 * Mock function to fetch assigned games
 */
export const fetchAssignedGames = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return mock games
  return MOCK_GAMES;
};

/**
 * Mock function to fetch a specific game by ID
 */
export const fetchGameById = async (gameId: string | number) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Find the requested game in mock data
  const game = MOCK_GAMES.find((g) => g.id === gameId);

  if (!game) {
    console.error(`Game ${gameId} not found in mock data`);
    return null;
  }

  return game;
};
