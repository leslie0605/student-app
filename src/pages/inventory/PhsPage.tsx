
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Upload, FileText, FileCheck } from 'lucide-react';
import { fetchPHSVersions } from '@/services/inventoryService';
import { PHSVersion } from '@/types/inventory';

const PhsPage = () => {
  const navigate = useNavigate();
  const [phsVersions, setPhsVersions] = useState<PHSVersion[]>([]);
  
  // Fetch PHS versions
  const { isLoading: isLoadingPHS, data: phsData } = useQuery({
    queryKey: ['phs-versions'],
    queryFn: fetchPHSVersions
  });
  
  // Update state when data is fetched
  useEffect(() => {
    if (phsData) {
      setPhsVersions(phsData);
    }
  }, [phsData]);
  
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
            Personal History Statement
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border border-magic-blue/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                  <Upload className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Upload PHS</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Upload your current personal history statement (PDF/DOCX)
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-magic-blue/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                  <FileCheck className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Auto-Format</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Auto-tailor your PHS to specific program requirements
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border border-magic-blue/10 shadow-sm mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Your PHS Versions</h3>
                {isLoadingPHS ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : phsVersions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h4 className="text-lg font-medium mb-2">No PHS versions yet</h4>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Upload your first Personal History Statement to get started with formatting and evaluation.
                    </p>
                    <Button>Upload Your First PHS</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {phsVersions.map((version) => (
                      <div key={version.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{version.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Target: {version.targetUniversity} - {version.targetProgram}
                            </p>
                          </div>
                          {version.score && (
                            <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-sm">
                              Score: {version.score}/100
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground mb-3">
                          Last modified: {version.dateModified}
                        </div>
                        
                        {version.feedback && (
                          <div className="mb-3">
                            <p className="text-xs font-medium mb-1">Feedback:</p>
                            <ul className="text-xs space-y-1 list-disc pl-4">
                              {version.feedback.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">Download</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm">View Report</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">PHS Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Share your personal journey and experiences honestly</li>
                    <li>Discuss challenges you've overcome</li>
                    <li>Explain how your background has prepared you for graduate study</li>
                    <li>Highlight your unique perspective and what you'll bring to the program</li>
                    <li>Connect your personal history to your research interests</li>
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

export default PhsPage;
