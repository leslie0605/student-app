import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUser, clearCurrentUser } from "@/utils/api";
import { useNavigate } from "react-router-dom";

// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "mentor";
  avatar?: string;
}

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

  // Initialize auth state from localStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser as User);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        clearCurrentUser();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Logout function
  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  // Auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Higher-order component to protect routes that require authentication
export const withAuth = (Component: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate("/login");
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return AuthenticatedComponent;
};
