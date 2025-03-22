import React, { useState, useEffect } from "react";
import { Bell, Check, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkForMentorFeedback } from "@/services/documentSharingService";
import { RevisionNotification } from "@/types/inventory";
import { useNavigate } from "react-router-dom";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<RevisionNotification[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const result = await checkForMentorFeedback();
        setNotifications(result);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // In a real app, you would set up a polling or websocket for real-time updates
    const intervalId = setInterval(fetchNotifications, 60000); // Poll every minute

    return () => clearInterval(intervalId);
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleViewDocument = (documentId: string) => {
    // Navigate to the document viewer with the correct route
    navigate(`/document/${documentId}`);
    setIsOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleNotifications}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 shadow-lg z-50 border animate-in fade-in-50 slide-in-from-top-5">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className="h-6 w-6"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </CardHeader>

          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No new notifications
              </div>
            ) : (
              <div className="grid gap-2 p-2">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`bg-card ${
                      !notification.isRead ? "border-primary" : ""
                    }`}
                  >
                    <CardHeader className="p-3 pb-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">
                          {notification.documentName}
                        </h3>
                        {!notification.isRead && (
                          <Badge variant="default" className="text-[10px] h-5">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.mentorName} •{" "}
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <div className="flex space-x-2 mb-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Check className="h-3 w-3 mr-1 text-green-500" />
                          <span>{notification.editsAccepted} edits</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <FileText className="h-3 w-3 mr-1 text-blue-500" />
                          <span>{notification.commentsAdded} comments</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 pt-0 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleViewDocument(notification.documentId)
                        }
                      >
                        View Document
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
