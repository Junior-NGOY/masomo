"use server";
import axios from "axios";
import { api } from "@/lib/api";
import { ContactProps } from "@/components/frontend/contact-us";
import { Contact } from "@/types/types";
import { revalidatePath } from "next/cache";

//const BASE_API_URL = process.env.API_URL || "";

export async function createContact(data: ContactProps) {
  try {
    //send the data to the api
    const response = await api.post("/contacts", data);
    revalidatePath("/dashboard/admin/contacts");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create contact";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}

export async function deleteContact(id: string) {
  console.log("deleted", id);
  return {
    ok: true
  };
}

export async function getAllContacts() {
  try {
    //send the data to the api
    const response = await api.get("/contacts");
    const contacts = response.data;
    return contacts as Contact[];
  } catch (error: any) {
    if (axios.isAxiosError(Error)) {
      //type-safe error
      const message =
        error.response?.data?.message || "Failed to create contact";
      throw new Error(message);
    }
    throw error;
    console.log(error);
  }
}
