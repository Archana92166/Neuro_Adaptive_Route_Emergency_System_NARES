
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { EmergencyLocation } from "@/components/neuronav/emergency-location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageSquare, Siren } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";

export default function SosPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [emergencyContact, setEmergencyContact] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isDark = document.documentElement.classList.contains('dark');
            setIsSensoryMode(isDark);
        }
        
        const fetchEmergencyContact = async () => {
            if(user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists() && userDoc.data().emergencyMobile) {
                    setEmergencyContact(userDoc.data().emergencyMobile);
                }
            }
        };

        fetchEmergencyContact();
    }, [user]);

    const handleSensoryModeChange = (isSensory: boolean) => {
        setIsSensoryMode(isSensory);
        if (isSensory) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

    const handleAlertContact = () => {
        if (emergencyContact) {
            window.location.href = `sms:${emergencyContact}`;
        }
    }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={handleSensoryModeChange}
      />
      <main className="flex-grow flex items-center justify-center p-4 bg-destructive/10">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-destructive">
            <CardHeader className="text-center">
                <Siren className="mx-auto h-16 w-16 text-destructive animate-pulse" />
                <CardTitle className="text-4xl font-bold text-destructive mt-4">EMERGENCY</CardTitle>
                <CardDescription className="text-lg">
                    Stay calm. Help is on the way.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="p-4 rounded-lg bg-card">
                 <EmergencyLocation />
               </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="tel:911" className="w-full">
                      <Button size="lg" variant="destructive" className="h-16 text-lg w-full">
                          <Phone className="mr-2" /> Call Emergency Services
                      </Button>
                    </a>
                     <Button size="lg" variant="secondary" className="h-16 text-lg" onClick={handleAlertContact} disabled={!emergencyContact}>
                        <MessageSquare className="mr-2" /> Alert Emergency Contacts
                    </Button>
                </div>
                 <div className="text-center">
                    <Link href="/" passHref>
                        <Button variant="outline">
                        I'm Safe / Cancel
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
