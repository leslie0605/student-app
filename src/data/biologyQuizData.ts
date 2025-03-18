export interface Concept {
  id: string;
  name: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  explanation: string;
  correctRegion: string;
  options: string[];
}

export const quizMetadata = {
  id: "biology-quiz",
  title: "Biology Concepts Quiz",
  description:
    "Test your knowledge of key biology concepts through real-life scenarios and applications.",
  icon: "dna",
};

export const concepts: Concept[] = [
  {
    id: "cell-theory",
    name: "Cell Theory",
    description:
      "All living organisms are composed of cells, which are the fundamental units of life. Cells arise only from pre-existing cells.",
  },
  {
    id: "evolution",
    name: "Evolution",
    description:
      "A process in which species undergo genetic change over time through natural selection and adaptation to their environment.",
  },
  {
    id: "photosynthesis",
    name: "Photosynthesis",
    description:
      "A process used by plants and certain organisms to convert light energy into chemical energy, fueling growth and metabolism.",
  },
  {
    id: "genetics",
    name: "Genetics",
    description:
      "The study of heredity and variation, focusing on genes, DNA, and the mechanisms by which traits are transmitted from one generation to the next.",
  },
  {
    id: "ecosystem",
    name: "Ecosystem",
    description:
      "A community of living organisms interacting with their physical environment, where every element plays a role in the balance of life.",
  },
  {
    id: "homeostasis",
    name: "Homeostasis",
    description:
      "The ability of an organism to regulate and maintain a stable internal environment despite external changes.",
  },
  {
    id: "dna",
    name: "DNA Structure",
    description:
      "The double helix structure of deoxyribonucleic acid that encodes the genetic blueprint of all living organisms.",
  },
  {
    id: "protein-synthesis",
    name: "Protein Synthesis",
    description:
      "The cellular process by which proteins are generated based on genetic instructions, essential for growth, repair, and function.",
  },
  {
    id: "metabolism",
    name: "Metabolism",
    description:
      "The network of biochemical reactions that convert food into energy and building blocks necessary for life.",
  },
  {
    id: "respiration",
    name: "Respiration",
    description:
      "The process by which cells convert oxygen and nutrients into energy, releasing carbon dioxide as a byproduct.",
  },
  {
    id: "ecology",
    name: "Ecology",
    description:
      "The branch of biology that studies the interactions among organisms and their environment, shaping ecosystems and biodiversity.",
  },
  {
    id: "biodiversity",
    name: "Biodiversity",
    description:
      "The variety of life in the world or in a particular habitat, including the variability among living organisms and the ecosystems they form.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Why do plants thrive in sunlight while struggling to grow in dark environments?",
    explanation:
      "Plants use photosynthesis to convert light energy into chemical energy. Without enough light, their energy production falters, leading to stunted growth.",
    correctRegion: "photosynthesis",
    options: ["photosynthesis", "cell-theory", "respiration", "genetics"],
  },
  {
    id: 2,
    question:
      "Why do certain animal species appear perfectly adapted to their environments over generations?",
    explanation:
      "Evolution through natural selection allows species to develop traits that are advantageous in their environments, resulting in well-adapted populations over time.",
    correctRegion: "evolution",
    options: ["evolution", "homeostasis", "genetics", "ecology"],
  },
  {
    id: 3,
    question:
      "How can two siblings share many similarities yet exhibit distinct differences?",
    explanation:
      "Genetics explains that siblings inherit a mix of genes from their parents, which leads to both shared traits and individual differences.",
    correctRegion: "genetics",
    options: ["genetics", "cell-theory", "protein-synthesis", "biodiversity"],
  },
  {
    id: 4,
    question:
      "Why is it that every living organism, from the simplest bacterium to complex animals, is built from similar structural units?",
    explanation:
      "Cell Theory reveals that all life forms are composed of cells—the basic building blocks that unify the diversity of life.",
    correctRegion: "cell-theory",
    options: ["cell-theory", "dna", "metabolism", "ecology"],
  },
  {
    id: 5,
    question:
      "Why do you start sweating on a hot day, and how does your body avoid overheating?",
    explanation:
      "Homeostasis is the body's mechanism to maintain a stable internal temperature. Sweating cools the body, preventing overheating during high temperatures.",
    correctRegion: "homeostasis",
    options: ["homeostasis", "metabolism", "respiration", "protein-synthesis"],
  },
  {
    id: 6,
    question:
      "How does your body determine traits like eye color or height during development?",
    explanation:
      "DNA carries genetic instructions that act as a blueprint for developing physical traits, ensuring that characteristics are passed down through generations.",
    correctRegion: "dna",
    options: ["dna", "genetics", "evolution", "ecology"],
  },
  {
    id: 7,
    question:
      "Why can eating protein-rich foods help repair muscles and tissues?",
    explanation:
      "Protein synthesis is essential for repairing and building tissues, as cells use amino acids from proteins to create new, functional proteins for growth and repair.",
    correctRegion: "protein-synthesis",
    options: [
      "protein-synthesis",
      "photosynthesis",
      "respiration",
      "cell-theory",
    ],
  },
  {
    id: 8,
    question:
      "Why do some people seem to burn energy faster than others even while at rest?",
    explanation:
      "Metabolism encompasses all the chemical reactions that produce energy in the body. Variations in metabolic rate can be due to genetic factors, lifestyle, and other influences.",
    correctRegion: "metabolism",
    options: ["metabolism", "ecology", "homeostasis", "evolution"],
  },
  {
    id: 9,
    question:
      "Why does breathing become more labored during intense physical activities?",
    explanation:
      "Respiration increases during exertion to supply more oxygen to the muscles, leading to heavier breathing as the body works to meet higher energy demands.",
    correctRegion: "respiration",
    options: [
      "respiration",
      "protein-synthesis",
      "photosynthesis",
      "cell-theory",
    ],
  },
  {
    id: 10,
    question:
      "How do interactions among plants, animals, and their surroundings contribute to a balanced environment?",
    explanation:
      "Ecology studies how living organisms interact with each other and their environment, creating complex networks that support healthy, resilient ecosystems.",
    correctRegion: "ecology",
    options: ["ecology", "biodiversity", "evolution", "cell-theory"],
  },
];
