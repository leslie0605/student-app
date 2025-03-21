
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Upload, FileText, FileCheck, Edit, MessageSquare, UserCheck, Mail } from "lucide-react";
import { fetchSoPVersions } from "@/services/inventoryService";
import { SoPVersion } from "@/types/inventory";
import MentorChatButton from "@/components/mentor/MentorChatButton";
import { toast } from "@/components/ui/use-toast";

interface RevisionNotification {
  id: string;
  documentName: string;
  mentorName: string;
  date: string;
  editsAccepted: number;
  commentsAdded: number;
  isRead: boolean;
}

const SopPage = () => {
  const navigate = useNavigate();
  const [sopVersions, setSopVersions] = useState<SoPVersion[]>([]);
  const [revisionNotifications, setRevisionNotifications] = useState<RevisionNotification[]>([]);

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

  // Mock revision notifications data
  useEffect(() => {
    // This would normally come from an API call
    const mockNotifications: RevisionNotification[] = [
      {
        id: "1",
        documentName: "UCLA Psychology SoP",
        mentorName: "Dr. Jane Smith",
        date: "2023-11-05",
        editsAccepted: 12,
        commentsAdded: 3,
        isRead: false,
      },
      {
        id: "2",
        documentName: "Stanford Computer Science SoP",
        mentorName: "Prof. Michael Chen",
        date: "2023-11-02",
        editsAccepted: 8,
        commentsAdded: 5,
        isRead: true,
      },
    ];
    
    setRevisionNotifications(mockNotifications);
  }, []);

  const markNotificationAsRead = (notificationId: string) => {
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
  };

  const viewRevision = (notificationId: string) => {
    // Mark as read when viewed
    markNotificationAsRead(notificationId);
    
    // In a real app, this would navigate to the revision view
    toast({
      title: "View revision",
      description: "This would open the document with revisions."
    });
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            {/* Revision Notifications */}
            {revisionNotifications.length > 0 && (
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
                          <Button size="sm">View Report</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">SoP Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Be specific about research interests and goals</li>
                    <li>Mention relevant faculty members by name</li>
                    <li>Connect past experiences to future plans</li>
                    <li>Explain why this specific program is a good fit</li>
                    <li>
                      Keep within the program's page limits (usually 1-2 pages)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <MentorChatButton />
    </div>
  );
};

export default SopPage;
