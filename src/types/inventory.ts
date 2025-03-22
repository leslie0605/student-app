// Tool categories and their statuses
export type ToolCategory = "lor" | "cv" | "sop" | "phs" | "language" | "gpa";
export type ToolStatus = "not-started" | "in-progress" | "completed";

// Tool types
export interface ToolType {
  id: string;
  name: string;
}

// Tool rarities
export interface ToolRarity {
  id: string;
  name: string;
}

// Letters of Recommendation types
export interface Recommender {
  id: string;
  name: string;
  email: string;
  institution: string;
  relationship: string;
  status: "requested" | "in-progress" | "submitted";
  dateRequested?: string;
  dateSubmitted?: string;
  notes?: string;
}

// CV/Resume types
export interface CVVersion {
  id: string;
  name: string;
  dateCreated: string;
  dateModified: string;
  file?: File | null;
  fileUrl?: string;
  score?: number;
  feedback?: string[];
}

// Statement of Purpose types
export interface SoPVersion {
  id: string;
  name: string;
  targetUniversity?: string;
  targetProgram?: string;
  dateCreated: string;
  dateModified: string;
  file?: File | null;
  fileUrl?: string;
  score?: number;
  feedback?: string[];
  sentToMentor?: boolean;
  mentorId?: string;
  lastSentDate?: string;
}

// Revision notification type for mentor feedback
export interface RevisionNotification {
  id: string;
  documentId: string;
  documentName: string;
  mentorName: string;
  date: string;
  editsAccepted: number;
  commentsAdded: number;
  isRead: boolean;
  fileUrl?: string;
  feedbackComments?: string;
}

// Personal History Statement types
export interface PHSVersion {
  id: string;
  name: string;
  targetUniversity?: string;
  targetProgram?: string;
  dateCreated: string;
  dateModified: string;
  file?: File | null;
  fileUrl?: string;
  score?: number;
  feedback?: string[];
}

// Chat Message type for "Ask a PhD Mentor" feature
export interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  message: string;
  timestamp: string;
}

// Tool interface for the Magical Tools
export interface MagicalTool {
  id: ToolCategory;
  name: string;
  description: string;
  status: ToolStatus;
  icon: string;
}
