"use server";
import axios from "axios";
import { api } from "@/lib/api";

import { Contact, Parent } from "@/types/types";
import { ParentProps } from "@/components/dashboard/forms/users/parent-form";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

//const BASE_API_URL = process.env.API_URL || "";

export async function createParent(data: ParentProps) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    const user = userCookie ? JSON.parse(userCookie.value) : null;
    const schoolId = user?.schoolId;
    const schoolName = user?.schoolName;

    if (schoolId) {
      (data as any).schoolId = schoolId;
      (data as any).schoolName = schoolName;
    }

    //send the data to the api
    const response = await api.post("/parents", data);
    revalidatePath("/dashboard/users/parents");
    return response.data;
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

export async function deleteParent(id: string) {
  console.log("deleted", id);
  return {
    ok: true
  };
}

export async function getAllParents() {
  try {
    //send the data to the api
    const response = await api.get("/parents");
    const parents = response.data;
    return parents as Parent[];
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
