import React from "react";
import { University } from "@/types/university";
import UniversityCard from "./UniversityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX } from "lucide-react";

interface UniversityGridProps {
  universities: University[];
  onToggleSaved: (id: string, saved: boolean) => void;
  isLoading: boolean;
}

const UniversityGrid: React.FC<UniversityGridProps> = ({
  universities,
  onToggleSaved,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[350px]">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="text-center py-12">
        <SearchX className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No universities found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {universities.map((university) => (
        <UniversityCard
          key={university._id}
          university={university}
          onToggleSaved={onToggleSaved}
        />
      ))}
    </div>
  );
};

export default UniversityGrid;
