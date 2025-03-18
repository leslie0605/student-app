
import React from 'react';
import { cn } from '@/lib/utils';
import { Concept } from '@/utils/quizUtils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizFeedbackProps {
  isCorrect: boolean;
  selectedRegion: Concept | null;
  correctRegion: Concept;
  explanation: string;
  onNext: () => void;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  isCorrect,
  selectedRegion,
  correctRegion,
  explanation,
  onNext
}) => {
  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-xl glass-effect border border-magic-blue/20 shadow-lg animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        {isCorrect ? (
          <>
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
            <h3 className="text-xl font-bold text-green-500">Correct!</h3>
          </>
        ) : (
          <>
            <XCircle className="h-6 w-6 text-magic-pink flex-shrink-0" />
            <h3 className="text-xl font-bold text-magic-pink">
              Not quite right
            </h3>
          </>
        )}
      </div>

      {!isCorrect && selectedRegion && (
        <p className="mb-3 text-muted-foreground">
          You selected <span className="font-medium text-foreground">{selectedRegion.name}</span>, but the correct answer is <span className="font-medium text-green-500">{correctRegion.name}</span>.
        </p>
      )}

      <div className="mb-4">
        <h4 className="font-bold mb-2 text-magic-purple">{correctRegion.name}: What You Need to Know</h4>
        <p className="text-muted-foreground">{correctRegion.description}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-bold mb-2 text-magic-blue">The Brain Science Explained:</h4>
        <p className="text-muted-foreground">{explanation}</p>
      </div>

      <button
        onClick={onNext}
        className={cn(
          "w-full py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md",
          "bg-gradient-to-r from-magic-blue to-magic-purple text-white",
          "hover:shadow-lg hover:translate-y-[-2px]",
          "active:translate-y-[0px]"
        )}
      >
        Continue to Next Question
      </button>
    </div>
  );
};

export default QuizFeedback;
