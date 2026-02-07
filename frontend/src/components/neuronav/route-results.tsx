"use client";

import { useEffect } from "react";
import { RouteCard } from "./route-card";

export function RouteResults({
  routes,
  isLoading,
  error,
}: {
  routes: any[] | null;
  isLoading: boolean;
  error: string | null;
}) {
  if (isLoading) return <p>Loading routes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!routes || routes.length === 0) return <p>No routes found.</p>;

  // ✅ STORE ALL ROUTES ONCE (for navigate page)
  useEffect(() => {
    localStorage.setItem("neuroNavRoutes", JSON.stringify(routes));
  }, [routes]);

  return (
    <div className="space-y-4">
      {routes.map(route => (
        <RouteCard
          key={route.routeId}
          route={route}
        />
      ))}
    </div>
  );
}
