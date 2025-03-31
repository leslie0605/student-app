
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { fetchPHSVersions } from "@/services/inventoryService";
import { PHSVersion } from "@/types/inventory";
import PHSDashboard from "@/components/inventory/phs/PHSDashboard";
import MentorChatButton from "@/components/mentor/MentorChatButton";

const PhsPage = () => {
  const navigate = useNavigate();
  const [phsVersions, setPhsVersions] = useState<PHSVersion[]>([]);

  // Fetch PHS versions
  const { isLoading: isLoadingPHS, data: phsData } = useQuery({
    queryKey: ["phs-versions"],
    queryFn: fetchPHSVersions,
  });

  // Update state when data is fetched
  useEffect(() => {
    if (phsData) {
      setPhsVersions(phsData);
    }
  }, [phsData]);

  const handleAddVersion = (version: PHSVersion) => {
    setPhsVersions((prev) => [...prev, version]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-magic-light to-white">
      <MainNavbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="mr-2 p-2"
            onClick={() => navigate("/magical-inventory")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-magic-blue to-magic-purple">
            Personal History Statement
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <Card className="border border-magic-blue/10 shadow-sm">
              <CardContent className="p-6">
                <PHSDashboard phsVersions={phsVersions} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">PHS Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>
                      Share your personal journey and experiences honestly
                    </li>
                    <li>Discuss challenges you've overcome</li>
                    <li>
                      Explain how your background has prepared you for graduate
                      study
                    </li>
                    <li>
                      Highlight your unique perspective and what you'll bring to
                      the program
                    </li>
                    <li>
                      Connect your personal history to your research interests
                    </li>
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

export default PhsPage;
