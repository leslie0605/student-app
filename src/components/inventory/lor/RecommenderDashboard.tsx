
import React, { useState } from 'react';
import { Recommender } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, Clock, CheckCircle, Calendar } from 'lucide-react';
import { addRecommender, updateRecommenderStatus } from '@/services/inventoryService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommenderDashboardProps {
  recommenders: Recommender[];
  onAddRecommender: (recommender: Recommender) => void;
  onUpdateStatus: (id: string, status: Recommender['status']) => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  institution: z.string().min(2, { message: "Institution is required." }),
  relationship: z.string().min(2, { message: "Relationship is required." }),
  notes: z.string().optional(),
  status: z.enum(['requested', 'in-progress', 'submitted']),
});

const RecommenderDashboard: React.FC<RecommenderDashboardProps> = ({ 
  recommenders, 
  onAddRecommender,
  onUpdateStatus,
  isLoading = false
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      institution: "",
      relationship: "",
      notes: "",
      status: "requested",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Create a recommender object with all required fields
      const newRecommender = await addRecommender({
        name: values.name,
        email: values.email,
        institution: values.institution,
        relationship: values.relationship,
        status: values.status,
        notes: values.notes || "",
        dateRequested: new Date().toISOString().split('T')[0],
      });
      
      onAddRecommender(newRecommender);
      setIsAddDialogOpen(false);
      form.reset();
      
      toast({
        title: "Recommender added",
        description: `${values.name} has been added to your recommenders.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add recommender. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: Recommender['status']) => {
    try {
      await updateRecommenderStatus(id, status);
      onUpdateStatus(id, status);
      
      toast({
        title: "Status updated",
        description: `Recommender status changed to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Recommender['status']) => {
    switch (status) {
      case 'requested':
        return <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200">Requested</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-500 border-yellow-200">In Progress</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200">Submitted</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="pt-2">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recommender Dashboard</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Recommender
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Recommender</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jsmith@university.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="institution"
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
                
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Research Advisor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="requested">Requested</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional notes about this recommender"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Add Recommender</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {recommenders.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-lg font-medium mb-2">No recommenders yet</h3>
            <p className="text-muted-foreground text-sm max-w-md text-center mb-6">
              Add your first recommender to start tracking your letters of recommendation.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Recommender
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommenders.map((recommender) => (
            <Card key={recommender.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(recommender.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{recommender.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{recommender.institution}</p>
                    </div>
                  </div>
                  {getStatusBadge(recommender.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{recommender.email}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Requested: {recommender.dateRequested}</span>
                  </div>
                  
                  {recommender.dateSubmitted && (
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>Submitted: {recommender.dateSubmitted}</span>
                    </div>
                  )}
                  
                  {recommender.notes && (
                    <div className="pt-2 text-sm">
                      <p className="font-medium">Notes:</p>
                      <p className="text-muted-foreground">{recommender.notes}</p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Update Status:</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant={recommender.status === 'requested' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleStatusChange(recommender.id, 'requested')}
                        className="flex-1"
                      >
                        Requested
                      </Button>
                      <Button 
                        variant={recommender.status === 'in-progress' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleStatusChange(recommender.id, 'in-progress')}
                        className="flex-1"
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        In Progress
                      </Button>
                      <Button 
                        variant={recommender.status === 'submitted' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleStatusChange(recommender.id, 'submitted')}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Submitted
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommenderDashboard;
