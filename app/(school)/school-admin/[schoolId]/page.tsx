import NotFound from "@/app/not-found";
import React from "react";

export default async function page({
  params,
  searchParams
}: {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const schoolId = (await params).schoolId;
  const name = (await searchParams).name;
  if (!schoolId) {
    return NotFound({ statusCode: 404, title: "School not found" });
  }
  return (
    <div>
      schoolId: {schoolId}
      <p>school name : {name}</p>
    </div>
  );
}
