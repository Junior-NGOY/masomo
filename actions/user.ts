"use server";
import axios from "axios";
import { api } from "@/lib/api";

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

export async function getUsers(schoolId?: string) {
  try {
    const params = schoolId ? { schoolId } : {};
    const response = await api.get("/users/", { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, roleId: string) {
  try {
    const response = await api.put(`/users/${userId}`, { roleId });
    revalidatePath("/dashboard/security/access");
    return response.data.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  try {
    const response = await api.put(`/users/${userId}`, { isActive });
    revalidatePath("/dashboard/security/access");
    return response.data.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}
