"use client";

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
import { Class, Parent } from "@/types/types";
import { createStudent } from "@/actions/students";
import toast from "react-hot-toast";
import RadioInput from "@/components/FormInputs/RadioInput";
import { generateRegistrationNumber } from "@/lib/generateRegNo";
import { generateRollNumber } from "@/lib/generateRoll";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type SingleStudentFormProps = {
  editingId?: string | undefined;
  initialData?: any | undefined | null;
  classes: Class[];
  parents: Parent[];
  nextSeq: number;
};
export type StudentProps = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId: string;
  studentType: string;
  parentName?: string;
  classTitle?: string;
  classId: string;
  streamTitle?: string;
  streamId: string;
  password: string;
  imageUrl: string;
  phone: string;
  state: string;
  BCN: string; // Birth Certificate Number
  nationality: string;
  religion: string;
  gender: string;
  dob: string;
  rollNo: string;
  regNo: string;
  admissionDate: string;
  address: string;
};
export default function SingleStudentForm({
  parents,
  classes,
  nextSeq,
  editingId,
  initialData
}: SingleStudentFormProps) {
  //parents
  const parentOptions = parents.map((parent) => {
    return {
      label: `${parent.firstname} ${parent.lastname}`,
      value: parent.id
    };
  });
  const [selectedParent, setSelectedParent] = useState<any>(null);
  //classes
  const classOptions = classes.map((item) => {
    return {
      label: item.title,
      value: item.id
    };
  });
  const [selectedClass, setSelectedClass] = useState<any>(classOptions[0]);
  const classId = selectedClass?.value ?? "";
  const streams = classes.find((item) => item.id === classId)?.streams || [];
  //sections / streams
  const streamsOptions = streams.map((item) => {
    return { label: item.title, value: item.id };
  });
  const [selectedStream, setSelectedStream] = useState<any>(streams[0]);
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
  //Student types
  const studentTypes = [
    {
      label: "Private Student",
      id: "PS"
    },
    {
      label: "Sponsored Student",
      id: "SS"
    }
  ];
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
  const [selectedNationality, setSelectedNationality] = useState<any>(
    nationalities[0]
  );

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
      data.parentId = selectedParent.value;
      data.parentName = selectedParent.label;
      data.classTitle = selectedClass.label;
      data.classId = selectedClass.value;
      data.streamId = selectedStream.value;
      data.streamTitle = selectedStream.label;
      data.gender = selectedGender.value;
      data.nationality = selectedNationality.value;
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
        const rollNo = generateRollNumber();
        const studentType = data.studentType as "PS" | "SS";
        const regNo = generateRegistrationNumber("BU", studentType, nextSeq);
        data.regNo = regNo;
        data.rollNo = rollNo;
        const res = await createStudent(data);
        setLoading(false);
        // Toast
        toast.success("Successfully Created!");
        //reset
        reset();
        //setImageUrl("/placeholder.svg");
        //route
        router.push("/dashboard/students");
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
                label="First Name"
                name="firstName"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Student Name"
                name="lastName"
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
                options={parentOptions}
                option={selectedParent}
                setOption={setSelectedParent}
                toolTipText="Add New Parent"
                href="/dashboard/users/parents/new"
              />
              <FormSelectInput
                label="Classes"
                options={classOptions}
                option={selectedClass}
                setOption={setSelectedClass}
                toolTipText="Add New Class"
                href="/dashboard/academics/classes"
              />
              <FormSelectInput
                label=" Stream/Section"
                options={streamsOptions}
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
                label="Date of admission"
                name="admissionDate"
                type="date"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Student Name"
                name="name"
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
                type="password"
              />
              <FormSelectInput
                label="Nationality"
                options={countries}
                option={selectedNationality}
                setOption={setSelectedNationality}
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/*    <TextInput
                register={register}
                errors={errors}
                label="Roll N°"
                name="rollNo"
              /> */}
              <TextInput
                register={register}
                errors={errors}
                label="Date of Birth"
                name="dob"
                type="date"
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
                <RadioInput
                  radioOptions={studentTypes}
                  register={register}
                  label="Student type"
                  name="studentType"
                  errors={errors}
                  //defaulValue="PS"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Birth Certificate N°"
                  name="BCN"
                />
                <div className="grid gap-3">
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Addresse"
                    name="address"
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
