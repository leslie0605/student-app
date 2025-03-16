
export interface MagicalTool {
  id: string;
  name: string;
  description: string;
  type: 'wand' | 'potion' | 'book' | 'artifact';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  power: number; // 1-10 rating
  acquired: boolean;
  image?: string;
}

export interface ToolType {
  id: string;
  name: 'wand' | 'potion' | 'book' | 'artifact';
  description: string;
}

export interface ToolRarity {
  id: string;
  name: 'common' | 'uncommon' | 'rare' | 'legendary';
  color: string;
}
