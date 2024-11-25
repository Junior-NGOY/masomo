import ContactUs from "@/components/frontend/contact-us";
import SectionHeader from "@/components/frontend/section-header";
import Logo from "@/components/logo";
import React from "react";

export default function page() {
  return (
    <div className="py-12">
      <div className="py-6 pb-8">
        <div className="flex items-center justify-center pb-4 ">
          <Logo size="lg" />
        </div>
        <SectionHeader
          title=""
          heading="Get your School Management System"
          description="Ready to transform your school's digital infrastructure ? fill out the form below and we'll help you"
        />
      </div>

      <ContactUs />
    </div>
  );
}
