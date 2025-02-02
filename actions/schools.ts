"use server";
import axios from "axios";
import { SchoolProps } from "@/components/dashboard/forms/school/school-onboarding-form";
import { revalidatePath } from "next/cache";
import { School } from "@/types/types";

const BASE_API_URL = process.env.API_URL || "";
export const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" }
});
export async function createSchool(data: SchoolProps) {
  //const endpoint = `${BASE_API_URL}/schools`;
  try {
    //send the data to the api
    const response = await api.post("/schools", data);
    revalidatePath("/dashboard/admin/schools");
    return response.data as School;
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
