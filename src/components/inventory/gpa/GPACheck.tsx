
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, Check, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { GPACheckResult, checkWESRequirement } from '@/services/inventoryService';
import { useToast } from '@/components/ui/use-toast';

const gpaFormSchema = z.object({
  isUSInstitution: z.enum(['yes', 'no'], {
    required_error: "Please select an option",
  }),
  hasTranscriptTranslation: z.enum(['yes', 'no'], {
    required_error: "Please select an option",
  }),
  degreeLevel: z.string({
    required_error: "Please select a degree level",
  }),
});

const GPACheck: React.FC = () => {
  const [result, setResult] = useState<GPACheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof gpaFormSchema>>({
    resolver: zodResolver(gpaFormSchema),
    defaultValues: {
      isUSInstitution: undefined,
      hasTranscriptTranslation: undefined,
      degreeLevel: undefined,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof gpaFormSchema>) => {
    setIsLoading(true);
    try {
      const checkResult = await checkWESRequirement(
        values.isUSInstitution === 'yes',
        values.hasTranscriptTranslation === 'yes'
      );
      setResult(checkResult);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform the check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">WES GPA Evaluation Check</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              WES Evaluation Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="isUSInstitution"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Did you earn your degree at a U.S. institution?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Yes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasTranscriptTranslation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Do you already have official English translations of your transcripts?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Yes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degreeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What level of degree are you applying for?</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="professional">Professional Degree (MD, JD, etc.)</SelectItem>
                          <SelectItem value="certificate">Graduate Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Different programs may have different requirements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Checking..." : "Check Requirement"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="py-12 text-center text-muted-foreground">
                <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Fill out the form and submit to check if you need a WES evaluation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg flex items-start ${
                  result.wesNeeded 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {result.wesNeeded ? (
                    <X className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {result.wesNeeded 
                        ? "You likely need a WES evaluation" 
                        : "You likely don't need a WES evaluation"}
                    </h4>
                    <p className="mt-1 text-sm">{result.reason}</p>
                  </div>
                </div>
                
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 border-t py-3">
            <p className="text-xs text-muted-foreground">
              Note: World Education Services (WES) is just one of several credential evaluation services. Some schools may prefer or require a different service.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GPACheck;
