"use client"

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState, useCallback } from "react";
import type { AdaptiveRouteSuggestionsOutput } from "@/ai/flows/adaptive-route-suggestions";
import { Loader2, AlertCircle } from "lucide-react";
import { getConfig } from "@/lib/config";
import { fetchTurnByTurnInstruction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { GenerateTurnByTurnOutput } from "@/ai/flows/generate-turn-by-turn";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import type { ReactElement } from "react"; // ← added for TS fix

type Route = AdaptiveRouteSuggestionsOutput["suggestedRoutes"][0];

interface MapProps extends google.maps.MapOptions {
  activeRoute: Route | null;
  allRoutes: Route[];
  isNavigating: boolean;
  onNavigationStep: (instruction: GenerateTurnByTurnOutput) => void;
  onNavigationFinish: () => void;
  onRouteSelect: (route: Route) => void;
}

// ======= FIXED RENDER FUNCTION =======
const render = (status: Status): ReactElement => {
  if (status === Status.LOADING) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (status === Status.FAILURE) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Map Error</AlertTitle>
        <AlertDescription>
          Could not load Google Maps. Please check your connection and API key.
        </AlertDescription>
      </Alert>
    );
  }
  return <div />; // ← fallback instead of null
};
// ======================================

export function NeuroNavMap({
  activeRoute,
  allRoutes,
  isNavigating,
  onNavigationStep,
  onNavigationFinish,
  onRouteSelect
}: {
  activeRoute: Route | null; 
  allRoutes: Route[]; 
  isNavigating: boolean; 
  onNavigationStep: (instruction: GenerateTurnByTurnOutput) => void; 
  onNavigationFinish: () => void;
  onRouteSelect: (route: Route) => void;
}) {
  const config = getConfig();
  if (!config.googleMapsApiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-muted">
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Google Maps API key is missing. Please add it to your environment file to display the map.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <Wrapper apiKey={config.googleMapsApiKey} render={render} libraries={['geocoding', 'places', 'marker', 'geometry']}>
      <MapComponent 
        activeRoute={activeRoute} 
        allRoutes={allRoutes} 
        isNavigating={isNavigating} 
        onNavigationStep={onNavigationStep} 
        onNavigationFinish={onNavigationFinish}
        onRouteSelect={onRouteSelect}
      />
    </Wrapper>
  );
}


