
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Headphones, Map, Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const tips = [
  {
    icon: Map,
    title: "Plan Your Route in Advance",
    description: "Use NeuroNav to check your route before you leave. Knowing the sensory score and potential challenges can mentally prepare you and reduce anxiety. Look for routes with lower scores, even if they take a bit longer.",
  },
  {
    icon: Headphones,
    title: "Pack a Sensory Toolkit",
    description: "Never leave without your essentials. Noise-cancelling headphones, sunglasses, a fidget toy, or even a comforting scent can be lifesavers when you feel overwhelmed. Keep them in a small, accessible bag.",
  },
  {
    icon: Clock,
    title: "Travel During Off-Peak Hours",
    description: "If your schedule allows, try to travel when public transport and roads are less crowded. Even a 30-minute shift in your travel time can make a significant difference in noise levels and the number of people you encounter.",
  },
  {
    icon: Eye,
    title: "Practice Mindful Observation",
    description: "Instead of letting the environment overwhelm you, try to focus on one neutral object—like the pattern on a seat, the clouds in the sky, or your own hands. This can help ground you and reduce the impact of chaotic surroundings.",
  },
];


export default function CalmerCommutePage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader
                isSensoryMode={isSensoryMode}
                onSensoryModeChange={setIsSensoryMode}
            />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                 <div className="max-w-4xl mx-auto">
                    <Link href="/tips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft size={16} />
                        Back to Tips & Guides
                    </Link>

                    <article>
                        <header className="mb-8">
                            <p className="text-primary font-semibold">Navigating Spaces</p>
                            <h1 className="text-4xl md:text-5xl font-bold font-headline mt-2 mb-4">5 Tips for a Calmer Commute</h1>
                            <p className="text-xl text-muted-foreground">
                                Learn how to prepare for your daily commute to minimize sensory triggers and arrive at your destination feeling centered.
                            </p>
                        </header>

                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                           <Image src="https://placehold.co/1200x675.png" alt="A calm public transport scene" fill objectFit="cover" data-ai-hint="calm public transport" />
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                            <p className="lead">
                                For many neurodivergent individuals, the daily commute can feel like a gauntlet of sensory challenges. The unpredictable noises, bright lights, and dense crowds can drain your energy before the day has even begun. However, with a bit of preparation and the right strategies, you can transform your journey into a more peaceful and manageable experience.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                                {tips.map((tip, index) => (
                                    <Card key={index} className="flex items-start gap-4 p-6 bg-card/50">
                                        <div className="p-2 bg-primary/20 rounded-full">
                                            <tip.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                                            <p className="text-muted-foreground">{tip.description}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <h2 className="font-headline text-3xl mt-12 mb-4">Your Journey, Your Terms</h2>

                            <p>
                                Remember, the goal is not to eliminate all sensory input, but to manage it in a way that works for you. By taking proactive steps and using tools like NeuroNav, you can regain a sense of control over your environment. Every small adjustment is a victory. Be patient with yourself, experiment with different strategies, and celebrate the progress you make in crafting a commute that supports your well-being.
                            </p>
                        </div>
                    </article>
                </div>
            </main>
             <style jsx global>{`
                .prose {
                    line-height: 1.7;
                }
                .prose p.lead {
                    font-size: 1.25em;
                    color: hsl(var(--muted-foreground));
                }
             `}</style>
        </div>
    )
}
