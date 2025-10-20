
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { SignUpForm } from "@/components/neuronav/signup-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import type { SignUpCredentials } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";


export default function SignUpPage() {
    const [isSensoryMode, setIsSensoryMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const auth = getAuth(app);
    const router = useRouter();

    const onSignUp = async (data: SignUpCredentials) => {
        setIsLoading(true);
        try {
            const { password, ...userData } = data;

            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
            const user = userCredential.user;
            
            await updateProfile(user, {
                displayName: userData.name
            });

            await setDoc(doc(db, "users", user.uid), {
                ...userData,
                uid: user.uid,
            });

            toast({
                title: "Account created successfully!",
            });
            
            router.push('/');

        } catch (error: any) {
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
             setIsLoading(false);
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
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
