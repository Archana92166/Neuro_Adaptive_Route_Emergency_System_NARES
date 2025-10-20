// This is a server-side file.
'use server';

/**
 * @fileOverview Summarizes the sensory challenges of a route.
 *
 * - summarizeRouteSensoryChallenges - A function that summarizes the sensory challenges of a given route.
 * - RouteSensorySummaryInput - The input type for the summarizeRouteSensoryChallenges function.
 * - RouteSensorySummaryOutput - The return type for the summarizeRouteSensoryChallenges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteSensorySummaryInputSchema = z.object({
  routeDescription: z.string().describe('A detailed description of the route, including specific locations and potential sensory challenges.'),
  userSensoryPreferences: z.string().describe('The user\u2019s sensory preferences and sensitivities (e.g., sensitivity to loud noises, crowds, bright lights).'),
});
export type RouteSensorySummaryInput = z.infer<typeof RouteSensorySummaryInputSchema>;

const RouteSensorySummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the sensory challenges on the route, tailored to the user\u2019s preferences, including potential noise levels or crowded areas.'),
  alternativeRouteSuggestions: z.string().optional().describe('Suggestions for alternative routes that minimize sensory challenges, if available.'),
});
export type RouteSensorySummaryOutput = z.infer<typeof RouteSensorySummaryOutputSchema>;

export async function summarizeRouteSensoryChallenges(input: RouteSensorySummaryInput): Promise<RouteSensorySummaryOutput> {
  return routeSensorySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeSensorySummaryPrompt',
  input: {schema: RouteSensorySummaryInputSchema},
  output: {schema: RouteSensorySummaryOutputSchema},
  prompt: `You are an AI assistant designed to help users understand the sensory challenges of a route.

You will receive a description of the route and the user's sensory preferences. Your goal is to provide a summary of the sensory challenges a user might encounter on the selected route, such as potential noise levels or crowded areas, so they can make informed decisions and prepare accordingly.

Route Description: {{{routeDescription}}}
User Sensory Preferences: {{{userSensoryPreferences}}}

Summary:
`, // Ensure the summary focuses on sensory challenges based on the user's preferences.
});

const routeSensorySummaryFlow = ai.defineFlow(
  {
    name: 'routeSensorySummaryFlow',
    inputSchema: RouteSensorySummaryInputSchema,
    outputSchema: RouteSensorySummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

