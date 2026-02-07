
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";


interface Guardian {
    name: string;
    relation: string;
    phone: string;
    initials: string;
    avatar: string;
}

export default function GuardianPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [guardians, setGuardians] = useState<Guardian[]>([]);
    const [newGuardianName, setNewGuardianName] = useState("");
    const [newGuardianRelation, setNewGuardianRelation] = useState("");
    const [newGuardianPhone, setNewGuardianPhone] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchGuardians = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const existingGuardians = userData.guardians || [];
                        if (userData.emergencyMobile && !existingGuardians.some((g: Guardian) => g.relation === 'From Profile')) {
                            existingGuardians.unshift({
                                name: "Emergency Contact",
                                relation: "From Profile",
                                phone: userData.emergencyMobile,
                                initials: "EC",
                                avatar: "https://placehold.co/100x100/A855F7/FFFFFF.png"
                            });
                        }
                        setGuardians(existingGuardians);
                    }
                } catch (error) {
                    console.error("Error fetching guardians:", error);
                }
            }
            setIsLoading(false);
        };

        if (!authLoading) {
            fetchGuardians();
        }
    }, [user, authLoading]);

    const handleAddGuardian = async () => {
        if (!newGuardianName || !newGuardianRelation || !newGuardianPhone || !user) return;

        const newGuardian: Guardian = {
            name: newGuardianName,
            relation: newGuardianRelation,
            phone: newGuardianPhone,
            initials: newGuardianName.split(' ').map(n => n[0]).join(''),
            avatar: `https://placehold.co/100x100/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF.png`
        };
        const updatedGuardians = [...guardians, newGuardian];
        
        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                guardians: updatedGuardians
            });
            setGuardians(updatedGuardians);
        } catch (error) {
            console.error("Failed to add guardian:", error);
        }
        
        setNewGuardianName("");
        setNewGuardianRelation("");
        setNewGuardianPhone("");
        setIsDialogOpen(false);
    }
    
    const handleCallGuardian = (phone: string) => {
        window.location.href = `tel:${phone}`;
    }

  if (authLoading || isLoading) {
      return (
          <div className="flex flex-col min-h-screen bg-secondary/40">
            <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader className="text-center">
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                             <Card key={i} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-12 w-24 rounded-md" />
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </main>
          </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
       <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Call a Guardian</CardTitle>
                <CardDescription>Connect with a trusted contact for support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {guardians.map((guardian, index) => (
                    <Card key={index} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={guardian.avatar} alt={guardian.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{guardian.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{guardian.name}</p>
                                <p className="text-sm text-muted-foreground">{guardian.relation}</p>
                            </div>
                        </div>
                        <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => handleCallGuardian(guardian.phone)}>
                           <Phone className="mr-2 h-5 w-5" /> Call
                        </Button>
                    </Card>
                ))}

                <div className="pt-4 text-center">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" disabled={!user}>
                                <UserPlus className="mr-2 h-5 w-5" /> Add New Guardian
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Guardian</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" value={newGuardianName} onChange={(e) => setNewGuardianName(e.target.value)} className="col-span-3" placeholder="e.g., Sarah Parker" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="relation" className="text-right">Relation</Label>
                                    <Input id="relation" value={newGuardianRelation} onChange={(e) => setNewGuardianRelation(e.target.value)} className="col-span-3" placeholder="e.g., Sibling" />
                                </div>
                                 <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">Phone</Label>
                                    <Input id="phone" type="tel" value={newGuardianPhone} onChange={(e) => setNewGuardianPhone(e.target.value)} className="col-span-3" placeholder="e.g., 555-123-4567" />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleAddGuardian}>Add Guardian</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
