"use client";

import { useEffect, useRef } from "react";

export function NeuroNavMap({
  path,
}: {
  path: google.maps.LatLngLiteral[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: path[0],
    });

    const polyline = new google.maps.Polyline({
      path,
      map,
      strokeColor: "#2563eb",
      strokeWeight: 5,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [path]);

  return <div ref={mapRef} className="w-full h-full" />;
}
