
export interface BrainRegion {
  id: string;
  name: string;
  description: string;
  coordinates: { x: number; y: number };
}

export interface QuizQuestion {
  id: number;
  question: string;
  explanation: string;
  correctRegion: string;
  options: string[];
}

export const brainRegions: BrainRegion[] = [
  {
    id: "frontal-lobe",
    name: "Frontal Lobe",
    description: "Responsible for executive functions, decision making, planning, and personality.",
    coordinates: { x: 20, y: 40 }
  },
  {
    id: "parietal-lobe",
    name: "Parietal Lobe",
    description: "Processes sensory information and helps with spatial awareness and navigation.",
    coordinates: { x: 50, y: 30 }
  },
  {
    id: "temporal-lobe",
    name: "Temporal Lobe",
    description: "Involved in auditory processing, language comprehension, and memory formation.",
    coordinates: { x: 35, y: 60 }
  },
  {
    id: "occipital-lobe",
    name: "Occipital Lobe",
    description: "The visual processing center of the brain.",
    coordinates: { x: 80, y: 50 }
  },
  {
    id: "cerebellum",
    name: "Cerebellum",
    description: "Coordinates muscle movements and maintains balance and posture.",
    coordinates: { x: 75, y: 80 }
  },
  {
    id: "amygdala",
    name: "Amygdala",
    description: "Processes emotions, especially fear and threat responses.",
    coordinates: { x: 45, y: 65 }
  },
  {
    id: "hippocampus",
    name: "Hippocampus",
    description: "Crucial for forming new memories and spatial navigation.",
    coordinates: { x: 50, y: 70 }
  },
  {
    id: "brainstem",
    name: "Brainstem",
    description: "Controls basic life functions like breathing, heart rate, and sleep cycles.",
    coordinates: { x: 60, y: 90 }
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Why do people sometimes overreact to small things, even when they don't understand why?",
    explanation: "The amygdala is your brain's alarm system, constantly scanning for threats. When it detects something potentially threatening (even if it's actually harmless), it can trigger strong emotional responses before your conscious mind has time to evaluate the situation rationally. This is why you might find yourself overreacting before you've had time to think.",
    correctRegion: "amygdala",
    options: ["amygdala", "frontal-lobe", "cerebellum", "occipital-lobe"]
  },
  {
    id: 2,
    question: "Why do we sometimes struggle to make decisions when faced with too many options?",
    explanation: "The frontal lobe handles executive functions like decision-making, planning, and weighing options. When presented with too many choices, this region can become overwhelmed, leading to 'decision fatigue.' This explains why making decisions becomes harder throughout the day and why limiting options can actually make choosing easier.",
    correctRegion: "frontal-lobe",
    options: ["frontal-lobe", "temporal-lobe", "brainstem", "parietal-lobe"]
  },
  {
    id: 3,
    question: "Why can we sometimes navigate to familiar places without actively thinking about the route?",
    explanation: "The hippocampus creates cognitive maps of our environment. After repeated exposure to a route, these spatial memories become so ingrained that navigation becomes automatic. This is why you can sometimes drive home on 'autopilot' while thinking about something else entirely.",
    correctRegion: "hippocampus",
    options: ["hippocampus", "cerebellum", "frontal-lobe", "occipital-lobe"]
  },
  {
    id: 4,
    question: "Why do we sometimes experience 'tip of the tongue' moments when we can't recall a word we know?",
    explanation: "The temporal lobe stores and processes language. During 'tip of the tongue' experiences, we're experiencing a temporary disconnect between the meaning of a word (which we can access) and its phonological form (the sounds that make up the word). This fascinating phenomenon shows how our language system has separate components for meaning and sound.",
    correctRegion: "temporal-lobe",
    options: ["temporal-lobe", "parietal-lobe", "cerebellum", "brainstem"]
  },
  {
    id: 5,
    question: "Why do we sometimes see optical illusions or misinterpret what we're seeing?",
    explanation: "The occipital lobe doesn't passively record what's in front of our eyes like a camera. Instead, it actively interprets visual information based on context, past experiences, and expectations. Optical illusions exploit the shortcuts and assumptions our visual system makes, revealing how our brain constructs our perception of reality rather than simply recording it.",
    correctRegion: "occipital-lobe",
    options: ["occipital-lobe", "parietal-lobe", "amygdala", "frontal-lobe"]
  },
  {
    id: 6,
    question: "Why do we sometimes jump or startle easily at sudden noises?",
    explanation: "The brainstem contains circuits that process sudden sensory information and can trigger immediate protective responses before conscious awareness. This explains why you might jump at a loud noise before you've even consciously registered what it was—an evolutionary advantage that keeps us safe by responding to potential threats before higher brain regions have time to analyze them.",
    correctRegion: "brainstem",
    options: ["brainstem", "amygdala", "cerebellum", "frontal-lobe"]
  },
  {
    id: 7,
    question: "Why do we sometimes lose our balance when we're tired or under the influence of alcohol?",
    explanation: "The cerebellum coordinates muscle movements and maintains posture and balance. When impaired by fatigue or substances like alcohol, this precise coordination suffers, resulting in clumsiness, stumbling, and poor balance. This is why sobriety tests often involve balance and coordination tasks.",
    correctRegion: "cerebellum",
    options: ["cerebellum", "parietal-lobe", "brainstem", "hippocampus"]
  },
  {
    id: 8,
    question: "Why do we sometimes lose track of where our limbs are in space when we're not looking at them?",
    explanation: "The parietal lobe integrates sensory information and helps create our sense of body position in space (proprioception). When this processing is disrupted or we're distracted, we can momentarily lose track of where exactly our limbs are without visual confirmation. This region's functioning explains why we can touch our nose with our eyes closed (when it's working well) or why we might misjudge and bump into things (when it's not).",
    correctRegion: "parietal-lobe",
    options: ["parietal-lobe", "occipital-lobe", "frontal-lobe", "temporal-lobe"]
  }
];
