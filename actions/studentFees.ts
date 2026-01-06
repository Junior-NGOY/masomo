"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getStudentFees(params?: {
  schoolId?: string;
  studentId?: string;
  academicYearId?: string;
}) {
  try {
    if (!BASE_URL) {
      console.error("BASE_URL is not defined. Check your .env file.");
      throw new Error("API URL configuration is missing");
    }

    const queryParams = new URLSearchParams();
    if (params?.schoolId) queryParams.append("schoolId", params.schoolId);
    if (params?.studentId) queryParams.append("studentId", params.studentId);
    if (params?.academicYearId) queryParams.append("academicYearId", params.academicYearId);

    const url = `${BASE_URL}/api/v1/student-fees${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    console.log("Fetching student fees from:", url);
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      cache: "no-store",
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("API error response:", errorData);
      throw new Error(errorData.error || "Failed to fetch student fees");
    }

    const result = await response.json();
    console.log("Student fees fetched successfully:", result.data?.length || 0, "records");
    return result.data;
  } catch (error: any) {
    console.error("Error in getStudentFees:", error);
    throw new Error(error.message || "Failed to fetch student fees");
  }
}

export async function getStudentFeeById(id: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(`${BASE_URL}/api/v1/student-fees/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch student fee");
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error("Error in getStudentFeeById:", error);
    throw new Error(error.message || "Failed to fetch student fee");
  }
}

export async function createStudentFee(data: {
  studentId: string;
  feeId: string;
  academicYearId: string;
  totalAmount: number;
}) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(`${BASE_URL}/api/v1/student-fees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create student fee");
    }

    const result = await response.json();
    revalidatePath("/dashboard/students/fees");
    return result.data;
  } catch (error: any) {
    console.error("Error in createStudentFee:", error);
    throw new Error(error.message || "Failed to create student fee");
  }
}

export async function updateStudentFee(id: string, data: { paidAmount?: number; totalAmount?: number; status?: string; notes?: string; dueDate?: string }) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/student-fees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update student fee");
    }

    const result = await response.json();
    revalidatePath("/dashboard/students/fees");
    return result.data;
  } catch (error: any) {
    console.error("Error in updateStudentFee:", error);
    throw new Error(error.message || "Failed to update student fee");
  }
}

export async function deleteStudentFee(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/student-fees/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete student fee");
    }

    const result = await response.json();
    revalidatePath("/dashboard/students/fees");
    return result.data;
  } catch (error: any) {
    console.error("Error in deleteStudentFee:", error);
    throw new Error(error.message || "Failed to delete student fee");
  }
}

export async function createPayment(paymentData: {
  studentFeeStructureId: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  notes?: string;
}) {
  try {
    if (!BASE_URL) {
      throw new Error("API URL configuration is missing");
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // Mapper les méthodes de paiement frontend vers le backend
    const methodMap: Record<string, string> = {
      mobile_money: "MOBILE_MONEY",
      cash: "CASH",
      bank_transfer: "BANK_TRANSFER",
      orange_money: "ORANGE_MONEY",
      airtel_money: "AIRTEL_MONEY",
      credit_card: "CREDIT_CARD",
      cheque: "CHEQUE",
      other: "OTHER"
    };

    const mappedMethod = methodMap[paymentData.paymentMethod.toLowerCase()] || "CASH";

    // Récupérer les détails de la structure de frais pour obtenir feeId et academicYearId
    const feeStructureResponse = await fetch(
      `${BASE_URL}/api/v1/student-fees/${paymentData.studentFeeStructureId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        cache: "no-store",
      }
    );

    if (!feeStructureResponse.ok) {
      throw new Error("Failed to fetch fee structure details");
    }

    const feeStructureData = await feeStructureResponse.json();
    const { feeId, academicYearId } = feeStructureData.data;

    const response = await fetch(`${BASE_URL}/api/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        studentId: paymentData.studentId,
        feeId,
        academicYearId,
        amount: paymentData.amount,
        paymentDate: new Date().toISOString(),
        method: mappedMethod,
        reference: paymentData.transactionReference || "",
        notes: paymentData.notes || "",
        studentFeeStructureId: paymentData.studentFeeStructureId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create payment");
    }

    const result = await response.json();
    revalidatePath("/dashboard/students/fees");
    return result.data;
  } catch (error: any) {
    console.error("Error in createPayment:", error);
    throw new Error(error.message || "Failed to create payment");
  }
}
