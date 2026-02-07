"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSensoryRoutes } from "@/lib/api";

declare global {
  interface Window {
    google: any;
  }
}

interface RouteFormProps {
  setRoutes: (data: any, prefs: any) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
}

export default function RouteForm({
  setRoutes,
  setLoading,
  setError,
}: RouteFormProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [useCurrent, setUseCurrent] = useState(false);

  /* ---------- Auto Location ---------- */
  useEffect(() => {
    if (!useCurrent) return;

    if (!window.google || !navigator.geolocation) {
      setError("Map not ready yet.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const geocoder = new window.google.maps.Geocoder();
          const res = await geocoder.geocode({
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          });

          if (res.results?.[0]) {
            setSource(res.results[0].formatted_address);
          } else {
            setError("Unable to fetch address.");
          }
        } catch {
          setError("Failed to resolve location.");
        }
      },
      () => setError("Location permission denied.")
    );
  }, [useCurrent, setError]);

  /* ---------- Submit ---------- */
  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!source || !destination) {
      setError("Source and destination required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getSensoryRoutes({
        origin: source,
        destination,
      });

      console.log("ROUTES FROM BACKEND 👉", data);
    
      // ✅ MATCHES PARENT SIGNATURE
      setRoutes(data.routes, null);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch routes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        value={source}
        onChange={e => setSource(e.target.value)}
        placeholder="Source location"
        className="w-full p-2 border rounded"
      />

      <input
        value={destination}
        onChange={e => setDestination(e.target.value)}
        placeholder="Destination"
        className="w-full p-2 border rounded"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={useCurrent}
          onChange={e => setUseCurrent(e.target.checked)}
        />
        Use my current location
      </label>

      <Button type="submit" className="w-full">
        Find Route
      </Button>
    </form>
  );
}
