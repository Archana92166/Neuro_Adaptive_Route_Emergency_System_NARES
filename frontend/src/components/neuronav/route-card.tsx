"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export interface NeuroRoute {
  routeId: string;
  summary: string;
  path: google.maps.LatLngLiteral[];
  distanceText: string;
  durationText: string;
  sensoryScore?: number;
  sensoryFlags?: string[];
}

export function RouteCard({ route }: { route: NeuroRoute }) {
  const router = useRouter();

  const score = route.sensoryScore ?? 5;

  const scoreColor =
    score <= 3
      ? "bg-green-500/20 text-green-700"
      : score <= 7
      ? "bg-yellow-500/20 text-yellow-700"
      : "bg-red-500/20 text-red-700";

  const handleShowOnMap = () => {
    localStorage.setItem(
      "neuroNavSelectedRoute",
      JSON.stringify({ routeId: route.routeId })
    );

    router.push("/navigate");
  };

  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <CardTitle>{route.summary}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {route.durationText}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Distance</span>
          <span className="text-sm font-medium">{route.distanceText}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm">Sensory Load</span>
          <Badge className={scoreColor}>{score}/10</Badge>
        </div>

        {route.sensoryFlags && route.sensoryFlags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {route.sensoryFlags.map((flag, i) => (
              <Badge key={i} variant="secondary">
                {flag}
              </Badge>
            ))}
          </div>
        )}

        <Button className="w-full mt-2" onClick={handleShowOnMap}>
          <MapPin className="mr-2 h-4 w-4" />
          Show on Map
        </Button>
      </CardContent>
    </Card>
  );
}
