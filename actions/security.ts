
"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  schoolId: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: { permission: Permission }[];
  _count: { users: number };
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  details: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export async function getRoles(schoolId: string) {
  try {
    const response = await api.get("/security/roles", { params: { schoolId } });
    return response.data.data as Role[];
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export async function getRole(id: string) {
  try {
    const response = await api.get(`/security/roles/${id}`);
    return response.data.data as Role;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

export async function createRole(data: { name: string; description: string; schoolId: string; permissionIds: string[] }) {
  try {
    const response = await api.post("/security/roles", data);
    revalidatePath("/dashboard/security/roles");
    return response.data.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
}

export async function updateRole(id: string, data: { name: string; description: string; permissionIds: string[] }) {
  try {
    const response = await api.put(`/security/roles/${id}`, data);
    revalidatePath("/dashboard/security/roles");
    return response.data.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
}

export async function deleteRole(id: string) {
  try {
    await api.delete(`/security/roles/${id}`);
    revalidatePath("/dashboard/security/roles");
    return true;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
}

export async function getPermissions() {
  try {
    const response = await api.get("/security/permissions");
    return response.data.data as Record<string, Permission[]>;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return {};
  }
}

export async function getLogs(schoolId: string) {
  try {
    const response = await api.get("/security/logs", { params: { schoolId } });
    return response.data.data as AuditLog[];
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
}
