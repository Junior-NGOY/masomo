"use server";
import axios from "axios";
import { api } from "./schools";
import {
  Class,
  ClassCreateProps,
  Stream,
  StreamCreateProps
} from "@/types/types";

//const BASE_API_URL = process.env.API_URL || "";

export async function createClass(data: ClassCreateProps) {
  try {
    //send the data to the api
    const response = await api.post("/classes", data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message = error.response?.data?.message || "Failed to create class";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function deleteClass(id: string) {
  console.log("deleted", id);
  return {
    ok: true
  };
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
    console.log(error);
  }
}
