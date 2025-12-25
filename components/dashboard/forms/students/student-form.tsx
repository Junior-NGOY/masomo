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
import { createStudent, updateStudent } from "@/actions/students";
import toast from "react-hot-toast";
import RadioInput from "@/components/FormInputs/RadioInput";
import useSchoolStore from "@/store/school";
import { generateRollNumber } from "@/lib/generateRoll";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Shuffle } from "lucide-react";

const studentSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est obligatoire" }),
  lastName: z.string().min(1, { message: "Le nom est obligatoire" }),
  email: z.string().email({ message: "L'adresse email est invalide" }).optional().or(z.literal("")).or(z.literal(null)),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }).optional().or(z.literal("")),
  parentId: z.string().min(1, { message: "Le parent est obligatoire" }),
  classId: z.string().min(1, { message: "La classe est obligatoire" }),
  streamId: z.string().min(1, { message: "L'option est obligatoire" }),
  gender: z.string().min(1, { message: "Le genre est obligatoire" }),
  admissionDate: z.string().min(1, { message: "La date d'admission est obligatoire" }),
  dob: z.string().min(1, { message: "La date de naissance est obligatoire" }),
  name: z.string().min(1, { message: "Le nom complet est obligatoire" }),
  phone: z.string().min(1, { message: "Le numéro de téléphone est obligatoire" }),
  nationality: z.string().nullable().optional(),
  religion: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  BCN: z.string().nullable().optional(),
  studentType: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

type StudentFormProps = z.infer<typeof studentSchema>;

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
  schoolId: string;
  schoolName: string;
  // Ajout pour cohérence avec le backend
  userId?: string;
};

// Static data moved outside component to be stable
const genders = [
  { label: "Female", value: "FEMALE" },
  { label: "Male", value: "MALE" }
];

const studentTypes = [
  { label: "Private Student", id: "PS" },
  { label: "Sponsored Student", id: "SS" }
];

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

const nationalities = [
  { label: "CD", value: "RDC" },
  { label: "COD", value: "DRC" }
];

const religions = [
  { label: "Christianity", value: "Christianity" },
  { label: "Islam", value: "Islam" },
  { label: "Judaism", value: "Judaism" },
  { label: "Hinduism", value: "Hinduism" },
  { label: "Buddhism", value: "Buddhism" },
  { label: "Other", value: "Other" },
];

