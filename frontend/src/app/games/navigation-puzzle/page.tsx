
"use client";

import { AppHeader } from "@/components/neuronav/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Flag, MapPin, Undo, Sparkles, Check, X, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type CellType = "empty" | "start" | "end" | "obstacle" | "path";

interface Cell {
  type: CellType;
  row: number;
  col: number;
}

interface Level {
  id: number;
  name: string;
  grid: CellType[][];
}

const levels: Level[] = [
  {
    id: 1,
    name: "A Simple Stroll",
    grid: [
      ["start", "empty", "empty", "empty", "empty"],
      ["obstacle", "obstacle", "empty", "obstacle", "empty"],
      ["empty", "empty", "empty", "obstacle", "empty"],
      ["empty", "obstacle", "obstacle", "obstacle", "empty"],
      ["empty", "empty", "empty", "empty", "end"],
    ],
  },
  {
    id: 2,
    name: "The Long Way Home",
    grid: [
        ["start", "obstacle", "empty", "empty", "empty"],
        ["empty", "obstacle", "empty", "obstacle", "empty"],
        ["empty", "obstacle", "empty", "obstacle", "empty"],
        ["empty", "empty", "empty", "obstacle", "end"],
        ["obstacle", "obstacle", "obstacle", "obstacle", "obstacle"],
    ],
  },
  {
    id: 3,
    name: "Mind the Gap",
    grid: [
        ["start", "empty", "empty", "obstacle", "empty"],
        ["obstacle", "obstacle", "empty", "obstacle", "empty"],
        ["empty", "empty", "empty", "empty", "empty"],
        ["empty", "obstacle", "empty", "obstacle", "end"],
        ["empty", "obstacle", "empty", "empty", "empty"],
    ],
  },
];

export default function NavigationPuzzlePage() {
  const [isSensoryMode, setIsSensoryMode] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameState, setGameState] = useState<"playing" | "success" | "failure">("playing");

  const currentLevel = levels[currentLevelIndex];

  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel]);
  
  const loadLevel = (level: Level) => {
    const startPos = findCell(level.grid, "start");
    const newGrid = level.grid.map((row, r) =>
      row.map((type, c) => ({ type, row: r, col: c }))
    );
    setGrid(newGrid);
    setPath(startPos ? [[startPos.row, startPos.col]] : []);
    setGameState("playing");
  };

  const findCell = (grid: CellType[][], type: CellType) => {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === type) return { row: r, col: c };
      }
    }
    return null;
  };

  const handleCellInteraction = (row: number, col: number) => {
    if (gameState !== "playing" || grid[row][col].type === "obstacle") return;

    if (path.length > 0) {
      const [lastRow, lastCol] = path[path.length - 1];
      const isAdjacent = Math.abs(row - lastRow) + Math.abs(col - lastCol) === 1;
      const isAlreadyInPath = path.some(p => p[0] === row && p[1] === col);

      if(isAlreadyInPath) {
          const index = path.findIndex(p => p[0] === row && p[1] === col);
          if (index !== -1 && index < path.length -1) {
              setPath(p => p.slice(0, index + 1));
          }
      } else if (isAdjacent) {
        setPath([...path, [row, col]]);
      }
    }
  };

  const checkSolution = () => {
    if (path.length < 2) return;
    const [lastRow, lastCol] = path[path.length - 1];
    if (grid[lastRow][lastCol].type === 'end') {
        setGameState('success');
    } else {
        setGameState('failure');
        setTimeout(() => setGameState('playing'), 1500);
    }
  };
  
  const resetPath = () => {
      const startPos = findCell(currentLevel.grid, 'start');
      setPath(startPos ? [[startPos.row, startPos.col]] : []);
      setGameState('playing');
  }

  const goToNextLevel = () => {
      setCurrentLevelIndex(i => (i + 1) % levels.length);
  }

  const getCellType = (cell: Cell) => {
      const isInPath = path.some(p => p[0] === cell.row && p[1] === cell.col);
      if (isInPath && cell.type !== 'start' && cell.type !== 'end') return 'path';
      return cell.type;
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <AppHeader isSensoryMode={isSensoryMode} onSensoryModeChange={setIsSensoryMode} />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-headline bg-gradient-to-r from-teal-500 to-sky-500 text-transparent bg-clip-text">
              Navigation Puzzle
            </CardTitle>
            <CardDescription className="text-center">
              Draw a path from the start to the checkered flag!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Control Panel */}
            <div className="flex flex-col items-center gap-4 w-full lg:w-64">
                <Card className="w-full text-center p-4 bg-primary/10">
                    <CardTitle className="text-xl">{currentLevel.name}</CardTitle>
                    <CardDescription>Level {currentLevel.id}</CardDescription>
                </Card>

                <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg"><MapPin className="text-blue-500" /> Start</div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg"><Flag className="text-green-500" /> End</div>
                </div>
                
                <Button onClick={checkSolution} className="w-full bg-green-600 hover:bg-green-700">
                    <Check className="mr-2" /> Check Path
                </Button>
                <Button onClick={resetPath} variant="outline" className="w-full">
                    <Undo className="mr-2"/> Reset
                </Button>
                {gameState === 'success' && (
                     <Button onClick={goToNextLevel} className="w-full">Next Level</Button>
                )}
            </div>
            
            {/* Game Grid */}
            <div className="flex-grow flex flex-col items-center gap-4">
              <div
                className="grid gap-1 bg-muted/50 p-2 rounded-lg"
                style={{ gridTemplateColumns: `repeat(${currentLevel.grid[0].length}, minmax(0, 1fr))` }}
              >
                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    const type = getCellType(cell);
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={cn(
                          "aspect-square w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-md transition-all duration-200",
                          {
                            "bg-card/80 hover:bg-accent/80 cursor-pointer": type === "empty",
                            "bg-blue-500/80 shadow-lg": type === "start",
                            "bg-green-500/80 shadow-lg": type === "end",
                            "bg-slate-700/70": type === "obstacle",
                            "bg-yellow-400/80 animate-pulse-fast": type === "path",
                          }
                        )}
                        onMouseDown={() => {
                          if (cell.type !== 'start') return;
                          setIsDrawing(true);
                          handleCellInteraction(r,c);
                        }}
                        onMouseEnter={() => {
                          if (!isDrawing) return;
                           handleCellInteraction(r,c);
                        }}
                        onMouseUp={() => setIsDrawing(false)}
                        onClick={() => handleCellInteraction(r, c)}
                      >
                         {type === 'start' && <MapPin className="text-white" size={32}/>}
                         {type === 'end' && <Flag className="text-white" size={32} />}
                      </div>
                    );
                  })
                )}
              </div>
              {gameState === 'success' && (
                  <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700">
                      <Sparkles className="h-4 w-4 !text-green-600" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>You found the path. Great job!</AlertDescription>
                  </Alert>
              )}
               {gameState === 'failure' && (
                  <Alert variant="destructive">
                      <Brain className="h-4 w-4" />
                      <AlertTitle>Not Quite!</AlertTitle>
                      <AlertDescription>That's not the right path. Keep trying!</AlertDescription>
                  </Alert>
              )}
            </div>

          </CardContent>
        </Card>
      </main>
       <style jsx global>{`
        @keyframes pulse-fast {
            0%, 100% { opacity: 0.7; transform: scale(0.95)}
            50% { opacity: 1; transform: scale(1.05) }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
