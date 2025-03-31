export interface University {
  _id: string;
  name: string;
  shortName: string;
  applicationDeadline: Date | string;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  ranking: {
    global: number;
    national: number;
    year: number;
  };
  admissionStats: {
    acceptanceRate: number;
    totalStudents: number;
    internationalStudents: number;
    year: number;
  };
  departments: Department[];
  tuition: {
    graduate: {
      inState: number;
      outOfState: number;
      international: number;
    };
    costOfLiving: number;
    currency: string;
  };
  researchAreas: ResearchArea[];
  contact: {
    admissionsOffice: ContactInfo;
    graduateSchool?: ContactInfo;
  };
  resources: {
    libraries: number;
    researchCenters: number;
    housingAvailable: boolean;
    internationalOffice: boolean;
  };
  saved?: boolean; // Client-side property
}

export interface Department {
  name: string;
  description: string;
  programs: Program[];
}

export interface Program {
  name: string;
  degree: "Bachelors" | "Masters" | "PhD" | "Certificate" | "Diploma";
  requirements: {
    gre: {
      required: boolean;
      minimumScore: number;
    };
    gpa: {
      minimum: number;
      preferred: number;
    };
    toefl: {
      required: boolean;
      minimumScore: number;
    };
    ielts: {
      required: boolean;
      minimumScore: number;
    };
  };
  deadlines: {
    regular: Date | string;
    priority: Date | string;
    rolling: boolean;
  };
  funding: {
    available: boolean;
    types: string[];
  };
}

export interface ResearchArea {
  name: string;
  description: string;
  facultyCount: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
}

// For API parameters
export interface UniversityFilter {
  country?: string;
  state?: string;
  department?: string;
  degree?: string;
  minRanking?: number;
  maxRanking?: number;
  limit?: number;
  page?: number;
}

// Legacy interfaces maintained for backward compatibility
export interface Field {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}
