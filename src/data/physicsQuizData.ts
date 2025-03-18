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
  id: "physics-quiz",
  title: "Physics Concepts Quiz",
  description: "Learn about fundamental physics concepts and phenomena.",
  icon: "atom"
};

export const concepts: Concept[] = [
  {
    id: "mechanics",
    name: "Mechanics",
    description:
      "The study of motion, forces, and energy. It covers topics such as kinematics, dynamics, and statics.",
  },
  {
    id: "electromagnetism",
    name: "Electromagnetism",
    description:
      "The branch of physics that deals with electric and magnetic fields and their interactions.",
  },
  {
    id: "thermodynamics",
    name: "Thermodynamics",
    description:
      "The study of heat, temperature, and energy transfer within physical systems.",
  },
  {
    id: "quantum-mechanics",
    name: "Quantum Mechanics",
    description:
      "A fundamental theory that describes the behavior of matter and energy at the atomic and subatomic scales.",
  },
  {
    id: "relativity",
    name: "Relativity",
    description:
      "Einstein's theory that explains how time, space, and gravity behave at high speeds and in strong gravitational fields.",
  },
  {
    id: "optics",
    name: "Optics",
    description:
      "The study of light, its properties, and its interactions with matter, including reflection, refraction, and dispersion.",
  },
  {
    id: "acoustics",
    name: "Acoustics",
    description:
      "The science of sound, including its production, transmission, and effects on different environments.",
  },
  {
    id: "fluid-dynamics",
    name: "Fluid Dynamics",
    description:
      "The study of fluids (liquids and gases) in motion, focusing on flow, pressure, and related phenomena like lift.",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Why does a ball thrown upward eventually come back down?",
    explanation:
      "According to mechanics, gravity exerts a constant force on the ball, causing an acceleration towards Earth that eventually reverses its upward motion.",
    correctRegion: "mechanics",
    options: ["mechanics", "thermodynamics", "optics", "quantum-mechanics"],
  },
  {
    id: 2,
    question:
      "Why do magnets stick to a refrigerator door?",
    explanation:
      "This is explained by electromagnetism. Magnetic fields interact with the ferromagnetic materials in the door, causing the magnet to adhere.",
    correctRegion: "electromagnetism",
    options: ["electromagnetism", "mechanics", "acoustics", "fluid-dynamics"],
  },
  {
    id: 3,
    question:
      "Why does a metal spoon heat up when placed in a hot cup of soup?",
    explanation:
      "Thermodynamics explains that heat is transferred from the hot soup to the cooler spoon through conduction, raising the spoon's temperature.",
    correctRegion: "thermodynamics",
    options: ["thermodynamics", "quantum-mechanics", "mechanics", "acoustics"],
  },
  {
    id: 4,
    question:
      "How can particles be in multiple states or locations at the same time?",
    explanation:
      "Quantum mechanics reveals that particles can exist in a superposition of states until they are observed, which is a hallmark of quantum behavior.",
    correctRegion: "quantum-mechanics",
    options: ["quantum-mechanics", "relativity", "optics", "mechanics"],
  },
  {
    id: 5,
    question:
      "Why does time seem to slow down when you're moving at very high speeds?",
    explanation:
      "Relativity predicts time dilation: as an object approaches the speed of light, time passes slower for it compared to a stationary observer.",
    correctRegion: "relativity",
    options: ["relativity", "mechanics", "thermodynamics", "quantum-mechanics"],
  },
  {
    id: 6,
    question:
      "Why does a prism split white light into a rainbow of colors?",
    explanation:
      "Optics explains that different wavelengths of light are refracted by different amounts when passing through a prism, separating the light into its constituent colors.",
    correctRegion: "optics",
    options: ["optics", "electromagnetism", "quantum-mechanics", "fluid-dynamics"],
  },
  {
    id: 7,
    question:
      "Why do we hear echoes in a canyon?",
    explanation:
      "Acoustics tells us that sound waves reflect off the canyon walls, creating echoes that are heard after the original sound is produced.",
    correctRegion: "acoustics",
    options: ["acoustics", "mechanics", "thermodynamics", "optics"],
  },
  {
    id: 8,
    question:
      "How do airplanes generate lift to overcome gravity?",
    explanation:
      "Fluid dynamics explains that the shape of an airplane's wings causes air to flow faster over the top than the bottom, creating a pressure difference that produces lift.",
    correctRegion: "fluid-dynamics",
    options: ["fluid-dynamics", "mechanics", "electromagnetism", "thermodynamics"],
  },
];
