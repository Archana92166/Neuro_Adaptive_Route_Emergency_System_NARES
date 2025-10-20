
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Gamepad2, User, BarChart, FileText, MapIcon, Music, ToyBrick, MemoryStick } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";


interface UserProfile {
    uid: string;
    name: string;
    email: string;
    profession: "student" | "professional" | "other";
    neurodiversity: string[];
}

const professionToDifficulty = {
    student: "student",
    professional: "professional",
    other: "expert"
}

export default function DashboardPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                const fetchUserProfile = async () => {
                    setIsLoadingProfile(true);
                    try {
                        const userDocRef = doc(db, "users", user.uid);
                        const userDoc = await getDoc(userDocRef);

                        if (userDoc.exists()) {
                            setUserProfile({ uid: user.uid, ...(userDoc.data() as Omit<UserProfile, 'uid'>) });
                        } else {
                            console.error("User document not found in Firestore for authenticated user.");
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
                fetchUserProfile();
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

    const recommendedDifficulty = professionToDifficulty[userProfile.profession] || "professional";

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

                    {/* Profile Column */}
                    <div className="space-y-6">
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User /> Your Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-semibold">Profession</h4>
                                    <p className="capitalize text-muted-foreground">{userProfile.profession}</p>
                                </div>
                                 <div>
                                    <h4 className="font-semibold">Neurodiversity Profile</h4>
                                    {userProfile.neurodiversity.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                           {userProfile.neurodiversity.map(item => <span key={item} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{item}</span>)}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Not specified.</p>
                                    )}
                                </div>
                                <Button variant="link" className="p-0 h-auto">Edit Profile</Button>
                            </CardContent>
                        </Card>
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
