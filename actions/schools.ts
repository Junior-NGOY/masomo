"use server";
import { api } from "@/lib/api";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { School } from "@/types/types";
import { Slash } from "lucide-react";

export type SchoolProps = {
  name: string;
  logo: string;
};

export async function createSchool(data: SchoolProps) {
  //const endpoint = `${BASE_API_URL}/schools`;
  try {
    //send the data to the api
    const response = await api.post("/schools", data);
    revalidatePath("/dashboard/admin/schools");
    return response.data.data as School;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create school";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function getSchoolById(id: string | null | undefined) {
  if (id) {
    try {
      //send the data to the api
      const response = await api.get(`/schools/${id}`);
      const school = response.data.data;
      return school as School;
    } catch (error: any) {
      console.error("Error fetching school:", error);
      return null;
    }
  } else {
    return null;
  }
}
export async function getAllSchools() {
  try {
    const response = await api.get("/schools");
    const schools = response.data;
    return schools as School[];
  } catch (error: any) {
    console.log(error);
    return [];
  }
}
