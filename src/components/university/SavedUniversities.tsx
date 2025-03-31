import React from "react";
import { University } from "@/types/university";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  BookmarkX,
  GraduationCap,
  Calendar,
  ExternalLink,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface SavedUniversitiesProps {
  universities: University[];
  onToggleSaved: (id: string, saved: boolean) => void;
  isLoading: boolean;
}

const SavedUniversities: React.FC<SavedUniversitiesProps> = ({
  universities,
  onToggleSaved,
  isLoading,
}) => {
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Target Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (universities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Target Schools</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Bookmark className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No saved universities</h3>
          <p className="text-muted-foreground">
            Go to the Explore tab and bookmark universities to add them to your
            bucket
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              document
                .querySelector('[data-value="explore"]')
                ?.dispatchEvent(new Event("click"))
            }
          >
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Explore Universities
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Target Schools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>University</TableHead>
                <TableHead>Programs</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((university) => {
                // Get main departments
                const mainDepartments = university.departments
                  .slice(0, 2)
                  .map((dept) => dept.name)
                  .join(", ");

                // Get programs count
                const programsCount = university.departments.reduce(
                  (acc, dept) => acc + dept.programs.length,
                  0
                );

                // Website URL
                const websiteUrl =
                  university.contact?.admissionsOffice?.website;

                return (
                  <TableRow key={university._id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        {university.name}
                        {websiteUrl && (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-magic-purple hover:underline mt-1"
                          >
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-magic-blue" />
                        <span>
                          {mainDepartments}{" "}
                          {university.departments.length > 2 ? "..." : ""}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({programsCount} programs)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {university.applicationDeadline ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-magic-purple" />
                          <span>
                            {format(
                              new Date(university.applicationDeadline),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No deadline set
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleSaved(university._id, false)}
                        >
                          <BookmarkX className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedUniversities;
