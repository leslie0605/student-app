import axios from "axios";
import { University, UniversityFilter } from "@/types/university";
import { ApplicationTask } from "@/types/journey";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Mock universities data for demo
const MOCK_UNIVERSITIES: University[] = [
  {
    id: "1",
    name: "Stanford University",
    location: {
      city: "Stanford",
      state: "California",
      country: "USA",
    },
    type: "Private",
    tuition: {
      currency: "USD",
      undergraduate: {
        inState: 56169,
        outOfState: 56169,
        international: 56169,
      },
      graduate: {
        inState: 55011,
        outOfState: 55011,
        international: 55011,
      },
    },
    admissionStats: {
      acceptanceRate: 4.3,
      averageGPA: 3.96,
      averageGRE: {
        verbal: 165,
        quantitative: 167,
        analytical: 4.8,
      },
    },
    departments: [
      {
        id: "d1",
        name: "Computer Science",
        programs: [
          {
            id: "p1",
            name: "Computer Science",
            degree: "PhD",
            deadline: "2023-12-01",
            requirements: [
              "GRE",
              "3 Letters of Recommendation",
              "Statement of Purpose",
            ],
          },
          {
            id: "p2",
            name: "Computer Science",
            degree: "MS",
            deadline: "2023-12-15",
            requirements: [
              "GRE",
              "3 Letters of Recommendation",
              "Statement of Purpose",
            ],
          },
        ],
      },
      {
        id: "d2",
        name: "Psychology",
        programs: [
          {
            id: "p3",
            name: "Psychology",
            degree: "PhD",
            deadline: "2023-12-01",
            requirements: [
              "GRE",
              "3 Letters of Recommendation",
              "Statement of Purpose",
              "CV",
            ],
          },
        ],
      },
    ],
    website: "https://www.stanford.edu",
  },
  {
    id: "2",
    name: "University of California, Berkeley",
    location: {
      city: "Berkeley",
      state: "California",
      country: "USA",
    },
    type: "Public",
    tuition: {
      currency: "USD",
      undergraduate: {
        inState: 14312,
        outOfState: 44066,
        international: 44066,
      },
      graduate: {
        inState: 14312,
        outOfState: 33928,
        international: 33928,
      },
    },
    admissionStats: {
      acceptanceRate: 14.5,
      averageGPA: 3.89,
      averageGRE: {
        verbal: 162,
        quantitative: 164,
        analytical: 4.5,
      },
    },
    departments: [
      {
        id: "d3",
        name: "Electrical Engineering and Computer Sciences",
        programs: [
          {
            id: "p4",
            name: "Computer Science",
            degree: "PhD",
            deadline: "2023-12-15",
            requirements: [
              "GRE",
              "3 Letters of Recommendation",
              "Statement of Purpose",
              "Personal History Statement",
            ],
          },
        ],
      },
      {
        id: "d4",
        name: "Psychology",
        programs: [
          {
            id: "p5",
            name: "Psychology",
            degree: "PhD",
            deadline: "2023-12-01",
            requirements: [
              "GRE",
              "3 Letters of Recommendation",
              "Statement of Purpose",
              "CV",
            ],
          },
        ],
      },
    ],
    website: "https://www.berkeley.edu",
  },
  {
    id: "3",
    name: "Massachusetts Institute of Technology",
    location: {
      city: "Cambridge",
      state: "Massachusetts",
      country: "USA",
    },
    type: "Private",
    tuition: {
      currency: "USD",
      undergraduate: {
        inState: 55450,
        outOfState: 55450,
        international: 55450,
      },
      graduate: {
        inState: 53790,
        outOfState: 53790,
        international: 53790,
      },
    },
    admissionStats: {
      acceptanceRate: 6.7,
      averageGPA: 3.95,
      averageGRE: {
        verbal: 162,
        quantitative: 168,
        analytical: 4.7,
      },
    },
    departments: [
      {
        id: "d5",
        name: "Electrical Engineering and Computer Science",
        programs: [
          {
            id: "p6",
            name: "Computer Science",
            degree: "PhD",
            deadline: "2023-12-15",
            requirements: [
              "GRE",
              "3 Letters of Recommendation",
              "Statement of Purpose",
            ],
          },
        ],
      },
    ],
    website: "https://www.mit.edu",
  },
];

export interface SearchResponse {
  success: boolean;
  data: University[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

class UniversityService {
  private readonly baseUrl = `${API_BASE_URL}/universities`;

  // Mock implementation of getAllUniversities
  async getAllUniversities(
    filters: UniversityFilter = {}
  ): Promise<SearchResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(
        "DEMO MODE: Returning mock universities data with filters:",
        filters
      );

      // Apply simple filtering if provided
      let filteredUniversities = [...MOCK_UNIVERSITIES];

      if (filters.country) {
        filteredUniversities = filteredUniversities.filter(
          (u) =>
            u.location.country.toLowerCase() === filters.country?.toLowerCase()
        );
      }

      if (filters.state) {
        filteredUniversities = filteredUniversities.filter(
          (u) => u.location.state.toLowerCase() === filters.state?.toLowerCase()
        );
      }

      if (filters.type) {
        filteredUniversities = filteredUniversities.filter(
          (u) => u.type.toLowerCase() === filters.type?.toLowerCase()
        );
      }

      return {
        success: true,
        data: filteredUniversities,
        pagination: {
          total: filteredUniversities.length,
          page: 1,
          pages: 1,
        },
      };
    } catch (error) {
      console.error("Error in mock university service:", error);
      return {
        success: false,
        data: [],
      };
    }
  }

  // Mock implementation of getUniversityById
  async getUniversityById(id: string): Promise<University> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("DEMO MODE: Getting university by ID:", id);

      const university = MOCK_UNIVERSITIES.find((u) => u.id === id);

      if (!university) {
        throw new Error(`University with ID ${id} not found`);
      }

      return university;
    } catch (error) {
      console.error(`Error fetching university ${id}:`, error);
      throw error;
    }
  }

  // Mock implementation of searchUniversities
  async searchUniversities(query: string): Promise<University[]> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("DEMO MODE: Searching universities with query:", query);

      if (!query) return MOCK_UNIVERSITIES;

      // Simple search in university names
      const searchResults = MOCK_UNIVERSITIES.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
      );

      return searchResults;
    } catch (error) {
      console.error("Error searching universities:", error);
      return [];
    }
  }

  // Mock implementation of getUniversityDepartments
  async getUniversityDepartments(id: string) {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      console.log("DEMO MODE: Getting departments for university ID:", id);

      const university = MOCK_UNIVERSITIES.find((u) => u.id === id);

      if (!university) {
        throw new Error(`University with ID ${id} not found`);
      }

      return university.departments;
    } catch (error) {
      console.error(`Error fetching departments for university ${id}:`, error);
      return [];
    }
  }

  // Helper method to format university data for display
  formatUniversityData(university: University) {
    return {
      ...university,
      formattedLocation: `${university.location.city}, ${university.location.state}, ${university.location.country}`,
      formattedTuition: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: university.tuition.currency,
        maximumFractionDigits: 0,
      }).format(university.tuition.graduate.international),
      formattedAcceptanceRate: `${university.admissionStats.acceptanceRate}%`,
      totalPrograms: university.departments.reduce(
        (acc, dept) => acc + dept.programs.length,
        0
      ),
    };
  }
}

export const universityService = new UniversityService();
