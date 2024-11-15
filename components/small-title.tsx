import React from "react";
import { Badge } from "./ui/badge";

export default function SmallTitle({ title }: { title: string }) {
  return (
    <>
      <Badge
        variant="secondary"
        className="h-6 items-center rounded-full px-3 text-sm"
      >
        {title}
      </Badge>
    </>
  );
}
