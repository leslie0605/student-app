
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Languages, Check, HelpCircle } from 'lucide-react';
import LanguageTestCheck from '@/components/inventory/language/LanguageTestCheck';
import MentorChatButton from '@/components/mentor/MentorChatButton';

const LanguagePage = () => {
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
            TOEFL/IELTS Requirements
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="border border-magic-blue/10 shadow-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Do I Need to Take an English Language Test?</h2>
                  <p className="text-muted-foreground">
                    Most graduate programs in English-speaking countries require proof of English proficiency.
                    Use our quick check tool to find out if you need to take the TOEFL or IELTS.
                  </p>
                </div>
                
                <LanguageTestCheck />
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
                      <Languages className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Test Options</h4>
                        <p className="text-sm text-muted-foreground">
                          TOEFL and IELTS are the most widely accepted English proficiency tests.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Score Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          Most programs require TOEFL scores of 80-100 (internet-based) or IELTS scores of 6.5-7.0.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Exemptions</h4>
                        <p className="text-sm text-muted-foreground">
                          You may be exempt if you're a native English speaker or completed a degree at an English-speaking institution.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Test Preparation Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Start preparing at least 2-3 months before the test</li>
                    <li>Take practice tests to identify weak areas</li>
                    <li>For TOEFL, practice integrated speaking and writing tasks</li>
                    <li>For IELTS, practice time management for the writing section</li>
                    <li>Scores are typically valid for 2 years</li>
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

export default LanguagePage;
