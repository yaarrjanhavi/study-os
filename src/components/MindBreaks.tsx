import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  Lock, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Pause, 
  ArrowRight, 
  HelpCircle,
  Trophy,
  RefreshCw,
  Flame,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";

interface MindBreaksProps {
  timerTimeLeft: number;
  timerMode: "focus" | "shortBreak" | "longBreak";
  timerIsRunning: boolean;
  setTimerIsRunning: (running: boolean) => void;
  hasBreakExtensionBeenUsed: boolean;
  handleExtendBreak: () => void;
  setActiveTab: (tab: string) => void;
  setTimerMode: (mode: "focus" | "shortBreak" | "longBreak") => void;
  setTimerDuration: (dur: number) => void;
  setTimerTimeLeft: (time: number) => void;
}

export default function MindBreaks({
  timerTimeLeft,
  timerMode,
  timerIsRunning,
  setTimerIsRunning,
  hasBreakExtensionBeenUsed,
  handleExtendBreak,
  setActiveTab,
  setTimerMode,
  setTimerDuration,
  setTimerTimeLeft
}: MindBreaksProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // If a focus session is active, show the lock screen
  const isBreakActive = timerMode === "shortBreak" || timerMode === "longBreak";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResumeStudy = () => {
    // Stop break timer, switch back to focus session
    setTimerIsRunning(false);
    setTimerMode("focus");
    setTimerDuration(25);
    setTimerTimeLeft(25 * 60);
    setActiveTab("dashboard");
  };

  if (!isBreakActive) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md bg-shell p-8 md:p-10 rounded-[2.5rem] border border-stone shadow-calm flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-stone flex items-center justify-center text-viridian/45">
            <Lock className="w-7 h-7" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-2xl font-bold text-viridian tracking-tight">
              Mind Breaks Locked 🌿
            </h2>
            <p className="font-mono text-xs text-viridian/65 leading-relaxed">
              To keep your study desk focused, games are only accessible during scheduled Pomodoro breaks.
            </p>
          </div>

          <div className="w-full bg-stone/30 border border-stone-dark/15 p-4 rounded-2xl text-[10px] font-mono text-viridian/70">
            Start a Pomodoro timer and complete a study session. Once completed, your break session will automatically unlock this section!
          </div>

          <button
            onClick={() => setActiveTab("timer")}
            className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-6 py-3 rounded-xl transition-all shadow-soft flex items-center gap-2"
          >
            Go to Study Timer
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 relative select-none pb-12">
      
      {/* 1. Floating Sticky Timer Header */}
      <div className="sticky top-0 z-20 glass-card p-4 rounded-2xl border border-stone/60 shadow-soft flex justify-between items-center bg-shell/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1.5">
            <Coffee className="w-4 h-4 text-orange-600 animate-pulse" />
            Mind Breaks
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-viridian/30" />
          <span className="hidden sm:inline-block font-mono text-[9px] text-viridian/60 uppercase">
            Rest & Restore
          </span>
        </div>

        {/* Floating countdown controls */}
        <div className="flex items-center gap-3">
          <div className={`font-mono text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-2 shadow-soft
            ${timerTimeLeft < 60 ? "bg-red-100 border-red-200 text-red-700 animate-pulse" : "bg-honeydew border-viridian/20 text-[#344945]"}
          `}>
            <span>Break Time: {formatTime(timerTimeLeft)}</span>
          </div>

          <button
            onClick={() => setTimerIsRunning(!timerIsRunning)}
            className="p-2 rounded-xl border border-stone/50 bg-shell/45 text-viridian hover:bg-stone/30 transition-all shadow-soft"
            title={timerIsRunning ? "Pause Timer" : "Start Timer"}
          >
            {timerIsRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResumeStudy}
            className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-soft"
          >
            End Break
          </button>
        </div>
      </div>

      {/* 2. Core Games Deck */}
      <div className="flex-1">
        {activeGame === null ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Game Card: Wordle */}
            <div 
              onClick={() => setActiveGame("wordle")}
              className="glass-card p-5 rounded-[2rem] border border-stone/60 hover:shadow-calm transition-all cursor-pointer flex flex-col gap-3.5 group bg-shell/65"
            >
              <div className="w-10 h-10 rounded-2xl bg-honeydew/60 border border-viridian/15 flex items-center justify-center text-viridian group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif text-lg font-bold">W</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1 group-hover:text-viridian-hover">
                  Daily Wordle
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </span>
                <p className="font-mono text-[10px] text-viridian/60 leading-normal">
                  Solve the daily 5-letter study word. One puzzle per day to encourage short, mindful focus.
                </p>
              </div>
            </div>

            {/* Game Card: Tiny Jigsaw */}
            <div 
              onClick={() => setActiveGame("jigsaw")}
              className="glass-card p-5 rounded-[2rem] border border-stone/60 hover:shadow-calm transition-all cursor-pointer flex flex-col gap-3.5 group bg-shell/65"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky/55 border border-sky-dark/15 flex items-center justify-center text-viridian group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif text-lg font-bold">J</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1 group-hover:text-viridian-hover">
                  Tiny Jigsaw
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </span>
                <p className="font-mono text-[10px] text-viridian/60 leading-normal">
                  Swap pieces to reconstruct a simple, calming 3x3 (9-piece) garden desk illustration.
                </p>
              </div>
            </div>

            {/* Game Card: Number Memory */}
            <div 
              onClick={() => setActiveGame("number")}
              className="glass-card p-5 rounded-[2rem] border border-stone/60 hover:shadow-calm transition-all cursor-pointer flex flex-col gap-3.5 group bg-shell/65"
            >
              <div className="w-10 h-10 rounded-2xl bg-stone/65 border border-stone-dark/15 flex items-center justify-center text-viridian group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif text-lg font-bold">N</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1 group-hover:text-viridian-hover">
                  Number Memory
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </span>
                <p className="font-mono text-[10px] text-viridian/60 leading-normal">
                  Recall a sequence of digits. The number grows longer on each success. Restores logical paths.
                </p>
              </div>
            </div>

            {/* Game Card: Pattern Memory */}
            <div 
              onClick={() => setActiveGame("pattern")}
              className="glass-card p-5 rounded-[2rem] border border-stone/60 hover:shadow-calm transition-all cursor-pointer flex flex-col gap-3.5 group bg-shell/65"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky/50 border border-sky-dark/15 flex items-center justify-center text-viridian group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif text-lg font-bold">P</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1 group-hover:text-viridian-hover">
                  Pattern Memory
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </span>
                <p className="font-mono text-[10px] text-viridian/60 leading-normal">
                  Memorize the highlighted grid cells and click to recreate the spatial pattern layout.
                </p>
              </div>
            </div>

            {/* Game Card: Spot the Difference */}
            <div 
              onClick={() => setActiveGame("spot")}
              className="glass-card p-5 rounded-[2rem] border border-stone/60 hover:shadow-calm transition-all cursor-pointer flex flex-col gap-3.5 group bg-shell/65"
            >
              <div className="w-10 h-10 rounded-2xl bg-honeydew/50 border border-viridian/15 flex items-center justify-center text-viridian group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif text-lg font-bold">S</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1 group-hover:text-viridian-hover">
                  Spot the Difference
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </span>
                <p className="font-mono text-[10px] text-viridian/60 leading-normal">
                  Compare two near-identical vector drawings of a cozy window and spot 3 small differences.
                </p>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setActiveGame(null)}
              className="self-start font-mono text-[10px] text-viridian hover:underline flex items-center gap-1 bg-stone/40 border border-stone px-3 py-1.5 rounded-xl transition-all"
            >
              ← Back to Games list
            </button>
            
            {activeGame === "wordle" && <WordleGame />}
            {activeGame === "jigsaw" && <JigsawGame />}
            {activeGame === "number" && <NumberGame />}
            {activeGame === "pattern" && <PatternGame />}
            {activeGame === "spot" && <SpotGame />}
          </div>
        )}
      </div>

      {/* 3. Timer Expired Modal Dialog Overlay */}
      <AnimatePresence>
        {timerTimeLeft === 0 && (
          <div className="fixed inset-0 bg-viridian/40 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-shell p-8 md:p-10 rounded-[2.5rem] border border-stone shadow-calm text-center flex flex-col items-center gap-6"
            >
              <img 
                src="/logo (light).png" 
                alt="StudyOS Logo" 
                className="w-12 h-12 object-contain"
              />
              
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-2xl font-bold text-viridian tracking-tight">
                  Break Time Expired! 🌿
                </h2>
                <p className="font-mono text-xs text-viridian/60 leading-relaxed">
                  You completed your scheduled restorative rest. Ready to return to study focus mode?
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleResumeStudy}
                  className="w-full bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs py-3.5 rounded-xl transition-all shadow-soft font-bold"
                >
                  Resume Study
                </button>

                {!hasBreakExtensionBeenUsed ? (
                  <button
                    onClick={handleExtendBreak}
                    className="w-full border border-stone hover:bg-stone/20 text-viridian font-mono text-xs py-3.5 rounded-xl transition-all shadow-soft"
                  >
                    +3 More Minutes (Available Once)
                  </button>
                ) : (
                  <span className="font-mono text-[9px] text-viridian/45 italic mt-1">
                    API extension already consumed for this break.
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// 1. GAME COMPONENT: Wordle
// ==========================================
function WordleGame() {
  const WORD_LIST = [
    "FOCUS", "BRAIN", "STUDY", "LEARN", "SMART", "LIGHT", "GRASS", "PEACE",
    "WATER", "GREEN", "ALPHA", "THINK", "WRITE", "PAPER", "PLANT", "SHINE",
    "DESKS", "QUIET", "SOLVE", "SPACE", "CLOCK", "STONE", "GLASS", "FLUID"
  ];

  const getDailyWord = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % WORD_LIST.length;
    return WORD_LIST[index];
  };

  const [solution] = useState(getDailyWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"PLAYING" | "WON" | "LOST">("PLAYING");

  useEffect(() => {
    // Check if daily word status is cached
    const todayKey = new Date().toDateString();
    const cached = localStorage.getItem(`studyos_wordle_${todayKey}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      setGuesses(parsed.guesses);
      setGameStatus(parsed.status);
    }
  }, []);

  const saveWordleState = (nextGuesses: string[], status: "PLAYING" | "WON" | "LOST") => {
    const todayKey = new Date().toDateString();
    localStorage.setItem(`studyos_wordle_${todayKey}`, JSON.stringify({ guesses: nextGuesses, status }));
  };

  const handleKeyPress = (char: string) => {
    if (gameStatus !== "PLAYING") return;
    if (guesses.length >= 6) return;

    if (char === "ENTER") {
      if (currentGuess.length !== 5) return;
      const nextGuesses = [...guesses, currentGuess];
      setGuesses(nextGuesses);
      
      let nextStatus: "PLAYING" | "WON" | "LOST" = "PLAYING";
      if (currentGuess === solution) {
        nextStatus = "WON";
        setGameStatus("WON");
        confetti({ particleCount: 60, spread: 50, colors: ["#344945", "#E4E3BC"] });
      } else if (nextGuesses.length >= 6) {
        nextStatus = "LOST";
        setGameStatus("LOST");
      }
      saveWordleState(nextGuesses, nextStatus);
      setCurrentGuess("");
    } else if (char === "BACK") {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(char)) {
      setCurrentGuess(prev => prev + char);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER") handleKeyPress("ENTER");
      else if (key === "BACKSPACE" || key === "BACK") handleKeyPress("BACK");
      else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, guesses, gameStatus]);

  const getLetterStyle = (char: string, index: number, isSubmitted: boolean) => {
    const base = "w-10 h-10 md:w-12 md:h-12 border flex items-center justify-center font-mono text-sm md:text-base font-bold rounded-xl transition-all";
    if (!isSubmitted) return `${base} border-stone/80 text-viridian bg-shell/50`;
    
    if (solution[index] === char) {
      return `${base} bg-viridian border-viridian text-shell`; // green match
    }
    if (solution.includes(char)) {
      return `${base} bg-[#D5E3E8] border-[#A8C7D3] text-[#344945]`; // yellow partial match
    }
    return `${base} bg-stone/40 border-stone text-viridian/45`; // gray wrong letter
  };

  const getKeyboardKeyStyle = (char: string) => {
    const base = "px-2 py-3 rounded-lg border text-[10px] font-mono font-bold transition-all hover:bg-stone/30 select-none cursor-pointer text-viridian";
    
    // Find highest match state for key
    let state = "normal";
    guesses.forEach(g => {
      for (let i = 0; i < 5; i++) {
        if (g[i] === char) {
          if (solution[i] === char) state = "green";
          else if (solution.includes(char) && state !== "green") state = "yellow";
          else if (state === "normal") state = "gray";
        }
      }
    });

    if (state === "green") return `${base} bg-viridian border-viridian text-shell hover:bg-viridian-hover`;
    if (state === "yellow") return `${base} bg-[#D5E3E8] border-[#A8C7D3] text-[#344945]`;
    if (state === "gray") return `${base} bg-stone/20 border-stone text-viridian/40`;
    return `${base} bg-shell border-stone/50`;
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
  ];

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-stone/60 max-w-md mx-auto w-full flex flex-col items-center gap-6 bg-shell/65">
      <div className="text-center flex flex-col gap-1 shrink-0">
        <span className="font-serif text-base font-bold text-viridian">Restful Wordle</span>
        <span className="font-mono text-[9px] text-viridian/60 uppercase">1 Study Word puzzle per day</span>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {Array.from({ length: 6 }).map((_, rIdx) => {
          const guess = guesses[rIdx] || "";
          const isSubmitted = rIdx < guesses.length;
          
          return (
            <div key={rIdx} className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, cIdx) => {
                const char = isSubmitted ? guess[cIdx] : (rIdx === guesses.length ? currentGuess[cIdx] : "");
                return (
                  <div key={cIdx} className={getLetterStyle(char || "", cIdx, isSubmitted)}>
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Status announcement */}
      {gameStatus !== "PLAYING" && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-full p-4 rounded-2xl border text-center font-mono text-[10px] leading-relaxed
            ${gameStatus === "WON" ? "bg-honeydew border-viridian/20 text-[#344945]" : "bg-red-100 border-red-200 text-red-700"}
          `}
        >
          {gameStatus === "WON" ? (
            <span>🎉 Congratulations! You solved the daily word: <strong>{solution}</strong>. Your brain is refreshed!</span>
          ) : (
            <span>Hard luck! The daily word was <strong>{solution}</strong>. Rest up and try again tomorrow.</span>
          )}
        </motion.div>
      )}

      {/* Keyboard */}
      <div className="w-full flex flex-col gap-1.5 select-none shrink-0">
        {keyboardRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 w-full">
            {row.map((char) => (
              <div 
                key={char} 
                onClick={() => handleKeyPress(char)}
                className={getKeyboardKeyStyle(char)}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. GAME COMPONENT: Tiny Jigsaw
// ==========================================
function JigsawGame() {
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const initGame = () => {
    // Generate indices 0..8 shuffled
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Simple shuffle loop
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Check if by chance shuffled is solved. If so, swap two elements.
    if (arr.every((val, idx) => val === idx)) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    setPieces(arr);
    setSelectedIdx(null);
    setSolved(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleTileClick = (index: number) => {
    if (solved) return;
    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      if (selectedIdx === index) {
        setSelectedIdx(null);
        return;
      }
      // Swap elements
      const newPieces = [...pieces];
      const temp = newPieces[selectedIdx];
      newPieces[selectedIdx] = newPieces[index];
      newPieces[index] = temp;
      setPieces(newPieces);
      setSelectedIdx(null);

      // Check solved
      if (newPieces.every((val, idx) => val === idx)) {
        setSolved(true);
        confetti({ particleCount: 80, spread: 60, colors: ["#D5E3E8", "#E4E3BC", "#344945"] });
      }
    }
  };

  // Render SVG slice based on original index
  const renderSvgSlice = (sliceIndex: number) => {
    const row = Math.floor(sliceIndex / 3);
    const col = sliceIndex % 3;
    
    // ViewBox is calculated: col*100 row*100 width=100 height=100
    return (
      <svg viewBox={`${col * 100} ${row * 100} 100 100`} className="w-full h-full text-viridian">
        {/* Sky Background */}
        <rect x="0" y="0" width="300" height="300" fill="#F7F5F1" />
        
        {/* Soft mountains */}
        <path d="M-50,220 L75,120 L150,220 Z" fill="#E0DCD1" opacity="0.6" />
        <path d="M100,220 L200,90 L320,220 Z" fill="#E0DCD1" opacity="0.8" />
        
        {/* Large calming Sun */}
        <circle cx="150" cy="110" r="35" fill="#E4E3BC" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Ground grid */}
        <rect x="0" y="210" width="300" height="90" fill="#D5E3E8" opacity="0.5" />
        <line x1="0" y1="210" x2="300" y2="210" stroke="currentColor" strokeWidth="1.5" />

        {/* Quiet Flower Stem */}
        <path d="M150,270 Q145,230 150,180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Leaves */}
        <path d="M150,240 Q130,230 135,225" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M150,215 Q170,205 165,200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* Blossoming Flower petal shapes */}
        <circle cx="150" cy="180" r="10" fill="#F7F5F1" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="150" cy="166" r="8" fill="#E4E3BC" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="150" cy="194" r="8" fill="#E4E3BC" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="136" cy="180" r="8" fill="#E4E3BC" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="164" cy="180" r="8" fill="#E4E3BC" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-stone/60 max-w-sm mx-auto w-full flex flex-col items-center gap-6 bg-shell/65">
      <div className="text-center flex flex-col gap-1">
        <span className="font-serif text-base font-bold text-viridian">Zen Tiny Jigsaw</span>
        <span className="font-mono text-[9px] text-viridian/60 uppercase">Tap two tiles to swap their positions</span>
      </div>

      {/* Grid Canvas */}
      <div className="w-64 h-64 border border-stone-dark/40 rounded-2xl overflow-hidden grid grid-cols-3 gap-0.5 bg-stone-dark/35 shadow-soft">
        {pieces.map((val, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = val === idx;
          
          return (
            <div
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`aspect-square w-full relative cursor-pointer border overflow-hidden transition-all duration-300
                ${isSelected ? "border-sky-dark ring-2 ring-sky scale-[0.98] z-10" : "border-stone/20"}
                ${solved ? "pointer-events-none" : ""}
              `}
            >
              {renderSvgSlice(val)}
              {/* Highlight if correct index positioning on active puzzle */}
              {isCorrect && !solved && (
                <div className="absolute right-1 bottom-1 w-2.5 h-2.5 bg-honeydew border border-viridian/35 rounded-full flex items-center justify-center">
                  <Check className="w-1.5 h-1.5 text-viridian" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {solved ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full flex flex-col items-center gap-3"
        >
          <div className="p-3 bg-honeydew border border-viridian/25 text-center font-mono text-[10px] text-[#344945] rounded-xl leading-normal w-full">
            🌸 Beautifully assembled! Solved. Mind restored.
          </div>
          <button
            onClick={initGame}
            className="flex items-center gap-1 font-mono text-[9px] bg-viridian text-shell px-3 py-2 rounded-xl hover:bg-viridian-hover transition-all shadow-soft"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Play Again
          </button>
        </motion.div>
      ) : (
        <button
          onClick={initGame}
          className="font-mono text-[9px] text-viridian/50 hover:text-viridian underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reshuffle Grid
        </button>
      )}
    </div>
  );
}

// ==========================================
// 3. GAME COMPONENT: Number Memory
// ==========================================
function NumberGame() {
  const [level, setLevel] = useState(1);
  const [numberToRecall, setNumberToRecall] = useState("");
  const [userInput, setUserInput] = useState("");
  const [gameState, setGameState] = useState<"START" | "MEMORIZE" | "INPUT" | "RESULT">("START");
  const [timeLeft, setTimeLeft] = useState(3);

  const startNextLevel = (lvl: number) => {
    // Generate level + 2 random digits
    let numStr = "";
    for (let i = 0; i < lvl + 2; i++) {
      numStr += Math.floor(Math.random() * 10).toString();
    }
    setNumberToRecall(numStr);
    setUserInput("");
    setGameState("MEMORIZE");
    setTimeLeft(3); // 3 seconds memorize timer
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (gameState === "MEMORIZE") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("INPUT");
            if (timer) clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === numberToRecall) {
      confetti({ particleCount: 20, spread: 20, colors: ["#E4E3BC", "#344945"] });
      setLevel(prev => prev + 1);
      setGameState("RESULT");
    } else {
      setGameState("RESULT");
    }
  };

  const handleStartGame = () => {
    setLevel(1);
    startNextLevel(1);
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-stone/60 max-w-sm mx-auto w-full flex flex-col items-center gap-6 bg-shell/65">
      <div className="text-center flex flex-col gap-1">
        <span className="font-serif text-base font-bold text-viridian">Number Recall</span>
        <span className="font-mono text-[9px] text-viridian/60 uppercase">Boost short-term working retention</span>
      </div>

      {gameState === "START" && (
        <div className="flex flex-col items-center gap-5 py-6">
          <div className="w-12 h-12 rounded-full bg-sky/50 flex items-center justify-center text-viridian">
            <Trophy className="w-6 h-6" />
          </div>
          <p className="font-mono text-[10px] text-viridian/70 text-center leading-relaxed max-w-xs">
            Memorize the digits shown on the screen, then type them back. The chain gets 1 digit longer on each successful level.
          </p>
          <button
            onClick={handleStartGame}
            className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-6 py-3 rounded-xl transition-all shadow-soft font-bold"
          >
            Start Memory Check
          </button>
        </div>
      )}

      {gameState === "MEMORIZE" && (
        <div className="flex flex-col items-center gap-6 py-6 w-full">
          <div className="flex flex-col gap-1 items-center">
            <span className="font-mono text-[8px] text-viridian/50 uppercase tracking-wider">Level {level} digits:</span>
            <span className="font-serif text-3xl font-bold text-viridian tracking-[0.25em] pl-[0.25em] animate-pulse">
              {numberToRecall}
            </span>
          </div>

          <div className="w-full flex flex-col items-center gap-1.5">
            <div className="w-full h-1 bg-stone/40 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-viridian"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
            <span className="font-mono text-[9px] text-viridian/60">Hiding in {timeLeft}s...</span>
          </div>
        </div>
      )}

      {gameState === "INPUT" && (
        <form onSubmit={handleVerify} className="flex flex-col items-center gap-5 py-4 w-full font-mono text-[10px]">
          <span className="font-mono text-[8px] text-viridian/50 uppercase tracking-wider">What was the number?</span>
          
          <input
            type="text"
            required
            autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))} // Numbers only
            className="w-full px-4 py-3 rounded-xl border border-stone/80 bg-shell/50 text-center text-lg font-bold font-serif text-viridian focus:outline-none focus:border-viridian focus:bg-shell transition-all"
            placeholder="Type recalled digits..."
          />

          <button
            type="submit"
            className="w-full bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs py-3 rounded-xl transition-all shadow-soft font-bold"
          >
            Submit Answer
          </button>
        </form>
      )}

      {gameState === "RESULT" && (
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          {userInput.trim() === numberToRecall ? (
            <>
              <div className="w-10 h-10 rounded-full bg-honeydew border border-viridian/20 flex items-center justify-center text-viridian">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-bold text-viridian">Correct!</span>
                <span className="font-mono text-[10px] text-viridian/70 leading-normal">
                  Recalled <strong>{numberToRecall}</strong> successfully.
                </span>
              </div>
              <button
                onClick={() => startNextLevel(level)}
                className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-5 py-2.5 rounded-xl transition-all shadow-soft"
              >
                Advance to Level {level}
              </button>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-500">
                <span className="font-serif text-lg font-bold">X</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-serif text-sm font-bold text-viridian">Incorrect Recalled</span>
                <p className="font-mono text-[10px] leading-relaxed text-viridian/60 max-w-xs">
                  Your Answer: <strong className="text-red-700">{userInput || "blank"}</strong><br />
                  Correct Target: <strong className="text-viridian">{numberToRecall}</strong>
                </p>
                <span className="font-mono text-[9px] text-[#344945] bg-honeydew px-2 py-0.5 rounded border border-viridian/15 w-fit self-center">
                  Score Reached: Level {level}
                </span>
              </div>
              <button
                onClick={handleStartGame}
                className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-5 py-2.5 rounded-xl transition-all shadow-soft"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. GAME COMPONENT: Pattern Memory
// ==========================================
function PatternGame() {
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userSelection, setUserSelection] = useState<number[]>([]);
  const [gameState, setGameState] = useState<"START" | "SHOWING" | "USER" | "FAIL" | "SUCCESS">("START");

  const startNextLevel = (lvl: number) => {
    // Generate lvl + 2 unique random cells in a 3x3 grid (indices 0..8)
    let arr: number[] = [];
    while (arr.length < lvl + 2) {
      const cell = Math.floor(Math.random() * 9);
      if (!arr.includes(cell)) {
        arr.push(cell);
      }
    }
    setPattern(arr);
    setUserSelection([]);
    setGameState("SHOWING");

    // Hold showing state for 1.8 seconds, then let user interact
    setTimeout(() => {
      setGameState("USER");
    }, 1800);
  };

  const handleTileClick = (cellIndex: number) => {
    if (gameState !== "USER") return;
    if (userSelection.includes(cellIndex)) return;

    if (pattern.includes(cellIndex)) {
      const nextSelection = [...userSelection, cellIndex];
      setUserSelection(nextSelection);

      // Check if all correct pattern cells clicked
      if (nextSelection.length === pattern.length) {
        confetti({ particleCount: 20, spread: 20, colors: ["#D5E3E8", "#344945"] });
        setLevel(prev => prev + 1);
        setGameState("SUCCESS");
      }
    } else {
      setGameState("FAIL");
    }
  };

  const handleStartGame = () => {
    setLevel(1);
    startNextLevel(1);
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-stone/60 max-w-sm mx-auto w-full flex flex-col items-center gap-6 bg-shell/65">
      <div className="text-center flex flex-col gap-1">
        <span className="font-serif text-base font-bold text-viridian">Spatial Pattern Memory</span>
        <span className="font-mono text-[9px] text-viridian/60 uppercase">Recreate highlighted spatial grid shapes</span>
      </div>

      {gameState === "START" && (
        <div className="flex flex-col items-center gap-5 py-6">
          <div className="w-12 h-12 rounded-full bg-honeydew/70 border border-viridian/15 flex items-center justify-center text-viridian">
            <Flame className="w-6 h-6" />
          </div>
          <p className="font-mono text-[10px] text-viridian/70 text-center leading-relaxed max-w-xs">
            Look at the highlighted cells in the 3x3 grid. Once they disappear, click the matching tiles from memory.
          </p>
          <button
            onClick={handleStartGame}
            className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-6 py-3 rounded-xl transition-all shadow-soft font-bold"
          >
            Start Pattern Check
          </button>
        </div>
      )}

      {(gameState === "SHOWING" || gameState === "USER") && (
        <div className="flex flex-col items-center gap-5 w-full">
          <span className="font-mono text-[8px] text-viridian/50 uppercase tracking-wider">
            {gameState === "SHOWING" ? "👀 Memorizing Pattern..." : "👇 Recreate Shape:"}
          </span>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-2 w-64 h-64 border border-stone/40 p-2 rounded-2xl bg-stone/20">
            {Array.from({ length: 9 }).map((_, idx) => {
              const isHighlighted = pattern.includes(idx) && gameState === "SHOWING";
              const isSelected = userSelection.includes(idx);
              const isWrong = false; // We fail immediately

              return (
                <div
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  className={`aspect-square w-full rounded-xl border transition-all duration-200 cursor-pointer
                    ${isHighlighted ? "bg-viridian border-viridian scale-[0.96]" : ""}
                    ${isSelected ? "bg-viridian border-viridian" : ""}
                    ${!isHighlighted && !isSelected ? "bg-shell border-stone/40 hover:bg-stone/20" : ""}
                  `}
                />
              );
            })}
          </div>
          
          <span className="font-mono text-[9px] text-viridian/60">
            Level {level} — {pattern.length} tiles to match
          </span>
        </div>
      )}

      {gameState === "SUCCESS" && (
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <div className="w-10 h-10 rounded-full bg-honeydew border border-viridian/25 flex items-center justify-center text-viridian">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-serif text-sm font-bold text-viridian">Level Complete!</span>
            <span className="font-mono text-[10px] text-viridian/70 leading-normal">
              Successfully matched pattern shape layout.
            </span>
          </div>
          <button
            onClick={() => startNextLevel(level)}
            className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-5 py-2.5 rounded-xl transition-all shadow-soft"
          >
            Go to Level {level}
          </button>
        </div>
      )}

      {gameState === "FAIL" && (
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-500 font-serif font-bold text-lg">
            X
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-serif text-sm font-bold text-viridian">Pattern Mismatch</span>
            <p className="font-mono text-[10px] leading-relaxed text-viridian/60 max-w-xs">
              Clicked cell was not in the original shape.
            </p>
            <span className="font-mono text-[9px] text-[#344945] bg-honeydew px-2 py-0.5 rounded border border-viridian/15 w-fit self-center">
              Score Reached: Level {level}
            </span>
          </div>
          <button
            onClick={handleStartGame}
            className="bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-5 py-2.5 rounded-xl transition-all shadow-soft"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. GAME COMPONENT: Spot the Difference
// ==========================================
function SpotGame() {
  const [spotted, setSpotted] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  // 3 Differences indices config
  // 1: Missing bookmark ribbon (left book)
  // 2: Missing leaf on the plant (right side)
  // 3: Missing steam lines (coffee cup)
  const diffs = [
    { id: 1, label: "Bookmark ribbon", cx: 90, cy: 310, r: 25 },
    { id: 2, label: "Plant leaf", cx: 330, cy: 195, r: 25 },
    { id: 3, label: "Mug steam line", cx: 165, cy: 232, r: 20 }
  ];

  const handleCanvasClick = (x: number, y: number) => {
    if (solved) return;

    // Check if clicked near any differences
    diffs.forEach(diff => {
      const distance = Math.sqrt((x - diff.cx) ** 2 + (y - diff.cy) ** 2);
      if (distance <= diff.r) {
        if (!spotted.includes(diff.id)) {
          const nextSpotted = [...spotted, diff.id];
          setSpotted(nextSpotted);
          
          confetti({ particleCount: 15, spread: 20, colors: ["#E4E3BC", "#344945"] });
          
          if (nextSpotted.length === 3) {
            setSolved(true);
            confetti({ particleCount: 80, spread: 60, colors: ["#D5E3E8", "#E4E3BC", "#344945"] });
          }
        }
      }
    });
  };

  const handleRestart = () => {
    setSpotted([]);
    setSolved(false);
  };

  // Base illustration elements
  const renderBaseElements = (isDifferenceMap: boolean) => {
    return (
      <>
        {/* Table base line */}
        <line x1="30" y1="340" x2="370" y2="340" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        
        {/* Coffee Cup body */}
        <path d="M150,250 L180,250 L176,290 L154,290 Z" fill="#E0DCD1" stroke="currentColor" strokeWidth="2.2" />
        <path d="M180,260 C187,260 191,264 191,270 C191,276 187,280 180,280" fill="none" stroke="currentColor" strokeWidth="2.2" />
        
        {/* DIFFERENCE 3: Coffee steam lines */}
        {(!isDifferenceMap || !spotted.includes(3)) && (
          <path d="M160,238 C163,233 160,230 163,225" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={isDifferenceMap ? "opacity-0 cursor-default" : ""} />
        )}
        <path d="M170,239 C173,234 170,231 173,226" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

        {/* Desk Plant pot */}
        <rect x="305" y="260" width="35" height="40" rx="4" fill="#E0DCD1" stroke="currentColor" strokeWidth="2.2" />
        {/* Plant stems */}
        <path d="M322,260 Q315,225 305,230" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M322,260 Q325,225 342,228" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        
        {/* DIFFERENCE 2: Plant leaf */}
        {(!isDifferenceMap || !spotted.includes(2)) && (
          <path d="M322,260 Q330,210 330,195" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={isDifferenceMap ? "opacity-0 cursor-default" : ""} />
        )}

        {/* Open Books layout */}
        <rect x="50" y="270" width="80" height="50" rx="6" fill="#F7F5F1" stroke="currentColor" strokeWidth="2" transform="rotate(-10, 90, 295)" />
        
        {/* DIFFERENCE 1: Book Bookmark Ribbon */}
        {(!isDifferenceMap || !spotted.includes(1)) && (
          <path d="M90,310 L90,335 L100,325 L110,335" fill="#E4E3BC" stroke="currentColor" strokeWidth="1.8" className={isDifferenceMap ? "opacity-0 cursor-default" : ""} />
        )}
      </>
    );
  };

  return (
    <div className="glass-card p-4 md:p-6 rounded-[2.5rem] border border-stone/60 max-w-2xl mx-auto w-full flex flex-col items-center gap-6 bg-shell/65">
      <div className="text-center flex flex-col gap-1 shrink-0">
        <span className="font-serif text-base font-bold text-viridian">Calm differences</span>
        <span className="font-mono text-[9px] text-viridian/60 uppercase">Find and tap the 3 subtle differences ({spotted.length}/3)</span>
      </div>

      {/* Side-by-Side Canvas illustrations */}
      <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-center shrink-0">
        
        {/* Image 1: Original */}
        <div className="relative w-64 aspect-square border border-stone rounded-2xl bg-shell/80 p-2 shadow-soft">
          <span className="absolute top-2 left-2 font-mono text-[8px] text-viridian/45 bg-stone/30 px-1.5 py-0.5 rounded border border-stone-dark/10">Scene A</span>
          <svg viewBox="0 0 400 400" className="w-full h-full text-viridian">
            {renderBaseElements(false)}
          </svg>
        </div>

        {/* Image 2: Differences mapping */}
        <div className="relative w-64 aspect-square border border-stone rounded-2xl bg-shell/80 p-2 shadow-soft">
          <span className="absolute top-2 left-2 font-mono text-[8px] text-viridian/45 bg-stone/30 px-1.5 py-0.5 rounded border border-stone-dark/10">Scene B</span>
          
          <svg 
            viewBox="0 0 400 400" 
            className="w-full h-full text-viridian cursor-crosshair"
            onClick={(e) => {
              const svg = e.currentTarget;
              const rect = svg.getBoundingClientRect();
              // Calculate mouse relative coordinates in 400x400 viewBox
              const x = ((e.clientX - rect.left) / rect.width) * 400;
              const y = ((e.clientY - rect.top) / rect.height) * 400;
              handleCanvasClick(x, y);
            }}
          >
            {renderBaseElements(true)}

            {/* Render Spotted Highlight rings */}
            {spotted.map(id => {
              const diff = diffs.find(d => d.id === id);
              if (!diff) return null;
              return (
                <circle
                  key={id}
                  cx={diff.cx}
                  cy={diff.cy}
                  r={diff.r}
                  fill="none"
                  stroke="#344945"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        </div>

      </div>

      {solved ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full flex flex-col items-center gap-3"
        >
          <div className="p-3 bg-honeydew border border-viridian/25 text-center font-mono text-[10px] text-[#344945] rounded-xl leading-normal w-full">
            🎉 Wonderful! Spotted all 3 difference areas. Your vision path is clean.
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 font-mono text-[9px] bg-viridian text-shell px-3 py-2 rounded-xl hover:bg-viridian-hover transition-all shadow-soft"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Play Again
          </button>
        </motion.div>
      ) : (
        <button
          onClick={handleRestart}
          className="font-mono text-[9px] text-viridian/50 hover:text-viridian underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset Differences
        </button>
      )}
    </div>
  );
}
