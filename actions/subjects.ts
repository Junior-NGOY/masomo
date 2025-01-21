"use server";
import axios from "axios";
import { api } from "./schools";
import {
  Class,
  ClassCreateProps,
  Department,
  DepartmentBrief,
  DepartmentCreateProps,
  Stream,
  StreamCreateProps,
  Subject,
  SubjectBrief,
  SubjectCreateProps
} from "@/types/types";
import { revalidatePath } from "next/cache";

//const BASE_API_URL = process.env.API_URL || "";

export async function createSubject(data: SubjectCreateProps) {
  try {
    //send the data to the api
    const response = await api.post("/subjects", data);
    revalidatePath("/dashboard/academics/subjects");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create subject";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function deleteSubject(id: string) {
  console.log("deleted", id);
  return {
    ok: true
  };
}

export async function getAllSubjects() {
  try {
    //send the data to the api
    const response = await api.get("/subjects");
    const subjects = response.data;
    return subjects as Subject[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message = error.response?.data?.message || "Failed to get subjects";
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

export async function getBriefSubject() {
  try {
    //send the data to the api
    const response = await api.get("/subjects/brief");
    const subjects = response.data;
    return subjects as SubjectBrief[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to get subjects brief";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}
