
"use client";

import { useState, useEffect, useRef } from "react";
import type { AdaptiveRouteSuggestionsOutput } from "@/ai/flows/adaptive-route-suggestions";
import { getAdaptiveRoutes } from "@/app/actions";
import type { RoutePreferences } from "@/lib/types";
import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, EyeOff, Map, Wind, Facebook, Instagram, Linkedin, Twitter, Youtube, Play, Pause, LocateFixed, Github } from "lucide-react";
import { RouteForm } from "@/components/neuronav/route-form";
import { RouteResults } from "@/components/neuronav/route-results";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { NeuroNavLogo } from "@/components/neuronav/icons";
import { useAuth } from "@/contexts/auth-context";


export default function NeuroNavPage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);
  const [suggestions, setSuggestions] = useState<AdaptiveRouteSuggestionsOutput | null>(null);
  const [currentPreferences, setCurrentPreferences] = useState<RoutePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (isSensoryMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isSensoryMode]);

  useEffect(() => {
    // Try to play the video programmatically on mount
    if (videoRef.current) {
        videoRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(err => {
            // Autoplay was prevented.
            setIsPlaying(false);
            console.error("Autoplay prevented: ", err);
        });
    }
  }, []);

  const handleRouteSubmit = async (data: RoutePreferences) => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    setCurrentPreferences(data);
    const result = await getAdaptiveRoutes(data);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSuggestions(result);
    }
    setIsLoading(false);
  };

  const scrollToForm = () => {
    const formSection = document.getElementById("route-finder");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const features = [
    {
      icon: Map,
      title: "Adaptive Routing",
      description: "Find paths that avoid sensory triggers like loud noises, bright lights, and crowds.",
    },
    {
      icon: Wind,
      title: "Calm Mode",
      description: "Activate a calming environment with guided breathing and relaxing sounds.",
    },
    {
      icon: EyeOff,
      title: "Low-Stimulation UI",
      description: "Reduce visual clutter with a sensory-friendly interface.",
    },
     {
      icon: LocateFixed,
      title: "Precise Location",
      description: "Use your exact location for emergencies and route planning.",
    },
  ];

  return (
    <div
      className={`flex flex-col min-h-screen bg-background font-body transition-colors duration-300`}
    >
      <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-black">
          <video
            ref={videoRef}
            src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
            loop
            muted
            playsInline
            className="absolute z-0 w-full h-full object-cover opacity-40"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <button
              onClick={handlePlayPause}
              className="absolute top-4 right-4 z-30 text-white p-2 rounded-full bg-black/20 hover:bg-black/50 transition-colors"
              aria-label={isPlaying ? "Pause video" : "Play video"}
          >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <div className="z-20 p-4 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">
              Navigate with Ease
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
              NeuroNav offers adaptive routing designed for sensory-friendly
              journeys.
            </p>
          </div>
        </section>

        {/* Navigation Help Section */}
        <section id="navigation-help" className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                  Navigation Help Starts Here
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  NeuroNav is designed to make every journey predictable and
                  comfortable. Our intelligent routing system analyzes your
                  sensory preferences to find paths that avoid overwhelming
                  environments. Whether you need to steer clear of bustling
                  crowds, loud construction sites, or jarringly bright lights,
                  we help you find a route that works for you.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  With real-time map visualization and clear, step-by-step
                  guidance, you can travel with confidence. We empower you to
                  explore the world on your own terms, reducing anxiety and
                  ensuring a calmer travel experience from start to finish.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="https://placehold.co/600x400/C8B6E2/311847.png"
                  alt="A person looking at a map, feeling confident and calm"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  data-ai-hint="diverse minds learning"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Calm and Control Section */}
        <section id="calm-and-control" className="py-12 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                  Designed for Calm and Control
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Your comfort is our priority. NeuroNav offers a suite of tools designed to give you control over your sensory environment. Activate our low-stimulation interface to reduce visual distractions, or engage with our in-app breathing exercises if you start to feel overwhelmed.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                   Customize your navigation experience with adjustable voice guidance and personalized alert settings. Our goal is to provide a tool that adapts not just to the road, but to your needs in the moment, ensuring every journey is as stress-free as possible.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="https://placehold.co/600x400/B6E2D3/184731.png"
                  alt="A serene person using a simple, clear app on their phone"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  data-ai-hint="learning through play"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose NeuroNav Section */}
        <section id="why-choose-us" className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-12">
              Why Choose NeuroNav?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-primary/20 p-4 rounded-full">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
             <Button size="lg" className="mt-12" onClick={scrollToForm}>
              Plan Your First Route <ArrowRight className="ml-2"/>
            </Button>
          </div>
        </section>

        {/* Route Finder Section */}
        <section id="route-finder" className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center text-foreground mb-12">
              Find Your Flow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 lg:col-span-3">
                <Card className="shadow-lg sticky top-24">
                  <CardHeader>
                    <CardTitle>Plan Your Route</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                        <RouteForm onSubmit={handleRouteSubmit} isLoading={isLoading} />
                    ) : (
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-muted-foreground">Please log in or sign up to use the route planner and access personalized features.</p>
                            <div className="flex flex-col gap-2">
                                <Link href="/login" passHref>
                                    <Button className="w-full">Login</Button>
                                </Link>
                                <Link href="/signup" passHref>
                                    <Button variant="secondary" className="w-full">Sign Up</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-8 lg:col-span-9">
                <RouteResults
                  suggestions={suggestions}
                  isLoading={isLoading}
                  error={error}
                  preferences={currentPreferences}
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-slate-800 text-slate-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
               <div className="flex items-center gap-2">
                    <NeuroNavLogo className="h-8 w-8" />
                    <span className="font-bold text-xl text-white">NeuroNav</span>
               </div>
                <p className="mt-4 text-sm">Your partner in sensory-friendly navigation.</p>
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wider">About NeuroNav</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white">Media Requests</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-bold text-white tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/stories" className="hover:text-white">Peer Stories</Link></li>
                <li><Link href="/tips" className="hover:text-white">Tips & Guides</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wider">For Users</h3>
              <ul className="mt-4 space-y-2 text-sm">
                 <li><Link href="/login" className="hover:text-white">Login</Link></li>
                <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="#" className="hover:text-white">User Portal</Link></li>
                <li><Link href="#" className="hover:text-white">Get the App</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wider">Follow Us</h3>
                <div className="flex mt-4 space-x-4">
                  <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><Twitter className="h-6 w-6 hover:text-white" /></a>
                  <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><Youtube className="h-6 w-6 hover:text-white" /></a>
                  <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook className="h-6 w-6 hover:text-white" /></a>
                  <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin className="h-6 w-6 hover:text-white" /></a>
                  <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram className="h-6 w-6 hover:text-white" /></a>
                  <a href="#" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><Github className="h-6 w-6 hover:text-white" /></a>
                </div>
            </div>
          </div>
          <Separator className="my-8 bg-slate-700" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} NeuroNav. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white">Terms & Conditions</Link>
                <Link href="#" className="hover:text-white">Privacy Policy</Link>
                <Link href="#" className="hover:text-white">Accessibility</Link>
                <Link href="#" className="hover:text-white">Site Map</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
