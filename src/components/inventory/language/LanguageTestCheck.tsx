
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Languages, Check, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { LanguageTestCheckResult, checkLanguageTestRequirement } from '@/services/inventoryService';
import { useToast } from '@/components/ui/use-toast';

const languageFormSchema = z.object({
  isNativeSpeaker: z.enum(['yes', 'no'], {
    required_error: "Please select an option",
  }),
  hasEnglishDegree: z.enum(['yes', 'no'], {
    required_error: "Please select an option",
  }),
  targetCountry: z.string({
    required_error: "Please select a target country",
  }),
});

const LanguageTestCheck: React.FC = () => {
  const [result, setResult] = useState<LanguageTestCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof languageFormSchema>>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      isNativeSpeaker: undefined,
      hasEnglishDegree: undefined,
      targetCountry: undefined,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof languageFormSchema>) => {
    setIsLoading(true);
    try {
      const checkResult = await checkLanguageTestRequirement(
        values.isNativeSpeaker === 'yes',
        values.hasEnglishDegree === 'yes',
        values.targetCountry
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
      <h3 className="text-xl font-semibold">TOEFL/IELTS Requirement Check</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Languages className="h-5 w-5 mr-2" />
              Language Test Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="isNativeSpeaker"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Is English your native language?</FormLabel>
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
                  name="hasEnglishDegree"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Have you completed a degree taught entirely in English?</FormLabel>
                      <FormDescription>
                        This means you attended an institution where English was the primary language of instruction.
                      </FormDescription>
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
                  name="targetCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Which country are you applying to?</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                <Languages className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Fill out the form and submit to check if you need to take a language test.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg flex items-start ${
                  result.required 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {result.required ? (
                    <X className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {result.required 
                        ? "You likely need to take a language test" 
                        : "You may be exempt from language tests"}
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
              Note: This is a general guideline. Always check with your specific target programs for their exact requirements.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LanguageTestCheck;
