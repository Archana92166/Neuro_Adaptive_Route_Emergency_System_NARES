import { config } from 'dotenv';
config();

import '@/ai/flows/adaptive-route-suggestions.ts';
import '@/ai/flows/route-sensory-summary.ts';
import '@/ai/flows/game-feedback.ts';
import '@/ai/flows/find-nearby-places.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/generate-turn-by-turn.ts';
import '@/ai/tools/directions.ts';
import '@/ai/tools/geocoding.ts';
