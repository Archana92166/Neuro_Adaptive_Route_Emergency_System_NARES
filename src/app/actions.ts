
'use client';

import type { RoutePreferences, SignUpCredentials, BetaSignUpCredentials } from "@/lib/types";
import { getGameFeedback, type GameFeedbackInput, type GameFeedbackOutput } from "@/ai/flows/game-feedback";
import { findNearbyPlaces, type FindNearbyPlacesInput, type FindNearbyPlacesOutput } from "@/ai/flows/find-nearby-places";
import { convertTextToSpeech, type TextToSpeechOutput } from "@/ai/flows/text-to-speech";
import { generateTurnByTurn, type GenerateTurnByTurnInput, type GenerateTurnByTurnOutput } from "@/ai/flows/generate-turn-by-turn";
import { getDirections } from "@/ai/tools/directions";
import type { TravelMode } from "@googlemaps/google-maps-services-js";
import { adaptiveRouteSuggestions, type AdaptiveRouteSuggestionsOutput, type RouteSuggestion } from "@/ai/flows/adaptive-route-suggestions";


export async function getAdaptiveRoutes(
  data: RoutePreferences
): Promise<AdaptiveRouteSuggestionsOutput | { error: string }> {
  try {
    const travelModes: TravelMode[] = ["driving", "walking", "transit"];
    
    const routePromises = travelModes.map(mode => 
      getDirections({
        origin: data.startLocation,
        destination: data.endLocation,
        travelMode: mode,
      }).catch(e => {
        console.warn(`Could not get directions for ${mode}:`, e.message);
        return null; // Return null if a specific mode fails, so Promise.all doesn't reject
      })
    );

    const results = await Promise.all(routePromises);
    const successfulRoutes = results.filter(r => r !== null) as RouteSuggestion[];
    
    if (successfulRoutes.length === 0) {
      return { error: "Could not find any routes between the specified locations. Please check the addresses and try again." };
    }

    // Now, call the AI flow with the fetched routes
    const aiPoweredSuggestions = await adaptiveRouteSuggestions({
        ...data,
        currentDateTime: new Date().toISOString(),
        routes: successfulRoutes,
    });

    return aiPoweredSuggestions;

  } catch (error) {
    console.error("Error in getAdaptiveRoutes:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching route suggestions.";
    return { error: errorMessage };
  }
}


export async function handleSignUp(data: SignUpCredentials): Promise<{ success: boolean, error?: string }> {
  try {
    // Here you would typically handle user creation, e.g., save to a database.
    // For this demo, we'll just log the data.
    console.log("New user signed up:", data);
    return { success: true };
  } catch (error) {
    console.error("Error in handleSignUp:", error);
    return { success: false, error: "Failed to sign up. Please try again later." };
  }
}


export async function fetchGameFeedback(data: GameFeedbackInput): Promise<GameFeedbackOutput | { error: string }> {
    try {
      const result = await getGameFeedback(data);
      return result;
    } catch (error) {
      console.error("Error in fetchGameFeedback:", error);
      return { error: "Failed to get feedback. Keep trying your best!" };
    }
}


export async function fetchNearbyMedicalServices(data: FindNearbyPlacesInput): Promise<FindNearbyPlacesOutput | { error: string }> {
  try {
    const result = await findNearbyPlaces(data);
    return result;
  } catch (error) {
    console.error("Error in fetchNearbyMedicalServices:", error);
    return { error: "Failed to find nearby services. Please try again later." };
  }
}

export async function handleBetaSignUp(data: BetaSignUpCredentials): Promise<{ success: boolean, error?: string }> {
    try {
        console.log("New beta tester signed up:", data);
        return { success: true };
    } catch (error) {
        console.error("Error in handleBetaSignUp:", error);
        return { success: false, error: "Failed to sign up for beta. Please try again later." };
    }
}

export async function fetchTurnByTurnInstruction(data: GenerateTurnByTurnInput): Promise<GenerateTurnByTurnOutput | { error: string }> {
    try {
      const result = await generateTurnByTurn(data);
      return result;
    } catch (error) {
      console.error("Error in fetchTurnByTurnInstruction:", error);
      return { error: "Failed to generate instruction." };
    }
}

export async function fetchAudio(text: string): Promise<TextToSpeechOutput | { error: string }> {
    try {
        const result = await convertTextToSpeech({ text });
        return result;
    } catch (error) {
        console.error("Error in fetchAudio:", error);
        return { error: "Failed to generate audio." };
    }
}
