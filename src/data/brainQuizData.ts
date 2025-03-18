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
  id: "brain-quiz",
  title: "Brain Regions Quiz",
  description:
    "Test your knowledge about different brain regions and their functions.",
  icon: "brain",
};

export const concepts: Concept[] = [
  {
    id: "frontal-lobe",
    name: "Frontal Lobe",
    description:
      "Responsible for cognitive functions, including decision-making, problem-solving, and planning.",
  },
  {
    id: "parietal-lobe",
    name: "Parietal Lobe",
    description:
      "Processes sensory information and is involved in spatial awareness and navigation.",
  },
  {
    id: "temporal-lobe",
    name: "Temporal Lobe",
    description:
      "Processes auditory information and is involved in memory, language, and emotional responses.",
  },
  {
    id: "occipital-lobe",
    name: "Occipital Lobe",
    description:
      "Processes visual information and is essential for visual perception and interpretation.",
  },
  {
    id: "cerebellum",
    name: "Cerebellum",
    description:
      "Coordinates movements, balance, and posture, as well as some cognitive functions.",
  },
  {
    id: "brain-stem",
    name: "Brain Stem",
    description:
      "Controls basic life functions such as breathing, heart rate, and sleep cycles.",
  },
  {
    id: "hypothalamus",
    name: "Hypothalamus",
    description:
      "Regulates body temperature, hunger, thirst, and emotional responses.",
  },
  {
    id: "hippocampus",
    name: "Hippocampus",
    description:
      "Crucial for forming new memories, learning, and spatial navigation.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Why do people with frontal lobe damage often struggle with planning and decision-making?",
    explanation:
      "The frontal lobe is responsible for executive functions like planning, decision-making, and impulse control. Damage to this area affects these critical abilities.",
    correctConcept: "frontal-lobe",
    options: ["frontal-lobe", "temporal-lobe", "cerebellum", "brain-stem"],
  },
  {
    id: 2,
    question:
      "Why might a person with damage to the occipital lobe have difficulty recognizing faces?",
    explanation:
      "The occipital lobe processes visual information, including facial recognition. Damage to this region can impair the ability to recognize faces, a condition called prosopagnosia.",
    correctConcept: "occipital-lobe",
    options: ["occipital-lobe", "parietal-lobe", "hippocampus", "hypothalamus"],
  },
  {
    id: 3,
    question:
      "Why would damage to the temporal lobe affect a person's ability to understand speech?",
    explanation:
      "The temporal lobe processes auditory information and houses Wernicke's area, which is crucial for language comprehension. Damage to this region can cause difficulties in understanding spoken language.",
    correctConcept: "temporal-lobe",
    options: ["temporal-lobe", "cerebellum", "frontal-lobe", "brain-stem"],
  },
  {
    id: 4,
    question:
      "Why might a person with cerebellum damage have a stumbling, uncoordinated gait?",
    explanation:
      "The cerebellum coordinates movement, balance, and posture. Damage to this region results in ataxia, characterized by uncoordinated movements and an unsteady gait.",
    correctConcept: "cerebellum",
    options: ["cerebellum", "brain-stem", "parietal-lobe", "hypothalamus"],
  },
  {
    id: 5,
    question:
      "Why would injury to the brain stem potentially be life-threatening?",
    explanation:
      "The brain stem controls vital functions like breathing, heart rate, and consciousness. Damage to this region can disrupt these essential life-sustaining processes.",
    correctConcept: "brain-stem",
    options: ["brain-stem", "hippocampus", "frontal-lobe", "parietal-lobe"],
  },
  {
    id: 6,
    question:
      "Why might damage to the hippocampus prevent someone from forming new memories?",
    explanation:
      "The hippocampus is crucial for converting short-term memories into long-term memories. Damage to this structure causes anterograde amnesia, where new memories cannot be formed.",
    correctConcept: "hippocampus",
    options: ["hippocampus", "occipital-lobe", "cerebellum", "hypothalamus"],
  },
  {
    id: 7,
    question:
      "Why would a tumor in the hypothalamus disrupt body temperature regulation?",
    explanation:
      "The hypothalamus regulates homeostasis, including body temperature. A tumor in this region can impair its ability to maintain normal body temperature.",
    correctConcept: "hypothalamus",
    options: ["hypothalamus", "temporal-lobe", "brain-stem", "frontal-lobe"],
  },
  {
    id: 8,
    question:
      "Why might damage to the parietal lobe cause someone to neglect one side of their body?",
    explanation:
      "The parietal lobe processes sensory information and spatial awareness. Damage, particularly to the right parietal lobe, can cause hemispatial neglect where a person ignores or is unaware of the left side of their body or environment.",
    correctConcept: "parietal-lobe",
    options: ["parietal-lobe", "occipital-lobe", "hippocampus", "cerebellum"],
  },
];
