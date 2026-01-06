"use server";
import axios from "axios";
import { api } from "@/lib/api";

import { Teacher, TeacherCreateProps } from "@/types/types";
import { revalidatePath } from "next/cache";

//const BASE_API_URL = process.env.API_URL || "";

export async function createTeacher(data: TeacherCreateProps) {
  try {
    //send the data to the api
    const response = await api.post("/teachers", data);
    revalidatePath("/dashboard/users/teachers");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create teacher";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function deleteTeacher(id: string) {
  console.log("deleted", id);
  return {
    ok: true
  };
}

export async function getAllTeachers() {
  try {
    //send the data to the api
    const response = await api.get("/teachers");
    const teachers = response.data;
    return teachers as Teacher[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create teacher";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}
