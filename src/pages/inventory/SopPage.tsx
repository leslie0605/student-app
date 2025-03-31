
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { fetchSoPVersions } from "@/services/inventoryService";
import { SoPVersion } from "@/types/inventory";
import SoPDashboard from "@/components/inventory/sop/SoPDashboard";
import MentorChatButton from "@/components/mentor/MentorChatButton";

const SopPage = () => {
  const navigate = useNavigate();
  const [sopVersions, setSopVersions] = useState<SoPVersion[]>([]);

  // Fetch SoP versions
  const { isLoading: isLoadingSoP, data: sopData } = useQuery({
    queryKey: ["sop-versions"],
    queryFn: fetchSoPVersions,
  });

  // Update state when data is fetched
  useEffect(() => {
    if (sopData) {
      setSopVersions(sopData);
    }
  }, [sopData]);

  const handleAddVersion = (version: SoPVersion) => {
    setSopVersions((prev) => [...prev, version]);
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
            Statement of Purpose
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <Card className="border border-magic-blue/10 shadow-sm">
              <CardContent className="p-6">
                <SoPDashboard sopVersions={sopVersions} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <Card className="border border-magic-blue/10 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">SoP Tips</h3>
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>
                      Clearly state your research interests and career goals
                    </li>
                    <li>
                      Demonstrate knowledge of the program you're applying to
                    </li>
                    <li>
                      Explain how your background has prepared you for graduate study
                    </li>
                    <li>
                      Highlight relevant academic and research experiences
                    </li>
                    <li>
                      Be specific about faculty members you want to work with
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

export default SopPage;
