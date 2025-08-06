"use client";
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
      console.log("Connexion en mode démo avec:", data);
      
      // Pas de validation - accepter n'importe quelles données
      // Simulation d'un délai d'API court
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Données fictives d'utilisateur
      const mockUserData = {
        id: `user_${Date.now()}`,
        email: data.email || "demo@masomo.com",
        name: "Administrateur Demo",
        role: UserRole.ADMIN,
        schoolId: "school_demo_123",
        schoolName: "École Demo",
        phone: "+243 999 999 999",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Données fictives d'école
      const mockSchoolData = {
        id: "school_demo_123",
        name: "École Demo",
        logo: "/images/logo.png"
      };
      
      console.log("✅ Connexion réussie (mode démo)");
      
      // Sauvegarder dans Zustand (données fictives)
      setUser(mockUserData as User);
      setSchool(mockSchoolData as School);
      
      setIsLoading(false);
      
      // Redirection directe vers le dashboard (mode démo)
      router.push("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
      console.log("Erreur de connexion:", error);
    }
  }
  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] lg:grid-cols-2 relative">
      <div className="flex items-center justify-center py-12 relative">
        {/* Logo repositionné */}
        <div className="absolute top-8 left-8 z-10">
          <Logo 
            logoSrc="/images/logo.png" // Changez ce chemin vers votre logo
            logoAlt="Masomo Pro"
            size="sm"
          />
        </div>
        
        <div className="mx-auto grid w-[350px] gap-6 mt-16 md:mt-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-gray-600">Mode Démo - Utilisez n'importe quelles données</p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Email Address (Demo - optionnel)"
              register={register}
              name="email"
              type="email"
              errors={errors}
              placeholder="demo@masomo.com (ou laissez vide)"
              icon={Mail}
            />

            <PasswordInput
              label="Password (Demo - optionnel)"
              register={register}
              name="password"
              type="password"
              errors={errors}
              placeholder="motdepasse (ou laissez vide)"
              forgotPasswordLink="/forgot-password"
              icon={Lock}
            />

            <SubmitButton
              buttonIcon={LogIn}
              title="Connexion Demo"
              loading={isLoading}
              loadingTitle="Connexion en cours..."
            />
          </form>
          
          <div className="text-center text-sm text-gray-500">
            <p>🎯 Mode Démo Actif</p>
            <p>Aucune validation requise - cliquez sur "Connexion Demo"</p>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <CustomCarousel />
      </div>
    </div>
  );
}
