import React, { useState, useRef } from "react";
import { CVVersion } from "@/types/inventory";
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
import {
  FileText,
  Upload,
  Plus,
  Download,
  Calendar,
  FileX,
  Star,
  Check,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sendDocumentToMentor } from "@/services/documentSharingService";

interface CVDashboardProps {
  cvVersions: CVVersion[];
}

const CVDashboard: React.FC<CVDashboardProps> = ({ cvVersions }) => {
  const [versions, setVersions] = useState<CVVersion[]>(cvVersions);
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      if (
        file.type !== "application/pdf" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
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
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
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
      formData.append("cvFile", selectedFile);

      // Upload to server
      const response = await fetch("http://localhost:3000/api/cv/upload", {
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
        `http://localhost:3000/api/cv/files/${selectedFile.name.replace(
          /\s+/g,
          "_"
        )}`;
      const score = result.data?.analysis?.score || 0;
      const feedback = result.data?.analysis?.feedback || [
        "Your CV has been uploaded successfully.",
        "We are analyzing your CV for improvement opportunities.",
        "Consider adding more details to your experience section.",
      ];

      // Add the new version to the versions list with analysis data
      const newVersion: CVVersion = {
        id: Date.now().toString(),
        name: selectedFile.name,
        dateCreated: new Date().toLocaleDateString(),
        dateModified: new Date().toLocaleDateString(),
        fileUrl: fileUrl,
        score: score,
        feedback: feedback,
      };

      setVersions((prev) => [newVersion, ...prev]);

      // Reset the selected file
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Close the dialog
      setIsUploadDialogOpen(false);

      toast({
        title: "Upload successful",
        description: `Your CV has been uploaded and scored ${score}/100.`,
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

  const handleDownload = (version: CVVersion) => {
    // Mock implementation - in a real app, this would download the file
    toast({
      title: "File download",
      description: `Downloading ${version.name}...`,
    });
  };

  const handleFormatting = () => {
    // Mock implementation - in a real app, this would trigger formatting
    toast({
      title: "Auto-formatting",
      description: "Auto-formatting to APA format would be implemented here.",
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const handleSendToMentor = async (version: CVVersion) => {
    setIsSending(true);
    try {
      const result = await sendDocumentToMentor(version, "cv");

      if (result.success) {
        toast({
          title: "Sent to mentor",
          description: "Your CV has been sent to your mentor for review.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error sending CV to mentor:", error);
      toast({
        title: "Failed to send",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred when sending to mentor.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">CV/Resume Dashboard</h3>
        <div className="flex space-x-2">
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload CV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload CV/Resume</DialogTitle>
                <DialogDescription>
                  Upload your current CV or resume. Supported formats: PDF,
                  DOCX.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center ${
                    selectedFile ? "border-green-500 bg-green-50" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <>
                      <FileText className="h-12 w-12 text-green-500 mb-4" />
                      <p className="mb-2 text-sm text-center font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                      >
                        Change File
                      </Button>
                    </>
                  ) : (
                    <>
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="mb-2 text-sm text-center">
                        Drag and drop your CV here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        PDF or DOCX, up to 5MB
                      </p>
                      <Button onClick={() => fileInputRef.current?.click()}>
                        Select File
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              </div>
              <DialogFooter className="flex space-x-2">
                <Button variant="outline" onClick={handleFormatting}>
                  Auto-Format to APA Style
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isNewVersionDialogOpen}
            onOpenChange={setIsNewVersionDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New CV Version</DialogTitle>
                <DialogDescription>
                  Create a new version or duplicate an existing one.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {/* Form would go here in a real implementation */}
                <p className="text-center text-muted-foreground">
                  CV creation form would go here
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {versions.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileX className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-lg font-medium mb-2">No CV versions yet</h3>
            <p className="text-muted-foreground text-sm max-w-md text-center mb-6">
              Upload your first CV to get started with formatting and
              evaluation.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First CV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload CV/Resume</DialogTitle>
                  <DialogDescription>
                    Upload your current CV or resume. Supported formats: PDF,
                    DOCX.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center ${
                      selectedFile ? "border-green-500 bg-green-50" : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {selectedFile ? (
                      <>
                        <FileText className="h-12 w-12 text-green-500 mb-4" />
                        <p className="mb-2 text-sm text-center font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                        >
                          Change File
                        </Button>
                      </>
                    ) : (
                      <>
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="mb-2 text-sm text-center">
                          Drag and drop your CV here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          PDF or DOCX, up to 5MB
                        </p>
                        <Button onClick={() => fileInputRef.current?.click()}>
                          Select File
                        </Button>
                        <input
                          type="file"
                          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {versions.map((version) => (
            <Card key={version.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{version.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="text-xs">
                          Last modified: {version.dateModified}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  {version.score !== undefined && (
                    <Badge variant="outline" className="bg-background">
                      <div className="flex items-center">
                        <Star
                          className={`h-3 w-3 mr-1 ${scoreColor(
                            version.score
                          )}`}
                        />
                        <span
                          className={`font-medium ${scoreColor(version.score)}`}
                        >
                          {version.score}/100
                        </span>
                      </div>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {version.feedback && version.feedback.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">
                      AI Evaluation Feedback:
                    </h4>
                    <ScrollArea className="h-32 w-full rounded-md border p-2">
                      <ul className="space-y-2">
                        {version.feedback.map((item, index) => (
                          <li key={index} className="flex items-start text-sm">
                            {item.toLowerCase().includes("add") ||
                            item.toLowerCase().includes("consider") ||
                            item.toLowerCase().includes("improve") ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            ) : item.toLowerCase().includes("great") ||
                              item.toLowerCase().includes("good") ||
                              item.toLowerCase().includes("excellent") ? (
                              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            )}
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>AI-generated feedback based on CV analysis</span>
                      {version.score !== undefined && (
                        <span
                          className={`font-medium ${scoreColor(version.score)}`}
                        >
                          Score: {version.score}/100
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(version)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSendToMentor(version)}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Send to Mentor
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t flex justify-between py-3">
                <span className="text-xs text-muted-foreground">
                  Created: {version.dateCreated}
                </span>
                <Button variant="ghost" size="sm" className="h-auto py-0">
                  View Report
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CVDashboard;
