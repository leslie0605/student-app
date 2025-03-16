
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { fetchCVVersions, fetchChatMessages } from '@/services/inventoryService';
import { CVVersion, ChatMessage } from '@/types/inventory';
import CVDashboard from '@/components/inventory/cv/CVDashboard';
import MentorChat from '@/components/inventory/MentorChat';

const CvPage = () => {
  const navigate = useNavigate();
  const [cvVersions, setCvVersions] = useState<CVVersion[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Fetch CV versions
  const { isLoading: isLoadingCV } = useQuery({
    queryKey: ['cv-versions'],
    queryFn: fetchCVVersions,
    onSuccess: (data) => setCvVersions(data)
  });
  
  // Fetch chat messages for the CV tool
  const { isLoading: isLoadingChat } = useQuery({
    queryKey: ['chat-messages', 'cv'],
    queryFn: () => fetchChatMessages('cv'),
    onSuccess: (data) => setChatMessages(data)
  });
  
  const handleAddVersion = (version: CVVersion) => {
    setCvVersions(prev => [...prev, version]);
  };
  
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
            CV/Resume
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <Card className="border border-magic-blue/10 shadow-sm">
              <CardContent className="p-6">
                <CVDashboard cvVersions={cvVersions} />
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
                      Need guidance on formatting your CV for academic applications? Ask our PhD Mentor!
                    </p>
                    <MentorChat 
                      toolId="cv" 
                      messages={chatMessages}
                      onNewMessage={handleNewMessage}
                      isLoading={isLoadingChat}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">CV Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Academic CVs can be more than 1-2 pages, unlike resumes</li>
                    <li>Include all relevant research experience, even if in progress</li>
                    <li>List publications in APA format</li>
                    <li>Include teaching experience, conferences, and presentations</li>
                    <li>Add relevant technical and research skills</li>
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

export default CvPage;
