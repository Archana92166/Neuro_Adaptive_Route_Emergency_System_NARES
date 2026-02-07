
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, PlayCircle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pianoKeys = [
  { note: "C", freq: 261.63, type: "white", key: "a" },
  { note: "C#", freq: 277.18, type: "black", key: "w" },
  { note: "D", freq: 293.66, type: "white", key: "s" },
  { note: "D#", freq: 311.13, type: "black", key: "e" },
  { note: "E", freq: 329.63, type: "white", key: "d" },
  { note: "F", freq: 349.23, type: "white", key: "f" },
  { note: "F#", freq: 369.99, type: "black", key: "t" },
  { note: "G", freq: 392.00, type: "white", key: "g" },
  { note: "G#", freq: 415.30, type: "black", key: "y" },
  { note: "A", freq: 440.00, type: "white", key: "h" },
  { note: "A#", freq: 466.16, type: "black", key: "u" },
  { note: "B", freq: 493.88, type: "white", key: "j" },
];

const songs = [
    { name: "Twinkle Twinkle Little Star", melody: [
        { note: "C", key: 'a', duration: 400 }, { note: "C", key: 'a', duration: 400 }, { note: "G", key: 'g', duration: 400 }, { note: "G", key: 'g', duration: 400 },
        { note: "A", key: 'h', duration: 400 }, { note: "A", key: 'h', duration: 400 }, { note: "G", key: 'g', duration: 800 },
        { note: "F", key: 'f', duration: 400 }, { note: "F", key: 'f', duration: 400 }, { note: "E", key: 'd', duration: 400 }, { note: "E", key: 'd', duration: 400 },
        { note: "D", key: 's', duration: 400 }, { note: "D", key: 's', duration: 400 }, { note: "C", key: 'a', duration: 800 },
    ]},
    { name: "Mary Had a Little Lamb", melody: [
        { note: "E", key: 'd', duration: 300 }, { note: "D", key: 's', duration: 300 }, { note: "C", key: 'a', duration: 300 }, { note: "D", key: 's', duration: 300 },
        { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 600 },
        { note: "D", key: 's', duration: 300 }, { note: "D", key: 's', duration: 300 }, { note: "D", key: 's', duration: 600 },
        { note: "E", key: 'd', duration: 300 }, { note: "G", key: 'g', duration: 300 }, { note: "G", key: 'g', duration: 600 },
    ]},
    { name: "Ode to Joy", melody: [
        { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 300 }, { note: "F", key: 'f', duration: 300 }, { note: "G", key: 'g', duration: 300 },
        { note: "G", key: 'g', duration: 300 }, { note: "F", key: 'f', duration: 300 }, { note: "E", key: 'd', duration: 300 }, { note: "D", key: 's', duration: 300 },
        { note: "C", key: 'a', duration: 300 }, { note: "C", key: 'a', duration: 300 }, { note: "D", key: 's', duration: 300 }, { note: "E", key: 'd', duration: 300 },
        { note: "E", key: 'd', duration: 450 }, { note: "D", key: 's', duration: 150 }, { note: "D", key: 's', duration: 600 },
    ]},
    { name: "Happy Birthday", melody: [
        { note: "C", key: 'a', duration: 250 }, { note: "C", key: 'a', duration: 250 }, { note: "D", key: 's', duration: 500 }, { note: "C", key: 'a', duration: 500 },
        { note: "F", key: 'f', duration: 500 }, { note: "E", key: 'd', duration: 1000 },
        { note: "C", key: 'a', duration: 250 }, { note: "C", key: 'a', duration: 250 }, { note: "D", key: 's', duration: 500 }, { note: "C", key: 'a', duration: 500 },
        { note: "G", key: 'g', duration: 500 }, { note: "F", key: 'f', duration: 1000 },
    ]},
    { name: "Jingle Bells", melody: [
        { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 600 },
        { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 600 },
        { note: "E", key: 'd', duration: 300 }, { note: "G", key: 'g', duration: 300 }, { note: "C", key: 'a', duration: 450 }, { note: "D", key: 's', duration: 150 }, { note: "E", key: 'd', duration: 900 },
    ]},
    { name: "Row Your Boat", melody: [
        { note: "C", key: 'a', duration: 400 }, { note: "C", key: 'a', duration: 400 }, { note: "C", key: 'a', duration: 300 }, { note: "D", key: 's', duration: 100 }, { note: "E", key: 'd', duration: 400 },
        { note: "E", key: 'd', duration: 300 }, { note: "D", key: 's', duration: 100 }, { note: "E", key: 'd', duration: 300 }, { note: "F", key: 'f', duration: 100 }, { note: "G", key: 'g', duration: 800 },
    ]},
    { name: "Itsy Bitsy Spider", melody: [
        { note: "G", key: 'g', duration: 300 }, { note: "C", key: 'a', duration: 300 }, { note: "C", key: 'a', duration: 300 }, { note: "C", key: 'a', duration: 300 }, { note: "D", key: 's', duration: 300 }, { note: "E", key: 'd', duration: 300 },
        { note: "E", key: 'd', duration: 600 }, { note: "D", key: 's', duration: 300 }, { note: "C", key: 'a', duration: 300 }, { note: "D", key: 's', duration: 300 }, { note: "E", key: 'd', duration: 300 }, { note: "C", key: 'a', duration: 600 },
    ]},
    { name: "London Bridge", melody: [
        { note: "G", key: 'g', duration: 400 }, { note: "A", key: 'h', duration: 400 }, { note: "G", key: 'g', duration: 400 }, { note: "F", key: 'f', duration: 400 },
        { note: "E", key: 'd', duration: 400 }, { note: "F", key: 'f', duration: 400 }, { note: "G", key: 'g', duration: 800 },
        { note: "D", key: 's', duration: 400 }, { note: "E", key: 'd', duration: 400 }, { note: "F", key: 'f', duration: 800 },
    ]},
    { name: "Old MacDonald", melody: [
        { note: "G", key: 'g', duration: 300 }, { note: "G", key: 'g', duration: 300 }, { note: "G", key: 'g', duration: 300 }, { note: "D", key: 's', duration: 300 },
        { note: "E", key: 'd', duration: 300 }, { note: "E", key: 'd', duration: 300 }, { note: "D", key: 's', duration: 600 },
        { note: "B", key: 'j', duration: 300 }, { note: "B", key: 'j', duration: 300 }, { note: "A", key: 'h', duration: 300 }, { note: "A", key: 'h', duration: 300 }, { note: "G", key: 'g', duration: 900 },
    ]},
    { name: "Baby Shark", melody: [
        { note: "D", key: 's', duration: 300 }, { note: "E", key: 'd', duration: 300 }, 
        { note: "G", key: 'g', duration: 300 }, { note: "G", key: 'g', duration: 300 }, { note: "G", key: 'g', duration: 300 }, { note: "G", key: 'g', duration: 300 },
        { note: "G", key: 'g', duration: 300 }, { note: "G", key: 'g', duration: 300 }, 
    ]},
];

