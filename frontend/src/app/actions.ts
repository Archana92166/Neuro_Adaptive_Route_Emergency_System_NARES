'use client';

import type { SignUpCredentials, BetaSignUpCredentials } from "@/lib/types";
import { getGameFeedback, type GameFeedbackInput, type GameFeedbackOutput } from "@/ai/flows/game-feedback";
import { findNearbyPlaces, type FindNearbyPlacesInput, type FindNearbyPlacesOutput } from "@/ai/flows/find-nearby-places";
import { convertTextToSpeech, type TextToSpeechOutput } from "@/ai/flows/text-to-speech";

/* =========================================================
   NOTE (IMPORTANT – READ ONCE)
   ---------------------------------------------------------
   - Navigation & routing are handled by BACKEND only
   - This file MUST NOT call Google Directions or routing AI
   - This avoids schema conflicts & runtime crashes
   ========================================================= */


/* -------------------- AUTH HELPERS -------------------- */

export async function handleSignUp(
  data: SignUpCredentials
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("New user signed up:", data);
    return { success: true };
  } catch (error) {
    console.error("Error in handleSignUp:", error);
    return { success: false, error: "Failed to sign up. Please try again later." };
  }
}

export async function handleBetaSignUp(
  data: BetaSignUpCredentials
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("New beta tester signed up:", data);
    return { success: true };
  } catch (error) {
    console.error("Error in handleBetaSignUp:", error);
    return { success: false, error: "Failed to sign up for beta." };
  }
}

/* -------------------- GAME FEEDBACK -------------------- */

export async function fetchGameFeedback(
  data: GameFeedbackInput
): Promise<GameFeedbackOutput | { error: string }> {
  try {
    return await getGameFeedback(data);
  } catch (error) {
    console.error("Error in fetchGameFeedback:", error);
    return { error: "Failed to get feedback." };
  }
}

/* -------------------- NEARBY MEDICAL -------------------- */

export async function fetchNearbyMedicalServices(
  data: FindNearbyPlacesInput
): Promise<FindNearbyPlacesOutput | { error: string }> {
  try {
    return await findNearbyPlaces(data);
  } catch (error) {
    console.error("Error in fetchNearbyMedicalServices:", error);
    return { error: "Failed to find nearby services." };
  }
}

/* -------------------- TEXT TO SPEECH -------------------- */

export async function fetchAudio(
  text: string
): Promise<TextToSpeechOutput | { error: string }> {
  try {
    return await convertTextToSpeech({ text });
  } catch (error) {
    console.error("Error in fetchAudio:", error);
    return { error: "Failed to generate audio." };
  }
}
