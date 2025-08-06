import ModernFooter from "@/components/modern-footer";
import ModernHeader from "@/components/modern-header";
import React from "react";

export default function FontLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ModernHeader />
      {children}
      <ModernFooter />
    </div>
  );
}
