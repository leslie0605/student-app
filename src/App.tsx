
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuizGame from "./pages/QuizGame";
import Journey from "./pages/Journey";
import UniversityBucket from "./pages/UniversityBucket";
import MagicalInventory from "./pages/MagicalInventory";
import NotFound from "./pages/NotFound";

// Import specific tool pages
import LorPage from "./pages/inventory/LorPage";
import CvPage from "./pages/inventory/CvPage";
import SopPage from "./pages/inventory/SopPage";
import PhsPage from "./pages/inventory/PhsPage";
import LanguagePage from "./pages/inventory/LanguagePage";
import GpaPage from "./pages/inventory/GpaPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz-game" element={<QuizGame />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/uni-bucket" element={<UniversityBucket />} />
          <Route path="/magical-inventory" element={<MagicalInventory />} />
          
          {/* Tool-specific routes */}
          <Route path="/magical-inventory/lor" element={<LorPage />} />
          <Route path="/magical-inventory/cv" element={<CvPage />} />
          <Route path="/magical-inventory/sop" element={<SopPage />} />
          <Route path="/magical-inventory/phs" element={<PhsPage />} />
          <Route path="/magical-inventory/language" element={<LanguagePage />} />
          <Route path="/magical-inventory/gpa" element={<GpaPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
