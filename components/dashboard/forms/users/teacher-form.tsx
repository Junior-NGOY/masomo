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
import toast from "react-hot-toast";
import { createTeacher } from "@/actions/teacher";
import { Gender, TeacherCreateProps } from "@/types/types";
import FormMultipleSelectInput from "@/components/FormInputs/FormMultipleSelectInput";
import { generateRollNumber } from "@/lib/generateRoll";

/* export type SelectOptionProps = {
  label: string;
  value: string;
}; */
type TeacherFormProps = {
  editingId?: string | undefined;
  initialData?: any | undefined | null;
  classes: dataOption[];
  departments: dataOption[];
  subjects: dataOption[];
};

export type dataOption = { label: string; value: string };
export default function TeacherForm({
  editingId,
  initialData,
  classes,
  departments,
  subjects
}: TeacherFormProps) {
  //parents
  const title = [
    {
      label: "Mr.",
      value: "Mr."
    },
    {
      label: "Mrs.",
      value: "Mrs"
    }
  ];
  const [selectedTitle, setSelectedTitle] = useState<any>(null);

  //Genders
  const genders = [
    {
      label: "Female",
      value: "FEMALE"
    },
    {
      label: "Male",
      value: "MALE"
    }
  ];
  const [selectedGender, setSelectedGender] = useState<any>(genders[0]);

  //Contact Methodes
  const contactMethods = [
    { value: "Téléphone", label: "Téléphone" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Facebook", label: "Facebook" }
  ];
  const [selectedContactMethod, setSelectedContactMethod] = useState<any>(
    contactMethods[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState<any>(
    departments[0]
  );
  //Qualifications
  const qualifications = [
    { value: "Bachelors", label: "Bachelors" },
    { value: "Diploma", label: "Diploma" },
    { value: "Certificate", label: "Certificate" }
  ];
  const [selectedSubjects, setSelectedSubjects] = useState<any>([subjects[0]]);
  const [mainSubject, setMainSubject] = useState<any>(subjects[0]);
  const [qualification, setQualification] = useState<any>(qualifications[0]);
  const [selectedClasses, setSelectedClasses] = useState<any>([classes[0]]);

  const initialCountryCode = "CD";
  const nationalities = [
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
  const [selectedNationality, setSelectedNationality] = useState<any>(
    nationalities[0]
  );
  const initialCountry = nationalities.find(
    (item) => item.code === initialCountryCode
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TeacherCreateProps>({
    defaultValues: {
      firstName: ""
    }
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.imageUrl || "/images/student.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveTeacher(data: TeacherCreateProps) {
    try {
      setLoading(true);
      data.imageUrl = imageUrl;
      data.title = selectedTitle.value;
      data.nationality = selectedNationality.value;
      data.contactMethod = selectedContactMethod.value;
      data.departmentId = selectedDepartment.value;
      data.departmentName = selectedDepartment.label;
      data.qualification = qualification.label;
      data.mainSubject = mainSubject.label;
      data.mainSubjectId = mainSubject.value;
      data.subjects = subjects.map((item: any) => item.label);
      data.classIds = selectedClasses.map((item: any) => item.value);
      data.classes = selectedClasses.map((item: any) => item.label);
      data.employeeId = "EMP" + generateRollNumber();
      data.gender = selectedGender.value.toUpperCase();
      data.experience = Number(data.experience);
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
        const res = await createTeacher(data);
        setLoading(false);
        // Toast
        toast.success("Successfully Created!");
        //reset
        reset();
        //setImageUrl("/placeholder.svg");
        //route
        router.push("/dashboard/users/teachers");
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
    <form className="" onSubmit={handleSubmit(saveTeacher)}>
      <FormHeader
        href="/teachers"
        parent=""
        title="Teacher"
        editingId={editingId}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-12 col-span-full space-y-3">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormSelectInput
                label="Titre"
                options={title}
                option={selectedTitle}
                setOption={setSelectedTitle}
              />
              <TextInput
                register={register}
                errors={errors}
                label="Prénom"
                name="firstName"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Nom"
                name="lastName"
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
                label="Email"
                name="email"
                type="email"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Whatsapp n°"
                name="whatsappNo"
                //type="tel"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormSelectInput
                label="Nationalité"
                options={nationalities}
                option={selectedNationality}
                setOption={setSelectedNationality}
                isSearchable={false}
              />
              <TextInput
                register={register}
                errors={errors}
                label="Num carte nationale/passeport"
                name="NIN"
              />
              <FormSelectInput
                label="Sexe"
                options={genders}
                option={selectedGender}
                setOption={setSelectedGender}
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="Date de naissance"
                name="dateOfBirth"
                type="date"
              />
              <FormSelectInput
                label="methode de contact préférée"
                options={contactMethods}
                option={selectedContactMethod}
                setOption={setSelectedContactMethod}
              />
              <PasswordInput
                register={register}
                errors={errors}
                label="Teacher Portal Password"
                name="password"
                toolTipText="password will be used by the parent on the student portail"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="Date of joining"
                name="dateOfJoining"
                type="date"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Designation"
                name="designation"
                placeholder="e.g. Head of Department."
              />
              <FormSelectInput
                label="Department"
                options={departments}
                option={selectedDepartment}
                setOption={setSelectedDepartment}
                href="/dashboard/academics/departments/new"
                toolTipText="Create New Department"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormSelectInput
                label="Qualification"
                options={qualifications}
                option={qualification}
                setOption={setQualification}
              />
              <FormSelectInput
                label="Main Subject"
                options={subjects}
                option={mainSubject}
                setOption={setMainSubject}
                href="/dashboard/academics/subjects/new"
                toolTipText="Add New Subject"
              />
              <FormMultipleSelectInput
                label="Subject"
                options={subjects}
                option={selectedSubjects}
                setOption={setSelectedSubjects}
                href="/dashboard/academics/subjects/new"
                toolTipText="Add New Subject"
                isMultiple={true}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="grid gap-3">
                  <FormMultipleSelectInput
                    label="Class"
                    isMultiple={true}
                    options={classes}
                    option={selectedClasses}
                    setOption={setSelectedClasses}
                    toolTipText="Add New Class"
                    href="/dashboard/academics/classes/"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Year of Experience"
                    name="experience"
                    type="number"
                    placeholder="e.g. 5"
                  />
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Adresse"
                    name="address"
                  />
                  {/*  <div className="grid gap-3"></div> */}
                </div>
              </div>
              <div className="grid">
                <ImageInput
                  title="Teacher profile Image"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="teacherProfileImage"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormFooter
        href="/teachers"
        editingId={editingId}
        loading={loading}
        title="Teacher"
        parent="users"
      />
    </form>
  );
}
