"use server";
import axios from "axios";
import { api } from "@/lib/api";

import { StudentProps } from "@/components/dashboard/forms/students/student-form";
import { Student } from "@/types/types";
import { revalidatePath } from "next/cache";

//const BASE_API_URL = process.env.API_URL || "";

export async function createStudent(data: StudentProps) {
  try {
    //send the data to the api
    const response = await api.post("/students", data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create student";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function deleteStudent(id: string) {
  try {
    await api.delete(`/students/${id}`);
    revalidatePath("/dashboard/students");
    return {
      ok: true
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: "Failed to delete student"
    };
  }
}

export async function updateStudent(id: string, data: StudentProps) {
  try {
    const response = await api.put(`/students/${id}`, data);
    revalidatePath("/dashboard/students");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      const message =
        error.response?.data?.message || "Failed to update student";
      throw new Error(message);
    }
    throw error;
  }
}

export async function getStudentById(id: string) {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      const message =
        error.response?.data?.message || "Failed to get student";
      throw new Error(message);
    }
    throw error;
  }
}

export async function getStudentNextSequence() {
  try {
    //send the data to the api
    const response = await api.get("/students/seq");
    revalidatePath("/dashboard/students");
    const nextSeq = response.data;
    return nextSeq as number;
  } catch (error: any) {
    /* if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create parent";
      throw new Error(message);
    }
    throw error; */
    console.log(error);
  }
}
export async function getAllStudents() {
  try {
    //send the data to the api
    const response = await api.get("/students");
    const students = response.data;
    return students as Student[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create parent";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}
