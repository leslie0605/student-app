
import { toast } from "@/hooks/use-toast";
import { SoPVersion } from "@/types/inventory";

// Mock mentor dashboard API endpoint (replace with actual endpoint)
const MENTOR_DASHBOARD_API = "https://academic-ally-platform.vercel.app/api";

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

// Interface for document revision response
export interface DocumentRevision {
  id: string;
  documentId: string;
  documentName: string;
  mentorId: string;
  mentorName: string;
  revisionDate: string;
  editsAccepted: number;
  commentsAdded: number;
  fileUrl: string;
  feedback?: string[];
}

/**
 * Send a SoP document to the mentor dashboard for review
 */
export const sendDocumentToMentor = async (
  document: SoPVersion,
  studentName: string = "Sample Student", // In a real app, you'd get this from auth
  studentId: string = "student-123" // In a real app, you'd get this from auth
): Promise<{ success: boolean; message: string }> => {
  try {
    // Prepare the document submission payload
    const submission: DocumentSubmission = {
      documentId: document.id,
      documentName: document.name,
      documentType: "sop",
      studentId,
      studentName,
      fileUrl: document.fileUrl || "https://example.com/sample-document.pdf", // Mock URL
      targetProgram: document.targetProgram,
      targetUniversity: document.targetUniversity,
      submissionDate: new Date().toISOString(),
    };

    // In a real implementation, this would be an actual API call
    // const response = await fetch(`${MENTOR_DASHBOARD_API}/document-submissions`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(submission),
    // });
    
    // if (!response.ok) {
    //   throw new Error(`Failed to send document: ${response.statusText}`);
    // }
    
    // const result = await response.json();
    
    // Mock a successful response for demonstration
    console.log("Document sent to mentor:", submission);
    
    return {
      success: true,
      message: "Document successfully sent to mentor for review",
    };
  } catch (error) {
    console.error("Error sending document to mentor:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send document",
    };
  }
};

/**
 * Check for document revisions from mentors
 */
export const checkForDocumentRevisions = async (
  studentId: string = "student-123" // In a real app, you'd get this from auth
): Promise<DocumentRevision[]> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch(`${MENTOR_DASHBOARD_API}/document-revisions?studentId=${studentId}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error(`Failed to check revisions: ${response.statusText}`);
    // }
    
    // const revisions = await response.json();
    
    // Mock revisions for demonstration
    const mockRevisions: DocumentRevision[] = [
      {
        id: "rev-1",
        documentId: "1", // This should match one of your SoP document IDs
        documentName: "UCLA Psychology SoP",
        mentorId: "mentor-1",
        mentorName: "Dr. Jane Smith",
        revisionDate: new Date().toISOString(),
        editsAccepted: 12,
        commentsAdded: 3,
        fileUrl: "https://example.com/revised-document.pdf",
        feedback: [
          "Improved introduction section",
          "Added more specificity to research interests",
          "Fixed grammar and style issues"
        ]
      }
    ];
    
    return mockRevisions;
  } catch (error) {
    console.error("Error checking for document revisions:", error);
    return [];
  }
};

/**
 * Download a revised document from the mentor dashboard
 */
export const downloadRevisedDocument = async (
  revisionId: string
): Promise<{ success: boolean; fileUrl?: string; message: string }> => {
  try {
    // In a real implementation, this would be an actual API call to download
    // const response = await fetch(`${MENTOR_DASHBOARD_API}/document-revisions/${revisionId}/download`, {
    //   method: "GET",
    // });
    
    // if (!response.ok) {
    //   throw new Error(`Failed to download document: ${response.statusText}`);
    // }
    
    // Mock download success
    return {
      success: true,
      fileUrl: "https://example.com/revised-document.pdf",
      message: "Document downloaded successfully",
    };
  } catch (error) {
    console.error("Error downloading revised document:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to download document",
    };
  }
};

/**
 * Mark a revision notification as read in the mentor dashboard
 */
export const markRevisionAsRead = async (
  revisionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, this would be an actual API call to mark as read
    // const response = await fetch(`${MENTOR_DASHBOARD_API}/document-revisions/${revisionId}/read`, {
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
      message: error instanceof Error ? error.message : "Failed to mark revision as read",
    };
  }
};
