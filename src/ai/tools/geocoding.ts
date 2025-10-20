'use server';
/**
 * @fileOverview A tool for converting coordinates to addresses.
 *
 * - getAddressFromCoordinates - A Genkit tool that performs reverse geocoding.
 */
import { ai } from "@/ai/genkit";
import { z } from "zod";
import { Client } from "@googlemaps/google-maps-services-js";

const GeocodingInputSchema = z.object({
  lat: z.number().describe("The latitude."),
  lng: z.number().describe("The longitude."),
});

const GeocodingOutputSchema = z.string().describe("The formatted address.");

const mapsClient = new Client({});

const getAddressFromCoordinatesTool = ai.defineTool(
  {
    name: 'getAddressFromCoordinates',
    description: 'Converts latitude and longitude coordinates into a human-readable street address.',
    inputSchema: GeocodingInputSchema,
    outputSchema: GeocodingOutputSchema,
  },
  async (input) => {
    try {
      const response = await mapsClient.reverseGeocode({
        params: {
          latlng: { latitude: input.lat, longitude: input.lng },
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      });

      if (response.data.status !== 'OK' || response.data.results.length === 0) {
        throw new Error(`Reverse Geocoding API failed with status: ${response.data.status}`);
      }

      // Return the first, most specific address.
      return response.data.results[0].formatted_address;

    } catch (error) {
      console.error("Error fetching address:", error);
      throw new Error("Failed to get address from the Google Maps API.");
    }
  }
);

export const getAddressFromCoordinates = getAddressFromCoordinatesTool;
