"use client";
import React, { useState } from "react";

import { Check, FolderPlus, Pen, Pencil, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { SubjectCreateProps, SubjectCategory, SubjectType } from "@/types/types";

import FormSelectInput from "@/components/FormInputs/FormSelectInput";
import { DepartmentOption } from "../../subject-listing";
import { createSubject } from "@/actions/subjects";

export default function SubjectForm({
  userId,
  initialContent,
  editingId,
  departments
}: {
  userId?: string;
  initialContent?: string;
  editingId?: string;
  departments: DepartmentOption[];
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SubjectCreateProps>({
    defaultValues: {
      name: initialContent || ""
    }
  });  const types = [
    {
      label: "THEORY",
      value: SubjectType.THEORY
    },
    {
      label: "PRACTICAL",
      value: SubjectType.PRACTICAL
    },
    {
      label: "BOTH",
      value: SubjectType.BOTH
    }
  ];
  const categories = [
    {
      label: "CORE",
      value: SubjectCategory.CORE
    },
    {
      label: "ELECTIVE",
      value: SubjectCategory.ELECTIVE
    },
    {
      label: "ADDITIONAL",
      value: SubjectCategory.ADDITIONAL
    },
    {
      label: "VOCATIONAL",
      value: SubjectCategory.VOCATIONAL
    },
    {
      label: "LANGUAGE",
      value: SubjectCategory.LANGUAGE
    },
    {
      label: "EXTRA_CURRICULAR",
      value: SubjectCategory.EXTRA_CURRICULAR
    }
  ];
  const [selectedCategory, setSelectedCategory] = useState<any>(categories[0]);
  const [selectedType, setSelectedType] = useState<any>(types[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [loading, setLoading] = useState(false);

  async function saveSubject(data: SubjectCreateProps) {
    //data.userId = userId;
    data.departmentId = selectedDepartment.value;
    data.departmentName = selectedDepartment.label;
    data.category = selectedCategory.value;
    data.type = selectedType.value;
    //data.code = data.code.toUpperCase();
    try {
      setLoading(true);
      if (editingId) {
        //await updateClassById(editingId, data);
        //setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
      } else {
        await createSubject(data);
        setLoading(false);
        toast.success("Successfully Created!");
        reset();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div>
      <div className="py-1">
        <Dialog>
          <DialogTrigger asChild>
            {editingId ? (
              <button title="Edit Folder" className="text-blue-600">
                <Pencil className="w-4 h-4 " />
              </button>
            ) : (
              <div className="flex items-center justify-between mb-4">
                <Button size="icon" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="sr-only">Add Subject</span>
              </div>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
              {/* <DialogDescription>
                Please Write your Comment here, with respect
              </DialogDescription> */}
            </DialogHeader>
            <form className="" onSubmit={handleSubmit(saveSubject)}>
              <div className="">
                <div className="space-y-3">
                  <div className="grid gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label="Name"
                      name="name"
                      icon={Check}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      placeholder="MATH101" // placeholder="MATH101"
                      label="Subject code"
                      name="code"
                    />
                    <TextInput
                      register={register}
                      errors={errors}
                      label="Short Name"
                      name="shortName"
                      placeholder="Math"
                      //icon={Check}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <FormSelectInput
                      label="Category"
                      options={categories}
                      option={selectedCategory}
                      setOption={setSelectedCategory}
                    />
                    <FormSelectInput
                      label="Type"
                      options={types}
                      option={selectedType}
                      setOption={setSelectedType}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormSelectInput
                      label="Department"
                      options={departments}
                      option={selectedDepartment}
                      setOption={setSelectedDepartment}
                      href="/dashboard/academics/departments"
                      toolTipText="add Department"
                    />
                  </div>
                </div>
                <div className="py-3">
                  <SubmitButton
                    title={editingId ? "Update" : "Add"}
                    loading={loading}
                  />
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