function MapComponent({ activeRoute, allRoutes, isNavigating, onNavigationStep, onNavigationFinish, onRouteSelect }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  
  // Refs for map objects
  const polylinesRef = useRef<Map<Route, google.maps.Polyline>>(new Map());
  const startMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const endMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  
  const watchIdRef = useRef<number | null>(null);
  const currentLegIndexRef = useRef<number>(0);
  const isFetchingInstruction = useRef(false);

  const { toast } = useToast();

  // Initialize Map
  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
        mapId: 'NEURO_NAV_MAP',
        disableDefaultUI: true,
        zoomControl: true,
      }));
    }
  }, [ref, map]);

  // Draw routes and markers
  useEffect(() => {
    if (!map) return;

    const drawElements = async () => {
      // Clear previous polylines
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current.clear();

      // Clear previous markers
      if (startMarkerRef.current) startMarkerRef.current.map = null;
      if (endMarkerRef.current) endMarkerRef.current.map = null;

      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      const bounds = new google.maps.LatLngBounds();

      // Draw all routes
      allRoutes.forEach(route => {
        const isSelected = activeRoute?.routeDescription === route.routeDescription;
        const polyline = new google.maps.Polyline({
          path: route.path,
          geodesic: true,
          strokeColor: isSelected ? "#4285F4" : "#808080",
          strokeOpacity: isSelected ? 0.9 : 0.7,
          strokeWeight: isSelected ? 8 : 6,
          zIndex: isSelected ? 2 : 1,
          clickable: true,
        });

        polyline.addListener('click', () => onRouteSelect(route));
        polyline.setMap(map);
        polylinesRef.current.set(route, polyline);

        // Extend bounds only for the active route to set the initial view
        if (isSelected) {
            route.path.forEach(point => bounds.extend(point));
        }
      });
      
      // Draw markers for the active route
      if (activeRoute && activeRoute.path.length > 0) {
        const startPin = new PinElement({ background: '#10B981', borderColor: '#FFFFFF', glyphColor: '#FFFFFF' });
        startMarkerRef.current = new AdvancedMarkerElement({ position: activeRoute.path[0], map, title: 'Start', content: startPin.element });
        
        const endPin = new PinElement({ background: '#EF4444', borderColor: '#FFFFFF', glyphColor: '#FFFFFF' });
        endMarkerRef.current = new AdvancedMarkerElement({ position: activeRoute.path[activeRoute.path.length - 1], map, title: 'End', content: endPin.element });
        
        // If bounds are empty (e.g., only one route), extend for it
        if (bounds.isEmpty()) {
            activeRoute.path.forEach(point => bounds.extend(point));
        }
      }
      
      if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 100);
      }
    };
    drawElements();

  }, [map, allRoutes, activeRoute, onRouteSelect]);

  const stopNavigationTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const getAndSpeakInstruction = useCallback(async (legIndex: number) => {
    if (!activeRoute || isFetchingInstruction.current) return;

    isFetchingInstruction.current = true;
    const routePath = activeRoute.path;
    const isLast = legIndex >= routePath.length - 2;

    try {
        const result = await fetchTurnByTurnInstruction({
            from: routePath[legIndex],
            to: routePath[legIndex + 1],
            isLastStep: isLast,
        });

        if ('instruction' in result) {
            onNavigationStep(result);
            if (isLast) {
              onNavigationFinish();
              stopNavigationTracking();
            }
        } else {
            toast({ variant: 'destructive', title: 'Instruction Error', description: result.error });
        }
    } catch(e) {
         toast({ variant: 'destructive', title: 'Instruction Error', description: "Could not fetch instruction." });
    } finally {
        isFetchingInstruction.current = false;
    }
}, [activeRoute, onNavigationStep, onNavigationFinish, stopNavigationTracking, toast]);

  // Handle Real-time Navigation
  useEffect(() => {
    if (!isNavigating || !map || !activeRoute) {
      stopNavigationTracking();
      if (userMarkerRef.current) userMarkerRef.current.map = null;
      return;
    }

    currentLegIndexRef.current = 0;
    const routePathLatLng = activeRoute.path.map(p => new google.maps.LatLng(p.lat, p.lng));

    const initNavigation = async () => {
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        const userPin = new PinElement({ background: '#1A73E8', borderColor: '#FFFFFF', glyphColor: '#FFFFFF', scale: 1.2 });
        userMarkerRef.current = new AdvancedMarkerElement({ map, content: userPin.element, zIndex: 10 });
        
        getAndSpeakInstruction(0);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const newPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                if (userMarkerRef.current) userMarkerRef.current.position = newPos;
                map.panTo(newPos);

                const currentLegIndex = currentLegIndexRef.current;
                const nextLegStartPoint = routePathLatLng[currentLegIndex + 1];

                if (nextLegStartPoint) {
                    // Check if user is close to the next point in the path
                    const distanceToNextPoint = google.maps.geometry.spherical.computeDistanceBetween(newPos, nextLegStartPoint);
                    
                    if (distanceToNextPoint < 25) { // 25 meters threshold
                        const newLegIndex = currentLegIndex + 1;
                        if (newLegIndex < activeRoute.path.length -1) {
                            currentLegIndexRef.current = newLegIndex;
                            getAndSpeakInstruction(newLegIndex);
                        } else {
                            onNavigationFinish();
                            stopNavigationTracking();
                        }
                    }
                }
            },
            (error) => {
                toast({ variant: 'destructive', title: 'Location Error', description: error.message });
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    initNavigation();
    return () => stopNavigationTracking();
}, [isNavigating, map, activeRoute, toast, stopNavigationTracking, getAndSpeakInstruction, onNavigationFinish]);

  return <div ref={ref} id="map" className="h-full w-full" />;
}
