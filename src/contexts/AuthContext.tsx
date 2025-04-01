import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { setCurrentUser, clearCurrentUser } from "@/utils/api";
import { useNavigate } from "react-router-dom";

// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "mentor";
  avatar?: string;
}

// Mock user data for automatic login
const MOCK_USER: User = {
  id: "student-123",
  name: "Demo Student",
  email: "demo@student.edu",
  role: "student",
};

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  setUser: (user: User) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  logout: () => {},
  setUser: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-login with mock user data
  useEffect(() => {
    const autoLogin = () => {
      try {
        // Set mock user data
        setUser(MOCK_USER);
        setCurrentUser(MOCK_USER);
        console.log("Auto-logged in with demo user:", MOCK_USER.name);
      } catch (error) {
        console.error("Error during auto-login:", error);
      } finally {
        setLoading(false);
      }
    };

    // Automatically log in after a short delay to simulate authentication
    const timer = setTimeout(autoLogin, 500);
    return () => clearTimeout(timer);
  }, []);

  // Logout function (resets to demo user instead of actually logging out)
  const logout = () => {
    clearCurrentUser();
    // Auto-login again with mock user after "logout"
    setUser(MOCK_USER);
    setCurrentUser(MOCK_USER);
  };

  // Auth context value
  const value = {
    user,
    isAuthenticated: true, // Always authenticated for demo purposes
    loading,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Higher-order component that no longer requires real authentication
export const withAuth = (Component: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const { loading } = useAuth();

    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};
