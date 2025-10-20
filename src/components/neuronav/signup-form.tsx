
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SignUpCredentials } from "@/lib/types";
import { SignUpCredentialsSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";

const neurodiversityOptions = [
  { id: "dyslexia", label: "Dyslexia" },
  { id: "adhd", label: "ADHD" },
  { id: "autism_spectrum", label: "Autism Spectrum" },
  { id: "sensory_processing_disorder", label: "Sensory Processing Disorder" },
  { id: "none", label: "Prefer not to say / None" },
];

interface SignUpFormProps {
  onSubmit: (data: SignUpCredentials) => void;
  isLoading: boolean;
}

export function SignUpForm({ onSubmit, isLoading }: SignUpFormProps) {
  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(SignUpCredentialsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
      address: "",
      emergencyMobile: "",
      profession: "student",
      neurodiversity: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Section 1: Account Credentials */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Details</h3>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field}/>
                        </FormControl>
                         <FormDescription>Create a new password. Must be at least 8 characters.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>

         {/* Section 2: Contact Information */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact & Safety</h3>
             <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                 <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., +1 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="emergencyMobile"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Emergency Contact Number</FormLabel>
                        <FormControl>
                        <Input placeholder="A trusted contact for SOS alerts" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 123 Main St, Anytown, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>

        {/* Section 3: Profile Personalization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Which best describes you?</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="student" />
                            </FormControl>
                            <FormLabel className="font-normal">Student</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="professional" />
                            </FormControl>
                            <FormLabel className="font-normal">Professional</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="neurodiversity"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Neurodiversity Profile (Optional)</FormLabel>
                    <FormDescription>
                      This helps us tailor suggestions. Select any that apply.
                    </FormDescription>
                  </div>
                  <div className="space-y-3">
                    {neurodiversityOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="neurodiversity"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-sm">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <Separator />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create My Account
            </>
          )}
        </Button>
         <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
                Login
            </Link>
        </div>
      </form>
    </Form>
  );
}
