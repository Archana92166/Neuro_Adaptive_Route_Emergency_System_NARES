
"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { getConfig } from "@/lib/config";

const render = (status: Status) => {
  if (status === Status.LOADING) {
    return (
      <div className="flex items-center space-x-2 p-4 border rounded-lg">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading Map Utilities...</p>
      </div>
    );
  }
  if (status === Status.FAILURE) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Map Error</AlertTitle>
        <AlertDescription>Could not load Google Maps. Please check your connection and API key.</AlertDescription>
      </Alert>
    );
  }
  return null;
};

function LocationDisplay() {
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (!isMounted) return;

          if (status === "OK") {
            if (results && results[0]) {
              setLocation(results[0].formatted_address);
            } else {
              setError("No results found for your location.");
            }
          } else {
            setError(`Geocoder failed due to: ${status}`);
          }
          setIsLoading(false);
        });
      },
      (err) => {
        if (!isMounted) return;
        setError(`Could not get location: ${err.message}`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 p-4 border rounded-lg">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm text-muted-foreground">Fetching current location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <MapPin className="h-4 w-4" />
      <AlertTitle>Your Current Location</AlertTitle>
      <AlertDescription className="font-mono text-sm">{location}</AlertDescription>
    </Alert>
  );
}

export function EmergencyLocation() {
  const config = getConfig();

  if (!config.googleMapsApiKey) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Configuration Error</AlertTitle>
        <AlertDescription>Google Maps API key is missing. Location services are unavailable.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Wrapper apiKey={config.googleMapsApiKey} render={render} libraries={['geocoding']}>
      <LocationDisplay />
    </Wrapper>
  )
}

    