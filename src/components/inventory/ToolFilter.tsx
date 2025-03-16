
import React from 'react';
import { ToolType, ToolRarity } from '@/types/inventory';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2, Beaker, BookOpen, Sparkles } from 'lucide-react';

interface ToolFilterProps {
  types: ToolType[];
  rarities: ToolRarity[];
  selectedType: string;
  selectedRarity: string;
  acquisitionStatus: string;
  onTypeChange: (type: string) => void;
  onRarityChange: (rarity: string) => void;
  onAcquisitionStatusChange: (status: string) => void;
  isLoading: boolean;
}

const ToolFilter: React.FC<ToolFilterProps> = ({
  types,
  rarities,
  selectedType,
  selectedRarity,
  acquisitionStatus,
  onTypeChange,
  onRarityChange,
  onAcquisitionStatusChange,
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
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wand':
        return <Wand2 className="h-4 w-4" />;
      case 'potion':
        return <Beaker className="h-4 w-4" />;
      case 'book':
        return <BookOpen className="h-4 w-4" />;
      case 'artifact':
        return <Sparkles className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tool-type">Tool Type</Label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger id="tool-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.name} className="flex items-center">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(type.name)}
                      <span>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rarity">Rarity</Label>
            <Select value={selectedRarity} onValueChange={onRarityChange}>
              <SelectTrigger id="rarity">
                <SelectValue placeholder="All Rarities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                {rarities.map((rarity) => (
                  <SelectItem key={rarity.id} value={rarity.name}>
                    {rarity.name.charAt(0).toUpperCase() + rarity.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="acquisition-status">Status</Label>
            <Select value={acquisitionStatus} onValueChange={onAcquisitionStatusChange}>
              <SelectTrigger id="acquisition-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="acquired">Acquired</SelectItem>
                <SelectItem value="not-acquired">Not Acquired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolFilter;
