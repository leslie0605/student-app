import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, User, Lock, LogIn, Loader2 } from "lucide-react";
import { login, getCurrentUser } from "@/utils/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-magic-light to-white">
      <div className="w-full max-w-md p-8 rounded-xl glass-effect border border-magic-purple/20 shadow-lg">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-magic-purple/10 flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-magic-purple" />
          </div>
          <h1 className="text-2xl font-bold text-center">Magic Prep Quest</h1>
          <p className="text-muted-foreground text-center mt-1">
            Login to access your educational games
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <User className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@school.edu"
                className={cn(
                  "w-full py-2 pl-10 pr-4 rounded-lg bg-white/50 border border-magic-purple/20",
                  "focus:outline-none focus:ring-2 focus:ring-magic-purple focus:border-transparent"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full py-2 pl-10 pr-4 rounded-lg bg-white/50 border border-magic-purple/20",
                  "focus:outline-none focus:ring-2 focus:ring-magic-purple focus:border-transparent"
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-3 rounded-lg font-medium transition-all-200 shadow-md",
              "bg-gradient-to-r from-magic-blue to-magic-purple text-white",
              "hover:shadow-lg hover:translate-y-[-2px]",
              "flex items-center justify-center gap-2",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-sm text-center text-muted-foreground mb-4">
            Quick Login as Demo Student
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoStudents.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => loginAsDemoStudent(student)}
                disabled={isLoading}
                className={cn(
                  "text-xs py-2 px-3 rounded-lg border border-magic-purple/20 bg-white/70",
                  "hover:bg-magic-purple/10 transition-colors",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {student.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
