import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Clock, 
  Check,
  EyeOff,
  Eye,
  Coffee
} from "lucide-react";
import confetti from "canvas-confetti";
import { PomodoroSession } from "../app/dashboard/page";

interface StudyTimerProps {
  timerHistory: PomodoroSession[];
  saveTimerHistory: (history: PomodoroSession[]) => void;
  streak: number;
  setStreak: (s: number) => void;
}

export default function StudyTimer({
  timerHistory,
  saveTimerHistory,
  streak,
  setStreak
}: StudyTimerProps) {
  // Modes: 'focus' (25m), 'shortBreak' (5m), 'longBreak' (15m)
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [duration, setDuration] = useState(25); // in minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Clean Focus View Mode
  const [distractionFree, setDistractionFree] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mode durations maps
  const defaultDurations = {
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  };

  // Sync timer when mode or custom duration changes
  useEffect(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const minutes = defaultDurations[mode];
    setDuration(minutes);
    setTimeLeft(minutes * 60);
  }, [mode]);

  // Main countdown ticking hook
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer Finished!
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Audio chime bell
    if (!isMuted) {
      try {
        const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
        chime.volume = 0.5;
        chime.play().catch(err => {
          console.log("Audio chime playback blocked by browser:", err);
        });
      } catch (err) {
        console.log("Audio chime playback blocked by browser.");
      }
    }

    // Trigger full splash confetti
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#D5E3E8", "#E4E3BC", "#344945"]
    });

    // Log Completed session to history
    const session: PomodoroSession = {
      id: `th-${Date.now()}`,
      duration: duration,
      type: mode,
      date: new Date().toISOString()
    };

    saveTimerHistory([session, ...timerHistory]);

    // Update streak if it was a Focus session
    if (mode === "focus") {
      setStreak(streak + 1);
      localStorage.setItem("studyos_streak", String(streak + 1));
      alert("Wonderful focus block completed! Take a soft, peaceful break.");
      setMode("shortBreak");
    } else {
      alert("Break completed! Ready to flow back into focus?");
      setMode("focus");
    }
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const handleAdjustDuration = (mins: number) => {
    if (mins < 1 || mins > 120) return;
    setDuration(mins);
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Progress percentage computations
  const totalSeconds = duration * 60;
  const progressPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) : 0;
  const strokeDashoffset = 2 * Math.PI * 90 * progressPercent;

  return (
    <div className={`h-full flex flex-col items-center justify-center select-none ${distractionFree ? "p-4 justify-center" : "gap-8"}`}>
      
      {/* Distraction Free Toggler */}
      {!distractionFree && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 justify-center border border-stone/50 bg-stone/20 p-1.5 rounded-[2rem] shadow-soft shrink-0"
        >
          <button
            onClick={() => setMode("focus")}
            className={`flex items-center gap-1.5 font-mono text-[10px] px-5 py-2.5 rounded-[1.5rem] transition-all ${mode === "focus" ? "bg-viridian text-shell font-bold" : "text-viridian/70 hover:bg-stone"}`}
          >
            <Clock className="w-3.5 h-3.5" />
            Focus Session
          </button>
          <button
            onClick={() => setMode("shortBreak")}
            className={`flex items-center gap-1.5 font-mono text-[10px] px-5 py-2.5 rounded-[1.5rem] transition-all ${mode === "shortBreak" ? "bg-viridian text-shell font-bold" : "text-viridian/70 hover:bg-stone"}`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Short Break
          </button>
          <button
            onClick={() => setMode("longBreak")}
            className={`flex items-center gap-1.5 font-mono text-[10px] px-5 py-2.5 rounded-[1.5rem] transition-all ${mode === "longBreak" ? "bg-viridian text-shell font-bold" : "text-viridian/70 hover:bg-stone"}`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Long Break
          </button>
        </motion.div>
      )}

      {/* Main Circular Clock Canvas */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing glow behind clock when active focus */}
        {isRunning && mode === "focus" && (
          <motion.div 
            animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-72 h-72 rounded-full bg-sky/35 blur-3xl"
          />
        )}

        <svg viewBox="0 0 200 200" className="w-64 h-64 md:w-80 md:h-80 drop-shadow-sm select-none">
          <circle 
            cx="100" cy="100" r="90" 
            stroke="var(--color-stone)" strokeWidth="6" fill="transparent"
          />
          <motion.circle 
            cx="100" cy="100" r="90" 
            stroke={mode === "focus" ? "var(--color-viridian)" : "var(--color-sky)"} 
            strokeWidth="6" fill="transparent"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 - strokeDashoffset}
            strokeLinecap="round"
            animate={{ strokeDashoffset: 2 * Math.PI * 90 - strokeDashoffset }}
            transition={{ duration: 0.4, ease: "linear" }}
          />
        </svg>

        {/* Text Timer overlay */}
        <div className="absolute flex flex-col items-center justify-center gap-1 text-center">
          <span className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-viridian">
            {formatTime(timeLeft)}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">
            {mode === "focus" ? "Concentrate" : "Rest Mode"}
          </span>
        </div>
      </div>

      {/* Timer Controls bar */}
      <div className="flex flex-col items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-xl border border-stone/50 text-viridian/65 hover:bg-stone/30 transition-all"
            title={isMuted ? "Unmute bell" : "Mute bell"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* PLAY / PAUSE */}
          <button
            onClick={handleToggleTimer}
            className="w-16 h-16 rounded-full bg-viridian text-shell hover:bg-viridian-hover flex items-center justify-center shadow-calm transition-all transform active:scale-95"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

          {/* RESET */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-stone/50 text-viridian/65 hover:bg-stone/30 transition-all"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Adjust Duration Sliders (Only if not running & not distraction free) */}
        {!isRunning && !distractionFree && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 font-mono text-[10px] text-viridian/70 mt-2"
          >
            <button 
              onClick={() => handleAdjustDuration(duration - 5)}
              className="px-2 py-1 rounded bg-stone/40 border border-stone text-viridian"
            >
              -5m
            </button>
            <span className="font-bold">{duration} mins</span>
            <button 
              onClick={() => handleAdjustDuration(duration + 5)}
              className="px-2 py-1 rounded bg-stone/40 border border-stone text-viridian"
            >
              +5m
            </button>
          </motion.div>
        )}
      </div>

      {/* Focus Mode Overlay button */}
      <button
        onClick={() => setDistractionFree(!distractionFree)}
        className="mt-4 font-mono text-[9px] text-viridian/60 hover:text-viridian flex items-center gap-1.5 bg-stone/30 border border-stone px-3.5 py-1.5 rounded-xl hover:bg-stone/50 transition-all shadow-soft"
      >
        {distractionFree ? (
          <>
            <Eye className="w-3.5 h-3.5" /> Show Dashboard
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5" /> Clean Focus Mode
          </>
        )}
      </button>

    </div>
  );
}
