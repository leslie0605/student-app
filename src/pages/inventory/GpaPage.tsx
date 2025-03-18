
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Calculator, GraduationCap, FileText } from 'lucide-react';
import GPACheck from '@/components/inventory/gpa/GPACheck';
import MentorChatButton from '@/components/mentor/MentorChatButton';

const GpaPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="mr-2 p-2" 
            onClick={() => navigate('/magical-inventory')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
            GPA & Transcript Evaluation
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="border border-magic-blue/10 shadow-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Do I Need WES Evaluation?</h2>
                  <p className="text-muted-foreground">
                    If you earned your degree outside the United States, you may need to have your transcripts evaluated 
                    by a credential evaluation service like World Education Services (WES).
                    Use our quick check tool to find out if you need WES evaluation.
                  </p>
                </div>
                
                <GPACheck />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-4">
            <div className="space-y-6 sticky top-24">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Guide</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calculator className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">GPA Conversion</h4>
                        <p className="text-sm text-muted-foreground">
                          WES converts your grades to the U.S. 4.0 scale, making it easier for admissions committees to evaluate your academic performance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Degree Equivalency</h4>
                        <p className="text-sm text-muted-foreground">
                          WES determines if your degree is equivalent to a U.S. bachelor's, master's, or doctoral degree.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Processing Time</h4>
                        <p className="text-sm text-muted-foreground">
                          WES evaluation typically takes 7-10 business days after receiving all required documents.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">WES Evaluation Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Start the WES process early, at least 2-3 months before application deadlines</li>
                    <li>Check if your target programs specify a preferred evaluation service</li>
                    <li>Official transcripts must be sent directly from your institution to WES</li>
                    <li>Some programs may accept unofficial translations temporarily</li>
                    <li>WES evaluation fees typically range from $100-$200</li>
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

export default GpaPage;
