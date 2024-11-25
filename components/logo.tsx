import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo({
  variant = "light",
  size = "md"
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  if (variant === "light") {
    return (
      <Link href={"/"} className="flex items-center space-x-2">
        <div className="bg-blue-500 rounded-full p-1">
          <span className="text-white font-bold text-xl">
            <GraduationCap
              className={cn("w-6 h-6", size === "lg" && "w-10 h-10")}
            />
          </span>
        </div>
        <span className={cn(" font-bold text-xl", size === "lg" && "text-4xl")}>
          Masomo<span className="text-blue-500">Pro</span>
        </span>
      </Link>
    );
  } else {
  }
}
