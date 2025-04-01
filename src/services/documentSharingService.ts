import { toast } from "@/hooks/use-toast";
import {
  SoPVersion,
  CVVersion,
  PHSVersion,
  RevisionNotification,
} from "@/types/inventory";

// Backend API endpoint (not used in demo mode)
const BACKEND_API = "http://localhost:3000/api";

// Mock revision notifications for demo
const MOCK_FEEDBACK_NOTIFICATIONS: RevisionNotification[] = [
  {
    id: "notification-1",
    documentId: "doc-123",
    documentName: "Stanford Psychology SoP",
    mentorName: "Dr. Sarah Johnson",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    editsAccepted: 5,
    commentsAdded: 3,
    fileEdited: true,
    isRead: false,
    hasEditedFile: true,
    editedFileUrl: "/api/documents/edited-files/sample-edited-doc.pdf",
    fileUrl: "/api/documents/files/sample-original-doc.pdf",
    feedbackComments:
      "Great work overall! I've made some edits to improve clarity and structure. Please review the changes.",
  },
  {
    id: "notification-2",
    documentId: "doc-124",
    documentName: "Berkeley CS CV",
    mentorName: "Prof. Michael Williams",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    editsAccepted: 2,
    commentsAdded: 7,
    fileEdited: true,
    isRead: true,
    hasEditedFile: true,
    editedFileUrl: "/api/documents/edited-files/sample-edited-cv.pdf",
    fileUrl: "/api/documents/files/sample-original-cv.pdf",
    feedbackComments:
      "Your CV needs more focus on research experience. I've suggested several changes to highlight your technical skills better.",
  },
];

// Mock document data
const MOCK_DOCUMENT: DocumentData = {
  id: "doc-123",
  title: "Stanford Psychology SoP",
  content:
    "This Statement of Purpose outlines my academic journey and research interests in psychology. I am particularly interested in cognitive development in children and how early experiences shape learning outcomes. During my undergraduate studies, I conducted research on attention spans in preschoolers, which was published in the Journal of Developmental Psychology. I hope to continue this research at Stanford under the guidance of Dr. Elizabeth Chen, whose work on developmental milestones has greatly influenced my research direction.",
  type: "Statement of Purpose",
  studentName: "Demo Student",
  studentId: "student-123",
  mentorEdits: [
    {
      id: "edit-1",
      text: "cognitive and social development",
      originalText: "cognitive development",
      position: { start: 120, end: 148 },
      mentorName: "Dr. Sarah Johnson",
      mentorId: "mentor-1",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      fromSuggestion: true,
    },
    {
      id: "edit-2",
      text: "which was subsequently published",
      originalText: "which was published",
      position: { start: 300, end: 331 },
      mentorName: "Dr. Sarah Johnson",
      mentorId: "mentor-1",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      fromSuggestion: false,
    },
  ],
  status: "completed",
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  targetProgram: "Psychology PhD",
  targetUniversity: "Stanford University",
  fileUrl: "/api/documents/files/sample-original-doc.pdf",
  editedFileUrl: "/api/documents/edited-files/sample-edited-doc.pdf",
  feedbackComments:
    "Great work overall! I've made some edits to improve clarity and structure. Please review the changes.",
};

// Interface for document submission
export interface DocumentSubmission {
  documentId: string;
  documentName: string;
  documentType: "sop" | "cv" | "phs";
  studentId: string;
  studentName: string;
  fileUrl: string;
  targetProgram?: string;
  targetUniversity?: string;
  submissionDate: string;
}

// Define document data shape
export interface DocumentData {
  id: string;
  title: string;
  content: string;
  type: string;
  studentName: string;
  studentId: string;
  mentorEdits: Array<{
    id: string;
    text: string;
    originalText?: string;
    position: { start: number; end: number };
    mentorName: string;
    mentorId?: string;
    timestamp: string;
    fromSuggestion?: boolean;
  }>;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
  targetProgram?: string;
  targetUniversity?: string;
  fileUrl?: string;
  editedFileUrl?: string;
  feedbackComments?: string;
}

/**
 * Mock: Send a document to the mentor dashboard for review
 */
export const sendDocumentToMentor = async (
  document: SoPVersion | CVVersion | PHSVersion,
  documentType: "sop" | "cv" | "phs",
  studentName: string = "Sample Student", // In a real app, you'd get this from auth
  studentId: string = "student-123" // In a real app, you'd get this from auth
): Promise<{ success: boolean; message: string }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Prepare the document submission payload (just for logging)
    const submission: DocumentSubmission = {
      documentId: document.id,
      documentName: document.name,
      documentType,
      studentId,
      studentName,
      fileUrl: document.fileUrl || "/api/documents/files/mock-document.pdf",
      targetProgram:
        "targetProgram" in document ? document.targetProgram : undefined,
      targetUniversity:
        "targetUniversity" in document ? document.targetUniversity : undefined,
      submissionDate: new Date().toISOString(),
    };

    console.log("DEMO MODE: Sending document to mentor:", submission);

    // Update document status if it's a SoP or PHS
    if (documentType === "sop" && "sentToMentor" in document) {
      await updateSoPSentToMentor(
        document.id,
        true,
        "mentor-1" // Fixed mentor ID for this simple implementation
      );
    } else if (documentType === "phs" && "sentToMentor" in document) {
      await updatePHSSentToMentor(
        document.id,
        true,
        "mentor-1" // Fixed mentor ID for this simple implementation
      );
    }

    return {
      success: true,
      message: "Document successfully sent to mentor for review (DEMO MODE)",
    };
  } catch (error) {
    console.error("Error in demo document sending:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to send document",
    };
  }
};

