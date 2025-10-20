
'use server';

/**
 * @fileOverview This flow analyzes pre-fetched routes from the Google Maps API
 * to provide intelligent, sensory-aware travel suggestions.
 * The AI evaluates each route against the user's sensory preferences
 * to provide a descriptive name, a sensory score, potential challenges,
 * and a summary of why the routes are being recommended.
 */

import {z} from 'genkit';
import { ai } from '@/ai/genkit';

const RoutePointSchema = z.object({
  lat: z.number().describe('The latitude of the point.'),
  lng: z.number().describe('The longitude of the point.'),
});

const RouteSuggestionSchema = z.object({
  distance: z.string().describe("The total distance of the route."),
  duration: z.string().describe("The estimated travel time."),
  polyline: z.array(RoutePointSchema).describe("An array of lat/lng points representing the decoded route path."),
  travelMode: z.enum(["driving", "walking", "bicycling", "transit"]).describe("The mode of travel."),
});
export type RouteSuggestion = z.infer<typeof RouteSuggestionSchema>;


const AdaptiveRouteSuggestionsInputSchema = z.object({
  startLocation: z.string().describe('The starting location of the route.'),
  endLocation: z.string().describe('The destination location of the route.'),
  currentDateTime: z.string().describe('The current date and time.'),
  sensoryPreferences: z
    .array(z.string())
    .describe(
      'An array of sensory sensitivities, e.g., loud noises, bright lights, crowds.'
    ),
  routes: z.array(RouteSuggestionSchema).describe("An array of pre-fetched routes from Google Maps Directions API."),
});
export type AdaptiveRouteSuggestionsInput = z.infer<typeof AdaptiveRouteSuggestionsInputSchema>;


const SuggestedRouteSchema = z.object({
  routeDescription: z.string().describe('A descriptive name/description for the route (e.g., "Fastest Drive", "Quiet Park Walk", "Main Transit Line"). This should be based on an analysis of the route, not just the travel mode.'),
  estimatedTime: z.string().describe('The estimated travel time for the route, taken directly from the input route object.'),
  sensoryChallenges: z
    .array(z.string())
    .describe('An array of potential sensory challenges on the route, based on the travel mode, time of day, and user preferences (e.g., "Heavy Traffic Noise", "Crowded Train", "Uneven Sidewalks").'),
  overallSensoryScore: z
    .number()
    .min(1).max(10)
    .describe(
      'A score from 1-10 indicating the overall sensory load of the route (lower is better, with 1 being very calm and 10 being very intense). This score should be the primary output of your analysis.'
    ),
  path: z.array(RoutePointSchema).describe("An array of latitude and longitude points representing the route's path for drawing on a map, taken directly from the input route object."),
});

const AdaptiveRouteSuggestionsOutputSchema = z.object({
  suggestedRoutes: z.array(SuggestedRouteSchema),
  recommendationReasoning: z
    .string()
    .describe('A brief, 2-sentence explanation of why these routes are recommended based on the user\'s preferences and the available options. For example: "I have provided the fastest driving route and a walking route that avoids major roads. The driving route has a higher sensory score due to potential traffic noise."'),
});
export type AdaptiveRouteSuggestionsOutput = z.infer<
  typeof AdaptiveRouteSuggestionsOutputSchema
>;

export async function adaptiveRouteSuggestions(
  input: AdaptiveRouteSuggestionsInput
): Promise<AdaptiveRouteSuggestionsOutput> {
  return adaptiveRouteSuggestionsFlow(input);
}


const prompt = ai.definePrompt({
    name: 'adaptiveRouteSuggestionsPrompt',
    input: { schema: AdaptiveRouteSuggestionsInputSchema },
    output: { schema: AdaptiveRouteSuggestionsOutputSchema },
    prompt: `You are an expert sensory-aware navigation assistant. Your task is to analyze a set of pre-fetched routes and provide personalized, sensory-friendly suggestions.

User's Request:
- Start: {{{startLocation}}}
- End: {{{endLocation}}}
- Current Time: {{{currentDateTime}}}
- User's Sensory Preferences to Avoid: {{{json sensoryPreferences}}}

Available Routes:
{{{json routes}}}

Your analysis must produce the following for each route:
1.  **routeDescription**: Give each route a clear, descriptive name. Don't just name it after the travel mode. Analyze its properties. A walking route through a park should be "Quiet Park Walk", not just "Walking". A driving route on a highway should be "Highway Route".
2.  **estimatedTime**: Use the exact duration from the input route.
3.  **sensoryChallenges**: Based on the travel mode, time of day, and the user's preferences, list specific potential challenges. For 'driving', challenges could be 'Traffic Noise' or 'Bright Headlights'. For 'transit', it could be 'Crowded Vehicle' or 'Loud Announcements'. For 'walking', it could be 'Busy Sidewalks' or 'Uneven Pavement'.
4.  **overallSensoryScore**: This is the most critical part of your analysis. Assign a score from 1 (very calm) to 10 (very intense).
    - A quiet, late-night walk in a residential area might be a 1 or 2.
    - A direct walking route through a city center during the day might be a 5 or 6.
    - Driving in rush hour traffic should be an 8 or 9.
    - Public transit during peak hours is likely a 6-8.
    Base this score on the user's sensitivities. If they are sensitive to crowds, a transit route gets a higher score.
5.  **path**: Use the exact polyline from the input route.

Finally, provide a brief 'recommendationReasoning' to summarize your suggestions and explain the trade-offs (e.g., "The walking route is longer but has a much lower sensory score.").
`,
});


const adaptiveRouteSuggestionsFlow = ai.defineFlow(
  {
    name: 'adaptiveRouteSuggestionsFlow',
    inputSchema: AdaptiveRouteSuggestionsInputSchema,
    outputSchema: AdaptiveRouteSuggestionsOutputSchema,
  },
  async (input) => {
    // The AI will now process the pre-fetched routes and return the analysis.
    const { output } = await prompt(input);

    if (!output) {
      throw new Error('The AI failed to generate route suggestions.');
    }

    // Ensure the output paths match the input paths for consistency.
    const finalRoutes = output.suggestedRoutes.map((suggestedRoute, index) => {
        // Find the corresponding original route if possible, or fallback to index.
        const originalRoute = input.routes.find(r => r.duration === suggestedRoute.estimatedTime) || input.routes[index];
        return {
            ...suggestedRoute,
            path: originalRoute.polyline, // Ensure the path is directly from the source
        };
    });

    return {
        ...output,
        suggestedRoutes: finalRoutes,
    };
  }
);
