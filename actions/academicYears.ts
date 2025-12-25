"use server";

import { api } from "./schools";
import axios from "axios";

export async function getActiveAcademicYear(schoolId: string) {
  try {
    const response = await api.get(`/academic-years/active/${schoolId}`);
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
        // Return null instead of throwing if not found, to handle gracefully
      return null;
    }
    console.error("Failed to fetch active academic year:", error);
    return null;
  }
}
