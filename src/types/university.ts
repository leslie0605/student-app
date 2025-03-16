
export interface University {
  id: string;
  name: string;
  location: string;
  fields: string[];
  applicationDeadline?: string; // ISO date string
  website?: string;
  programType: 'PhD' | 'Masters' | 'Both';
  description?: string;
  saved: boolean;
}

export interface Field {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}
