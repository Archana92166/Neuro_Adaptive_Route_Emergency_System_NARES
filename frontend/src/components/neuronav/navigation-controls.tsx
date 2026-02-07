"use client";

import { Volume2, VolumeX, StopCircle } from "lucide-react";

export function NavigationControls({
  instruction,
  audioOn,
  toggleAudio,
  stop,
}: any) {
  if (!instruction) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white p-3 rounded shadow flex gap-3">
      <span>{instruction}</span>
      <button onClick={toggleAudio}>
        {audioOn ? <Volume2 /> : <VolumeX />}
      </button>
      <button onClick={stop}>
        <StopCircle />
      </button>
    </div>
  );
}
