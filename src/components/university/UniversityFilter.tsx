
import React from 'react';
import { Field, Location } from '@/types/university';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface UniversityFilterProps {
  fields: Field[];
  locations: Location[];
  selectedField: string;
  selectedLocation: string;
  programType: string;
  onFieldChange: (field: string) => void;
  onLocationChange: (location: string) => void;
  onProgramTypeChange: (type: string) => void;
  isLoading: boolean;
}

const UniversityFilter: React.FC<UniversityFilterProps> = ({
  fields,
  locations,
  selectedField,
  selectedLocation,
  programType,
  onFieldChange,
  onLocationChange,
  onProgramTypeChange,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="field">Field of Study</Label>
            <Select value={selectedField} onValueChange={onFieldChange}>
              <SelectTrigger id="field">
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.name}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={selectedLocation} onValueChange={onLocationChange}>
              <SelectTrigger id="location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="program-type">Program Type</Label>
            <Select value={programType} onValueChange={onProgramTypeChange}>
              <SelectTrigger id="program-type">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversityFilter;
