
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { RoutePreferences } from "@/lib/types";
import { RoutePreferencesSchema } from "@/lib/types";
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
import { Loader2, Route, LocateFixed } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { getConfig } from "@/lib/config";
import { useSearchParams, useRouter } from 'next/navigation';


const sensoryOptions = [
  { id: "loud_noises", label: "Loud Noises" },
  { id: "bright_lights", label: "Bright Lights" },
  { id: "crowds", label: "Crowds" },
  { id: "strong_smells", label: "Strong Smells" },
  { id: "uneven_surfaces", label: "Uneven Surfaces" },
];

interface RouteFormProps {
  onSubmit: (data: RoutePreferences) => void;
  isLoading: boolean;
}

const renderMapStatus = (status: Status) => {
  if (status === Status.LOADING) return <Loader2 className="h-4 w-4 animate-spin" />;
  if (status === Status.FAILURE) return <LocateFixed className="h-4 w-4 text-destructive" />;
  return <LocateFixed className="h-4 w-4" />;
}

function RouteFormContent({ onSubmit, isLoading }: RouteFormProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const form = useForm<RoutePreferences>({
    resolver: zodResolver(RoutePreferencesSchema),
    defaultValues: {
      startLocation: "",
      endLocation: "",
      sensoryPreferences: ["loud_noises", "crowds"],
    },
  });
  
  const getCurrentLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK') {
              if (results && results[0]) {
                form.setValue("startLocation", results[0].formatted_address, {
                  shouldValidate: true,
                });
              } else {
                setLocationError("No address found for your location.");
              }
            } else {
              setLocationError(`Geocoder failed: ${status}`);
            }
            setIsLocating(false);
          });
        },
        (err) => {
          setLocationError(`Error: ${err.message}`);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not available.");
    }
  }, [form]);

  useEffect(() => {
    // Check if start location is already set from a previous navigation or other means.
    // If not, fetch the current location.
    if (!form.getValues("startLocation")) {
        getCurrentLocation();
    }
  }, [form, getCurrentLocation]);


  useEffect(() => {
    const destination = localStorage.getItem("neuroNavDestination");
    if (destination) {
      form.setValue("endLocation", destination, { shouldValidate: true });
      localStorage.removeItem("neuroNavDestination"); // Clean up after use
       const formSection = document.getElementById("route-finder");
       if (formSection) {
         formSection.scrollIntoView({ behavior: "smooth" });
       }
    }
  }, [form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="startLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Location</FormLabel>
                <div className="flex items-center gap-2">
                   <FormControl>
                    <Input placeholder="e.g., Central Park, NYC" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    aria-label="Get current location"
                  >
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                  </Button>
                </div>
                 {locationError && <p className="text-xs text-destructive">{locationError}</p>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Times Square, NYC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sensoryPreferences"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sensory Preferences</FormLabel>
                <FormDescription>
                  Select sensitivities to avoid on your route.
                </FormDescription>
              </div>
              <div className="space-y-3">
                {sensoryOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="sensoryPreferences"
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
                                  ? field.onChange([...field.value, item.id])
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Routes...
            </>
          ) : (
            <>
              <Route className="mr-2 h-4 w-4" />
              Find My Flow
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export function RouteForm(props: RouteFormProps) {
  const config = getConfig();

  if (!config.googleMapsApiKey) {
    // Render a disabled form or a message if the API key is missing
    return (
       <div className="space-y-8 p-4 border rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
              Location features are disabled. Please add a Google Maps API key.
          </p>
          <Button className="w-full" disabled>Find My Flow</Button>
      </div>
    );
  }

  return (
    <Wrapper apiKey={config.googleMapsApiKey} libraries={['geocoding', 'places', 'marker', 'geometry']}>
      <RouteFormContent {...props} />
    </Wrapper>
  );
}
