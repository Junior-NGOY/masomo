"use server";
import axios from "axios";
import { api } from "@/lib/api";
import {
  Class,
  ClassBrief,
  ClassCreateProps,
  Stream,
  StreamCreateProps
} from "@/types/types";
import { revalidatePath } from "next/cache";

//const BASE_API_URL = process.env.API_URL || "";

export async function createClass(data: ClassCreateProps) {
  try {
    //send the data to the api
    const response = await api.post("/classes", data);
    revalidatePath("/dashboard/academics/classes");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message = error.response?.data?.message || "Failed to create class";
      throw new Error(message);
    }
    throw error;
  }
}

export async function updateClassById(id: string, data: ClassCreateProps) {
  try {
    const response = await api.put(`/classes/${id}`, data);
    revalidatePath("/dashboard/academics/classes");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      const message = error.response?.data?.message || "Failed to update class";
      throw new Error(message);
    }
    throw error;
  }
}

export async function deleteClass(id: string) {
  try {
    const response = await api.delete(`/classes/${id}`);
    revalidatePath("/dashboard/academics/classes");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      const message = error.response?.data?.message || "Failed to delete class";
      throw new Error(message);
    }
    throw error;
  }
}

export async function getAllClasses() {
  try {
    //send the data to the api
    const response = await api.get("/classes");
    const classes = response.data;
    return classes as Class[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message = error.response?.data?.message || "Failed to get class";
      throw new Error(message);
    }
    throw error;
  }
}
export async function getBriefClasses() {
  try {
    //send the data to the api
    const response = await api.get("/classes/brief");
    const classes = response.data;
    return classes as ClassBrief[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message = error.response?.data?.message || "Failed to get class";
      throw new Error(message);
    }
    throw error;
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
  }
}

export async function updateStreamById(id: string, data: StreamCreateProps) {
  try {
    const response = await api.put(`/streams/${id}`, data);
    revalidatePath("/dashboard/academics/classes");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      const message =
        error.response?.data?.message || "Failed to update stream";
      throw new Error(message);
    }
    throw error;
  }
}

export async function deleteStream(id: string) {
  try {
    const response = await api.delete(`/streams/${id}`);
    revalidatePath("/dashboard/academics/classes");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      const message =
        error.response?.data?.message || "Failed to delete stream";
      throw new Error(message);
    }
    throw error;
  }
}

export async function getAllStreams() {
  try {
    //send the data to the api
    const response = await api.get("/streams");
    const streams = response.data;
    return streams as Stream[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create stream";
      throw new Error(message);
    }
    throw error;
  }
}
