"use server";
import axios from "axios";
import { api } from "@/lib/api";

export type OnboardingProps = {
  schoolName: string;
  schoolLogo: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminPhone: string;
};

export async function onboardSchool(data: OnboardingProps) {
  try {
    const response = await api.post("/onboarding", data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Failed to onboard school";
      throw new Error(message);
    }
    throw error;
  }
}
