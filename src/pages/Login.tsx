import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, User, Lock, LogIn, Loader2 } from "lucide-react";
import { login, getCurrentUser } from "@/utils/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Show a toast message about demo mode
    toast.success("Demo Mode Active", {
      description: "You've been automatically logged in as a demo student",
      duration: 5000,
    });

    // Automatically redirect to home page
    navigate("/");
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password, "student");

      if (response.success) {
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add demo student logins for quick access
  const demoStudents = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@student.edu",
      password: "password",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@student.edu",
      password: "password",
    },
    {
      id: "3",
      name: "Miguel Lopez",
      email: "miguel@student.edu",
      password: "password",
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma@student.edu",
      password: "password",
    },
  ];

  const loginAsDemoStudent = async (demoStudent: (typeof demoStudents)[0]) => {
    setEmail(demoStudent.email);
    setPassword(demoStudent.password);

    // Use a small timeout to ensure the state updates and user can see what's happening
    setTimeout(() => {
      handleLogin(new Event("submit") as any);
    }, 300);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Magic Prep</h1>
          <p className="mt-2 text-sm text-gray-600">
            Demo Mode: Auto-redirecting...
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
