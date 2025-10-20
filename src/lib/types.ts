
import { z } from "zod";

export const RoutePreferencesSchema = z.object({
  startLocation: z.string().min(3, { message: "Start location must be at least 3 characters." }),
  endLocation: z.string().min(3, { message: "End location must be at least 3 characters." }),
  sensoryPreferences: z.array(z.string()).min(1, { message: "Please select at least one sensory preference." }),
});

export type RoutePreferences = z.infer<typeof RoutePreferencesSchema>;


const RoutePointSchema = z.object({
  lat: z.number().describe('The latitude of the point.'),
  lng: z.number().describe('The longitude of the point.'),
});

export const AdaptiveRouteSuggestionsOutputSchema = z.object({
  suggestedRoutes: z.array(
    z.object({
      routeDescription: z.string().describe('A description of the route.'),
      estimatedTime: z.string().describe('The estimated travel time for the route.'),
      sensoryChallenges: z
        .array(z.string())
        .describe('An array of potential sensory challenges on the route.'),
      overallSensoryScore: z
        .number()
        .describe(
          'A score indicating the overall sensory load of the route (lower is better).'
        ),
      path: z.array(RoutePointSchema).describe("An array of latitude and longitude points representing the route's path for drawing on a map."),
    })
  ),
  recommendationReasoning: z
    .string()
    .describe('Explanation of why these routes are recommended.'),
});
export type AdaptiveRouteSuggestionsOutput = z.infer<
  typeof AdaptiveRouteSuggestionsOutputSchema
>;


export const SignUpCredentialsSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    mobile: z.string().min(10, { message: "Please enter a valid mobile number." }),
    address: z.string().min(5, { message: "Please enter a valid address." }),
    emergencyMobile: z.string().min(10, { message: "Please enter a valid emergency mobile number." }),
    profession: z.enum(["student", "professional", "other"]),
    neurodiversity: z.array(z.string()).optional(),
});

export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;

export const LoginCredentialsSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;


export const BetaSignUpCredentialsSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    interests: z.array(z.string()).min(1, { message: "Please select at least one area of interest." }),
    feedback: z.string().optional(),
});

export type BetaSignUpCredentials = z.infer<typeof BetaSignUpCredentialsSchema>;

const PointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const GenerateTurnByTurnInputSchema = z.object({
  from: PointSchema.describe("The starting point of the navigation segment."),
  to: PointSchema.describe("The ending point of the navigation segment."),
  next: PointSchema.optional().describe("The point after the ending point, to determine the turn."),
  isLastStep: z.boolean().describe("Whether this is the final instruction of the route."),
});
export type GenerateTurnByTurnInput = z.infer<typeof GenerateTurnByTurnInputSchema>;


export const GenerateTurnByTurnOutputSchema = z.object({
  instruction: z.string().describe("A simple, clear, turn-by-turn navigation instruction."),
  icon: z.enum(['arrow-up', 'arrow-left', 'arrow-right', 'arrow-up-left', 'arrow-up-right', 'flag']).describe("The icon to display for the instruction."),
});
export type GenerateTurnByTurnOutput = z.infer<typeof GenerateTurnByTurnOutputSchema>;
