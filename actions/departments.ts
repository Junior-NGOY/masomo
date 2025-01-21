"use server";
import axios from "axios";
import { api } from "./schools";
import {
  Department,
  DepartmentBrief,
  DepartmentCreateProps,
  Stream,
  StreamCreateProps
} from "@/types/types";
import { revalidatePath } from "next/cache";

//const BASE_API_URL = process.env.API_URL || "";

export async function createDepartment(data: DepartmentCreateProps) {
  try {
    //send the data to the api
    const response = await api.post("/departments", data);
    revalidatePath("/dashboard/academics/departments");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create department";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function deleteDepartment(id: string) {
  console.log("deleted", id);
  return {
    ok: true
  };
}

export async function getAllDepartments() {
  try {
    //send the data to the api
    const response = await api.get("/departments");
    const departments = response.data;
    return departments as Department[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to get department";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}
export async function createStream(data: StreamCreateProps) {
  try {
    //send the data to the api
    const response = await api.post("/streams", data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create stream";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function deleteStream(id: string) {
  console.log("deleted", id);
  return {
    ok: true
  };
}

export async function getBriefDepartments() {
  try {
    //send the data to the api
    const response = await api.get("/departments/brief");
    const departments = response.data;
    return departments as DepartmentBrief[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message = error.response?.data?.message || "Failed to create brief";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}
