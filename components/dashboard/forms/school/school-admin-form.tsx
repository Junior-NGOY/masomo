"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { Lock, Mail, Phone, Send, User } from "lucide-react";
import toast from "react-hot-toast";
import { UserCreateProps } from "@/types/types";
import PasswordInput from "@/components/FormInputs/PasswordInput";
import { createUser } from "@/actions/user";
import { UserRole } from "@/types/types";

export default function SchoolAdminForm({
  schoolId,
  schoolName
}: {
  schoolId: string;
  schoolName: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserCreateProps>({
    defaultValues: {
      //name: ""
    }
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  // const initialImage = "/images/student.png";
  // const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveSchoolAdmin(data: UserCreateProps) {
    try {
      setLoading(true);
      data.schoolId = schoolId;
      data.schoolName = schoolName;
      data.role = UserRole.ADMIN;
      console.log("Données fictives de l'administrateur:", data);
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer un ID fictif pour l'administrateur
      const mockAdminResponse = {
        id: `admin_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        schoolId: data.schoolId,
        schoolName: data.schoolName
      };
      
      console.log("Réponse fictive:", mockAdminResponse);
      setLoading(false);
      // Toast
      toast.success("Administrateur créé avec succès (mode démo)!");
      //reset
      reset();
      //route - redirection vers le tableau de bord
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Erreur lors de la création de l'administrateur");
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(saveSchoolAdmin)}>
      <div className="text-center">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Welcome to {schoolName},
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-2">
          Create the admin for this school.
        </p>
      </div>
      <div className="grid grid-cols-12 gap-6 py-6">
        <div className="lg:col-span-12 col-span-full space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <TextInput
              register={register}
              errors={errors}
              label="Admin Name"
              name="name"
              icon={User}
            />
            <TextInput
              register={register}
              errors={errors}
              label="Admin Email"
              name="email"
              icon={Mail}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <TextInput
              register={register}
              errors={errors}
              label="Admin Phone"
              name="phone"
              icon={Phone}
            />
            <PasswordInput
              register={register}
              errors={errors}
              label="Admin Password"
              name="password"
              icon={Lock}
            />
          </div>
        </div>
      </div>
      <SubmitButton
        buttonIcon={Send}
        loadingTitle="Creating please wait..."
        loading={loading}
        title="Create School Admin"
      />
    </form>
  );
}
