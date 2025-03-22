import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getRevisedDocument,
  DocumentData,
} from "@/services/documentSharingService";
import {
  FileText,
  ChevronLeft,
  User,
  Calendar,
  Download,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const ReviewDocument = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getRevisedDocument(id);
        if (result.success && result.document) {
          setDocument(result.document);
        } else {
          setError(result.message);
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, toast]);

  const handleDownload = () => {
    if (!document?.fileUrl) return;

    // In a real app, this would trigger a download
    window.open(document.fileUrl, "_blank");

    toast({
      title: "Document Downloaded",
      description: "Your document has been downloaded.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
        <MainNavbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-magic-blue/20 rounded-full mb-4"></div>
              <div className="h-6 w-48 bg-magic-blue/20 rounded mb-2"></div>
              <div className="h-4 w-32 bg-magic-blue/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
        <MainNavbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              className="mr-2 p-2"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
              Document Not Found
            </h1>
          </div>
          <Card className="border border-magic-blue/10 shadow-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-magic-purple/50 mb-4" />
              <h2 className="text-xl font-medium mb-2">
                We couldn't find this document
              </h2>
              <p className="text-muted-foreground mb-6">
                {error ||
                  "The document you're looking for doesn't exist or has been removed."}
              </p>
              <Button onClick={() => navigate("/magical-inventory")}>
                Return to Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            {document.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <Card className="border border-magic-blue/10 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{document.type}</CardTitle>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last updated:{" "}
                  {new Date(document.updatedAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-md mb-6">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mentor Feedback
                  </h3>
                  <p className="text-sm">
                    {document.feedbackComments ||
                      "No additional feedback was provided."}
                  </p>
                </div>

                <Separator className="my-6" />

                <h3 className="font-medium mb-4">Document with Mentor Edits</h3>
                <ScrollArea className="h-[500px] border rounded-md p-4">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {/* This would be replaced with proper highlighting of edited text in a real implementation */}
                    {document.content}
                  </div>
                </ScrollArea>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Mentor Edit Summary</h3>
                  <div className="space-y-2">
                    {document.mentorEdits.length > 0 ? (
                      document.mentorEdits.map((edit) => (
                        <div
                          key={edit.id}
                          className="bg-blue-50 border border-blue-100 rounded-md p-3"
                        >
                          <div className="flex items-center text-sm mb-1">
                            <User className="h-3 w-3 mr-1 text-blue-500" />
                            <span className="font-medium text-blue-700">
                              {edit.mentorName}
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {new Date(edit.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-red-700">
                                Original:
                              </span>
                              <p className="bg-red-50 p-2 rounded mt-1">
                                {edit.originalText || "[No text]"}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-green-700">
                                Change:
                              </span>
                              <p className="bg-green-50 p-2 rounded mt-1">
                                {edit.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm p-4 bg-muted/20 rounded-md">
                        No edits were made to this document.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Document Stats</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <span className="font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {document.status === "completed"
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Edits:
                      </span>
                      <span className="font-medium">
                        {document.mentorEdits.length}
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Created:
                      </span>
                      <span className="font-medium text-sm">
                        {new Date(document.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                    {document.targetProgram && (
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Program:
                        </span>
                        <span className="font-medium text-sm">
                          {document.targetProgram}
                        </span>
                      </li>
                    )}
                    {document.targetUniversity && (
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          University:
                        </span>
                        <span className="font-medium text-sm">
                          {document.targetUniversity}
                        </span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDocument;
