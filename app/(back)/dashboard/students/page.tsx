import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Students() {
  return (
    <div>
      Students
      <Button asChild>
        <Link href={"/dashboard/students/new"}>New Student </Link>
      </Button>
      ;
    </div>
  );
}
