
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Rocket, Milestone } from "lucide-react";
import { useState } from "react";

const updates = [
    {
        version: "v1.2.0",
        date: "October 26, 2023",
        title: "Introducing: Cognitive Games",
        description: "We're excited to launch a new suite of cognitive training games like Sensory Matching and Rhythm & Flow to help sharpen focus and processing skills. Plus, a complete redesign of the user dashboard!",
        tags: ["New Feature", "Enhancement", "UI/UX"]
    },
    {
        version: "v1.1.5",
        date: "October 12, 2023",
        title: "First Aid & Nearby Care",
        description: "A new 'First Aid & Nearby Care' section has been added to the Emergency & Support menu, providing quick access to essential guides and a tool to find nearby medical services.",
        tags: ["New Feature", "Safety"]
    },
    {
        version: "v1.1.0",
        date: "September 28, 2023",
        title: "Improved Geolocation & Map Accuracy",
        description: "Backend updates to improve the speed and accuracy of our geolocation services. Maps now load faster and route polylines are smoother.",
        tags: ["Enhancement", "Performance"]
    },
    {
        version: "v1.0.0",
        date: "September 1, 2023",
        title: "NeuroNav Is Live!",
        description: "Welcome to NeuroNav! Our initial release features AI-powered adaptive routing, sensory-friendly UI modes, and personalized route suggestions. We're so excited to have you on this journey with us.",
        tags: ["Launch", "Core Feature"]
    },
];

export default function UpdatesPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader
                isSensoryMode={isSensoryMode}
                onSensoryModeChange={setIsSensoryMode}
            />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
                            <Rocket className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">Updates & New Features</h1>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                            We're constantly working to improve NeuroNav. Here's a log of our latest enhancements, fixes, and new features.
                        </p>
                    </div>
                    
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-5 md:left-1/2 top-5 h-full w-0.5 bg-border -translate-x-1/2"></div>
                        
                        <div className="space-y-12">
                            {updates.map((update, index) => (
                                <div key={index} className="relative pl-10 md:pl-0">
                                    <div className="md:flex items-start md:gap-8">
                                        <div className="hidden md:block md:w-1/2 md:text-right">
                                           {index % 2 === 0 && <UpdateCard {...update} />}
                                        </div>
                                        <div className="absolute left-5 top-2 md:left-1/2 h-5 w-5 bg-primary rounded-full -translate-x-1/2 flex items-center justify-center ring-8 ring-background">
                                            <Milestone className="h-3 w-3 text-primary-foreground" />
                                        </div>
                                         <div className="md:w-1/2 md:text-left">
                                           {index % 2 !== 0 && <UpdateCard {...update} />}
                                           <div className="md:hidden mt-4">
                                               <UpdateCard {...update} />
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const UpdateCard = (update: typeof updates[0]) => (
     <Card className="shadow-md hover:shadow-lg transition-shadow animate-in fade-in-50">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>{update.title}</CardTitle>
                <Badge variant="outline">{update.version}</Badge>
            </div>
            <CardDescription>{update.date}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm mb-4">{update.description}</p>
            <div className="flex flex-wrap gap-2">
                {update.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
        </CardContent>
    </Card>
)
