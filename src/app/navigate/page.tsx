
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { NeuroNavMap } from "@/components/neuronav/map";
import { useToast } from "@/hooks/use-toast";
import type { AdaptiveRouteSuggestionsOutput, RoutePreferences } from "@/lib/types";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Navigation, X, Share, Bookmark, MoreVertical, ArrowLeft, Wind, Car, TramFront, Footprints } from "lucide-react";
import Link from "next/link";
import React from 'react';
import type { GenerateTurnByTurnOutput } from "@/ai/flows/generate-turn-by-turn";
import { NavigationControls } from "@/components/neuronav/navigation-controls";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { fetchAudio } from "../actions";

type Route = AdaptiveRouteSuggestionsOutput["suggestedRoutes"][0];

function NavigatePageContent() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [allRoutes, setAllRoutes] = useState<Route[]>([]);
    const [activeRoute, setActiveRoute] = useState<Route | null>(null);
    const [preferences, setPreferences] = useState<RoutePreferences | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [currentInstruction, setCurrentInstruction] = useState<GenerateTurnByTurnOutput | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const { toast } = useToast();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const instructionQueueRef = useRef<string[]>([]);
    const isSpeakingRef = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio();
            audioRef.current.onended = () => {
                isSpeakingRef.current = false;
                playNextInQueue();
            };
        }
    }, []);

    const playNextInQueue = useCallback(() => {
        if (isSpeakingRef.current || instructionQueueRef.current.length === 0) {
            return;
        }
        isSpeakingRef.current = true;
        const nextInstruction = instructionQueueRef.current.shift();
        if (nextInstruction) {
             fetchAudio(nextInstruction).then(result => {
                if ('audioDataUri' in result && audioRef.current && isAudioEnabled) {
                    audioRef.current.src = result.audioDataUri;
                    audioRef.current.play().catch(e => {
                        console.error("Audio play failed:", e);
                        isSpeakingRef.current = false;
                    });
                } else {
                     isSpeakingRef.current = false;
                }
             });
        }
    }, [isAudioEnabled]);

    const speakInstruction = useCallback((instruction: string) => {
        instructionQueueRef.current.push(instruction);
        playNextInQueue();
    }, [playNextInQueue]);


    useEffect(() => {
        const routesData = localStorage.getItem("neuroNavRoutes");
        const activeRouteData = localStorage.getItem("neuroNavActiveRoute");
        const prefsData = localStorage.getItem("neuroNavPreferences");

        try {
            if(routesData) setAllRoutes(JSON.parse(routesData));
            if(activeRouteData) setActiveRoute(JSON.parse(activeRouteData));
            if(prefsData) setPreferences(JSON.parse(prefsData));
        } catch (error) {
            console.error("Failed to parse route data from localStorage", error);
            toast({ variant: "destructive", title: "Could not load route", description: "The route data was corrupted." });
        }
        
    }, [toast]);

    const handleStartNavigation = () => {
        if (activeRoute) {
            setIsNavigating(true);
            const startInstruction = {instruction: "Starting navigation... Acquiring GPS signal.", icon: "arrow-up" as const};
            setCurrentInstruction(startInstruction);
            speakInstruction(startInstruction.instruction);
        }
    }

    const handleStopNavigation = () => {
        setIsNavigating(false);
        setCurrentInstruction(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        instructionQueueRef.current = [];
        isSpeakingRef.current = false;
        toast({ title: "Navigation Ended", description: "You have stopped the navigation." });
    }

    const handleNavigationStep = useCallback((instructionData: GenerateTurnByTurnOutput) => {
        setCurrentInstruction(instructionData);
        speakInstruction(instructionData.instruction);
    }, [speakInstruction]);

    const handleNavigationFinish = useCallback(() => {
        setIsNavigating(false);
        const finalMessage = { instruction: "You have arrived at your destination.", icon: 'flag' as const};
        setCurrentInstruction(finalMessage);
        speakInstruction(finalMessage.instruction);
        toast({ title: "Navigation Complete", description: "You have arrived at your destination." });
    }, [speakInstruction, toast]);

    const handleRouteSelect = (route: Route) => {
        setActiveRoute(route);
        localStorage.setItem("neuroNavActiveRoute", JSON.stringify(route));
    }

    const handleToggleAudio = () => {
        setIsAudioEnabled(prev => !prev);
        if (isAudioEnabled && audioRef.current) {
            audioRef.current.pause();
            isSpeakingRef.current = false;
        }
    }

    if (!allRoutes.length || !preferences) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
                <main className="flex-grow flex items-center justify-center text-center">
                    <div>
                        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
                        <h1 className="mt-4 text-xl font-semibold">Loading Routes...</h1>
                        <p className="mt-2 text-muted-foreground">If you are not redirected, please select a route again.</p>
                        <Link href="/#route-finder" passHref>
                           <Button variant="outline" className="mt-4">Go Back</Button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    const displayedRoute = activeRoute || allRoutes[0];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
            <main className="flex-grow lg:grid lg:grid-cols-12 relative">
                <div className="lg:col-span-12 h-screen relative">
                    <NeuroNavMap
                        activeRoute={displayedRoute}
                        allRoutes={allRoutes}
                        isNavigating={isNavigating}
                        onNavigationStep={handleNavigationStep}
                        onNavigationFinish={handleNavigationFinish}
                        onRouteSelect={handleRouteSelect}
                    />

                    <AnimatePresence>
                    {!isNavigating && (
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.2)]"
                        >
                            <div className="p-4 space-y-4">
                               <div className="text-center">
                                    <h3 className="text-2xl font-bold">{displayedRoute.estimatedTime}</h3>
                                    <p className="text-muted-foreground text-sm">{displayedRoute.routeDescription}</p>
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    <Button onClick={handleStartNavigation} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                                        <Navigation className="mr-2"/> Start
                                    </Button>
                                    <Button variant="secondary" size="lg" className="rounded-full"><Share className="mr-2"/> Share</Button>
                                    <Button variant="secondary" size="lg" className="rounded-full"><Bookmark className="mr-2"/> Save</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <div className="absolute top-4 left-4 right-4">
                        <AnimatePresence>
                        {isNavigating && currentInstruction && (
                            <NavigationControls
                                currentInstruction={currentInstruction}
                                onStop={handleStopNavigation}
                                onToggleAudio={handleToggleAudio}
                                isAudioEnabled={isAudioEnabled}
                           />
                        )}
                        </AnimatePresence>
                        {!isNavigating && (
                            <Card className="shadow-lg">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Link href="/" passHref>
                                            <Button variant="ghost" size="icon"><ArrowLeft/></Button>
                                        </Link>
                                        <div className="flex-grow space-y-2">
                                            <p className="border-b pb-2 text-sm">Your location</p>
                                            <p className="text-sm">{preferences.endLocation}</p>
                                        </div>
                                         <Button variant="ghost" size="icon"><MoreVertical/></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function NavigatePage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <NavigatePageContent />
        </React.Suspense>
    )
}
