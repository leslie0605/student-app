
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { fetchRecommenders } from '@/services/inventoryService';
import { Recommender } from '@/types/inventory';
import RecommenderDashboard from '@/components/inventory/lor/RecommenderDashboard';
import LetterTemplate from '@/components/inventory/lor/LetterTemplate';
import MentorChatButton from '@/components/mentor/MentorChatButton';

const LorPage = () => {
  const navigate = useNavigate();
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  
  // Fetch recommenders data
  const { isLoading: isLoadingRecommenders, data: recommendersData } = useQuery({
    queryKey: ['recommenders'],
    queryFn: fetchRecommenders
  });
  
  // Update state when data is fetched
  useEffect(() => {
    if (recommendersData) {
      setRecommenders(recommendersData);
    }
  }, [recommendersData]);
  
  const handleAddRecommender = (recommender: Recommender) => {
    setRecommenders(prev => [...prev, recommender]);
  };
  
  const handleUpdateStatus = (id: string, status: Recommender['status']) => {
    setRecommenders(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status } : rec)
    );
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
            Letters of Recommendation
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <div className="space-y-8">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <RecommenderDashboard 
                    recommenders={recommenders} 
                    onAddRecommender={handleAddRecommender}
                    onUpdateStatus={handleUpdateStatus}
                    isLoading={isLoadingRecommenders}
                  />
                </CardContent>
              </Card>
              
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Email Templates</h3>
                  <LetterTemplate />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Letter Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Request letters at least 4-6 weeks before deadlines</li>
                    <li>Provide recommenders with your CV and personal statement</li>
                    <li>Remind them of specific projects you worked on together</li>
                    <li>Send gentle reminders one week before the deadline</li>
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

export default LorPage;
