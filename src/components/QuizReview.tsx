import React from 'react';
import { UserQuizAnswer, loadQuizData } from '@/utils/quizUtils';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';

interface QuizReviewProps {
  userAnswers: UserQuizAnswer[];
  onStartNewQuiz: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({ userAnswers, onStartNewQuiz }) => {
  const { quizId = 'brain-quiz' } = useParams<{ quizId: string }>();
  
  // Load quiz data
  const quizData = loadQuizData(quizId);
  
  if (!quizData || !userAnswers.length) return null;
  
  const { questions, options } = quizData;
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 p-4 bg-magic-purple/10 rounded-lg">
        <h2 className="text-xl font-bold text-magic-purple mb-2">Quiz Review</h2>
        <p className="text-muted-foreground">
          You've already completed this quiz. Here are your answers and the correct solutions.
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        {userAnswers.map((answer) => {
          const question = questions.find((q: any) => q.id === answer.questionId);
          if (!question) return null;
          
          const selectedOption = answer.selectedOptionId 
            ? options.find((r: any) => r.id === answer.selectedOptionId)
            : null;
            
          const correctOption = options.find((r: any) => r.id === question.correctRegion);
          
          return (
            <div 
              key={answer.questionId}
              className="p-6 rounded-xl glass-effect shadow-sm border border-magic-blue/20"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {answer.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-magic-pink" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold mb-2">Question {answer.questionId}:</h3>
                  <p className="mb-4">{question.question}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className={cn(
                      "p-3 rounded-lg",
                      answer.isCorrect 
                        ? "bg-green-50 border border-green-100" 
                        : "bg-red-50 border border-red-100"
                    )}>
                      <h4 className="text-sm font-medium mb-1">Your Answer:</h4>
                      <p className={answer.isCorrect ? "text-green-700" : "text-red-700"}>
                        {selectedOption?.name || "No answer selected"}
                      </p>
                    </div>
                    
                    {!answer.isCorrect && (
                      <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                        <h4 className="text-sm font-medium mb-1">Correct Answer:</h4>
                        <p className="text-green-700">{correctOption?.name}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 p-3 bg-magic-blue/5 rounded-lg">
                    <h4 className="text-sm font-medium mb-1 text-magic-blue">Explanation:</h4>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center">
        <button
          onClick={onStartNewQuiz}
          className={cn(
            "py-3 px-8 rounded-lg font-medium transition-all-200 shadow-md",
            "bg-gradient-to-r from-magic-blue to-magic-purple text-white",
            "hover:shadow-lg hover:translate-y-[-2px]",
            "active:translate-y-[0px]"
          )}
        >
          Start a New Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizReview;
