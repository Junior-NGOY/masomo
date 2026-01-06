"use server";

import { api } from "@/lib/api";
import { FeeCreateProps, Fee } from "@/types/types";
import { revalidatePath } from "next/cache";
import axios from "axios";

export async function createFee(data: FeeCreateProps) {
  try {
    const response = await api.post("/fees", data);
    revalidatePath("/dashboard/finance/fees");
    revalidatePath("/dashboard/students/fees");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to create fee";
      throw new Error(message);
    }
    throw error;
  }
}

export async function getFees(params?: {
  schoolId?: string;
  academicYearId?: string;
  classLevel?: string;
}) {
  try {
    const response = await api.get("/fees", { params });
    return response.data.data as Fee[];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to fetch fees";
      throw new Error(message);
    }
    throw error;
  }
}

export async function deleteFee(id: string) {
  try {
    const response = await api.delete(`/fees/${id}`);
    revalidatePath("/dashboard/finance/fees");
    revalidatePath("/dashboard/students/fees");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to delete fee";
      throw new Error(message);
    }
    throw error;
  }
}

export async function updateFee(id: string, data: Partial<FeeCreateProps>) {
  try {
    const response = await api.put(`/fees/${id}`, data);
    revalidatePath("/dashboard/finance/fees");
    revalidatePath("/dashboard/students/fees");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to update fee";
      throw new Error(message);
    }
    throw error;
  }
}
