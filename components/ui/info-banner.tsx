"use client";

import { useState } from "react";
import { X, Info, CheckCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "px-4 py-2 relative border shadow-md rounded-md max-w-3xl",
  {
    variants: {
      type: {
        info: "bg-blue-50 text-blue-900 border-blue-200",
        success: "bg-green-50 text-green-900 border-green-200",
        warning: "bg-orange-50 text-orange-900 border-orange-200",
        danger: "bg-red-50 text-red-900 border-red-200"
      }
    },
    defaultVariants: {
      type: "info"
    }
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  message: string;
}

export function InfoBanner({ message, type }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(bannerVariants({ type }), "my-4 mx-auto max-w-7xl")}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {type === "info" && <Info className="h-5 w-5 mr-2 flex-shrink-0" />}
          {type === "warning" && (
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          {type === "success" && (
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
