
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { BetaSignUpForm } from "@/components/neuronav/beta-signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { handleBetaSignUp } from "@/app/actions";
import type { BetaSignUpCredentials } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Beaker, Users, MessageSquare } from "lucide-react";

const benefits = [
    {
        icon: Beaker,
        title: "Early Access to Features",
        description: "Be the first to try our latest innovations, from new cognitive games to advanced routing algorithms."
    },
    {
        icon: Users,
        title: "Shape the Future of NeuroNav",
        description: "Your feedback directly influences our development priorities and helps us build a better tool for everyone."
    },
    {
        icon: MessageSquare,
        title: "Direct Line to Our Team",
        description: "Engage with our developers and designers, share your ideas, and be a part of our core community."
    }
]

export default function BetaTestingPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const onBetaSignUp = async (data: BetaSignUpCredentials) => {
        setIsLoading(true);
        const result = await handleBetaSignUp(data);
        if (result.success) {
            toast({
                title: "Welcome to the Beta Program!",
                description: "Thank you for joining. We'll be in touch soon.",
            });
            setIsSubmitted(true);
        } else {
            toast({
                title: "Sign-up failed",
                description: result.error,
                variant: "destructive"
            });
        }
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader
                isSensoryMode={isSensoryMode}
                onSensoryModeChange={setIsSensoryMode}
            />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">Join Our Beta Testing Program</h1>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
                            Help us build the future of neuro-inclusive technology. Become a NeuroNav beta tester and get exclusive access to new features and a direct line to our development team.
                        </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold font-headline text-center lg:text-left">Why Join?</h2>
                            {benefits.map(benefit => (
                                <div key={benefit.title} className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/20 text-primary rounded-full mt-1">
                                        <benefit.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{benefit.title}</h3>
                                        <p className="text-muted-foreground">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Sign Up for Beta Access</CardTitle>
                                <CardDescription>Fill out the form below to get started.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="text-center p-8 bg-green-500/10 text-green-700 rounded-lg">
                                        <h3 className="text-xl font-bold">Thank You!</h3>
                                        <p>Your application has been received. We're excited to have you on board!</p>
                                    </div>
                                ) : (
                                    <BetaSignUpForm onSubmit={onBetaSignUp} isLoading={isLoading} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
