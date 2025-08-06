"use client";
import { cn } from "@/lib/utils";
import useSchoolStore from "@/store/school";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({
  variant = "light",
  size = "md",
  logoSrc,
  logoAlt
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  logoSrc?: string;
  logoAlt?: string;
}) {
  const { school } = useSchoolStore();
  
  // Priorité : logoSrc prop > school logo > logo par défaut
  const finalLogoSrc = logoSrc || school?.logo || "/images/logo.png";
  const finalLogoAlt = logoAlt || school?.name || "MasomoPro";
  
  if (variant === "light") {
    return (
      <Link href={"/"} className="flex items-center space-x-2">
        <div className="bg-blue-500 rounded-full p-1 md:hidden">
          <span className="text-white font-bold text-xl">
            <GraduationCap
              className={cn("w-6 h-6", size === "lg" && "w-10 h-10")}
            />
          </span>
        </div>
        <Image
          src={finalLogoSrc}
          width={500}
          height={150}
          alt={finalLogoAlt}
          className="w-44"
        />
      </Link>
    );
  } else {
    return (
      <Link href={"/"} className="flex items-center space-x-2">
        <div className="bg-white rounded-full p-1 md:hidden">
          <span className="text-blue-800 font-bold text-xl">
            <GraduationCap
            //className={cn("w-6 h-6", size === "lg" && "w-10 h-10")}
            />
          </span>
        </div>
        <Image
          src={finalLogoSrc}
          width={500}
          height={150}
          alt={finalLogoAlt}
          className="w-44"
        />
      </Link>
    );
  }
}
