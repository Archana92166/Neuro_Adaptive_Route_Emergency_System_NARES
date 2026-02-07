
"use client";

import React from "react";
import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Brain, Check, HelpCircle, Loader2, Play, Trophy, X } from "lucide-react";
import { fetchGameFeedback } from "@/app/actions";
import type { GameFeedbackOutput } from "@/ai/flows/game-feedback";
import { cn } from "@/lib/utils";

const shapes = ["circle", "square", "triangle"] as const;
const colors = ["red", "blue", "green"] as const;

const colorMap: { [key in typeof colors[number]]: string } = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
};

const shapeMap: { [key in typeof shapes[number]]: React.ReactNode } = {
  circle: <div className="w-24 h-24 rounded-full" />,
  square: <div className="w-24 h-24" />,
  triangle: <div className="w-0 h-0 border-l-[60px] border-l-transparent border-b-[100px] border-r-[60px] border-r-transparent" />,
};

type Rule = "shape" | "color";

interface Stimulus {
  shape: typeof shapes[number];
  color: typeof colors[number];
}

interface Trial {
  stimulus: Stimulus;
  rule: Rule;
  options: Stimulus[];
}

export default function CognitiveSwitchPage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentTrial, setCurrentTrial] = useState<Trial | null>(null);
  const [feedback, setFeedback] = useState<GameFeedbackOutput | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [answerState, setAnswerState] = useState<"correct" | "incorrect" | null>(null);

  const generateTrial = useCallback(() => {
    // Determine the rule for this trial
    const rule: Rule = Math.random() > 0.5 ? "shape" : "color";
    
    // Generate the target stimulus
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const targetStimulus: Stimulus = { shape: targetShape, color: targetColor };
    
    // Generate answer options
    const options: Stimulus[] = [targetStimulus];
    while(options.length < 3) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Ensure no duplicate options
      if (!options.some(opt => opt.shape === shape && opt.color === color)) {
        options.push({shape, color});
      }
    }

    setCurrentTrial({
      stimulus: targetStimulus,
      rule,
      options: options.sort(() => Math.random() - 0.5) // Shuffle options
    });
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState("playing");
    setFeedback(null);
    generateTrial();
  };

  const endGame = useCallback(async () => {
    setGameState("finished");
    setIsFeedbackLoading(true);
    const result = await fetchGameFeedback({ gameName: 'Cognitive Switch', score });
    if ('feedback' in result) {
      setFeedback(result);
    } else {
      setFeedback({ feedback: "Great job challenging your brain!", tip: "Staying focused on the current rule is key to improving your score." });
    }
    setIsFeedbackLoading(false);
  }, [score]);
  
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState, endGame]);

  const handleAnswer = (selectedOption: Stimulus) => {
    if (!currentTrial) return;

    let isCorrect = false;
    if(currentTrial.rule === 'color') {
        isCorrect = selectedOption.color === currentTrial.stimulus.color;
    } else { // rule is 'shape'
        isCorrect = selectedOption.shape === currentTrial.stimulus.shape;
    }

    setAnswerState(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
        setScore(s => s + 1);
    }

    setTimeout(() => {
        setAnswerState(null);
        generateTrial();
    }, 500);
  };

  const StimulusDisplay = ({ stimulus }: { stimulus: Stimulus }) => {
    const shapeNode = shapeMap[stimulus.shape];
    const colorClass = stimulus.shape === 'triangle' ? `border-b-${stimulus.color}-500` : colorMap[stimulus.color];
    
    // For triangle, we need to apply color to the border
    if (stimulus.shape === 'triangle') {
        const coloredShape = React.cloneElement(shapeNode as React.ReactElement, {
            className: cn((shapeNode as React.ReactElement).props.className, `border-b-${stimulus.color}-500`)
        });
        return coloredShape;
    }

    return React.cloneElement(shapeNode as React.ReactElement, {
      className: cn((shapeNode as React.ReactElement).props.className, colorClass)
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-headline bg-gradient-to-r from-green-500 to-sky-500 text-transparent bg-clip-text">Cognitive Switch</CardTitle>
            <CardDescription className="text-center">Test your mental flexibility by matching the rule.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8 min-h-[400px]">
             {gameState === "idle" && (
                <div className="text-center flex flex-col items-center justify-center h-full gap-4">
                    <p className="max-w-md text-muted-foreground">You will be shown an object and a rule ("Match Shape" or "Match Color"). Click the button that matches the target based on the current rule. It's a great workout for your executive function!</p>
                    <Button onClick={startGame} size="lg"><Play className="mr-2" /> Start Game</Button>
                </div>
            )}

            {gameState === "playing" && currentTrial && (
                 <div className="w-full flex flex-col items-center gap-6 animate-in fade-in-50">
                    <div className="flex justify-around w-full text-xl font-bold">
                        <span className="text-blue-600">Score: {score}</span>
                        <span className="text-purple-600">Time: {timeLeft}s</span>
                    </div>

                    <Card className="w-full p-4 flex flex-col items-center gap-4 bg-muted/50">
                         <h3 className="text-2xl font-bold">Match by <span className="text-primary">{currentTrial.rule.toUpperCase()}</span></h3>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <StimulusDisplay stimulus={currentTrial.stimulus} />
                        </div>
                    </Card>

                    <div className="grid grid-cols-3 gap-4 w-full">
                        {currentTrial.options.map((option, i) => {
                            const isTarget = option === currentTrial.stimulus;
                            const isCorrectAnswer = currentTrial.rule === 'color' ? option.color === currentTrial.stimulus.color : option.shape === currentTrial.stimulus.shape;
                             const showCorrect = answerState === 'correct' && isCorrectAnswer;
                             const showIncorrect = answerState === 'incorrect' && isCorrectAnswer;

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(option)}
                                    disabled={!!answerState}
                                    className={cn("h-32 w-full rounded-lg flex items-center justify-center transition-all duration-200",
                                    "bg-card hover:bg-accent",
                                    showCorrect && "bg-green-500/80 ring-4 ring-green-300",
                                    showIncorrect && "bg-red-500/80 ring-4 ring-red-300"
                                    )}
                                >
                                    <StimulusDisplay stimulus={option} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {gameState === "finished" && (
                <div className="text-center space-y-4 animate-in fade-in-50">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 text-transparent bg-clip-text">Game Over!</h2>
                    <p className="text-xl">Your final score is: <span className="font-bold text-primary">{score}</span></p>
                   
                    {isFeedbackLoading && <div className="flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> <p>Analyzing your performance...</p></div>}
                    
                    {feedback && (
                        <Card className="bg-primary/10 border-primary/30">
                            <CardHeader className="flex-row items-center gap-4">
                                 <Trophy className="h-8 w-8 text-yellow-500"/>
                                 <div>
                                    <CardTitle className="text-base text-left text-primary-foreground">Coach's Feedback</CardTitle>
                                 </div>
                            </CardHeader>
                            <CardContent className="text-left text-sm space-y-2">
                                <p>{feedback.feedback}</p>
                                <div className="flex items-start gap-2 text-muted-foreground">
                                    <Brain className="h-4 w-4 mt-1 shrink-0 text-yellow-400" />
                                    <p><span className="font-semibold">Tip:</span> {feedback.tip}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    
                    <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-green-500 to-sky-500 text-white">Play Again</Button>
                </div>
            )}

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
