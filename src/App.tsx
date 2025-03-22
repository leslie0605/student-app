import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import QuizSelection from "@/pages/QuizSelection";
import QuizGame from "@/pages/QuizGame";
import MatchingGame from "@/pages/MatchingGame";
import FlashcardGame from "@/pages/FlashcardGame";
import Login from "@/pages/Login";
import { AuthProvider, withAuth } from "@/contexts/AuthContext";
import MagicalInventory from "./pages/MagicalInventory";
import CvPage from "./pages/inventory/CvPage";
import LorPage from "./pages/inventory/LorPage";
import SopPage from "./pages/inventory/SopPage";
import PhsPage from "./pages/inventory/PhsPage";
import GpaPage from "./pages/inventory/GpaPage";
import LanguagePage from "./pages/inventory/LanguagePage";
import Journey from "./pages/Journey";
import UniversityBucket from "./pages/UniversityBucket";
import ReviewDocument from "./pages/ReviewDocument";

import "./App.css";

// Create a client
const queryClient = new QueryClient();

// Wrap components that require authentication
const ProtectedIndex = withAuth(Index);
const ProtectedQuizSelection = withAuth(QuizSelection);
const ProtectedQuizGame = withAuth(QuizGame);
const ProtectedMatchingGame = withAuth(MatchingGame);
const ProtectedFlashcardGame = withAuth(FlashcardGame);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedIndex />} />
            <Route
              path="/quiz-selection"
              element={<ProtectedQuizSelection />}
            />
            <Route path="/quiz-game/:quizId" element={<ProtectedQuizGame />} />
            <Route
              path="/matching-game/:quizId"
              element={<ProtectedMatchingGame />}
            />
            <Route
              path="/flashcard-game/:quizId"
              element={<ProtectedFlashcardGame />}
            />
            <Route path="/magical-inventory" element={<MagicalInventory />} />
            <Route path="/inventory/cv" element={<CvPage />} />
            <Route path="/inventory/lor" element={<LorPage />} />
            <Route path="/inventory/sop" element={<SopPage />} />
            <Route path="/inventory/phs" element={<PhsPage />} />
            <Route path="/inventory/gpa" element={<GpaPage />} />
            <Route path="/inventory/language" element={<LanguagePage />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/uni-bucket" element={<UniversityBucket />} />
            <Route path="/document/:id" element={<ReviewDocument />} />

            {/* Fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>

      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
