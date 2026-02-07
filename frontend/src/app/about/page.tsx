
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Heart, Lightbulb, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


const teamMembers = [
    { name: "Alex Johnson", role: "Founder & CEO", initials: "AJ", avatar: "https://placehold.co/100x100.png", hint: "professional portrait" },
    { name: "Dr. Maria Garcia", role: "Lead Neurodiversity Researcher", initials: "MG", avatar: "https://placehold.co/100x100.png", hint: "scientist portrait" },
    { name: "Sam Chen", role: "Lead Developer", initials: "SC", avatar: "https://placehold.co/100x100.png", hint: "developer portrait" },
    { name: "Priya Singh", role: "UX/UI Designer", initials: "PS", avatar: "https://placehold.co/100x100.png", hint: "designer portrait" },
]


export default function AboutPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <AppHeader
                isSensoryMode={isSensoryMode}
                onSensoryModeChange={setIsSensoryMode}
            />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-24 md:py-40 text-center overflow-hidden bg-black">
                     <div className="absolute top-0 left-0 w-full h-full z-0">
                        <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full -top-20 -left-40 animate-pulse-slow-1"></div>
                        <div className="absolute w-72 h-72 bg-purple-500/10 rounded-full -bottom-20 -right-20 animate-pulse-slow-2"></div>
                         <div className="absolute w-56 h-56 bg-sky-500/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow-3"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">Crafted with Love, for Every Mind</h1>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                            We're a passionate team dedicated to building technology that empowers, supports, and celebrates the unique brilliance of neurodiversity.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 md:py-24 bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
                                    <Lightbulb className="text-yellow-400" size={36}/> Our Mission
                                </h2>
                                <p className="mt-6 text-lg text-gray-400">
                                    Our mission is to create beautiful and accessible tools that empower neurodivergent individuals to navigate the world with confidence. We believe in technology that adapts to people, unlocking the creative potential of every young mind. By blending thoughtful design with AI, we aim to reduce sensory overload and foster independence.
                                </p>
                                <p className="mt-4 text-lg text-gray-400">
                                    Every feature in NeuroNav is designed with empathy, informed by research, and tested with our community. We aren't just building an app; we're nurturing a companion for your journey.
                                </p>
                            </div>
                            <div className="relative aspect-square">
                                <Image 
                                    src="https://placehold.co/600x600.png" 
                                    alt="Creative and diverse young minds collaborating on a project" 
                                    fill
                                    objectFit="cover"
                                    className="rounded-lg shadow-2xl shadow-teal-500/10"
                                    data-ai-hint="creative minds brainstorming"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 md:py-24 bg-black/50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline flex items-center justify-center gap-3">
                           <Users className="text-sky-400" size={36} /> Meet the Team
                        </h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-400">
                            We are researchers, developers, designers, and advocates for the neurodivergent community, united by a shared vision.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                            {teamMembers.map((member) => (
                                <div key={member.name} className="flex flex-col items-center">
                                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-purple-500/50">
                                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
                                        <AvatarFallback>{member.initials}</AvatarFallback>
                                    </Avatar>
                                    <h4 className="mt-4 font-bold text-lg">{member.name}</h4>
                                    <p className="text-sm text-purple-400">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 text-center bg-gray-900">
                    <div className="container mx-auto px-4">
                         <h2 className="text-3xl font-bold font-headline">Join Our Journey</h2>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-400">
                           Help us shape the future of neuro-inclusive technology. Check out our open-source project, share your story, and be part of a community that cares.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Button size="lg" variant="outline" className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black">
                                <Github className="mr-2"/> View on GitHub
                            </Button>
                            <Button size="lg" variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-200 hover:text-black">
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
