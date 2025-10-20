
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import React from 'react';


type IconName = keyof typeof LucideIcons;

const allIconNames = Object.keys(LucideIcons).filter(
  (n) =>
    !["createReactComponent", "LucideProps", "IconNode", "icons", "default"].includes(n)
) as IconName[];

interface GameItem {
  icon: IconName;
  color: string;
}

const colors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-indigo-500",
  "text-teal-500",
];

type Difficulty = "student" | "professional" | "expert";

const gameSettings = {
  student: { gridSize: 9, time: 60, gridCols: "grid-cols-3" },
  professional: { gridSize: 16, time: 45, gridCols: "grid-cols-4" },
  expert: { gridSize: 25, time: 30, gridCols: "grid-cols-5" },
};

const getRandomItem = (): GameItem => {
  const randomIcon = allIconNames[Math.floor(Math.random() * allIconNames.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return { icon: randomIcon, color: randomColor };
};

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function SensoryMatchingGame() {
  const searchParams = useSearchParams();
  const initialDifficulty = searchParams.get("difficulty") as Difficulty | null;

  const [isSensoryMode, setIsSensoryMode] = useState(false);
  const [targetItem, setTargetItem] = useState<GameItem | null>(null);
  const [gridItems, setGridItems] = useState<GameItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">(
    initialDifficulty ? "playing" : "idle"
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty || "professional");

  const { gridSize, time: initialTime, gridCols } = gameSettings[difficulty];

  useEffect(() => {
    if (initialDifficulty) {
        setDifficulty(initialDifficulty);
        startGame(initialDifficulty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDifficulty])


  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState("finished");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState]);

  const setupLevel = (currentDifficulty: Difficulty) => {
    const { gridSize: currentGridSize } = gameSettings[currentDifficulty];
    const newTarget = getRandomItem();
    setTargetItem(newTarget);

    const newGridItems: GameItem[] = [newTarget];
    while (newGridItems.length < currentGridSize) {
      const item = getRandomItem();
      // Ensure no duplicates
      if (!newGridItems.some(i => i.icon === item.icon && i.color === item.color) && (item.icon !== newTarget.icon || item.color !== newTarget.color)) {
        newGridItems.push(item);
      }
    }
    setGridItems(shuffleArray(newGridItems));
  };
  
  const startGame = (diff: Difficulty) => {
    const { time } = gameSettings[diff];
    setScore(0);
    setTimeLeft(time);
    setGameState("playing");
    setupLevel(diff);
  };

  const handleStartGame = () => {
    startGame(difficulty);
  }

  const handleItemClick = (item: GameItem) => {
    if (gameState !== "playing") return;

    if (item.icon === targetItem?.icon && item.color === targetItem?.color) {
      setScore(score + 10);
      setTimeLeft(timeLeft + 2); // Add a little time for correct answer
      setupLevel(difficulty);
    } else {
      setScore(Math.max(0, score - 5)); // Penalize for wrong answer
    }
  };

  const RenderIcon = ({ name, color, size = 64 }: { name: IconName; color: string; size?: number }) => {
    const IconComponent = LucideIcons[name] as React.ElementType;
    if (!IconComponent) return null;
    return <IconComponent className={color} size={size} />;
  };
  
  const handleDifficultyChange = (value: string) => {
      setDifficulty(value as Difficulty);
      setGameState("idle");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader
        isSensoryMode={isSensoryMode}
        onSensoryModeChange={setIsSensoryMode}
      />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-headline">
              Sensory Matching
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {gameState === "idle" && (
              <div className="text-center space-y-6">
                 <div>
                    <h3 className="mb-4 text-lg font-medium">Choose your challenge level:</h3>
                    <RadioGroup value={difficulty} onValueChange={handleDifficultyChange} className="flex justify-center gap-4 md:gap-8">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="student" id="student" />
                            <Label htmlFor="student">Student (Easy)</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="professional" id="professional" />
                            <Label htmlFor="professional">Professional (Medium)</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="expert" id="expert" />
                            <Label htmlFor="expert">Expert (Hard)</Label>
                        </div>
                    </RadioGroup>
                </div>
                <p>Find the matching icon in the grid as fast as you can.</p>
                <Button onClick={handleStartGame} size="lg">
                  Start Game
                </Button>
              </div>
            )}

            {gameState === "finished" && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Game Over!</h2>
                <p className="text-xl">Your final score is: {score}</p>
                <Button onClick={handleStartGame} size="lg">
                  Play Again
                </Button>
                 <Button variant="outline" onClick={() => setGameState('idle')}>
                  Change Difficulty
                </Button>
              </div>
            )}

            {gameState === "playing" && targetItem && (
              <>
                <div className="flex justify-around w-full text-lg font-semibold">
                  <span>Score: {score}</span>
                  <span>Time Left: {timeLeft}s</span>
                </div>
                <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-primary/10 w-full">
                  <p className="font-semibold">Find this icon:</p>
                  <div className="p-4 bg-card rounded-lg shadow-inner">
                    <RenderIcon name={targetItem.icon} color={targetItem.color} size={56}/>
                  </div>
                </div>
                <div className={`grid ${gridCols} gap-2 md:gap-4 w-full`}>
                  {gridItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleItemClick(item)}
                      className="flex items-center justify-center aspect-square rounded-lg bg-card hover:bg-accent transition-colors shadow-md"
                    >
                      <RenderIcon name={item.icon} color={item.color} size={40} />
                    </button>
                  ))}
                </div>
                 <Button variant="outline" size="sm" onClick={() => setGameState('finished')} className="mt-4">
                    End Game
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


export default function SensoryMatchingPage() {
    return (
        <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <SensoryMatchingGame />
        </React.Suspense>
    )
}
