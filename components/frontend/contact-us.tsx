"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import TextArea from "../FormInputs/TextAreaInput";
import PhoneInput from "../FormInputs/PhoneInput";
import FormSelectInput from "../FormInputs/FormSelectInput";

export type ContactProps = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  school: string;
  country: string;
  schoolPage: string;
  students: number;
  role: string;
  media: string;
  message: string;
};
const ContactUs: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<any>("congo");
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactProps>();
  const router = useRouter();
  async function onSubmit(data: ContactProps) {
    console.log(data);
  }
  const countries = [
    { name: "congolais" },
    { name: "Kinshasa" },
    { name: "criser" }
  ];
  const roles = [
    { label: "congolais", value: "congolais" },
    { label: "Kinshasa", value: "Kinshasa" },
    { label: "role", value: "role" },
    { label: "role1", value: "role1" }
  ];
  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
            <h3 className="text-2xl text-center font-semibold ">
              Tell us about your institution and requirements
            </h3>
            <p className="text-muted-foreground text-sm text-center px-4 py-2 mb-4 max-w-xl mx-auto">
              Our team will reach out within 24 hours to schedule a personalized
              demo and discuss your specific needs.
            </p>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                label="Your Full name"
                register={register}
                name="name"
                errors={errors}
                placeholder="Eg. john doe"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  label="Email Address"
                  register={register}
                  name="email"
                  type="email"
                  errors={errors}
                  placeholder="Eg. johndoe@gmail.com"
                />
                <PhoneInput
                  label="Phone"
                  register={register}
                  name="phone"
                  errors={errors}
                  placeholder="Eg. +243"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  label="School name"
                  register={register}
                  name="school"
                  errors={errors}
                  placeholder="Eg. Imara collège"
                />
                <FormSelectInput
                  options={roles}
                  label="Country"
                  option={selectedCountry}
                  setOption={setSelectedCountry}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  label="School Website / Social Mediage Page(fb, linkedin)"
                  register={register}
                  name="schoolpage"
                  errors={errors}
                  placeholder="Eg. www.imara.com"
                />
                <TextInput
                  label="Number of students"
                  register={register}
                  name="students"
                  errors={errors}
                  placeholder="Eg. 300"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormSelectInput
                  label="Role"
                  options={roles}
                  option={selectedRole}
                  setOption={setSelectedRole}
                />
                <FormSelectInput
                  label="Please select media did hear about us"
                  options={roles}
                  option={selectedRole}
                  setOption={setSelectedRole}
                />
              </div>
              <TextInput
                label="Please share with us the key pain points you want to solve"
                register={register}
                name="students"
                errors={errors}
                placeholder="Eg. 300"
              />
              <SubmitButton
                buttonIcon={Send}
                title="Submit"
                loading={isLoading}
                loadingTitle="Sending please wait..."
              />
            </form>
          </div>
        </div>
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-800 text-white p-6 rounded-2xl">
            <h3 className="font-semibold text-xl mb-2">
              Speak to someone in sales
            </h3>
            <p className="text-sm mb-4 py-4">
              To create a more value-added solution, is essential to an analysis
              of the possibilities of improvement.
            </p>
            <button className="bg-white text-green-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition duration-300">
              Book Appointment
            </button>
          </div>
          <div className="bg-lime-400 p-6 rounded-2xl">
            <h3 className="font-semibold mb-2 text-xl">Contact to our team</h3>
            <p className="text-sm mb-4 py-4">
              To create a more value-added solution, is essential to an analysis
              of the possibilities of improvement.
            </p>
            <button className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-300">
              Sign up to get your school on board
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
