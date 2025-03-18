
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, BookOpen, Atom, PieChart, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

// Interface for quiz data
interface QuizData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  path: string;
}

const QuizSelection = () => {
  const navigate = useNavigate();
  
  // Quiz data with different categories
  const quizzes: QuizData[] = [
    {
      id: 'brain-quiz',
      title: 'Brain Function Quiz',
      description: 'Test your knowledge about different brain regions and their functions.',
      icon: <Brain className="h-8 w-8 text-magic-purple" />,
      available: true,
      path: '/quiz-game'
    },
    {
      id: 'psychology-quiz',
      title: 'Psychology Concepts',
      description: 'Learn about fundamental psychological theories and principles.',
      icon: <PieChart className="h-8 w-8 text-magic-pink" />,
      available: false,
      path: '/quiz-game/psychology'
    },
    {
      id: 'science-quiz',
      title: 'Science Fundamentals',
      description: 'Test your knowledge of basic scientific principles and discoveries.',
      icon: <Atom className="h-8 w-8 text-magic-blue" />,
      available: false,
      path: '/quiz-game/science'
    },
    {
      id: 'math-quiz',
      title: 'Mathematical Reasoning',
      description: 'Challenge yourself with mathematical problems and concepts.',
      icon: <Calculator className="h-8 w-8 text-emerald-500" />,
      available: false,
      path: '/quiz-game/math'
    }
  ];

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {quizzes.map((quiz) => (
            <div 
              key={quiz.id}
              className={cn(
                "p-6 rounded-xl border transition-all duration-300",
                "hover:shadow-lg hover:translate-y-[-2px]",
                quiz.available 
                  ? "bg-white border-magic-purple/30 cursor-pointer" 
                  : "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed"
              )}
              onClick={() => quiz.available && navigate(quiz.path)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-magic-purple/10 flex items-center justify-center">
                  {quiz.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                    {!quiz.available && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{quiz.description}</p>
                  
                  {quiz.available && (
                    <button 
                      className="mt-4 px-4 py-2 bg-magic-purple/10 text-magic-purple rounded-lg text-sm font-medium hover:bg-magic-purple/20 transition-colors"
                    >
                      Start Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizSelection;
