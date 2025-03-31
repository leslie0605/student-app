
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SoPVersion } from "@/types/inventory";
import { sendDocumentToMentor } from "@/services/documentSharingService";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SendToMentorDialogProps {
  document: SoPVersion;
}

const SendToMentorDialog: React.FC<SendToMentorDialogProps> = ({ document }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string>("");
  const [priority, setPriority] = useState<string>("normal");

  // Mock list of mentors - in a real app, this would come from an API
  const mentors = [
    { id: "mentor-1", name: "Dr. Jane Smith - Psychology" },
    { id: "mentor-2", name: "Prof. Michael Chen - Computer Science" },
    { id: "mentor-3", name: "Dr. Emily Johnson - Biology" },
  ];

  const handleSendToMentor = async () => {
    if (!selectedMentor) {
      toast({
        title: "Selection Required",
        description: "Please select a mentor to review your document.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Providing the correct document type "sop" as the second parameter
      const result = await sendDocumentToMentor(document, "sop", selectedMentor, priority);
      
      if (result.success) {
        toast({
          title: "Document Sent",
          description: `Your document has been sent to the mentor for review.`,
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send document. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Send to Mentor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send for Review</DialogTitle>
          <DialogDescription>
            Submit your document to a PhD mentor for professional review and feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document-name" className="text-right">
              Document
            </Label>
            <Input
              id="document-name"
              value={document.name}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mentor" className="text-right">
              Mentor
            </Label>
            <Select
              value={selectedMentor}
              onValueChange={setSelectedMentor}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((mentor) => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={setPriority}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High - Within 24 hours</SelectItem>
                <SelectItem value="normal">Normal - Within 48 hours</SelectItem>
                <SelectItem value="low">Low - Within 5 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSendToMentor}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send to Mentor"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendToMentorDialog;
