
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MemoryStick, RefreshCw, Star, Brain, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type IconName = keyof typeof LucideIcons;

const allIcons: IconName[] = [
  "Cat", "Dog", "Fish", "Bird", "Rabbit", "Turtle", "Apple", "Carrot",
  "Car", "Train", "Plane", "Rocket", "Bike", "Boat", "Sun", "Moon", 
  "Cloud", "Snowflake", "Flame", "Droplet", "Gift", "Heart", "Home", "Key"
];

const difficultySettings = {
    beginner: { pairs: 6, grid: "grid-cols-4", cardSize: "w-20 h-20 md:w-24 md:h-24", iconSize: "h-10 w-10 md:h-12 md:w-12" },
    medium: { pairs: 8, grid: "grid-cols-4", cardSize: "w-16 h-16 md:w-20 md:h-20", iconSize: "h-8 w-8 md:h-10 md:w-10" },
};

type Difficulty = keyof typeof difficultySettings;

interface CardInfo {
  id: number;
  icon: IconName;
  isFlipped: boolean;
  isMatched: boolean;
}

const generateCards = (numPairs: number): CardInfo[] => {
  const selectedIcons = allIcons.sort(() => 0.5 - Math.random()).slice(0, numPairs);
  const cardPairs = [...selectedIcons, ...selectedIcons];
  const shuffledCards = cardPairs.sort(() => 0.5 - Math.random());
  return shuffledCards.map((icon, index) => ({
    id: index,
    icon,
    isFlipped: false,
    isMatched: false,
  }));
};

const iconColors = [ "text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500", "text-pink-500", "text-orange-500", "text-teal-500", "text-indigo-500", "text-cyan-500" ];
const getIconColor = (iconName: string) => {
    let hash = 0;
    for (let i = 0; i < iconName.length; i++) {
        hash = iconName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return iconColors[Math.abs(hash) % iconColors.length];
}

export default function Memory2DPage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won">("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(100);

  const settings = difficultySettings[difficulty];

  useEffect(() => {
    if (gameState === "playing") {
        if (cards.length > 0 && cards.every(c => c.isMatched)) {
            setGameState("won");
        }
    }
  }, [cards, gameState]);

  const startGame = () => {
    setCards(generateCards(settings.pairs));
    setFlippedCards([]);
    setScore(100);
    setGameState("playing");
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedCards]);

  const checkForMatch = () => {
    const [firstId, secondId] = flippedCards;
    const newCards = [...cards];

    if (newCards[firstId].icon === newCards[secondId].icon) {
      newCards[firstId].isMatched = true;
      newCards[secondId].isMatched = true;
      setScore(s => s + 50);
    } else {
      newCards[firstId].isFlipped = false;
      newCards[secondId].isFlipped = false;
      setScore(s => Math.max(0, s - 10));
    }

    setCards(newCards);
    setFlippedCards([]);
  };

  const RenderIcon = ({ name }: { name: IconName }) => {
    const IconComponent = LucideIcons[name] as React.ElementType;
    return IconComponent ? <IconComponent className={cn(settings.iconSize, getIconColor(name))} /> : <Brain />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-headline flex items-center justify-center gap-2">
              <MemoryStick /> 2D Memory Game
            </CardTitle>
            <CardDescription className="text-center">
              Find all the matching pairs!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">

            {gameState === 'idle' && (
                 <div className="text-center space-y-6 animate-in fade-in-50">
                    <h3 className="mb-4 text-lg font-medium">Choose your difficulty:</h3>
                    <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)} className="flex justify-center gap-4 md:gap-8">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="beginner" id="beginner" />
                            <Label htmlFor="beginner">Beginner</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium</Label>
                        </div>
                    </RadioGroup>
                    <Button onClick={startGame} size="lg">Start Game</Button>
                </div>
            )}
            
            {gameState === 'won' && (
                <div className="text-center p-8 space-y-4 animate-in fade-in-50 zoom-in-75">
                    <Trophy className="h-16 w-16 text-yellow-400 mx-auto animate-pulse" />
                    <h2 className="text-2xl font-bold text-primary">Congratulations!</h2>
                    <p className="text-muted-foreground">You found all the matches! Your final score is <span className="font-bold text-foreground">{score}</span>.</p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={startGame}>Play Again</Button>
                        <Button variant="outline" onClick={() => setGameState('idle')}>Change Level</Button>
                    </div>
                </div>
            )}
            
            {gameState === "playing" && (
                <div className="animate-in fade-in-50">
                    <div className="flex justify-between w-full max-w-sm mb-4">
                        <p className="font-bold text-lg">Score: {score}</p>
                        <Button onClick={() => setGameState('idle')} variant="outline" size="sm">
                            End Game
                        </Button>
                    </div>
                    <div className={cn("grid gap-2 md:gap-4", settings.grid)}>
                    {cards.map(card => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className={cn("flex items-center justify-center rounded-lg transition-transform duration-500 cursor-pointer", settings.cardSize)}
                            style={{ transformStyle: "preserve-3d", transform: card.isFlipped ? "rotateY(180deg)" : "" }}
                        >
                            {/* Front of card */}
                            <div className={cn("absolute w-full h-full flex items-center justify-center rounded-lg bg-primary/20 transition-all", {
                                "bg-green-500/20 pointer-events-none": card.isMatched,
                            })} style={{ backfaceVisibility: "hidden" }}>
                                <Star className={cn("text-primary/50", settings.iconSize, {"opacity-50": card.isMatched})} />
                            </div>
                            
                            {/* Back of card */}
                            <div className={cn("absolute w-full h-full flex items-center justify-center rounded-lg bg-card transition-all", {
                                "bg-green-500/20": card.isMatched,
                            })} style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                                <RenderIcon name={card.icon} />
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

    