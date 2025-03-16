
import React from 'react';
import { Field, Location } from '@/types/university';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, MapPin, BookOpen, GraduationCap } from 'lucide-react';

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
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-magic-purple" />
          <h2 className="text-lg font-semibold">Filter Universities</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              {/* Field of Study Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  Field of Study
                </label>
                <Select value={selectedField} onValueChange={onFieldChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Fields</SelectItem>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.name}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Select value={selectedLocation} onValueChange={onLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Program Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  Program Type
                </label>
                <Select value={programType} onValueChange={onProgramTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Programs</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversityFilter;
