"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ImageInput from "@/components/FormInputs/ImageInput";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { onboardSchool, OnboardingProps } from "@/actions/onboarding";

export default function SchoolOnboardingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OnboardingProps>({
    defaultValues: {
      schoolName: "",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      adminPassword: ""
    }
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = "/images/student.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function onSubmit(data: OnboardingProps) {
    try {
      setLoading(true);
      data.schoolLogo = imageUrl;
      
      await onboardSchool(data);
      
      setLoading(false);
      toast.success("School and Admin created successfully!");
      reset();
      setImageUrl(initialImage);
      
      // Redirect to login
      router.push("/login");
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.message || "Error creating school");
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Welcome to Masomo,
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-2">
          Complete your school's profile and admin details to get started.
        </p>
      </div>
      <div className="grid grid-cols-12 gap-6 py-6">
        <div className="lg:col-span-12 col-span-full space-y-3">
          <div className="grid gap-6">
            
            {/* School Details */}
            <h3 className="text-lg font-medium">School Details</h3>
            <div className="grid gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="School Name"
                name="schoolName"
              />
            </div>
            <div className="grid gap-3">
              <div className="grid">
                <ImageInput
                  title="Customize your School Logo (500px X 150px)"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="schoolLogo"
                  className="object-contain"
                  size="sm"
                />
              </div>
            </div>

            {/* Admin Details */}
            <h3 className="text-lg font-medium border-t pt-4">Admin Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                register={register}
                errors={errors}
                label="Admin Name"
                name="adminName"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Admin Phone"
                name="adminPhone"
              />
            </div>
            <TextInput
              register={register}
              errors={errors}
              label="Admin Email"
              name="adminEmail"
              type="email"
            />
            <TextInput
              register={register}
              errors={errors}
              label="Admin Password"
              name="adminPassword"
              type="password"
            />

          </div>
        </div>
      </div>
      <SubmitButton
        buttonIcon={Send}
        loadingTitle="Creating please wait..."
        loading={loading}
        title="Register School & Admin"
      />
    </form>
  );
}
