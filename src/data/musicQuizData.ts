export interface Concept {
  id: string;
  name: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  explanation: string;
  correctConcept: string;
  options: string[];
}

export const quizMetadata = {
  id: "music-quiz",
  title: "Quiz on music Concepts",
  description: "Test your knowledge about music concepts.",
  icon: "music",
  image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
};

export const concepts: Concept[] = [
  {
    id: "concept-1",
    name: "Musical Notation",
    description:
      "A system used to visually represent aurally perceived music played with instruments or sung by the human voice through the use of written symbols.",
  },
  {
    id: "concept-2",
    name: "Rhythm",
    description:
      "The arrangement of sounds as they move through time. It's the pattern of durations of notes and rests.",
  },
  {
    id: "concept-3",
    name: "Melody",
    description:
      "A sequence of single notes that is musically satisfying. It's the tune you whistle or hum.",
  },
  {
    id: "concept-4",
    name: "Harmony",
    description:
      "The process by which individual sounds are joined together. It's the simultaneous combination of notes and the structure of these combinations.",
  },
  {
    id: "concept-5",
    name: "Tempo",
    description:
      "The speed or pace of a given piece of music. It can be slow, fast or anything in between.",
  },
];
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Which concept refers to the visual representation of music through written symbols?",
    explanation:
      "Musical Notation is the system used to visually represent aurally perceived music played with instruments or sung by the human voice.",
    correctConcept: "concept-1",
    options: ["concept-1", "concept-2", "concept-3", "concept-4"],
  },
  {
    id: 2,
    question:
      "Which concept describes the arrangement of sounds as they move through time?",
    explanation:
      "Rhythm refers to the pattern of durations of notes and rests as they move through time.",
    correctConcept: "concept-2",
    options: ["concept-1", "concept-2", "concept-3", "concept-4"],
  },
  {
    id: 3,
    question:
      "Which concept is defined as a sequence of single notes that is musically satisfying?",
    explanation:
      "Melody is the sequence of single notes that is musically satisfying. It's the tune you whistle or hum.",
    correctConcept: "concept-3",
    options: ["concept-1", "concept-2", "concept-3", "concept-5"],
  },
  {
    id: 4,
    question:
      "Which concept refers to the simultaneous combination of notes and the structure of these combinations?",
    explanation:
      "Harmony refers to the process by which individual sounds are joined together. It's the simultaneous combination of notes and the structure of these combinations.",
    correctConcept: "concept-4",
    options: ["concept-2", "concept-3", "concept-4", "concept-5"],
  },
  {
    id: 5,
    question:
      "Which concept describes the speed or pace of a given piece of music?",
    explanation:
      "Tempo is the speed or pace of a given piece of music. It can be slow, fast or anything in between.",
    correctConcept: "concept-5",
    options: ["concept-1", "concept-2", "concept-5", "concept-4"],
  },
];