/**
 * Mock: Check for document revisions from mentors
 */
export const checkForMentorFeedback = async (
  studentId: string = "student-123" // In a real app, you'd get this from auth
): Promise<RevisionNotification[]> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("DEMO MODE: Returning mock feedback notifications");
    return MOCK_FEEDBACK_NOTIFICATIONS;
  } catch (error) {
    console.error("Error in demo feedback check:", error);
    return [];
  }
};

/**
 * Check for document revisions from mentors (legacy function alias)
 * @deprecated Use checkForMentorFeedback instead
 */
export const checkForDocumentRevisions = async (
  studentId: string = "student-123" // In a real app, you'd get this from auth
) => {
  console.warn(
    "checkForDocumentRevisions is deprecated. Use checkForMentorFeedback instead."
  );
  return checkForMentorFeedback(studentId);
};

/**
 * Mark a revision notification as read in the mentor dashboard
 */
export const markRevisionAsRead = async (
  revisionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log("DEMO MODE: Marking revision as read", revisionId);

    // Mock success
    return {
      success: true,
      message: "Revision marked as read (DEMO MODE)",
    };
  } catch (error) {
    console.error("Error marking revision as read:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to mark revision as read",
    };
  }
};

// Function to update a SoP version's "sent to mentor" status
export const updateSoPSentToMentor = async (
  id: string,
  status: boolean,
  mentorId?: string
): Promise<SoPVersion> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sopIndex = mockSoPVersions.findIndex((s) => s.id === id);
      if (sopIndex >= 0) {
        mockSoPVersions[sopIndex].sentToMentor = status;
        mockSoPVersions[sopIndex].mentorId = mentorId;
        mockSoPVersions[sopIndex].lastSentDate = new Date()
          .toISOString()
          .split("T")[0];
        resolve(mockSoPVersions[sopIndex]);
      } else {
        reject(new Error("SoP version not found"));
      }
    }, 500);
  });
};

// Function to update a PHS version's "sent to mentor" status
export const updatePHSSentToMentor = async (
  id: string,
  status: boolean,
  mentorId?: string
): Promise<PHSVersion> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const phsIndex = mockPHSVersions.findIndex((p) => p.id === id);
      if (phsIndex >= 0) {
        mockPHSVersions[phsIndex].sentToMentor = status;
        mockPHSVersions[phsIndex].mentorId = mentorId;
        mockPHSVersions[phsIndex].lastSentDate = new Date()
          .toISOString()
          .split("T")[0];
        resolve(mockPHSVersions[phsIndex]);
      } else {
        reject(new Error("PHS version not found"));
      }
    }, 500);
  });
};

// Mock data for SoP versions (used by the updateSoPSentToMentor function)
const mockSoPVersions: SoPVersion[] = [
  {
    id: "1",
    name: "UCLA Psychology SoP",
    targetUniversity: "UCLA",
    targetProgram: "Psychology PhD",
    dateCreated: "2023-02-15",
    dateModified: "2023-03-10",
    sentToMentor: false,
  },
  {
    id: "2",
    name: "Stanford CS SoP",
    targetUniversity: "Stanford",
    targetProgram: "Computer Science PhD",
    dateCreated: "2023-01-20",
    dateModified: "2023-03-05",
    sentToMentor: false,
  },
];

// Mock data for PHS versions (used by the updatePHSSentToMentor function)
const mockPHSVersions: PHSVersion[] = [
  {
    id: "1",
    name: "Berkeley PHS",
    targetUniversity: "UC Berkeley",
    targetProgram: "Psychological Science",
    dateCreated: "2023-02-20",
    dateModified: "2023-03-15",
    sentToMentor: false,
  },
];

/**
 * Mock: Get revised document details
 */
export const getRevisedDocument = async (
  documentId: string
): Promise<{ success: boolean; document?: DocumentData; message: string }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    console.log("DEMO MODE: Returning mock document data for ID:", documentId);

    // Return mock document data
    return {
      success: true,
      document: MOCK_DOCUMENT,
      message: "Document retrieved successfully (DEMO MODE)",
    };
  } catch (error) {
    console.error("Error retrieving revised document:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve document",
    };
  }
};
