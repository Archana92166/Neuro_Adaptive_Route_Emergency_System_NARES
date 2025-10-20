
'use server';
/**
 * @fileOverview A tool for fetching real-time driving directions using Google Maps.
 *
 * - getDirections - A Genkit tool that retrieves a route between two locations.
 */
import { ai } from "@/ai/genkit";
import { z } from "zod";
import { Client, TravelMode } from "@googlemaps/google-maps-services-js";
import { decode } from "@googlemaps/polyline-codec";

const DirectionsInputSchema = z.object({
  origin: z.string().describe("The starting point for the directions."),
  destination: z.string().describe("The ending point for the directions."),
  travelMode: z.enum(["driving", "walking", "bicycling", "transit"]).default("driving").describe("The mode of travel."),
});

const RoutePointSchema = z.object({ lat: z.number(), lng: z.number() });

const DirectionsOutputSchema = z.object({
  distance: z.string().describe("The total distance of the route."),
  duration: z.string().describe("The estimated travel time."),
  polyline: z.array(RoutePointSchema).describe("An array of lat/lng points representing the decoded route path."),
  travelMode: z.enum(["driving", "walking", "bicycling", "transit"]).describe("The mode of travel used for this route."),
});

// Note: This key is used on the server-side and should be kept secret.
// It is configured via secrets in apphosting.yaml.
const mapsClient = new Client({});
const getDirectionsTool = ai.defineTool(
  {
    name: 'getDirections',
    description: 'Fetches directions between two locations for a specified travel mode.',
    inputSchema: DirectionsInputSchema,
    outputSchema: DirectionsOutputSchema,
  },
  async (input) => {
    try {
      const response = await mapsClient.directions({
        params: {
          origin: input.origin,
          destination: input.destination,
          mode: input.travelMode,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      });

      if (response.data.status !== 'OK' || response.data.routes.length === 0) {
        throw new Error(`Directions API failed for ${input.travelMode} with status: ${response.data.status}`);
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];
      const encodedPolyline = route.overview_polyline.points;
      
      // Decode the polyline to get the path coordinates
      const decodedPath = decode(encodedPolyline, 5).map(([lat, lng]) => ({ lat, lng }));

      return {
        distance: leg.distance.text,
        duration: leg.duration.text,
        polyline: decodedPath,
        travelMode: input.travelMode,
      };

    } catch (error) {
      console.error(`Error fetching directions for ${input.travelMode}:`, error);
      // It's important to re-throw or handle the error so the AI knows the tool failed.
      throw new Error(`Failed to get directions from the Google Maps API for ${input.travelMode}.`);
    }
  }
);

// We export the function itself for direct invocation if needed.
export const getDirections = getDirectionsTool;
