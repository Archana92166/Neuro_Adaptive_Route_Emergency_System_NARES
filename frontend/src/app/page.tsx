"use client";

import { useState, useEffect, useRef } from "react";
import type { RoutePreferences } from "@/lib/types";
import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ArrowRight,
  EyeOff,
  Map,
  Wind,
  LocateFixed,
  Play,
  Pause,
} from "lucide-react";
import RouteForm from "@/components/neuronav/route-form";
import { RouteResults } from "@/components/neuronav/route-results";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";


interface NeuroRoute {
  routeId: string;
  summary: string;
  path: google.maps.LatLngLiteral[];
  distanceText: string;
  durationText: string;
  sensoryScore: number;
  sensoryFlags: string[];
}
 
export default function NeuroNavPage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);

  const [suggestions, setSuggestions] = useState<NeuroRoute[] | null>(null);

  const [currentPreferences, setCurrentPreferences] =
    useState<RoutePreferences | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { user } = useAuth();
   const [routes, setRoutes] = useState<any[] | null>(null);

  /* ---------- Sensory Mode ---------- */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isSensoryMode);
  }, [isSensoryMode]);

  /* ---------- Video Autoplay ---------- */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  /* ---------- FIXED FEATURES (NO ADAPTIVE CLAIMS) ---------- */
  const features = [
    {
      icon: Map,
      title: "Real-Time Map Navigation",
      description:
        "View live maps and routes between locations using Google Maps.",
    },
    {
      icon: LocateFixed,
      title: "Automatic Current Location",
      description:
        "Instantly detect and use your current location without manual input.",
    },
    {
      icon: Wind,
      title: "Calm & Clear Guidance",
      description:
        "Minimal, distraction-free navigation with optional voice assistance.",
    },
    {
      icon: EyeOff,
      title: "Low-Stimulation Interface",
      description:
        "Clean and simple UI designed to reduce visual and cognitive overload.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors">
      <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />

      <main className="flex-grow">
        {/* ---------- Hero ---------- */}
        <section className="relative h-[60vh] flex items-center justify-center text-white bg-black">
          <video
            ref={videoRef}
            src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/50" />
          <button
            onClick={handlePlayPause}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <div className="z-10 text-center">
            <h1 className="text-5xl font-bold">Navigate with Ease</h1>
            <p className="mt-4 text-lg">
              Simple, clear, real-time navigation for everyday use.
            </p>
          </div>
        </section>

        {/* ---------- IMAGE + INFO SECTION (RESTORED) ---------- */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Navigation Help Starts Here
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  This system allows users to enter any source and destination
                  or instantly use their current location to plan routes.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  With live map rendering, clear route paths, and optional
                  voice guidance, the focus is on simplicity, clarity,
                  and usability.
                </p>
              </div>

              <div className="md:w-1/2">
                <Image
                  src="https://placehold.co/600x400/C8B6E2/311847.png"
                  alt="Navigation overview"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FEATURES SECTION ---------- */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              What Makes This Stand Out
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-primary/20 p-4 rounded-full">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- ROUTE FINDER ---------- */}
        <section id="route-finder" className="py-16">
          <div className="container mx-auto grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Plan Your Route</CardTitle>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <RouteForm
                      setRoutes={(routesArray) => {
                        setRoutes(routesArray);
                        setError(null);
                        setIsLoading(false);
                      }}
                      setLoading={setIsLoading}
                      setError={setError}
                    />
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Login required to plan routes.
                      </p>
                      <Link href="/login">
                        <Button className="w-full">Login</Button>
                      </Link>
                      <Link href="/signup">
                        <Button variant="secondary" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-8">
              <RouteResults
                routes={routes}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-slate-800 text-slate-300">
        <div className="container mx-auto py-10">
          <Separator className="my-6 bg-slate-700" />
          <p className="text-center text-sm">
            © {new Date().getFullYear()} NeuroNav. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
