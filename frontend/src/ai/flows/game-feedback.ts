'use server';

/**
 * @fileOverview Provides personalized feedback for games.
 *
 * - getGameFeedback - A function that generates encouraging feedback based on a game score.
 * - GameFeedbackInput - The input type for the getGameFeedback function.
 * - GameFeedbackOutput - The return type for the getGameFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GameFeedbackInputSchema = z.object({
  gameName: z.string().describe('The name of the game played.'),
  score: z.number().describe('The final score achieved by the user.'),
});
export type GameFeedbackInput = z.infer<typeof GameFeedbackInputSchema>;

const GameFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Encouraging and personalized feedback for the user.'),
  tip: z.string().describe('A helpful tip for improving in the next round.'),
});
export type GameFeedbackOutput = z.infer<typeof GameFeedbackOutputSchema>;


export async function getGameFeedback(
  input: GameFeedbackInput
): Promise<GameFeedbackOutput> {
  return gameFeedbackFlow(input);
}


const prompt = ai.definePrompt({
  name: 'gameFeedbackPrompt',
  input: { schema: GameFeedbackInputSchema },
  output: { schema: GameFeedbackOutputSchema },
  prompt: `You are an encouraging and friendly AI coach for a cognitive training app.

  A user has just finished playing a game and you need to provide them with positive feedback and a helpful tip.

  Game: {{{gameName}}}
  Score: {{{score}}}

  Analyze the score in the context of the game.
  - For "Cognitive Switch", a score above 20 is good. A score above 40 is great.
  - For "Sensory Matching", a score above 80 is good. A score above 150 is great.

  Generate a short, encouraging feedback message (1-2 sentences).
  Then, provide a simple, actionable tip (1 sentence) to help them improve their score next time.

  Keep the tone positive and supportive.
  `,
});


const gameFeedbackFlow = ai.defineFlow(
  {
    name: 'gameFeedbackFlow',
    inputSchema: GameFeedbackInputSchema,
    outputSchema: GameFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
