
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Upload, FileText, BarChart, FileCheck } from 'lucide-react';
import { fetchSoPVersions, fetchChatMessages } from '@/services/inventoryService';
import { SoPVersion, ChatMessage } from '@/types/inventory';
import MentorChat from '@/components/inventory/MentorChat';

const SopPage = () => {
  const navigate = useNavigate();
  const [sopVersions, setSopVersions] = useState<SoPVersion[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Fetch SoP versions
  const { isLoading: isLoadingSoP } = useQuery({
    queryKey: ['sop-versions'],
    queryFn: fetchSoPVersions,
    onSuccess: (data) => setSopVersions(data)
  });
  
  // Fetch chat messages for the SoP tool
  const { isLoading: isLoadingChat } = useQuery({
    queryKey: ['chat-messages', 'sop'],
    queryFn: () => fetchChatMessages('sop'),
    onSuccess: (data) => setChatMessages(data)
  });
  
  const handleNewMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };
  
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
            Statement of Purpose
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border border-magic-blue/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                  <Upload className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Upload SoP</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Upload your current statement of purpose (PDF/DOCX)
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-magic-blue/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                  <FileCheck className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Auto-Format</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Auto-tailor your SoP to specific program requirements
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border border-magic-blue/10 shadow-sm mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Your SoP Versions</h3>
                {isLoadingSoP ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : sopVersions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h4 className="text-lg font-medium mb-2">No SoP versions yet</h4>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Upload your first Statement of Purpose to get started with formatting and evaluation.
                    </p>
                    <Button>Upload Your First SoP</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sopVersions.map((version) => (
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
                  <h3 className="text-xl font-semibold mb-4">Help Resources</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Need guidance on writing a compelling Statement of Purpose? Ask our PhD Mentor!
                    </p>
                    <MentorChat 
                      toolId="sop" 
                      messages={chatMessages}
                      onNewMessage={handleNewMessage}
                      isLoading={isLoadingChat}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">SoP Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Be specific about research interests and goals</li>
                    <li>Mention relevant faculty members by name</li>
                    <li>Connect past experiences to future plans</li>
                    <li>Explain why this specific program is a good fit</li>
                    <li>Keep within the program's page limits (usually 1-2 pages)</li>
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

export default SopPage;
