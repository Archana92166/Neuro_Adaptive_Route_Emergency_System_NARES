
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Map, SlidersHorizontal, UserCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const features = [
    {
        icon: BrainCircuit,
        title: "AI-Powered Route Analysis",
        description: "At the core of NeuroNav is a sophisticated AI model trained to understand and predict sensory challenges. When you request a route, our AI analyzes multiple data sources—including real-time traffic, public transit schedules, user-submitted reports, and environmental data—to identify potential sensory triggers like loud noises, bright lights, or dense crowds."
    },
    {
        icon: Map,
        title: "Dynamic Sensory Scoring",
        description: "Each potential route segment is assigned a 'Sensory Score' based on the intensity and type of sensory input. A quiet, tree-lined street will have a very low score, while a busy intersection with ongoing construction will have a high score. The AI dynamically adjusts these scores based on the time of day and live conditions."
    },
    {
        icon: SlidersHorizontal,
        title: "Personalized Preference Matching",
        description: "Your personal sensory preferences are the most important factor. Our system cross-references the scored routes with your specific sensitivities. If you've indicated a high sensitivity to crowds, routes passing through busy public squares will be deprioritized, even if they are the most direct."
    },
    {
        icon: UserCheck,
        title: "Community-Driven Feedback Loop",
        description: "NeuroNav is a living system that learns and improves with every user's journey. After a trip, you can provide feedback on the accuracy of our sensory predictions. This data is anonymized and used to retrain our AI models, making future recommendations even more accurate for the entire community."
    }
];

export default function HowItWorksPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-secondary/40">
            <AppHeader
                isSensoryMode={isSensoryMode}
                onSensoryModeChange={setIsSensoryMode}
            />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-background py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">The Science of a Calmer Journey</h1>
                        <p className="mt-4 text-lg max-w-3xl mx-auto text-muted-foreground">
                            Discover the innovative technology that powers NeuroNav's ability to create personalized, sensory-friendly routes.
                        </p>
                    </div>
                </section>

                {/* Core Technology Section */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="relative aspect-video">
                                <Image
                                    src="https://placehold.co/600x450.png"
                                    alt="Abstract network of data points and routes"
                                    fill
                                    objectFit="cover"
                                    className="rounded-lg shadow-lg"
                                    data-ai-hint="abstract data network"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold font-headline">
                                    Blending AI with Empathy
                                </h2>
                                <p className="mt-6 text-lg text-muted-foreground">
                                    NeuroNav isn't just another mapping service. It's an intelligent companion designed with a deep understanding of neurodiversity. We leverage cutting-edge artificial intelligence, but our goal is always human-centric: to reduce anxiety and empower you to navigate the world with confidence. We combine data-driven insights with a compassionate approach to build a tool that truly understands and adapts to your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">How It Works, Step by Step</h2>
                            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                                Here’s a breakdown of the process that happens every time you plan a route.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature) => (
                                <Card key={feature.title} className="flex items-start gap-6 p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-3 bg-primary/20 rounded-full mt-1">
                                         <feature.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                                        <CardContent className="p-0 text-muted-foreground">
                                            {feature.description}
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
