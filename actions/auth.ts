"use server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { api } from "./schools";
import { cookies } from "next/headers";
import { User } from "@/types/types";

export async function loginUser(data: { email: string; password: string }) {
  try {
    console.log(data);
    const response = await api.post("/login", data);

    //Save the data in Zustand
    //Route to the user according to the role
    const { user, accessToken, refreshToken } = response.data.data;
    //console.log("Actions Server", user, accessToken, refreshToken);
    const userData = response.data.data;
    await createServerSession(userData);
    return response.data.data as SessionData;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create parent";
      throw new Error(message);
    }
    //throw error;
    console.log(error);
  }
}

//session data schema
export interface SessionData {
  user: User;
  accessToken: string;
  refreshToken: string;
}
/* interface UserData {
  createdAt: string;
  email: string;
  id: string;
  image: string | null;
  name: string;
  phone: string | null;
  role: string;
  schoolId: string | null;
  schoolName: string | null;
  updatedAt: string;
} */
//server action to create user session
export async function createServerSession(data: SessionData) {
  //const { user, accessToken, refreshToken } = data;
  try {
    const cookieStore = await cookies();
    //set cookies with appropriate expiration

    // Set user data in cookie
    cookieStore.set("user", JSON.stringify(data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 60 minutes (same as access token)
      path: "/"
    });
    // Set access token cookie (expires in 60 minutes)
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 60 minutes
      path: "/"
    });
    // Set refresh token cookie (expires in 30 days)
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Session creation error :", error);
    return { success: false, error: "Invalid session data" };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    //Delete all authentification-related cookies
    cookieStore.delete("user");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return { success: true };
  } catch (error) {
    console.log("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

//helper function get current user from cookies (server-side)
export async function getServerUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (!userCookie) return null;
  try {
    const user = JSON.parse(userCookie.value);
    return user as User;
  } catch (error) {
    return null;
  }
}
