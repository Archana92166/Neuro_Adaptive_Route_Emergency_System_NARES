
"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, Flag, Loader2, Navigation, StopCircle, Volume2, VolumeX } from "lucide-react";
import type { GenerateTurnByTurnOutput } from "@/ai/flows/generate-turn-by-turn";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationControlsProps {
    currentInstruction: GenerateTurnByTurnOutput | null;
    onStop: () => void;
    onToggleAudio: () => void;
    isAudioEnabled: boolean;
}

const iconMap = {
    'arrow-up': ArrowUp,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'arrow-up-left': ArrowUpLeft,
    'arrow-up-right': ArrowUpRight,
    'flag': Flag
};

export function NavigationControls({ currentInstruction, onStop, onToggleAudio, isAudioEnabled }: NavigationControlsProps) {
    if (!currentInstruction) return null;

    const IconComponent = iconMap[currentInstruction.icon];

    return (
        <motion.div
            className="flex items-center gap-2 bg-background/90 backdrop-blur-sm p-2 pr-2 rounded-full shadow-lg w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="flex-shrink-0 p-3 bg-primary/20 rounded-full">
               {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
            </div>
            <div className="flex-grow">
                 <p className="font-semibold text-base truncate">{currentInstruction.instruction}</p>
            </div>
             <Button variant="ghost" size="icon" className="rounded-full" onClick={onToggleAudio}>
                {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
            </Button>
            <Button variant="destructive" size="icon" className="rounded-full" onClick={onStop}>
                <StopCircle className="h-5 w-5" />
            </Button>
        </motion.div>
    )
}
