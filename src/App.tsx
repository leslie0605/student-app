import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuizGame from "./pages/QuizGame";
import QuizSelection from "./pages/QuizSelection";
import MagicalInventory from "./pages/MagicalInventory";
import CvPage from "./pages/inventory/CvPage";
import LorPage from "./pages/inventory/LorPage";
import SopPage from "./pages/inventory/SopPage";
import PhsPage from "./pages/inventory/PhsPage";
import GpaPage from "./pages/inventory/GpaPage";
import LanguagePage from "./pages/inventory/LanguagePage";
import Journey from "./pages/Journey";
import UniversityBucket from "./pages/UniversityBucket";
import { Toaster } from "./components/ui/toaster";
import ReviewDocument from "./pages/ReviewDocument";

import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz-selection" element={<QuizSelection />} />
          <Route path="/quiz-game/:quizId" element={<QuizGame />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
