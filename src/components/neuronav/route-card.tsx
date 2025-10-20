
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdaptiveRouteSuggestionsOutput } from "@/ai/flows/adaptive-route-suggestions";
import { Clock, Loader2, MapPin, Mic, ShieldAlert, Waves } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Route = AdaptiveRouteSuggestionsOutput["suggestedRoutes"][0];

interface RouteCardProps {
  route: Route;
  onShowOnMap: () => void;
}

export function RouteCard({ route, onShowOnMap }: RouteCardProps) {
  const getScoreColor = (score: number) => {
    if (score <= 3) return "bg-green-500/20 text-green-700 border-green-500/30";
    if (score <= 7) return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    return "bg-red-500/20 text-red-700 border-red-500/30";
  };

  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="font-headline">{route.routeDescription}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Clock className="h-4 w-4" />
          <span>{route.estimatedTime}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            Potential Sensory Challenges
          </h4>
          <div className="flex flex-wrap gap-2">
            {route.sensoryChallenges.length > 0 ? (
              route.sensoryChallenges.map((challenge, index) => (
                <Badge key={index} variant="secondary">
                  {challenge}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">None identified.</p>
            )}
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
             <Waves className="h-5 w-5 text-sky-600" />
            <h4 className="text-sm font-semibold">Overall Sensory Score</h4>
          </div>
          <Badge className={`text-lg ${getScoreColor(route.overallSensoryScore)}`}>
            {route.overallSensoryScore}/10
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
         <Button onClick={onShowOnMap}>
            <MapPin className="mr-2" />
            Show on Map
         </Button>
      </CardFooter>
    </Card>
  );
}


export function RouteCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Skeleton className="h-5 w-1/2 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </CardFooter>
    </Card>
  )
}
