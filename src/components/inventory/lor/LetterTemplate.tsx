
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Copy, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const templateSchema = z.object({
  professorName: z.string().min(2, { message: "Professor name is required" }),
  professorTitle: z.string().min(2, { message: "Professor title is required" }),
  professorDepartment: z.string().min(2, { message: "Department is required" }),
  professorInstitution: z.string().min(2, { message: "Institution is required" }),
  programName: z.string().min(2, { message: "Program name is required" }),
  universityName: z.string().min(2, { message: "University name is required" }),
  deadline: z.string().min(2, { message: "Deadline is required" }),
  yourName: z.string().min(2, { message: "Your name is required" }),
  yourEmail: z.string().email({ message: "Valid email is required" }),
  yourPhone: z.string().min(2, { message: "Phone number is required" }),
});

const LetterTemplate: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      professorName: "",
      professorTitle: "",
      professorDepartment: "",
      professorInstitution: "",
      programName: "",
      universityName: "",
      deadline: "",
      yourName: "",
      yourEmail: "",
      yourPhone: "",
    },
  });
  
  const watchedValues = form.watch();
  
  const requestTemplate = `Dear ${watchedValues.professorName || "[Professor Name]"},

I hope this email finds you well. I am writing to ask if you would be willing to write a letter of recommendation for my application to the ${watchedValues.programName || "[Program Name]"} at ${watchedValues.universityName || "[University Name]"}.

Having taken your courses and worked with you on [specific projects/research], I believe you can speak to my abilities and potential for graduate study in this field. The application deadline is ${watchedValues.deadline || "[Deadline]"}, and the letter can be submitted electronically through the university's application portal. I will send you the submission link if you agree to write the letter.

To help with your letter, I've attached my current CV, personal statement, and a brief description of our work together. I'm happy to provide any additional information that might be helpful.

I understand you are busy, so please let me know if your schedule allows you to write this recommendation. I greatly appreciate your consideration.

Best regards,
${watchedValues.yourName || "[Your Name]"}
${watchedValues.yourEmail || "[Your Email]"}
${watchedValues.yourPhone || "[Your Phone]"}`;

  const followUpTemplate = `Dear ${watchedValues.professorName || "[Professor Name]"},

I hope you're doing well. I'm writing to follow up on my request for a letter of recommendation for the ${watchedValues.programName || "[Program Name]"} at ${watchedValues.universityName || "[University Name]"}.

I understand you have a busy schedule, and I wanted to remind you that the application deadline is ${watchedValues.deadline || "[Deadline]"}. If you've already submitted the letter, thank you very much, and please disregard this email.

If you need any additional information from me or have any questions, please don't hesitate to let me know. I'm happy to provide whatever might be helpful.

Thank you again for your support.

Best regards,
${watchedValues.yourName || "[Your Name]"}
${watchedValues.yourEmail || "[Your Email]"}
${watchedValues.yourPhone || "[Your Phone]"}`;

  const thankYouTemplate = `Dear ${watchedValues.professorName || "[Professor Name]"},

I wanted to express my sincere gratitude for writing a letter of recommendation for my application to the ${watchedValues.programName || "[Program Name]"} at ${watchedValues.universityName || "[University Name]"}.

I truly appreciate the time and effort you took to support my graduate school application. Your mentorship has been invaluable to my academic journey, and I'm grateful for your willingness to advocate for me in this important process.

I'll be sure to keep you updated on my application results. Thank you again for your support.

With gratitude,
${watchedValues.yourName || "[Your Name]"}
${watchedValues.yourEmail || "[Your Email]"}
${watchedValues.yourPhone || "[Your Phone]"}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Email template has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Failed to copy email template. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Letter Templates</h3>
      
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Professor Details</h4>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="professorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="professorTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Associate Professor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="professorDepartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Department of Psychology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="professorInstitution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="University of Research" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Program Details</h4>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="programName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Name</FormLabel>
                        <FormControl>
                          <Input placeholder="PhD in Psychology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="universityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Stanford University" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input placeholder="December 1, 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Your Information</h4>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="yourName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yourEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yourPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Templates
                  </CardTitle>
                  <CardDescription>
                    Fill in the form to generate customized email templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="request">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="request">Initial Request</TabsTrigger>
                      <TabsTrigger value="followup">Follow-up</TabsTrigger>
                      <TabsTrigger value="thankyou">Thank You</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="request" className="mt-4">
                      <ScrollArea className="h-72 w-full rounded-md border p-4">
                        <div className="whitespace-pre-wrap font-mono text-sm">
                          {requestTemplate}
                        </div>
                      </ScrollArea>
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          onClick={() => copyToClipboard(requestTemplate)}
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="followup" className="mt-4">
                      <ScrollArea className="h-72 w-full rounded-md border p-4">
                        <div className="whitespace-pre-wrap font-mono text-sm">
                          {followUpTemplate}
                        </div>
                      </ScrollArea>
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          onClick={() => copyToClipboard(followUpTemplate)}
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="thankyou" className="mt-4">
                      <ScrollArea className="h-72 w-full rounded-md border p-4">
                        <div className="whitespace-pre-wrap font-mono text-sm">
                          {thankYouTemplate}
                        </div>
                      </ScrollArea>
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          onClick={() => copyToClipboard(thankYouTemplate)}
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LetterTemplate;
