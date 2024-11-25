"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";
import ImageInput from "@/components/FormInputs/ImageInput";
import TextArea from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import PasswordInput from "@/components/FormInputs/PasswordInput";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type SingleStudentFormProps = {
  editingId?: string | undefined;
  initialData?: any | undefined | null;
};
export type StudentProps = {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
};
export default function SingleStudentForm({
  editingId,
  initialData
}: SingleStudentFormProps) {
  //parents
  const parents = [
    {
      label: "Junior ",
      value: "123456"
    },
    {
      label: "Junior ngoy ",
      value: "123455"
    }
  ];
  const [selectedParent, setSelectedParent] = useState<any>(null);
  //classes
  const classes = [
    {
      label: "Junior ",
      value: "123456"
    },
    {
      label: "Junior ngoy ",
      value: "123455"
    }
  ];
  const [selectedClass, setSelectedClass] = useState<any>(null);
  //sections / streams
  const streams = [
    {
      label: "S1A",
      value: "123456"
    },
    {
      label: "S1B",
      value: "123455"
    },
    {
      label: "S2A",
      value: "123455"
    },
    {
      label: "S2B",
      value: "123455"
    }
  ];
  const [selectedStream, setSelectedStream] = useState<any>(null);
  //Genders
  const genders = [
    {
      label: "Female",
      value: "Femal"
    },
    {
      label: "Male",
      value: "Male"
    }
  ];
  const [selectedGender, setSelectedGender] = useState<any>(null);

  //Nationality
  const countries = [
    { value: "fr", label: "France", code: "FR" },
    { value: "de", label: "Allemagne", code: "DE" },
    { value: "it", label: "Italie", code: "IT" },
    { value: "es", label: "Espagne", code: "ES" },
    { value: "uk", label: "Royaume-Uni", code: "GB" },
    { value: "us", label: "États-Unis", code: "US" },
    { value: "ca", label: "Canada", code: "CA" },
    { value: "jp", label: "Japon", code: "JP" },
    { value: "cn", label: "Chine", code: "CN" },
    { value: "au", label: "Australie", code: "AU" }
  ];
  const initialCountryCode = "CD";
  const initialCountry = countries.find(
    (item) => item.code === initialCountryCode
  );
  const nationalities = [
    {
      label: "CD",
      value: "RDC"
    },
    {
      label: "COD",
      value: "DRC"
    }
  ];
  const [selectedNationality, setSelectedNationality] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<StudentProps>({
    defaultValues: {
      name: ""
    }
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.imageUrl || "/images/student.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveStudent(data: StudentProps) {
    try {
      setLoading(true);
      data.imageUrl = imageUrl;
      console.log(data);
      if (editingId) {
        /*   await updateCategoryById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
        //reset
        reset();
        //route
        router.push("/dashboard/categories");
        setImageUrl("/placeholder.svg"); */
      } else {
        /* await createCategory(data);
        setLoading(false);
        // Toast
        toast.success("Successfully Created!");
        //reset
        reset();
        setImageUrl("/placeholder.svg");
        //route
        router.push("/dashboard/categories"); */
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  // async function handleDeleteAll() {
  // setLoading(true);
  // try {
  // await deleteManyCategories();
  // setLoading(false);
  // } catch (error) {
  // console.log(error);
  // }
  // }

  return (
    <form className="" onSubmit={handleSubmit(saveStudent)}>
      <FormHeader
        href="/students"
        parent=""
        title="Student"
        editingId={editingId}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-12 col-span-full space-y-3">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="First name"
                name="firstname"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Student name"
                name="name"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Email"
                name="email"
                type="email"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormSelectInput
                label="Parent"
                options={parents}
                option={selectedParent}
                setOption={setSelectedParent}
                toolTipText="Add New Parent"
                href="/dashboard/users/parents/new"
              />
              <FormSelectInput
                label="Classes"
                options={streams}
                option={selectedParent}
                setOption={setSelectedParent}
                toolTipText="Add New Class"
                href="/dashboard/academics/classes"
              />
              <FormSelectInput
                label=" Stream/Section"
                options={streams}
                option={selectedStream}
                setOption={setSelectedStream}
                toolTipText="Add New Stream"
                href="/dashboard/academics/classes"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormSelectInput
                label="Gender"
                options={genders}
                option={selectedGender}
                setOption={setSelectedGender}
                isSearchable={false}
              />
              <TextInput
                register={register}
                errors={errors}
                label="Date of Birth"
                name="dob"
                type="date"
              />
              <PasswordInput
                register={register}
                errors={errors}
                label="Password"
                name="password"
                type="password"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="Phone"
                name="phone"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Password"
                name="password"
              />
              <FormSelectInput
                label="Nationality"
                options={countries}
                option={selectedNationality}
                setOption={setSelectedNationality}
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="Roll N°"
                name="roll No"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Birth Certificate N°"
                name="certificate"
              />
              <FormSelectInput
                label="Religion"
                options={countries}
                option={selectedNationality}
                setOption={setSelectedNationality}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-3">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Roll N°"
                  name="roll No"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Birth Certificate N°"
                  name="certificate"
                />
                <div className="grid gap-3">
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Adresse"
                    name="adress"
                  />
                </div>
              </div>
              <div className="grid ">
                <ImageInput
                  title="Student Image"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="studentProfileImage"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormFooter
        href="/students"
        editingId={editingId}
        loading={loading}
        title="Student"
        parent=""
      />
    </form>
  );
}
