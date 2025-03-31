
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Upload, FileText, FileCheck, Edit, MessageSquare, UserCheck, Mail } from "lucide-react";
import { fetchSoPVersions } from "@/services/inventoryService";
import { SoPVersion, RevisionNotification } from "@/types/inventory";
import MentorChatButton from "@/components/mentor/MentorChatButton";
import { toast } from "@/hooks/use-toast";
import SendToMentorDialog from "@/components/inventory/sop/SendToMentorDialog";
import { checkForDocumentRevisions, markRevisionAsRead } from "@/services/documentSharingService";

const SopPage = () => {
  const navigate = useNavigate();
  const [sopVersions, setSopVersions] = useState<SoPVersion[]>([]);
  const [revisionNotifications, setRevisionNotifications] = useState<RevisionNotification[]>([]);
  const [isCheckingRevisions, setIsCheckingRevisions] = useState(false);

  // Fetch SoP versions
  const { isLoading: isLoadingSoP, data: sopData } = useQuery({
    queryKey: ["sop-versions"],
    queryFn: fetchSoPVersions,
  });

  // Update state when data is fetched
  useEffect(() => {
    if (sopData) {
      setSopVersions(sopData);
    }
  }, [sopData]);

  // Fetch revision notifications
  const fetchRevisionNotifications = async () => {
    setIsCheckingRevisions(true);
    try {
      const revisions = await checkForDocumentRevisions();
      
      // Convert the revisions to notification format, handling different date formats
      const notifications: RevisionNotification[] = revisions.map(revision => ({
        id: revision.id,
        documentId: revision.documentId,
        documentName: revision.documentName,
        mentorName: revision.mentorName,
        // Use date property directly as defined in RevisionNotification type
        date: revision.date || new Date().toISOString().split('T')[0],
        editsAccepted: revision.editsAccepted,
        commentsAdded: revision.commentsAdded,
        isRead: false,
        fileUrl: revision.fileUrl
      }));
      
      setRevisionNotifications(prevNotifications => {
        // Merge new notifications with existing ones, avoiding duplicates
        const existingIds = new Set(prevNotifications.map(n => n.id));
        const newNotifications = notifications.filter(n => !existingIds.has(n.id));
        return [...prevNotifications, ...newNotifications];
      });
    } catch (error) {
      console.error("Error fetching revision notifications:", error);
    } finally {
      setIsCheckingRevisions(false);
    }
  };

  // Fetch revision notifications when the component mounts
  useEffect(() => {
    fetchRevisionNotifications();
    
    // Set up polling for new revisions every 5 minutes
    const interval = setInterval(fetchRevisionNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const result = await markRevisionAsRead(notificationId);
      
      if (result.success) {
        setRevisionNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
        
        toast({
          title: "Notification marked as read",
          description: "You've marked this revision notification as read."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to mark notification as read.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the notification.",
        variant: "destructive"
      });
    }
  };

  const viewRevision = (notificationId: string) => {
    // Mark as read when viewed
    markNotificationAsRead(notificationId);
    
    // Find the notification to get the document URL
    const notification = revisionNotifications.find(n => n.id === notificationId);
    
    if (notification?.fileUrl) {
      // In a real app, this would download or open the document
      window.open(notification.fileUrl, '_blank');
    } else {
      toast({
        title: "View revision",
        description: "This would open the document with revisions."
      });
    }
  };

  const handleRefreshRevisions = () => {
    if (!isCheckingRevisions) {
      fetchRevisionNotifications();
      toast({
        title: "Checking for revisions",
        description: "Looking for new document revisions from mentors."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="mr-2 p-2"
            onClick={() => navigate("/magical-inventory")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
            Statement of Purpose
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Revision Notifications */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Mentor Revisions</h2>
            <Button 
              onClick={handleRefreshRevisions}
              disabled={isCheckingRevisions}
              variant="outline"
            >
              {isCheckingRevisions ? "Checking..." : "Check for Revisions"}
            </Button>
          </div>
          
          {revisionNotifications.length > 0 ? (
            <Card className="border border-magic-blue/10 shadow-sm mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  Revision Notifications
                </h3>
                <div className="space-y-4">
                  {revisionNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`border rounded-lg p-4 relative transition-all ${
                        notification.isRead ? 'border-gray-200' : 'border-primary shadow-md'
                      }`}
                    >
                      {!notification.isRead && (
                        <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-primary animate-pulse" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <UserCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {notification.mentorName} revised your {notification.documentName}
                          </h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center">
                                <Edit className="h-4 w-4 mr-1" />
                                {notification.editsAccepted} edits accepted
                              </span>
                              <span className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {notification.commentsAdded} comments added
                              </span>
                            </div>
                            <div className="mt-1">
                              Received on {notification.date}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => viewRevision(notification.id)}>
                              View Revisions
                            </Button>
                            {!notification.isRead && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-magic-blue/10 shadow-sm mb-8">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Revisions Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't received any document revisions from mentors yet.
                </p>
                <Button onClick={handleRefreshRevisions} disabled={isCheckingRevisions}>
                  {isCheckingRevisions ? "Checking..." : "Check for Revisions"}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border border-magic-blue/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Upload className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Upload SoP</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Upload your current statement of purpose (PDF/DOCX)
                </p>
              </CardContent>
            </Card>

            <Card className="border border-magic-blue/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <FileCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Auto-Format</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Auto-tailor your SoP to specific program requirements
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-magic-blue/10 shadow-sm mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">
                Your SoP Versions
              </h3>
              {isLoadingSoP ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-muted/40 animate-pulse rounded-md"
                      />
                    ))}
                  </div>
                ) : sopVersions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h4 className="text-lg font-medium mb-2">
                      No SoP versions yet
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Upload your first Statement of Purpose to get started with
                      formatting and evaluation.
                    </p>
                    <Button>Upload Your First SoP</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sopVersions.map((version) => (
                      <div key={version.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{version.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Target: {version.targetUniversity} -{" "}
                              {version.targetProgram}
                            </p>
                          </div>
                          {version.score && (
                            <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-sm">
                              Score: {version.score}/100
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground mb-3">
                          Last modified: {version.dateModified}
                        </div>

                        {version.feedback && (
                          <div className="mb-3">
                            <p className="text-xs font-medium mb-1">
                              Feedback:
                            </p>
                            <ul className="text-xs space-y-1 list-disc pl-4">
                              {version.feedback.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <SendToMentorDialog document={version} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
      <MentorChatButton />
    </div>
  );
};

export default SopPage;