export default function PianoPage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [selectedSongIndex, setSelectedSongIndex] = useState(0);

  const selectedSong = songs[selectedSongIndex];

  const initAudioContext = () => {
      if (!audioContext) {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          setAudioContext(context);
      }
  }

  useEffect(() => {
    return () => {
      audioContext?.close();
    };
  }, [audioContext]);

  const playNote = useCallback((frequency: number, noteName: string, duration: number = 300) => {
    if (!audioContext) return;
    setActiveNote(noteName);
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (duration / 1000));

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + (duration / 1000) + 0.1);

    setTimeout(() => {
        setActiveNote(null);
    }, duration);
  }, [audioContext]);

  const playDemoSong = async () => {
    initAudioContext();
    if (isPlayingDemo || !audioContext) return;
    setIsPlayingDemo(true);
    for (const noteInfo of selectedSong.melody) {
        const key = pianoKeys.find(k => k.note === noteInfo.note);
        if (key) {
            playNote(key.freq, key.note, noteInfo.duration);
        }
        await new Promise(resolve => setTimeout(resolve, noteInfo.duration));
    }
    setIsPlayingDemo(false);
  }

  const handleManualPlay = (freq: number, note: string) => {
      initAudioContext();
      playNote(freq, note);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.repeat) return;
        const key = pianoKeys.find(k => k.key === event.key.toLowerCase());
        if(key && !isPlayingDemo) {
            handleManualPlay(key.freq, key.note);
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [playNote, isPlayingDemo, handleManualPlay]);

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-headline flex items-center justify-center gap-2">
              <Music /> Piano Game
            </CardTitle>
            <CardDescription className="text-center">
              Click the keys or use your keyboard (A, S, D...).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 p-2 md:p-6">
            
            <div className="w-full max-w-2xl space-y-4">
                <div className="flex items-center justify-between">
                    <Select onValueChange={(value) => setSelectedSongIndex(parseInt(value))} defaultValue={selectedSongIndex.toString()}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a song to practice" />
                        </SelectTrigger>
                        <SelectContent>
                            {songs.map((song, index) => (
                                <SelectItem key={index} value={index.toString()}>{song.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Button onClick={playDemoSong} disabled={isPlayingDemo}>
                        <PlayCircle className="mr-2"/>
                        {isPlayingDemo ? "Playing..." : "Play Demo"}
                    </Button>
                </div>
                <Card className="p-4 bg-muted/50 text-center">
                    <CardTitle className="text-lg mb-2">Practice Keys</CardTitle>
                    <div className="flex flex-wrap gap-2 justify-center font-mono text-lg">
                        {selectedSong.melody.map((note, index) => (
                            <span key={index} className="p-2 bg-background rounded-md shadow-sm uppercase">{note.key}</span>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="relative flex h-48 scale-75 md:scale-100">
              {pianoKeys.map((key) =>
                key.type === "white" ? (
                  <Button
                    key={key.note}
                    onMouseDown={() => handleManualPlay(key.freq, key.note)}
                    className={cn(
                        "w-12 h-full bg-white text-black border-2 border-slate-300 rounded-none first:rounded-l-lg last:rounded-r-lg hover:bg-slate-200 active:bg-slate-300 transition-colors duration-75",
                        (activeNote === key.note || (isPlayingDemo && activeNote === key.note)) && "bg-cyan-300"
                    )}
                    aria-label={`Play note ${key.note}`}
                  >
                    <span className="self-end pb-2 font-bold">{key.key.toUpperCase()}</span>
                  </Button>
                ) : null
              )}
              {pianoKeys.map((key, index) =>
                key.type === "black" ? (
                  <Button
                    key={key.note}
                    onMouseDown={() => handleManualPlay(key.freq, key.note)}
                    className={cn(
                        "w-8 h-28 bg-black text-white border-2 border-black rounded-b-md absolute z-10 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-75",
                        (activeNote === key.note || (isPlayingDemo && activeNote === key.note)) && "bg-cyan-500"
                    )}
                    style={{ left: `${(index - (Math.floor(index / 7) * 2 + (index > 4 ? 1 : 0))) * 3.05 + 1.9}rem` }}
                    aria-label={`Play note ${key.note}`}
                  >
                     <span className="self-end pb-2 font-bold">{key.key.toUpperCase()}</span>
                  </Button>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
    