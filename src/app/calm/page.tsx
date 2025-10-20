
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Waves, TreePine, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

const sounds = {
    rain: "https://www.soundjay.com/nature/rain-01.mp3",
    forest: "https://www.soundjay.com/nature/forest-01.mp3",
}

export default function CalmPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const playSound = (sound: keyof typeof sounds) => {
        if (audioRef.current) {
            audioRef.current.src = sounds[sound];
            audioRef.current.play();
        }
    }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
      <div className="relative flex-grow flex flex-col items-center justify-center p-4">
        <Image
          src="https://picsum.photos/seed/calm/1920/1080"
          alt="Abstract calm background with soft gradients"
          fill
          objectFit="cover"
          className="z-0 opacity-20 blur-sm"
          data-ai-hint="calm abstract gradient"
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        <div className="z-20 w-full max-w-2xl text-center flex flex-col items-center">
            <h1 className="text-4xl font-headline mb-2">The Calm Room</h1>
            <p className="text-lg text-muted-foreground mb-8">Choose an activity to find your center.</p>

            <Tabs defaultValue="breathe" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10 text-white/80">
                    <TabsTrigger value="breathe" className="gap-2"><Wind size={16}/> Breathe</TabsTrigger>
                    <TabsTrigger value="sounds" className="gap-2"><Waves size={16}/> Sounds</TabsTrigger>
                    <TabsTrigger value="visuals" className="gap-2"><Sparkles size={16}/> Visuals</TabsTrigger>
                </TabsList>
                <TabsContent value="breathe" className="mt-8 flex flex-col items-center">
                     <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        <div className="absolute w-full h-full rounded-full bg-blue-400/30 animate-pulse-slow"></div>
                        <div
                        className="absolute w-full h-full rounded-full bg-purple-400/50 animate-breath"
                        ></div>
                        <span className="text-lg md:text-xl font-medium tracking-wider uppercase">Breathe</span>
                    </div>
                    <p className="mt-8 text-lg max-w-xl">
                        Focus on your breath. Inhale as the circle expands, and exhale as it contracts.
                    </p>
                </TabsContent>
                <TabsContent value="sounds" className="mt-8">
                    <p className="text-lg mb-4">Listen to some calming ambient sounds.</p>
                     <div className="flex justify-center gap-4">
                        <Button variant="outline" className="bg-transparent text-white" onClick={() => playSound('rain')}>
                            <Waves className="mr-2"/> Rain
                        </Button>
                        <Button variant="outline" className="bg-transparent text-white" onClick={() => playSound('forest')}>
                            <TreePine className="mr-2"/> Forest
                        </Button>
                     </div>
                     <audio ref={audioRef} loop className="mx-auto mt-4 w-full max-w-xs"/>
                </TabsContent>
                <TabsContent value="visuals" className="mt-8">
                     <div className="w-full aspect-video rounded-lg overflow-hidden relative flex items-center justify-center bg-gray-900/50">
                        <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-fuchsia-500 rounded-full animate-pulse-slow-3 blur-2xl"></div>
                        <div className="w-48 h-48 bg-gradient-to-br from-sky-400 to-rose-500 rounded-lg animate-pulse-slow-2 blur-3xl absolute opacity-70"></div>
                     </div>
                     <p className="mt-4 text-lg">Watch the colors slowly shift and blend.</p>
                </TabsContent>
            </Tabs>
        </div>

         <div className="z-20 mt-12">
            <Link href="/" passHref>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                Return to Home
                </Button>
            </Link>
         </div>
      </div>
    </div>
  );
}