export default function SingleStudentForm({
  parents,
  classes,
  nextSeq,
  editingId,
  initialData
}: SingleStudentFormProps) {
  //parents
  const parentOptions = React.useMemo(() => parents.map((parent) => {
    return {
      label: `${parent.firstname} ${parent.lastname}`,
      value: parent.id
    };
  }), [parents]);

  const [selectedParent, setSelectedParent] = useState<any>(null);
  //classes
  const classOptions = React.useMemo(() => classes.map((item) => {
    return {
      label: item.title,
      value: item.id
    };
  }), [classes]);

  const [selectedClass, setSelectedClass] = useState<any>(null);
  const classId = selectedClass?.value ?? "";
  const streams = React.useMemo(() => classes.find((item) => item.id === classId)?.streams || [], [classes, classId]);
  //sections / streams
  const streamsOptions = React.useMemo(() => streams.map((item) => {
    return { label: item.title, value: item.id };
  }), [streams]);

  const [selectedStream, setSelectedStream] = useState<any>(null);  
  const [selectedGender, setSelectedGender] = useState<any>(null);
  
  const initialCountryCode = "CD";
  const initialCountry = countries.find(
    (item) => item.code === initialCountryCode
  );
  
  const [selectedNationality, setSelectedNationality] = useState<any>(
    nationalities[0]
  );
  
  const [selectedReligion, setSelectedReligion] = useState<any>(null);
  
  // Update state when initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.parentId) {
        const parent = parentOptions.find(p => p.value === initialData.parentId);
        if (parent) setSelectedParent(parent);
      }
      if (initialData.classId) {
        const cls = classOptions.find(c => c.value === initialData.classId);
        if (cls) setSelectedClass(cls);
      }
      // Stream depends on class, so we might need to find it in the new streams list derived from class
      // However, streams logic above derives from selectedClass which we just set. 
      // Ideally we need to find the stream from the specific class's streams.
      if (initialData.classId && initialData.streamId) {
         const cls = classes.find(c => c.id === initialData.classId);
         const stream = cls?.streams.find(s => s.id === initialData.streamId);
         if (stream) setSelectedStream({ label: stream.title, value: stream.id });
      }
      if (initialData.gender) {
        const gender = genders.find(g => g.value === initialData.gender);
        if (gender) setSelectedGender(gender);
      }
      if (initialData.nationality) {
         const nat = countries.find(n => n.value === initialData.nationality);
         if (nat) setSelectedNationality(nat);
      }
      if (initialData.religion) {
        const rel = religions.find(r => r.value === initialData.religion);
        if (rel) setSelectedReligion(rel);
      }
      if (initialData.studentType) {
         // student type handled by radio default value via RHF usually, 
         // but if managing state manually need to check. 
         // RadioInput uses register so RHF handles it.
      }
    }
  }, [initialData, classes, parentOptions, classOptions]);



  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<StudentFormProps>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData ? {
      ...initialData,
      dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
      admissionDate: initialData.admissionDate ? new Date(initialData.admissionDate).toISOString().split("T")[0] : "",
      state: initialData.state ?? "",
      religion: initialData.religion ?? "",
      nationality: initialData.nationality ?? "",
      BCN: initialData.BCN ?? "",
      address: initialData.address ?? "",
      email: initialData.email ?? "",
      phone: initialData.phone ?? "",
      // password is required on create but optional on update usually. 
      // If we keep the schema as is, we must provide a password or handle it.
      // For now let's leave it, if it errors we'll see.
    } : {
      name: "",
      studentType: "PS"
    }
  });

  // Force reset with sanitized data when initialData is available
  useEffect(() => {
    if (initialData) {
       const sanitizedData = {
          ...initialData,
          religion: initialData.religion ?? "",
          state: initialData.state ?? "",
          nationality: initialData.nationality ?? "",
          BCN: initialData.BCN ?? "",
          address: initialData.address ?? "",
          email: initialData.email ?? "",
          phone: initialData.phone ?? "",
          dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
          admissionDate: initialData.admissionDate ? new Date(initialData.admissionDate).toISOString().split("T")[0] : "",
       };
       reset(sanitizedData);
    }
  }, [initialData, reset]);

  // Sync states with RHF
  useEffect(() => {
    if (selectedParent) setValue("parentId", selectedParent.value, { shouldValidate: true });
  }, [selectedParent, setValue]);

  useEffect(() => {
    if (selectedClass) setValue("classId", selectedClass.value, { shouldValidate: true });
  }, [selectedClass, setValue]);

  useEffect(() => {
    if (selectedStream) setValue("streamId", selectedStream.value, { shouldValidate: true });
  }, [selectedStream, setValue]);

  useEffect(() => {
    if (selectedGender) setValue("gender", selectedGender.value, { shouldValidate: true });
  }, [selectedGender, setValue]);
  
  // Register hidden fields
  useEffect(() => {
     register("parentId");
     register("classId");
     register("streamId");
     register("gender");
  }, [register]);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.imageUrl || "/images/student.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const { school } = useSchoolStore();

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setValue("password", retVal);
    toast.success("Mot de passe généré !");
  };

  async function saveStudent(data: any) {
    try {
      setLoading(true);
      data.schoolId = school?.id ?? "";
      data.schoolName = school?.name ?? "";
      data.imageUrl = imageUrl;
      data.parentId = selectedParent.value;
      data.parentName = selectedParent.label;
      data.classTitle = selectedClass.label;
      data.classId = selectedClass.value;
      data.streamId = selectedStream.value;
      data.streamTitle = selectedStream.label;
      data.gender = selectedGender.value;
      data.gender = selectedGender.value;
      data.nationality = selectedNationality.value;
      data.religion = selectedReligion?.value;
      console.log(data);
      if (editingId) {
        // If password is empty string, remove it so we don't update it
        if (!data.password || data.password.trim() === "") {
          delete data.password;
        }
        await updateStudent(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
        //reset
        reset();
        //route
        router.push("/dashboard/students");
        setImageUrl("/placeholder.svg");
      } else {
        // Validation for creation
        if (!data.password || data.password.trim() === "") {
          setLoading(false);
          toast.error("Le mot de passe est obligatoire pour la création");
          return;
        }
        const rollNo = generateRollNumber();
        const studentType = data.studentType as "PS" | "SS";
        //const regNo = generateRegistrationNumber("BU", studentType, nextSeq);
        //data.regNo = regNo;
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
      toast.error("Something went wrong");
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
    <form className="" onSubmit={handleSubmit(saveStudent, (errors) => console.log(errors))}>
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
                label="Last Name"
                name="name"
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
                errors={errors}
                name="parentId"
              />
              <FormSelectInput
                label="Classes"
                options={classOptions}
                option={selectedClass}
                setOption={setSelectedClass}
                toolTipText="Add New Class"
                href="/dashboard/academics/classes"
                errors={errors}
                name="classId"
              />
              <FormSelectInput
                label=" Stream/Section"
                options={streamsOptions}
                option={selectedStream}
                setOption={setSelectedStream}
                toolTipText="Add New Stream"
                href="/dashboard/academics/classes"
                errors={errors}
                name="streamId"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormSelectInput
                label="Gender"
                options={genders}
                option={selectedGender}
                setOption={setSelectedGender}
                isSearchable={false}
                errors={errors}
                name="gender"
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
                label="Email"
                name="email"
                type="email"
              />
            
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="Phone"
                name="phone"
              />
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <PasswordInput
                    register={register}
                    errors={errors}
                    label="Password"
                    name="password"
                    type="password"
                    disableValidation={true}
                  />
                </div>
                <button
                  onClick={generatePassword}
                  type="button"
                  className="mb-1 p-2.5 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors"
                  title="Générer un mot de passe"
                >
                  <Shuffle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
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
                options={religions}
                option={selectedReligion}
                setOption={setSelectedReligion}
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
