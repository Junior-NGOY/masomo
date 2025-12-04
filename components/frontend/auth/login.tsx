"use client";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import CustomCarousel from "../custome-caroussel";
import Logo from "@/components/logo";
import PasswordInput from "@/components/FormInputs/PasswordInput";
import { Lock, LogIn, Mail, RollerCoaster, Router } from "lucide-react";
import { loginUser } from "@/actions/auth";
import { School, User, UserRole } from "@/types/types";
import { useUserSession } from "@/store/auth";
import useSchoolStore from "@/store/school";
import { getSchoolById } from "@/actions/schools";

/* export type RegisterInputProps = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}; */
export type LoginInputProps = {
  email: string;
  password: string;
};
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LoginInputProps>({
    mode: "onSubmit", // Validation seulement à la soumission
    defaultValues: {
      email: "",
      password: ""
    },
    // Mode démo - pas de validation requise
    resolver: undefined
  });
  const { setUser } = useUserSession();
  const { setSchool } = useSchoolStore();
  const router = useRouter();
  async function onSubmit(data: LoginInputProps) {
    try {
      setIsLoading(true);
      const response = await loginUser(data);
      if (response) {
        // Mettre à jour le store Zustand avec les vraies données
        await setUser(response.user);
        
        // Si l'utilisateur a une école, la charger aussi
        if (response.user.schoolId) {
          try {
            const schoolData = await getSchoolById(response.user.schoolId);
            if (schoolData) {
              setSchool(schoolData);
            }
          } catch (err) {
            console.error("Erreur lors du chargement de l'école:", err);
          }
        }
        
        toast.success("Connexion réussie!");
        router.push("/dashboard");
      } else {
        setIsLoading(false);
        toast.error("Échec de la connexion. Vérifiez vos identifiants.");
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Une erreur est survenue lors de la connexion");
    }
  }
  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] lg:grid-cols-2 relative">
      <div className="flex items-center justify-center py-12 relative">
        {/* Logo repositionné */}
        <div className="absolute top-8 left-8 z-10">
          <Logo 
            logoSrc="/images/logo.svg"
            logoAlt="Masomo Pro"
            size="sm"
          />
        </div>
        
        <div className="mx-auto grid w-[350px] gap-6 mt-16 md:mt-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-gray-600">Entrez vos identifiants pour accéder à votre compte</p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Email Address"
              register={register}
              name="email"
              type="email"
              errors={errors}
              placeholder="Ex: admin@masomo.pro"
              icon={Mail}
            />

            <PasswordInput
              label="Password"
              register={register}
              name="password"
              type="password"
              errors={errors}
              placeholder="Votre mot de passe"
              forgotPasswordLink="/forgot-password"
              icon={Lock}
              disableValidation={true}
            />

            <SubmitButton
              buttonIcon={LogIn}
              title="Se connecter"
              loading={isLoading}
              loadingTitle="Connexion en cours..."
            />
          </form>
          
          {/* <div className="text-center text-sm text-gray-500">
            <p>🎯 Mode Démo Actif</p>
            <p>Aucune validation requise - cliquez sur "Connexion Demo"</p>
          </div> */}
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <CustomCarousel />
      </div>
    </div>
  );
}
