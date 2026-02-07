// src/app/dashboard/page.tsx

"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Gamepad2, User, BarChart, FileText, MapIcon, Music, ToyBrick, MemoryStick } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Added updateDoc
import { auth, db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import type { UserProfile } from "@/lib/types"; // Import the updated UserProfile type
import { ProfileForm } from "@/components/neuronav/profile-form"; // Import the new ProfileForm component


// This interface is now fully defined in src/lib/types.ts
// interface UserProfile {
//     uid: string;
//     name: string;
//     email: string;
//     profession: "student" | "professional" | "other";
//     neurodiversity: string[];
// }

const professionToDifficulty = {
    student: "student",
    professional: "professional",
    other: "expert",
    unspecified: "intermediate" // Added for default handling
}

export default function DashboardPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false); // New state for form visibility
    const [isSavingProfile, setIsSavingProfile] = useState(false); // New state for saving
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast(); // Initialize toast

    // Function to fetch user profile
    const fetchUserProfile = async (currentUser: typeof user) => {
        setIsLoadingProfile(true);
        try {
            if (!currentUser) throw new Error("No authenticated user to fetch profile for.");
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const profileData = userDoc.data() as Omit<UserProfile, 'uid'>;
                const createdAt = (profileData as any)?.createdAt && typeof (profileData as any).createdAt.toDate === "function"
                    ? (profileData as any).createdAt.toDate()
                    : (profileData as any).createdAt;
                setUserProfile({ uid: currentUser.uid, ...profileData, createdAt }); // Convert Firebase Timestamp to Date if needed
            } else {
                console.error("User document not found in Firestore for authenticated user.");
                // This might happen if user authenticates but profile creation failed.
                // You might want to redirect to a profile setup page or prompt them here.
                await signOut(auth);
                router.push('/login');
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            await signOut(auth);
            router.push('/login');
        } finally {
            setIsLoadingProfile(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchUserProfile(user);
            } else {
                router.push('/login');
            }
        }
    }, [user, authLoading, router]);

    
    const handleLogout = () => {
        signOut(auth).then(() => {
            router.push("/");
        });
    }

    const handleProfileUpdate = async (updatedData: Partial<UserProfile>) => {
        if (!userProfile || !user) return; // Ensure userProfile and user exist
        setIsSavingProfile(true);
        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, updatedData);

            // Update local state with the new data
            setUserProfile(prev => prev ? { ...prev, ...updatedData } : null);

            toast({
                title: "Profile updated successfully!",
                variant: "default",
            });
            setIsProfileFormOpen(false); // Close form on success
        } catch (error) {
            console.error("Error updating user profile:", error);
            toast({
                title: "Failed to update profile",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSavingProfile(false);
        }
    };


    if (authLoading || isLoadingProfile || !userProfile) {
        return (
            <div className="flex flex-col min-h-screen bg-secondary/50">
                 <AppHeader
                    isSensoryMode={isSensoryMode}
                    onSensoryModeChange={setIsSensoryMode}
                />
                <main className="flex-grow container mx-auto p-4 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="space-y-6">
                           <Skeleton className="h-40 w-full" />
                           <Skeleton className="h-32 w-full" />
                           <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const recommendedDifficulty = professionToDifficulty[userProfile.profession || 'unspecified'];

    return (
        <div className="flex flex-col min-h-screen bg-secondary/50">
             <AppHeader
                isSensoryMode={isSensoryMode}
                onSensoryModeChange={setIsSensoryMode}
            />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">Welcome back, {userProfile.name}!</h1>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-gradient-to-br from-primary/80 to-primary">
                             <CardHeader>
                                <CardTitle className="text-primary-foreground">Recommended For You</CardTitle>
                                <CardDescription className="text-primary-foreground/80">Based on your profile, here's a great place to start.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row items-center gap-6">
                                <div className="p-4 bg-primary-foreground/20 rounded-lg">
                                    <BrainCircuit className="h-16 w-16 text-white" />
                                </div>
                                <div className="flex-grow text-white">
                                    <h3 className="text-xl font-bold">Sensory Matching Game</h3>
                                    <p className="mt-1">A game to help improve focus and visual processing. We recommend you start on the <span className="font-bold">{recommendedDifficulty}</span> level.</p>
                                </div>
                                <Link href={`/games/sensory-matching?difficulty=${recommendedDifficulty}`} passHref>
                                    <Button variant="secondary" size="lg" className="shrink-0">
                                        Play Now <Gamepad2 className="ml-2"/>
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Explore Other Activities</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* ... Your existing game links ... */}
                                <Link href="/games/piano" className="group block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Music className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                                        <div>
                                            <h4 className="font-semibold">Piano Game</h4>
                                            <p className="text-sm text-muted-foreground">Practice melodies and play.</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link href="/games/cognitive-switch" className="group block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <ToyBrick className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                                        <div>
                                            <h4 className="font-semibold">Cognitive Switch</h4>
                                            <p className="text-sm text-muted-foreground">Test your mental flexibility.</p>
                                        </div>
                                    </div>
                                </Link>
                                 <Link href="/games/navigation-puzzle" className="group block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <MapIcon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                                        <div>
                                            <h4 className="font-semibold">Navigation Puzzles</h4>
                                            <p className="text-sm text-muted-foreground">Challenge your spatial reasoning.</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link href="/games/memory-2d" className="group block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                                   <div className="flex items-center gap-3">
                                        <MemoryStick className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                                        <div>
                                            <h4 className="font-semibold">Memory 2D</h4>
                                            <p className="text-sm text-muted-foreground">Test your memory.</p>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Column (Conditional Rendering) */}
                    <div className="space-y-6">
                        {isProfileFormOpen && userProfile ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><User /> Edit Profile</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ProfileForm
                                        initialData={userProfile}
                                        onSubmit={handleProfileUpdate}
                                        onCancel={() => setIsProfileFormOpen(false)}
                                        isLoading={isSavingProfile}
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><User /> Your Profile</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold">Profession</h4>
                                        <p className="capitalize text-muted-foreground">{userProfile.profession || 'Not specified'}</p>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold">Neurodiversity Profile</h4>
                                        {userProfile.neurodiversity && userProfile.neurodiversity.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                               {userProfile.neurodiversity.map(item => <span key={item} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{item}</span>)}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">Not specified.</p>
                                        )}
                                    </div>
                                    {/* NEW: Display Address, Gender, Age, Emergency Number */}
                                    <div>
                                        <h4 className="font-semibold">Address</h4>
                                        <p className="text-muted-foreground">{userProfile.address || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Gender</h4>
                                        <p className="text-muted-foreground">{userProfile.gender || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Age</h4>
                                        <p className="text-muted-foreground">{userProfile.age === null || userProfile.age === undefined ? 'Not specified' : userProfile.age}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Emergency Number</h4>
                                        <p className="text-muted-foreground">{userProfile.emergencyNumber || 'Not specified'}</p>
                                    </div>

                                    <Button variant="link" className="p-0 h-auto" onClick={() => setIsProfileFormOpen(true)}>Edit Profile</Button>
                                </CardContent>
                            </Card>
                        )}
                         <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><BarChart/> Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground text-sm">
                                <p>Progress tracking is coming soon!</p>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileText /> Resources</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <Link href="/tips" className="block text-primary hover:underline">Tips &amp; Guides</Link>
                                <Link href="/stories" className="block text-primary hover:underline">Peer Stories</Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
