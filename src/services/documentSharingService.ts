import { toast } from "@/hooks/use-toast";
import {
  SoPVersion,
  CVVersion,
  PHSVersion,
  RevisionNotification,
} from "@/types/inventory";

// Backend API endpoint
const BACKEND_API = "http://localhost:3000/api";

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
  feedbackComments?: string;
}

/**
 * Send a document to the mentor dashboard for review
 */
export const sendDocumentToMentor = async (
  document: SoPVersion | CVVersion | PHSVersion,
  documentType: "sop" | "cv" | "phs",
  studentName: string = "Sample Student", // In a real app, you'd get this from auth
  studentId: string = "student-123" // In a real app, you'd get this from auth
): Promise<{ success: boolean; message: string }> => {
  try {
    // Prepare the document submission payload
    const submission: DocumentSubmission = {
      documentId: document.id,
      documentName: document.name,
      documentType,
      studentId,
      studentName,
      fileUrl: document.fileUrl || "https://example.com/sample-document.pdf", // In real app, this would be actual URL
      targetProgram:
        "targetProgram" in document ? document.targetProgram : undefined,
      targetUniversity:
        "targetUniversity" in document ? document.targetUniversity : undefined,
      submissionDate: new Date().toISOString(),
    };

    console.log("Sending document to mentor:", submission);
    console.log("API URL:", `${BACKEND_API}/documents/student-submission`);

    // Send to backend API - remove credentials option to avoid CORS issues
    const response = await fetch(
      `${BACKEND_API}/documents/student-submission`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      }
    );

    // Log raw response for debugging
    console.log("Response status:", response.status, response.statusText);
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    // Parse the response if it's valid JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      throw new Error(
        `Server returned invalid JSON: ${responseText.substring(0, 100)}...`
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Server error: ${response.status} ${response.statusText}`
      );
    }

    // Update document status if it's a SoP
    if (documentType === "sop" && "sentToMentor" in document) {
      await updateSoPSentToMentor(
        document.id,
        true,
        "mentor-1" // Fixed mentor ID for this simple implementation
      );
    }

    return {
      success: true,
      message: "Document successfully sent to mentor for review",
    };
  } catch (error) {
    console.error("Error sending document to mentor:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to send document",
    };
  }
};

/**
 * Check for document revisions from mentors
 */
export const checkForMentorFeedback = async (
  studentId: string = "student-123" // In a real app, you'd get this from auth
): Promise<RevisionNotification[]> => {
  try {
    console.log("Checking for mentor feedback for student:", studentId);
    console.log(
      "API URL:",
      `${BACKEND_API}/documents/notifications/${studentId}`
    );

    // Remove credentials option to avoid CORS issues
    const response = await fetch(
      `${BACKEND_API}/documents/notifications/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log raw response for debugging
    console.log("Response status:", response.status, response.statusText);
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    // Only try to parse if we have content
    if (responseText.trim()) {
      try {
        const result = JSON.parse(responseText);

        if (!response.ok) {
          throw new Error(
            result.message ||
              `Server error: ${response.status} ${response.statusText}`
          );
        }

        return result.data || [];
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(
          `Server returned invalid JSON: ${responseText.substring(0, 100)}...`
        );
      }
    }

    // Return empty array for empty responses
    return [];
  } catch (error) {
    console.error("Error checking for mentor feedback:", error);
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
    // In a real implementation, this would be an actual API call to mark as read
    // const response = await fetch(`${BACKEND_API}/document-revisions/${revisionId}/read`, {
    //   method: "PUT",
    // });

    // if (!response.ok) {
    //   throw new Error(`Failed to mark revision as read: ${response.statusText}`);
    // }

    // Mock success
    return {
      success: true,
      message: "Revision marked as read",
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

/**
 * Get revised document details
 */
export const getRevisedDocument = async (
  documentId: string
): Promise<{ success: boolean; document?: DocumentData; message: string }> => {
  try {
    const response = await fetch(`${BACKEND_API}/documents/${documentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to retrieve document");
    }

    const result = await response.json();
    return {
      success: true,
      document: result.data,
      message: "Document retrieved successfully",
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
