import axios from "axios";
import { University, UniversityFilter } from "@/types/university";
import { ApplicationTask } from "@/types/journey";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

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

  async getAllUniversities(
    filters: UniversityFilter = {}
  ): Promise<SearchResponse> {
    try {
      const response = await axios.get(this.baseUrl, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching universities:", error);
      throw error;
    }
  }

  async getUniversityById(id: string): Promise<University> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching university ${id}:`, error);
      throw error;
    }
  }

  async searchUniversities(query: string): Promise<University[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { query },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error searching universities:", error);
      throw error;
    }
  }

  async getUniversityDepartments(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}/departments`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching departments for university ${id}:`, error);
      throw error;
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
