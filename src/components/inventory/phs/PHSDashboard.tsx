import React, { useState, useRef } from "react";
import { PHSVersion } from "@/types/inventory";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Upload,
  Download,
  Calendar,
  FileX,
  Star,
  Check,
  Loader2,
  UserIcon,
  School,
  Target,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sendDocumentToMentor } from "@/services/documentSharingService";

interface PHSDashboardProps {
  phsVersions: PHSVersion[];
}

const PHSDashboard: React.FC<PHSDashboardProps> = ({ phsVersions }) => {
  const [versions, setVersions] = useState<PHSVersion[]>(phsVersions);
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [targetUniversity, setTargetUniversity] = useState("");
  const [targetProgram, setTargetProgram] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      if (
        file.type !== "application/pdf" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/msword" &&
        file.type !== "application/x-tex" &&
        !file.name.toLowerCase().endsWith(".tex")
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, or TEX file.",
          variant: "destructive",
        });
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should not exceed 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check file type
      if (
        file.type !== "application/pdf" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/msword" &&
        file.type !== "application/x-tex" &&
        !file.name.toLowerCase().endsWith(".tex")
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, or TEX file.",
          variant: "destructive",
        });
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should not exceed 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("phsFile", selectedFile);

      // Add metadata if available
      if (targetUniversity) {
        formData.append("targetUniversity", targetUniversity);
      }
      if (targetProgram) {
        formData.append("targetProgram", targetProgram);
      }

      // Upload to server
      const response = await fetch("http://localhost:3000/api/documents/phs", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload file");
      }

      // Extract file URL and analysis data from response
      const fileUrl =
        result.data?.fileUrl ||
        `http://localhost:3000/api/documents/files/${selectedFile.name.replace(
          /\s+/g,
          "_"
        )}`;
      const score = result.data?.analysis?.score || 0;
      const feedback = result.data?.analysis?.feedback || [
        "Your Personal History Statement has been uploaded successfully.",
        "We are analyzing your statement for improvement opportunities.",
        "Consider adding more details about the challenges you've overcome.",
        "Connect your personal experiences to your academic interests more clearly.",
      ];

      // Add the new version to the versions list with analysis data
      const newVersion: PHSVersion = {
        id: Date.now().toString(),
        name: targetProgram
          ? `${targetUniversity} - ${targetProgram}`
          : selectedFile.name,
        targetUniversity: targetUniversity || "Not specified",
        targetProgram: targetProgram || "Not specified",
        dateCreated: new Date().toLocaleDateString(),
        dateModified: new Date().toLocaleDateString(),
        fileUrl: fileUrl,
        score: score,
        feedback: feedback,
      };

      setVersions((prev) => [newVersion, ...prev]);

      // Reset the form
      setSelectedFile(null);
      setTargetUniversity("");
      setTargetProgram("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Close the dialog
      setIsUploadDialogOpen(false);

      toast({
        title: "Upload successful",
        description: `Your Personal History Statement has been uploaded and scored ${score}/100.`,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (version: PHSVersion) => {
    // In a real app, this would download the file
    window.open(version.fileUrl, "_blank");

    toast({
      title: "File download",
      description: `Downloading ${version.name}...`,
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const handleSendToMentor = async (version: PHSVersion) => {
    setIsSending(true);
    try {
      const result = await sendDocumentToMentor(version, "phs");

      if (result.success) {
        toast({
          title: "Sent to mentor",
          description:
            "Your Personal History Statement has been sent to your mentor for review.",
        });

        // Update the version status locally
        const updatedVersions = versions.map((v) =>
          v.id === version.id ? { ...v, sentToMentor: true } : v
        );
        setVersions(updatedVersions);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error sending PHS to mentor:", error);
      toast({
        title: "Failed to send",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while sending to mentor.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Personal History Statement</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and manage your Personal History Statement documents
          </p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload PHS
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Personal History Statement</DialogTitle>
              <DialogDescription>
                Upload your PHS as a PDF or DOCX file to get AI-powered feedback
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetUniversity">Target University</Label>
                <Input
                  id="targetUniversity"
                  placeholder="e.g. Stanford University"
                  value={targetUniversity}
                  onChange={(e) => setTargetUniversity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetProgram">Target Program</Label>
                <Input
                  id="targetProgram"
                  placeholder="e.g. Computer Science PhD"
                  value={targetProgram}
                  onChange={(e) => setTargetProgram(e.target.value)}
                />
              </div>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx,.doc,.tex,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/x-tex"
                  onChange={handleFileChange}
                />
                {!selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, or TEX files only (max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Check className="h-10 w-10 mx-auto text-green-500" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  setIsUploadDialogOpen(false);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleFileUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {versions.length === 0 ? (
        <Card className="border-dashed border-2 p-8">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileX className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No PHS documents yet</h3>
            <p className="text-center text-muted-foreground mb-4">
              Upload your Personal History Statement to share your unique
              journey and experiences
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload PHS
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {versions.map((version) => (
            <Card key={version.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{version.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Last updated: {version.dateModified}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${
                      version.score >= 80
                        ? "bg-green-100 text-green-800"
                        : version.score >= 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Score: {version.score}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">University:</span>{" "}
                      {version.targetUniversity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">Program:</span>{" "}
                      {version.targetProgram}
                    </span>
                  </div>
                </div>
                <div className="border rounded-md p-3 bg-muted/20">
                  <h4 className="text-sm font-medium mb-2">AI Feedback</h4>
                  <ScrollArea className="h-24">
                    <ul className="space-y-1">
                      {version.feedback.map((point, i) => (
                        <li key={i} className="text-sm flex">
                          <span className="mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(version)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSendToMentor(version)}
                  disabled={version.sentToMentor || isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : version.sentToMentor ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Sent to Mentor
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Send to Mentor
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PHSDashboard;
