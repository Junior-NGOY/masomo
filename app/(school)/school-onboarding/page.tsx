import SchoolOnboardingForm from "@/components/dashboard/forms/school/school-onboarding-form";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function page() {
  return (
    <div className="max-w-3xl mx-auto py-16">
      <Card className="border-t-4 border-blue-600 shadow">
        <CardContent className="p-6">
          <SchoolOnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
