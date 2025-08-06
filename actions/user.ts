"use server";
import axios from "axios";
import { api } from "./schools";

import { revalidatePath } from "next/cache";
import { UserCreateProps } from "@/types/types";

export async function createUser(data: UserCreateProps) {
  try {
    //send the data to the api
    const response = await api.post("/register", data);
    // revalidatePath("/dashboard/users/teachers");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message = error.response?.data?.message || "Failed to create user";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}
