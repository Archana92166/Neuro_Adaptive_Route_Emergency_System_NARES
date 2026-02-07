
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Sparkles, RefreshCw } from "lucide-react";
import { useState, useMemo, DragEvent } from "react";
import { cn } from "@/lib/utils";

const PIECES = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500"];

export default function DragDropPage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);
  const [pieces, setPieces] = useState<string[]>([]);
  const [targets, setTargets] = useState<(string | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const shufflePieces = () => {
    setPieces(PIECES.sort(() => Math.random() - 0.5));
    setTargets(Array(PIECES.length).fill(null));
    setIsComplete(false);
  };

  useMemo(() => {
    shufflePieces();
  }, []);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, piece: string) => {
    e.dataTransfer.setData("text/plain", piece);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const piece = e.dataTransfer.getData("text/plain");
    if (targets[index] === null) {
      const newTargets = [...targets];
      newTargets[index] = piece;
      setTargets(newTargets);

      const newPieces = pieces.filter(p => p !== piece);
      setPieces(newPieces);
      
      checkCompletion([...newPieces], newTargets);
    }
  };
  
  const handleTargetDrop = (e: DragEvent<HTMLDivElement>, pieceInTarget: string, index: number) => {
    e.preventDefault();
    const pieceFromSource = e.dataTransfer.getData("text/plain");
    
    // Allow swapping
    const newTargets = [...targets];
    const newPieces = [...pieces];

    const sourceIndex = newTargets.indexOf(pieceFromSource);
    
    if (pieceFromSource && pieceFromSource !== pieceInTarget) {
      newTargets[index] = pieceFromSource;
      newPieces.push(pieceInTarget);
      if(sourceIndex !== -1) {
          newTargets[sourceIndex] = null;
      }
      setPieces(newPieces.filter(p => p !== pieceFromSource));
      setTargets(newTargets);
      checkCompletion(newPieces.filter(p => p !== pieceFromSource), newTargets);
    }
  };

  const checkCompletion = (currentPieces: string[], currentTargets: (string|null)[]) => {
     if(currentPieces.length === 0) {
        let correct = true;
        for(let i=0; i<PIECES.length; i++) {
            if(currentTargets[i] !== PIECES[i]) {
                correct = false;
                break;
            }
        }
        if(correct) {
            setIsComplete(true);
        }
    }
  }


  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-card/80 backdrop-blur-sm text-center">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-headline flex items-center justify-center gap-2">
              <Puzzle /> Drag & Drop Puzzle
            </CardTitle>
            <CardDescription className="text-center">
              Drag the colored pieces to their correct spots.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8">
            {/* Target Area */}
            <div className="grid grid-cols-4 gap-2 p-4 rounded-lg bg-muted/50 w-full">
              {PIECES.map((originalPiece, index) => (
                <div
                  key={index}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  className={cn("h-20 w-full rounded-md border-2 border-dashed flex items-center justify-center", 
                  { "border-muted-foreground": !targets[index] },
                  { "border-transparent": !!targets[index] }
                  )}
                >
                  {targets[index] && (
                    <div 
                        draggable 
                        onDragStart={(e) => handleDragStart(e, targets[index]!)}
                        onDrop={(e) => handleTargetDrop(e, targets[index]!, index)}
                        className={cn("h-full w-full rounded-md cursor-grab", targets[index])}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Source Pieces */}
            <div className="h-24 flex items-center justify-center gap-4">
              {pieces.map((piece) => (
                <div
                  key={piece}
                  draggable
                  onDragStart={(e) => handleDragStart(e, piece)}
                  className={cn("h-20 w-20 rounded-md cursor-grab animate-in fade-in-0", piece)}
                />
              ))}
            </div>
            
            {isComplete && (
                 <div className="text-center text-green-500 font-bold flex items-center gap-2 animate-pulse">
                    <Sparkles size={20}/> Great Job!
                </div>
            )}

            <Button onClick={shufflePieces} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
