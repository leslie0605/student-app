
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
  title: "Quiz on Music Concepts",
  description: "Test your knowledge about music concepts.",
  icon: "music",
};

export const concepts: Concept[] = [
  {
    id: "concept-1",
    name: "Classical Music",
    description:
      "Classical music is a broad term that usually refers to the music produced in, or rooted in the traditions of Western liturgical and secular music, encompassing a broad period from roughly the 9th century to present times.",
  },
  {
    id: "concept-2",
    name: "Jazz Music",
    description:
      "Jazz is a music genre that originated in the African-American communities of New Orleans, United States in the late 19th and early 20th centuries. It emerged in the form of independent traditional and popular musical styles.",
  },
  {
    id: "concept-3",
    name: "Rock Music",
    description:
      "Rock music is a broad genre of popular music that originated as 'rock and roll' in the United States in the late 1940s and early 1950s, evolving into a range of different styles in the mid-1960s and later, particularly in the United States and the United Kingdom.",
  },
  {
    id: "concept-4",
    name: "Pop Music",
    description:
      "Pop music is a genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom. The terms 'popular music' and 'pop music' are often used interchangeably, although the former describes all music that is popular and includes many disparate styles.",
  },
  {
    id: "concept-5",
    name: "Hip Hop Music",
    description:
      "Hip hop music, also known as rap music, is a genre of popular music developed in the United States by inner-city African Americans and Latino Americans in the Bronx borough of New York City in the 1970s. It consists of a stylized rhythmic music that commonly accompanies rapping, a rhythmic and rhyming speech that is chanted.",
  },
];
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Which genre of music originated in New Orleans, United States in the late 19th and early 20th centuries?",
    explanation:
      "Jazz music originated in the African-American communities of New Orleans, United States in the late 19th and early 20th centuries.",
    correctConcept: "concept-2",
    options: ["concept-1", "concept-2", "concept-3", "concept-4"],
  },
  {
    id: 2,
    question:
      "What genre of music is associated with the Bronx borough of New York City in the 1970s?",
    explanation:
      "Hip Hop music, also known as rap music, developed in the United States by inner-city African Americans and Latino Americans in the Bronx borough of New York City in the 1970s.",
    correctConcept: "concept-5",
    options: ["concept-1", "concept-2", "concept-3", "concept-5"],
  },
  {
    id: 3,
    question:
      "Which genre of music evolved as 'rock and roll' in the United States in the late 1940s and early 1950s?",
    explanation:
      "Rock music is a genre of popular music that originated as 'rock and roll' in the United States in the late 1940s and early 1950s.",
    correctConcept: "concept-3",
    options: ["concept-4", "concept-2", "concept-3", "concept-1"],
  },
  {
    id: 4,
    question:
      "Which genre of music originated in its modern form during the mid-1950s in the United States and the United Kingdom?",
    explanation:
      "Pop music is a genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom.",
    correctConcept: "concept-4",
    options: ["concept-4", "concept-5", "concept-3", "concept-1"],
  },
  {
    id: 5,
    question:
      "Which genre of music usually refers to the music produced in, or rooted in the traditions of Western liturgical and secular music?",
    explanation:
      "Classical music usually refers to the music produced in, or rooted in the traditions of Western liturgical and secular music.",
    correctConcept: "concept-1",
    options: ["concept-3", "concept-2", "concept-5", "concept-1"],
  },
];
