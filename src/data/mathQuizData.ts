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
  id: "math-quiz",
  title: "Mathematics Quiz",
  description: "Challenge yourself with various mathematical concepts and problem-solving.",
  icon: "calculator"
};

export const concepts: Concept[] = [
  {
    id: "algebra",
    name: "Algebra",
    description:
      "Deals with symbols and the rules for manipulating these symbols; it is used to solve equations and model real-life situations.",
  },
  {
    id: "geometry",
    name: "Geometry",
    description:
      "Focuses on the properties and relations of points, lines, surfaces, and solids, often applied in real-world spatial problems.",
  },
  {
    id: "calculus",
    name: "Calculus",
    description:
      "Studies change in the form of derivatives and integrals; it helps in understanding rates of change and accumulation.",
  },
  {
    id: "statistics",
    name: "Statistics",
    description:
      "Involves collecting, analyzing, interpreting, and presenting data; it is used in surveys, experiments, and decision-making.",
  },
  {
    id: "probability",
    name: "Probability",
    description:
      "Deals with the likelihood of events occurring and underpins risk analysis and predictions in uncertain situations.",
  },
  {
    id: "number-theory",
    name: "Number Theory",
    description:
      "The study of integers and their properties, which is foundational for cryptography and understanding patterns in numbers.",
  },
  {
    id: "trigonometry",
    name: "Trigonometry",
    description:
      "Focuses on the relationships between the angles and sides of triangles; it is essential for modeling periodic phenomena.",
  },
  {
    id: "combinatorics",
    name: "Combinatorics",
    description:
      "The branch of mathematics concerning the counting, arrangement, and combination of objects.",
  },
  {
    id: "linear-algebra",
    name: "Linear Algebra",
    description:
      "Studies vectors, matrices, and linear transformations, and is critical in areas such as computer graphics and optimization.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "If a store offers a 20% discount on an item originally priced at $50, what is the sale price?",
    explanation:
      "Calculate 20% of $50 (which is $10) and subtract it from the original price. Thus, the sale price is $40.",
    correctConcept: "algebra",
    options: ["algebra", "statistics", "trigonometry", "calculus"],
  },
  {
    id: 2,
    question:
      "A recipe calls for a ratio of 3 parts water to 2 parts rice. If you have 6 cups of water, how many cups of rice are needed?",
    explanation:
      "Set up the proportion: 3 parts water / 2 parts rice = 6 cups water / x cups rice. Solving gives x = 4 cups of rice.",
    correctConcept: "algebra",
    options: ["algebra", "geometry", "statistics", "combinatorics"],
  },
  {
    id: 3,
    question:
      "A circular park has a radius of 30 meters. What is the approximate area of the park?",
    explanation:
      "Using the area formula A = πr², substitute r = 30 m: A ≈ 3.14 × 900 ≈ 2826 m².",
    correctConcept: "geometry",
    options: ["geometry", "calculus", "linear-algebra", "number-theory"],
  },
  {
    id: 4,
    question:
      "If you invest $2000 at an annual interest rate of 4% compounded annually, how much will you have after 5 years?",
    explanation:
      "Apply the compound interest formula A = P(1 + r)^n. Here, A = 2000 × (1.04)^5, which calculates to roughly $2433.",
    correctConcept: "algebra",
    options: ["algebra", "statistics", "trigonometry", "combinatorics"],
  },
  {
    id: 5,
    question:
      "In a raffle with 500 tickets, if you buy 5 tickets and one winning ticket is drawn, what is the probability of winning?",
    explanation:
      "The probability is the number of winning tickets you have divided by the total number of tickets: 5/500 = 0.01 or 1%.",
    correctConcept: "probability",
    options: ["probability", "statistics", "combinatorics", "calculus"],
  },
  {
    id: 6,
    question:
      "A survey found that 70% of respondents prefer online shopping. If 350 people were surveyed, how many prefer online shopping?",
    explanation:
      "Calculate 70% of 350: 0.7 × 350 = 245 people.",
    correctConcept: "statistics",
    options: ["statistics", "algebra", "geometry", "probability"],
  },
  {
    id: 7,
    question:
      "How many different ways can you arrange 4 distinct books on a shelf?",
    explanation:
      "The number of arrangements (permutations) of 4 items is 4! = 24.",
    correctConcept: "combinatorics",
    options: ["combinatorics", "linear-algebra", "number-theory", "algebra"],
  },
  {
    id: 8,
    question:
      "In a 30°-60°-90° right triangle, what is the ratio of the length of the side opposite the 30° angle to the hypotenuse?",
    explanation:
      "In such a triangle, the side opposite the 30° angle is half the hypotenuse, giving a ratio of 1:2.",
    correctConcept: "trigonometry",
    options: ["trigonometry", "geometry", "calculus", "algebra"],
  },
  {
    id: 9,
    question:
      "A company's profit over time is modeled by a smooth function P(t). What does the derivative P'(t) represent?",
    explanation:
      "The derivative P'(t) gives the instantaneous rate of change of profit, offering insights into how profit is increasing or decreasing over time.",
    correctConcept: "calculus",
    options: ["calculus", "algebra", "statistics", "linear-algebra"],
  },
  {
    id: 10,
    question:
      "A computer graphics program uses matrices to perform rotations and scaling of images. Which math concept is most relevant to these operations?",
    explanation:
      "Linear algebra deals with vectors, matrices, and linear transformations, which are the backbone of operations like rotation and scaling in computer graphics.",
    correctConcept: "linear-algebra",
    options: ["linear-algebra", "algebra", "trigonometry", "calculus"],
  },
];
