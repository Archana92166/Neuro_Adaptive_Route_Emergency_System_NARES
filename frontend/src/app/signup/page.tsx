// src/app/signup/page.tsx

"use client";

import { AppHeader } from "@/components/neuronav/header";
import { SignUpForm } from "@/components/neuronav/signup-form"; // Assumed to be updated and correct
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import type { SignUpCredentials } from "@/lib/types"; // Updated type
import { useToast } from "@/hooks/use-toast";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Re-using the GoogleIcon component from your LoginPage
const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
    </svg>
);

export default function SignUpPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { toast } = useToast();
    const auth = getAuth(app);
    const router = useRouter();

    const handleSignUpSuccess = () => {
        toast({
            title: "Account created successfully!",
            description: "Welcome to NeuroNav! You can now log in.",
            variant: "default", // Uses default variant, which is typically green/success
        });
        router.push('/'); // Redirect to home or login page after successful signup
    }

    const onSignUp = async (data: SignUpCredentials) => {
        setIsLoading(true);
        try {
            // These are mandatory from the form
            const { email, password, name } = data;

            // 1. Create user with Email and Password using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Firebase Auth profile with display name
            if (name) {
                await updateProfile(user, {
                    displayName: name
                });
            }

            // 3. Prepare data for Cloud Firestore
            // Use spread operator with `data`. Optional fields will only be present if collected by form.
            const firestoreData: Partial<SignUpCredentials> & { createdAt: Date; email: string; name: string } = {
                ...data, // Spreads all fields (name, email, password, address?, gender?, age?)
                createdAt: new Date(),
            };
            delete firestoreData.password; // Remove password as it's for auth, not Firestore storage

            // 4. Store additional user data in Cloud Firestore
            await setDoc(doc(db, "users", user.uid), firestoreData);

            handleSignUpSuccess();

        } catch (error: any) {
            console.error("Sign up Error:", error);
            let errorMessage = "An unknown error occurred during sign up.";
            if (error.code) {
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = "This email is already in use. Please log in instead.";
                        break;
                    case 'auth/weak-password':
                        errorMessage = "The password is too weak. Please use at least 8 characters.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "The email address is not valid.";
                        break;
                    default:
                        errorMessage = `Sign up failed: ${error.message}`;
                }
            }
             toast({
                title: "Sign up failed",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            // If the user is new (no existing profile in Firestore)
            if (!userDoc.exists()) {
                // For Google Sign-up, we don't get address, gender, age directly.
                // Set sensible default/placeholder values. User can update these later.
                const newUserProfile = {
                    name: user.displayName || 'New User',
                    email: user.email,
                    address: '', // Default for Google signup
                    gender: 'Rather not say', // Default for Google signup
                    age: null, // Default for Google signup
                    createdAt: new Date(),
                    // Add any other default fields you need
                };
                await setDoc(userDocRef, newUserProfile);
            }
            // If they already have an account (userDoc.exists()), no need to create a new profile.
            // The handleSignUpSuccess will still run, but for Google Sign-in it acts as a login/signup.

            handleSignUpSuccess();

        } catch (error: any) {
            console.error("Google Sign-Up Error:", error);
            let errorMessage = "Could not sign up with Google. Please try again.";
             if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Sign-up was cancelled.";
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = "Google Sign-In is not enabled for this project. Please enable it in your Firebase console under Authentication > Sign-in method.";
            } else if (error.code === 'auth/unauthorized-domain') {
                 errorMessage = "This domain is not authorized for Google Sign-In. Please add it to your Firebase project's authorized domains.";
             }
            toast({
                title: "Google Sign-Up Failed",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsGoogleLoading(false);
        }
    }


  return (
    <div className="flex flex-col min-h-screen bg-background">
       <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Tell us a bit about yourself to personalize your experience.</CardDescription>
            </CardHeader>
            <CardContent>
                <SignUpForm onSubmit={onSignUp} isLoading={isLoading} />

                {/* Separator and Google Sign-up Button */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignUp}
                    disabled={isGoogleLoading || isLoading}
                >
                    {isGoogleLoading ? (
                        <div className="animate-spin h-5 w-5 mr-2" />
                    ) : (
                        <GoogleIcon />
                    )}
                    Sign up with Google
                </Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
