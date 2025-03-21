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
  image: "/lovable-uploads/22d2e7af-4b10-4247-b980-a365152c6ff1.png",
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
  {
    id: "amygdala",
    name: "Amygdala",
    description:
      "Involved in processing emotions, particularly fear, and triggering the fight-or-flight response.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Why do people sometimes overreact to small things, even when they don't understand why?",
    explanation:
      "The amygdala is your brain's alarm system, constantly scanning for threats. When it detects something potentially threatening (even if it's actually harmless), it can trigger strong emotional responses before your conscious mind has time to evaluate the situation rationally. This is why you might find yourself overreacting before you've had time to think.",
    correctConcept: "amygdala",
    options: ["amygdala", "temporal-lobe", "cerebellum", "brain-stem"],
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
];
