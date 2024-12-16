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
import { createParent } from "@/actions/parents";
import toast from "react-hot-toast";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ParentFormProps = {
  editingId?: string | undefined;
  initialData?: any | undefined | null;
};
export type ParentProps = {
  title: string;
  firstname: string;
  lastname: string;
  relationship: string;
  email: string;
  NIN: string;
  gender: string;
  dob: string;
  phone: string;
  nationality: string;
  whatsappNo: string;
  imageUrl: string;
  contactMethod: string;
  occupation: string;
  address: string;
  password: string;
};
export default function ParentForm({
  editingId,
  initialData
}: ParentFormProps) {
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
  //classes
  const relationship = [
    {
      label: "Père",
      value: "Pere"
    },
    {
      label: "Mère",
      value: "Mere"
    },
    {
      label: "Oncle",
      value: "Oncle"
    },
    {
      label: "Tante",
      value: "Tante"
    },
    {
      label: "Frère",
      value: "Frere"
    },
    {
      label: "Soeur",
      value: "Soeur"
    }
  ];
  const [selectedRelationship, setSelectedRelationship] = useState<any>(null);

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
  } = useForm<ParentProps>({
    defaultValues: {
      firstname: ""
    }
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.imageUrl || "/images/student.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveParent(data: ParentProps) {
    try {
      setLoading(true);
      data.imageUrl = imageUrl;
      data.title = selectedTitle.value;
      data.relationship = selectedRelationship.value;
      data.nationality = selectedNationality.value;
      data.contactMethod = selectedContactMethod.value;
      data.gender = selectedGender.value;
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
        const res = await createParent(data);
        setLoading(false);
        // Toast
        toast.success("Successfully Created!");
        //reset
        reset();
        //setImageUrl("/placeholder.svg");
        //route
        router.push("/dashboard/users/parents");
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
    <form className="" onSubmit={handleSubmit(saveParent)}>
      <FormHeader
        href="/parents"
        parent=""
        title="Parent"
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
                name="firstname"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Nom"
                name="lastname"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <FormSelectInput
                label="Relation"
                options={relationship}
                option={selectedRelationship}
                setOption={setSelectedRelationship}
              />
              <TextInput
                register={register}
                errors={errors}
                label="Num carte nationale/passeport"
                name="NIN"
              />
              <FormSelectInput
                label=" Sexe"
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
                name="dob"
                type="date"
              />

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
                label="Phone"
                name="phone"
              />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <TextInput
                register={register}
                errors={errors}
                label="Whatsapp n°"
                name="whatsappNo"
                type="tel"
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
                label="Profession"
                name="occupation"
              />
            </div>
            {/*  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
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
           
            </div> */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-3">
                <FormSelectInput
                  label="Selectionnez la methode de contact préférée"
                  options={contactMethods}
                  option={selectedContactMethod}
                  setOption={setSelectedContactMethod}
                />
                <TextArea
                  register={register}
                  errors={errors}
                  label="Adresse"
                  name="address"
                />
                <div className="grid gap-3">
                  <PasswordInput
                    register={register}
                    errors={errors}
                    label="Mot de passe portail parent"
                    name="password"
                    toolTipText="password will be used by the parent on the student portail"
                  />
                </div>
              </div>
              <div className="grid   ">
                <ImageInput
                  title="Image de profile de parent"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="parentProfileImage"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormFooter
        href="/parents"
        editingId={editingId}
        loading={loading}
        title="Parent"
        parent=""
      />
    </form>
  );
}
