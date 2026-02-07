'use server';

/**
 * @fileOverview Finds nearby medical services.
 *
 * - findNearbyPlaces - A function that finds nearby doctors and hospitals.
 * - FindNearbyPlacesInput - The input type for the findNearbyPlaces function.
 * - FindNearbyPlacesOutput - The return type for the findNearbyPlaces function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FindNearbyPlacesInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user\'s location.'),
  longitude: z.number().describe('The longitude of the user\'s location.'),
});
export type FindNearbyPlacesInput = z.infer<typeof FindNearbyPlacesInputSchema>;

const PlaceSchema = z.object({
  name: z.string().describe('The name of the hospital or clinic.'),
  address: z.string().describe('The full address of the place.'),
  type: z.enum(['hospital', 'clinic', 'specialist']).describe('The type of medical facility.'),
  specialty: z.string().optional().describe('The medical specialty of the clinic or doctor (e.g., Neurology, Psychology).'),
});

const FindNearbyPlacesOutputSchema = z.object({
  places: z.array(PlaceSchema).describe('A list of nearby medical places.'),
});
export type FindNearbyPlacesOutput = z.infer<typeof FindNearbyPlacesOutputSchema>;

export async function findNearbyPlaces(
  input: FindNearbyPlacesInput
): Promise<FindNearbyPlacesOutput> {
  return findNearbyPlacesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findNearbyPlacesPrompt',
  input: { schema: FindNearbyPlacesInputSchema },
  output: { schema: FindNearbyPlacesOutputSchema },
  prompt: `You are an AI assistant helping a user find nearby medical services based on their current location.

  Current Location (Latitude, Longitude): {{{latitude}}}, {{{longitude}}}

  Generate a list of 3-5 realistic but fictional nearby hospitals, clinics, and specialists. For each place, provide a name, address, type, and an optional specialty.
  `,
});

const findNearbyPlacesFlow = ai.defineFlow(
  {
    name: 'findNearbyPlacesFlow',
    inputSchema: FindNearbyPlacesInputSchema,
    outputSchema: FindNearbyPlacesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
