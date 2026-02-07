"use client";

import { useEffect, useState } from "react";
import { NeuroNavMap } from "@/components/neuronav/map";

export default function NavigatePage() {
  const [route, setRoute] = useState<any | null>(null);
  const [mapsReady, setMapsReady] = useState(false);

  // 🔒 Load selected route from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("neuroNavSelectedRoute");
    const allRoutes = localStorage.getItem("neuroNavRoutes");

    if (!stored || !allRoutes) {
      console.error("Navigation data missing");
      return;
    }

    const { routeId } = JSON.parse(stored);
    const routes = JSON.parse(allRoutes);

    const selected = routes.find((r: any) => r.routeId === routeId);

    if (!selected || !selected.path?.length) {
      console.error("Invalid route data");
      return;
    }

    setRoute(selected);
  }, []);

  // 🔒 Wait until Google Maps is FULLY ready
  useEffect(() => {
    const check = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        setMapsReady(true);
        clearInterval(check);
      }
    }, 100);

    return () => clearInterval(check);
  }, []);

  if (!mapsReady || !route) {
    return <p className="p-4">Navigation loading…</p>;
  }

  return (
    <div className="w-full h-screen">
      <NeuroNavMap path={route.path} />
    </div>
  );
}
