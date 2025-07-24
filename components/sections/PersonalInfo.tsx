"use client";

import React from "react";
import * as z from "zod";

import SectionHeader from "../SectionHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import Container from "../Container";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(255, { message: "Name must be at most 255 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email" }),
  phone: z.string().refine((val) => /^\d{10}$/.test(val), {
    message: "Phone is required",
  }),
  monthlyIncome: z
  .string()
  .min(1, { message: "Monthly income is required" })
  .transform((val) => Number(val.replace(/,/g, '')))
  .refine((val) => !isNaN(val), {
    message: "Monthly income must be a number",
  })
  .refine((val) => val >= 5000 && val <= 5000000, {
    message: "Monthly income must be between 5,000 and 5,000,000",
  }),
loanAmount: z
  .string()
  .min(1, { message: "Loan Amount is required" })
  .transform((val) => Number(val.replace(/,/g, '')))
  .refine((val) => !isNaN(val), {
    message: "Loan Amount must be a number",
  })
  .refine((val) => val >= 1000 && val <= 5000000, {
    message: "Loan Amount must be between 1,000 and 5,000,000",
  }),
  selectLoanPurpose: z.enum(["education", "medical", "business", "personal"], {
    required_error: "Loan Purpose is required",
    invalid_type_error: "Invalid loan purpose selected",
  }),
  age: z.coerce
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .int({ message: "Age must be an integer" }) // optional, but good
    .refine((val) => val > 0 && val <= 99, {
      message: "Age must be between 1 and 99",
    }),
});


type ValidationSchema = z.infer<typeof formSchema>;

export default function PersonalInfo() {
  const { personalInfo, setPersonalInfo, increaseStep } = useStore(
    (state) => state
  );
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...personalInfo },
  });
  const {
    control,
    formState: { errors },
  } = form;

  const onSubmitHandler = async (values: ValidationSchema) => {
    setPersonalInfo({ ...personalInfo, ...values });
    increaseStep(1);
  const payload = {
    fullName: values.name,
    email: values.email,
    phoneNumber: values.phone,
    age: values.age,
    monthlyIncome: values.monthlyIncome,
    loanAmount: values.loanAmount,
    loanPurpose: values.selectLoanPurpose,
  };
   try {
    const response = await fetch("/api/v1/loans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Loan application failed:", data);
      alert(`Error: ${data.message || "Unknown error"}`);
      return;
    }

    console.log("Loan application successful:", data);
    alert(`Application submitted! ID: ${data.applicationId}`);
    
    // Move to next step only if API call is successful
    increaseStep(1);
  } catch (err) {
    console.error("API Error:", err);
    alert("An unexpected error occurred.");
  }
};

  return (
    <Container onNext={form.handleSubmit(onSubmitHandler)}>
      <SectionHeader
        title="ArisePreQ Loan Pre-Qualification"
        description="Get instant loan pre-qulification"
      />
      <Form {...form}>
        <form
          className="w-full maflex flex-col h-screen overflow-y-autox-w-2xl mx-auto px-4 py-6"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-c-primary-marine-blue flex items-center justify-between">
                  Name
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      "placeholder:font-medium placeholder:text-c-neutral-cool-gray border-c-neutral-light-gray text-c-primary-marine-blue",
                      {
                        "border-c-primary-strawberry-red": errors.name?.message,
                      }
                    )}
                    placeholder="e.g. George Russell"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-c-primary-marine-blue flex items-center justify-between">
                  Email Address
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      "placeholder:font-medium placeholder:text-c-neutral-cool-gray border-c-neutral-light-gray text-c-primary-marine-blue",
                      {
                        "border-c-primary-strawberry-red":
                          errors.email?.message,
                      }
                    )}
                    placeholder="e.g. MadMaxVerstappen@redbull.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-c-primary-marine-blue flex items-center justify-between">
                  Phone Number
                  <FormMessage>{errors.phone?.message}</FormMessage>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      "placeholder:font-medium placeholder:text-c-neutral-cool-gray border-c-neutral-light-gray text-c-primary-marine-blue",
                      {
                        "border-c-primary-strawberry-red":
                          errors.phone?.message,
                      }
                    )}
                    placeholder="e.g. 0851234567"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-c-primary-marine-blue flex items-center justify-between">
                  Monthly Income
                  <FormMessage>{errors.monthlyIncome?.message}</FormMessage>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      "placeholder:font-medium placeholder:text-c-neutral-cool-gray border-c-neutral-light-gray text-c-primary-marine-blue",
                      {
                        "border-c-primary-strawberry-red": errors.monthlyIncome?.message,
                      }
                    )}
                    placeholder="e.g 10,000"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-c-primary-marine-blue flex items-center justify-between">
                  Loan Amount
                  <FormMessage>{errors.loanAmount?.message}</FormMessage>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      "placeholder:font-medium placeholder:text-c-neutral-cool-gray border-c-neutral-light-gray text-c-primary-marine-blue",
                      {
                        "border-c-primary-strawberry-red": errors.loanAmount?.message,
                      }
                    )}
                    placeholder="e.g 10,000"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
  control={control}
  name="selectLoanPurpose"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-c-primary-marine-blue flex items-center justify-between">
        Select Loan Purpose
        <FormMessage>{errors.selectLoanPurpose?.message}</FormMessage>
      </FormLabel>
      <FormControl>
        <select
  {...field}
  className={cn(
    "w-full font-medium text-c-primary-marine-blue border rounded-md px-3 py-2",
    "placeholder:text-c-neutral-cool-gray border-c-neutral-light-gray",
    {
      "border-c-primary-strawberry-red": errors.selectLoanPurpose?.message,
    }
  )}
>
  <option value="" disabled hidden>
    Select Loan Purpose*
  </option>
  <option value="education">Education</option>
  <option value="medical">Medical</option>
  <option value="business">Business</option>
  <option value="personal">Personal</option>
</select>

      </FormControl>
    </FormItem>
  )}
/>
<FormField
  control={control}
  name="age"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-c-primary-marine-blue flex items-center justify-between">
        Age
        <FormMessage>{errors.age?.message}</FormMessage>
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="e.g 25"
          {...field}
          className={cn(
            "border-c-neutral-light-gray",
            {
              "border-c-primary-strawberry-red": errors.age?.message,
            }
          )}
        />
      </FormControl>
    </FormItem>
  )}
/>       
        </form>
      </Form>
    </Container>
  );
}
