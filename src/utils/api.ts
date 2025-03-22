// API service for interacting with the backend

// Define the base URL for API calls
const API_BASE_URL = "http://localhost:3000/api";

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

// Set current user to localStorage
export const setCurrentUser = (user: any) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

// Remove current user from localStorage
export const clearCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

/**
 * Login as student or mentor
 */
export const login = async (
  email: string,
  password: string,
  role: "student" | "mentor"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Store user data in localStorage
    if (data.success && data.user) {
      setCurrentUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

/**
 * Fetch assigned games for the current student
 */
export const fetchAssignedGames = async () => {
  const currentUser = getCurrentUser();

  // If no logged in user, return empty array
  if (!currentUser) {
    console.error("No logged in user found");
    return [];
  }

  // Use the current user's ID to fetch games, or fall back to 'current-student' for backward compatibility
  const studentId = currentUser.id || "current-student";

  // Debug info
  console.log("Fetching games for student ID:", studentId);
  console.log("Current user data:", currentUser);

  try {
    const url = `${API_BASE_URL}/quizzes/mentee/${studentId}/games`;
    console.log("Fetching games from URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const games = await response.json();
    console.log("Received games from API:", games.length, "games");
    console.log(
      "Game IDs:",
      games.map((g) => g.id)
    );

    return games;
  } catch (error) {
    console.error("Error fetching assigned games:", error);
    return [];
  }
};

/**
 * Fetch a specific game by ID
 */
export const fetchGameById = async (gameId: string | number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/games/${gameId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    return null;
  }
};
