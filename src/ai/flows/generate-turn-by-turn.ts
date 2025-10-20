
'use server';
/**
 * @fileOverview Generates a turn-by-turn navigation instruction.
 *
 * - generateTurnByTurn - A function that creates a navigation instruction between two points.
 * - GenerateTurnByTurnInput - The input type for the generateTurnByTurn function.
 * - GenerateTurnByTurnOutput - The return type for the generateTurnByTurn function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAddressFromCoordinates } from '../tools/geocoding';

const PointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const GenerateTurnByTurnInputSchema = z.object({
  from: PointSchema.describe("The starting point of the navigation segment."),
  to: PointSchema.describe("The ending point of the navigation segment."),
  isLastStep: z.boolean().describe("Whether this is the final instruction of the route."),
});
export type GenerateTurnByTurnInput = z.infer<typeof GenerateTurnByTurnInputSchema>;


const GenerateTurnByTurnOutputSchema = z.object({
  instruction: z.string().describe("A simple, clear, turn-by-turn navigation instruction."),
  icon: z.enum(['arrow-up', 'arrow-left', 'arrow-right', 'arrow-up-left', 'arrow-up-right', 'flag']).describe("The icon to display for the instruction."),
});
export type GenerateTurnByTurnOutput = z.infer<typeof GenerateTurnByTurnOutputSchema>;

export async function generateTurnByTurn(input: GenerateTurnByTurnInput): Promise<GenerateTurnByTurnOutput> {
  return generateTurnByTurnFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateTurnByTurnPrompt',
  input: {
    schema: z.object({
      fromAddress: z.string(),
      toAddress: z.string(),
    })
  },
  output: {
    schema: z.object({
      instruction: z.string(),
    })
  },
  prompt: `Generate a short navigation instruction to get from the start address to the end address. Keep it simple.

Start: {{{fromAddress}}}
End: {{{toAddress}}}

Instruction:
`,
});

const generateTurnByTurnFlow = ai.defineFlow(
  {
    name: 'generateTurnByTurnFlow',
    inputSchema: GenerateTurnByTurnInputSchema,
    outputSchema: GenerateTurnByTurnOutputSchema,
  },
  async (input): Promise<GenerateTurnByTurnOutput> => {
    
    if (input.isLastStep) {
        return { instruction: "You have arrived at your destination.", icon: "flag" };
    }
    
    try {
        const fromAddress = await getAddressFromCoordinates({ lat: input.from.lat, lng: input.from.lng });
        const toAddress = await getAddressFromCoordinates({ lat: input.to.lat, lng: input.to.lng });
        
        if (!fromAddress || !toAddress) {
            return { instruction: "Continue on the current path.", icon: "arrow-up" };
        }

        const { output } = await prompt({ fromAddress, toAddress });
        
        if (!output) {
            return { instruction: "Continue on the current path.", icon: "arrow-up" };
        }

        // Basic icon determination logic
        const instruction = output.instruction.toLowerCase();
        let icon: GenerateTurnByTurnOutput['icon'] = 'arrow-up';
        if (instruction.includes('right')) {
            icon = 'arrow-right';
        } else if (instruction.includes('left')) {
            icon = 'arrow-left';
        }

        return { instruction: output.instruction, icon: icon };

    } catch (error) {
        console.error("Error in generateTurnByTurnFlow:", error);
        return { instruction: "Continue straight ahead.", icon: "arrow-up" };
    }
  }
);

    
