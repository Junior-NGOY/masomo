"use server";
import axios from "axios";
import { api } from "./schools";

import { StudentProps } from "@/components/dashboard/forms/students/student-form";
import { Student } from "@/types/types";

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
  console.log("deleted", id);
  return {
    ok: true
  };
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
