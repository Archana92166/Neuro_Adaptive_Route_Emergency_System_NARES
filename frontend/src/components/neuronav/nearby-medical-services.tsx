
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin, Search, Hospital, Stethoscope, Navigation } from "lucide-react";
import { fetchNearbyMedicalServices } from "@/app/actions";
import type { FindNearbyPlacesOutput } from "@/ai/flows/find-nearby-places";
import { useRouter } from "next/navigation";

export function NearbyMedicalServices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<FindNearbyPlacesOutput | null>(null);
  const router = useRouter();

  const handleFindServices = () => {
    setIsLoading(true);
    setError(null);
    setServices(null);

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await fetchNearbyMedicalServices({ latitude, longitude });

        if ("error" in result) {
          setError(result.error);
        } else {
          setServices(result);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(`Could not get location: ${err.message}`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleNavigateToPlace = (address: string) => {
    localStorage.setItem("neuroNavDestination", address);
    router.push("/#route-finder");
  }

  const getIconForType = (type: 'hospital' | 'clinic' | 'specialist') => {
      switch (type) {
          case 'hospital': return <Hospital className="h-6 w-6 text-red-500" />;
          case 'clinic': return <Stethoscope className="h-6 w-6 text-blue-500" />;
          case 'specialist': return <Stethoscope className="h-6 w-6 text-purple-500" />;
      }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-secondary/40">
        <CardContent className="p-6">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
               <p className="text-muted-foreground text-center sm:text-left">Find hospitals and clinics near your current location.</p>
                <Button onClick={handleFindServices} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                    </>
                    ) : (
                    <>
                        <Search className="mr-2 h-4 w-4" />
                        Find Nearby Help
                    </>
                    )}
                </Button>
           </div>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <MapPin className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {services && services.places.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.places.map((place, index) => (
             <Card key={index} className="flex flex-col justify-between">
              <div className="flex items-start gap-4 p-4">
                  <div className="pt-1">{getIconForType(place.type)}</div>
                  <div className="flex-grow">
                      <h4 className="font-bold">{place.name}</h4>
                      <p className="text-sm text-muted-foreground">{place.address}</p>
                      {place.specialty && <p className="text-xs mt-1 text-primary font-semibold">{place.specialty}</p>}
                  </div>
              </div>
               <div className="p-4 pt-0">
                  <Button onClick={() => handleNavigateToPlace(place.address)} className="w-full">
                    <Navigation className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
               </div>
            </Card>
          ))}
        </div>
      )}

       {services && services.places.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No services were found nearby.</p>
       )}
    </div>
  );
}
