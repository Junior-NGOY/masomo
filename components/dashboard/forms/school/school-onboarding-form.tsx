"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import FormFooter from "../FormFooter";
import ImageInput from "@/components/FormInputs/ImageInput";

import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { Send } from "lucide-react";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ParentFormProps = {
  editingId?: string | undefined;
  initialData?: any | undefined | null;
};
export type ParentProps = {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
};
export default function SchoolOnboardingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ParentProps>({
    defaultValues: {
      name: ""
    }
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = "/images/student.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveStudent(data: ParentProps) {
    try {
      setLoading(true);
      data.imageUrl = imageUrl;
      console.log(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(saveStudent)}>
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
                name="schoolname"
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
