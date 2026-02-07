
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { BetaSignUpCredentials } from "@/lib/types";
import { BetaSignUpCredentialsSchema } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Send } from "lucide-react";

const interestsOptions = [
  { id: "new_routes", label: "New Routing Features" },
  { id: "new_games", label: "New Cognitive Games" },
  { id: "ui_ux", label: "UI/UX Improvements" },
  { id: "performance", label: "Performance and Speed" },
  { id: "accessibility", label: "Accessibility Features" },
];

interface BetaSignUpFormProps {
  onSubmit: (data: BetaSignUpCredentials) => void;
  isLoading: boolean;
}

export function BetaSignUpForm({ onSubmit, isLoading }: BetaSignUpFormProps) {
  const form = useForm<BetaSignUpCredentials>({
    resolver: zodResolver(BetaSignUpCredentialsSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
      feedback: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Alex Doe" {...field} />
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
          name="interests"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>What are you most interested in testing?</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
              </div>
              <div className="space-y-2">
                {interestsOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="interests"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
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
        
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anything else?</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us why you're excited to join or what you'd like to see in NeuroNav (optional)." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Submit Application
        </Button>
      </form>
    </Form>
  );
}
