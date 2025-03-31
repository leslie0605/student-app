import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { University } from "@/types/university";
import { format } from "date-fns";
import {
  ExternalLink,
  BookOpen,
  MapPin,
  Calendar,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Award,
  Users,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface UniversityCardProps {
  university: University;
  onToggleSaved: (id: string, saved: boolean) => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  onToggleSaved,
}) => {
  // Get total departments count
  const departmentsCount = university.departments.length;

  // Get main departments (limit to 3)
  const mainDepartments = university.departments
    .slice(0, 3)
    .map((dept) => dept.name)
    .join(", ");

  // Format tuition
  const formattedTuition = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: university.tuition.currency,
    maximumFractionDigits: 0,
  }).format(university.tuition.graduate.international);

  // Find earliest deadline across all programs
  const deadlines = university.departments
    .flatMap((dept) => dept.programs.map((prog) => prog.deadlines.regular))
    .filter(Boolean)
    .sort();

  const earliestDeadline = deadlines.length > 0 ? deadlines[0] : null;

  // Create website URL from admissions office if available
  const websiteUrl = university.contact?.admissionsOffice?.website;

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{university.name}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleSaved(university._id, !university.saved)}
                className={
                  university.saved
                    ? "text-magic-purple"
                    : "text-muted-foreground"
                }
              >
                {university.saved ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{university.saved ? "Remove from Bucket" : "Add to Bucket"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {university.location.city}, {university.location.state},{" "}
          {university.location.country}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-magic-blue mt-0.5" />
            <div>
              <div className="text-sm font-medium">Ranking</div>
              <div className="text-sm text-muted-foreground">
                Global: #{university.ranking.global} • National: #
                {university.ranking.national}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-magic-blue mt-0.5" />
            <div>
              <div className="text-sm font-medium">Departments</div>
              <div className="text-sm text-muted-foreground">
                {mainDepartments}
                {departmentsCount > 3
                  ? ` and ${departmentsCount - 3} more`
                  : ""}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-magic-blue mt-0.5" />
            <div>
              <div className="text-sm font-medium">Admission</div>
              <div className="text-sm text-muted-foreground">
                {university.admissionStats.acceptanceRate}% acceptance rate
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-magic-blue mt-0.5" />
            <div>
              <div className="text-sm font-medium">Tuition (Int'l)</div>
              <div className="text-sm text-muted-foreground">
                {formattedTuition} per year
              </div>
            </div>
          </div>

          {earliestDeadline && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-magic-blue mt-0.5" />
              <div>
                <div className="text-sm font-medium">Earliest Deadline</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(earliestDeadline), "MMMM d, yyyy")}
                </div>
              </div>
            </div>
          )}

          {university.researchAreas && university.researchAreas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {university.researchAreas.slice(0, 3).map((area, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {area.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-magic-purple hover:underline"
          >
            Visit Website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default UniversityCard;
