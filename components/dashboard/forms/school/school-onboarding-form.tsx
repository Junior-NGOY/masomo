"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ImageInput from "@/components/FormInputs/ImageInput";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { createSchool } from "@/actions/schools";

export type SchoolProps = {
  name: string;
  logo: string;
};
export default function SchoolOnboardingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SchoolProps>({
    defaultValues: {
      //name: ""
    }
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = "/images/student.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveSchool(data: SchoolProps) {
    try {
      setLoading(true);
      data.logo = imageUrl;
      console.log(data);
      const res = await createSchool(data);
      console.log(res);
      setLoading(false);
      // Toast
      toast.success("Successfully Created!");
      //reset
      reset();
      setImageUrl(initialImage);
      //route
      router.push(`/school-admin/${res.id}?name=${res.name}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(saveSchool)}>
      <div className="text-center">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Welcome to Masomo,
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-2">
          Complete your school's profile to get started with SchoolPro.
        </p>
      </div>
      <div className="grid grid-cols-12 gap-6 py-6">
        <div className="lg:col-span-12 col-span-full space-y-3">
          <div className="grid gap-6">
            <div className="grid     gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="School Name"
                name="name"
              />
            </div>
            <div className="grid   gap-3">
              <div className="grid ">
                <ImageInput
                  title="Customize your School Logo"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="schoolLogo"
                  className="object-contain"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubmitButton
        buttonIcon={Send}
        loadingTitle="Creating please wait..."
        loading={loading}
        title="Register School"
      />
    </form>
  );
}
