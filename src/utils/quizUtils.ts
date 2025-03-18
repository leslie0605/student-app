
// Get quiz icon based on quiz ID (React components would be passed elsewhere)
export const getQuizDescriptions = (quizId: string): string => {
  switch (quizId) {
    case 'brain-quiz': 
      return 'Test your knowledge about different brain regions and their functions.';
    case 'physics-quiz': 
      return 'Learn about fundamental physics concepts and phenomena.';
    case 'psychology-quiz': 
      return 'Learn about fundamental psychological theories and principles.';
    case 'science-quiz': 
      return 'Test your knowledge of basic scientific principles and discoveries.';
    case 'math-quiz': 
      return 'Challenge yourself with mathematical problems and concepts.';
    default: 
      return 'Test your knowledge in this quiz.';
  }
};
