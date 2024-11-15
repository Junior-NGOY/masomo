import SiteFooter from "@/components/frontend/site-footer";
import SiteHeader from "@/components/site-header";
import React from "react";

export default function FontLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
