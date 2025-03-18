
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getQuizTitle, 
  getQuizDescriptions, 
  isQuizCompleted, 
  getAvailableQuizIds, 
  getQuizIcon,
  initializeQuizzes
} from '@/utils/quizUtils';

// Use dynamic icons from Lucide React
import * as LucideIcons from 'lucide-react';

// Interface for quiz data
interface QuizData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Default icon for quizzes without a specific icon
const defaultQuizIcon = <BookOpen className="h-8 w-8 text-magic-purple" />;

// Get the proper icon based on icon name
const getQuizIconComponent = (quizId: string): React.ReactNode => {
  const iconName = getQuizIcon(quizId);
  
  if (iconName) {
    // Try to get the icon from Lucide dynamically
    const IconComponent = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    if (IconComponent) {
      return <IconComponent className="h-8 w-8 text-magic-purple" />;
    }
  }
  
  return defaultQuizIcon;
};

const QuizSelection = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      try {
        // Initialize the quizzes
        await initializeQuizzes();
        
        // Get the available quiz IDs
        const availableQuizIds = getAvailableQuizIds();
        
        // Map the IDs to quiz data
        const availableQuizzes: QuizData[] = availableQuizIds.map(quizId => ({
          id: quizId,
          title: getQuizTitle(quizId),
          description: getQuizDescriptions(quizId),
          icon: getQuizIconComponent(quizId)
        }));
        
        setQuizzes(availableQuizzes);
      } catch (error) {
        console.error('Failed to load quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleQuizSelect = (quizId: string) => {
    navigate(`/quiz-game/${quizId}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-magic-light to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-magic-dark/70 hover:text-magic-purple transition-all-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
        </div>
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-magic-purple/10 px-3 py-1 rounded-full text-magic-purple text-sm font-medium mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Educational Games</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Knowledge Challenge</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a quiz category to test your knowledge and learn interesting facts across different subjects.
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <p>Loading available quizzes...</p>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {quizzes.map((quiz) => {
              const completed = isQuizCompleted(quiz.id);
              
              return (
                <div 
                  key={quiz.id}
                  className={cn(
                    "p-6 rounded-xl border transition-all duration-300",
                    "bg-white border-magic-purple/30 cursor-pointer", 
                    "hover:shadow-lg hover:translate-y-[-2px]"
                  )}
                  onClick={() => handleQuizSelect(quiz.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-magic-purple/10 flex items-center justify-center">
                      {quiz.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                        {completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">{quiz.description}</p>
                      
                      <button 
                        className={cn(
                          "mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          completed 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-magic-purple/10 text-magic-purple hover:bg-magic-purple/20"
                        )}
                      >
                        {completed ? "Review Quiz" : "Start Quiz"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>No quizzes available. Add quiz data files to the data folder.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSelection;
