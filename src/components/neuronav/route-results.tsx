
"use client";

import type { AdaptiveRouteSuggestionsOutput, RoutePreferences } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteCard, RouteCardSkeleton } from "./route-card";
import { Compass, Frown, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";

interface RouteResultsProps {
  suggestions: AdaptiveRouteSuggestionsOutput | null;
  isLoading: boolean;
  error: string | null;
  preferences: RoutePreferences | null;
}

type Route = AdaptiveRouteSuggestionsOutput["suggestedRoutes"][0];

export function RouteResults({ suggestions, isLoading, error, preferences }: RouteResultsProps) {
  const router = useRouter();

  const handleShowOnMap = (route: Route) => {
    if (suggestions && preferences) {
      localStorage.setItem("neuroNavRoutes", JSON.stringify(suggestions.suggestedRoutes));
      localStorage.setItem("neuroNavActiveRoute", JSON.stringify(route));
      localStorage.setItem("neuroNavPreferences", JSON.stringify(preferences));
      router.push("/navigate");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <RouteCardSkeleton />
        <RouteCardSkeleton />
        <RouteCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex items-center justify-center h-full border-dashed">
        <div className="text-center p-8">
          <Frown className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-medium text-destructive">An Error Occurred</h3>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  if (!suggestions) {
    return (
      <Card className="flex items-center justify-center h-full border-dashed bg-secondary/50">
        <div className="text-center p-8">
          <Compass className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium text-foreground">Ready to find your way?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill out the form to get personalized route suggestions.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
       <Card className="bg-primary/20 border-primary/50">
        <CardHeader className="flex-row items-start gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Recommendation Rationale</CardTitle>
            <CardDescription className="text-primary-foreground/80">Why we're suggesting these routes for you.</CardDescription>
          </div>
          <Lightbulb className="h-8 w-8 text-primary shrink-0" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary-foreground/90">{suggestions.recommendationReasoning}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold font-headline">Suggested Routes</h3>
        {suggestions.suggestedRoutes.map((route, index) => (
          <RouteCard key={index} route={route} onShowOnMap={() => handleShowOnMap(route)} />
        ))}
      </div>
    </div>
  );
}
