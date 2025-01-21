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
import { User } from "@/types/types";
import { useUserSession } from "@/store/auth";

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
  } = useForm<LoginInputProps>();
  const { setUser } = useUserSession();
  const router = useRouter();
  async function onSubmit(data: LoginInputProps) {
    try {
      setIsLoading(true);
      console.log("data Mining", data);
      const sessionData = await loginUser(data);
      // save data in Zustand
      setUser(sessionData?.user as User);
      const role = sessionData?.user.role;
      // user the route according the role
      setIsLoading(false);
      if (role === "SUPER_ADMIN") {
        router.push("/school-onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response:", error.response);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
      }
      console.log(error.config);
    }
  }
  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] lg:grid-cols-2 relative ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 mt-10 md:mt-0">
          <div className="absolute left-1/3 top-14 md:top-5 md:left-5">
            <Logo />
          </div>

          <div className="grid gap-2 text-center mt-10 md:mt-0">
            <h1 className="text-3xl font-bold">Login to your Account</h1>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Email Address"
              register={register}
              name="email"
              type="email"
              errors={errors}
              placeholder="Eg. johndoe@gmail.com"
              icon={Mail}
            />
            {/*      <TextInput
              label="Phone Number"
              register={register}
              name="phone"
              type="tel"
              errors={errors}
              placeholder=""
            /> */}

            <PasswordInput
              label="Password"
              register={register}
              name="password"
              type="password"
              errors={errors}
              placeholder="******"
              forgotPasswordLink="/forgot-password"
              icon={Lock}
            />

            <SubmitButton
              buttonIcon={LogIn}
              title="SignIn"
              loading={isLoading}
              loadingTitle="Signing In please wait..."
            />
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <CustomCarousel />
      </div>
    </div>
  );
}
