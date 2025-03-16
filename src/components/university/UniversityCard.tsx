
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { University } from '@/types/university';
import { format } from 'date-fns';
import { ExternalLink, BookOpen, MapPin, Calendar, GraduationCap, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface UniversityCardProps {
  university: University;
  onToggleSaved: (id: string, saved: boolean) => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university, onToggleSaved }) => {
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
                onClick={() => onToggleSaved(university.id, !university.saved)}
                className={university.saved ? 'text-magic-purple' : 'text-muted-foreground'}
              >
                {university.saved ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{university.saved ? 'Remove from Bucket' : 'Add to Bucket'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {university.location}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <GraduationCap className="h-4 w-4 text-magic-blue mt-0.5" />
            <div>
              <div className="text-sm font-medium">Program Type</div>
              <div className="text-sm text-muted-foreground">{university.programType}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-magic-blue mt-0.5" />
            <div>
              <div className="text-sm font-medium">Fields of Study</div>
              <div className="text-sm text-muted-foreground">
                {university.fields.join(', ')}
              </div>
            </div>
          </div>
          
          {university.applicationDeadline && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-magic-blue mt-0.5" />
              <div>
                <div className="text-sm font-medium">Application Deadline</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(university.applicationDeadline), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          )}
          
          {university.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {university.description}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {university.website && (
          <a 
            href={university.website} 
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
