import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  BookOpen, 
  Plus, 
  Trash2, 
  FileEdit,
  TrendingUp,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";
import PlantCompanion from "./PlantCompanion";

interface RightSidebarProps {
  streak: number;
  todayGoals: { id: string; text: string; done: boolean }[];
  saveGoals: (goals: { id: string; text: string; done: boolean }[]) => void;
  setActiveTab: (tab: string) => void;
  notes: any[];
  saveNotes: (notes: any[]) => void;
}

export default function RightSidebar({
  streak,
  todayGoals,
  saveGoals,
  setActiveTab,
  notes,
  saveNotes,
}: RightSidebarProps) {
  const [newGoalText, setNewGoalText] = useState("");
  const [scratchpadText, setScratchpadText] = useState("");

  // Load scratchpad from localStorage
  useEffect(() => {
    const savedScratch = localStorage.getItem("studyos_scratchpad");
    if (savedScratch) setScratchpadText(savedScratch);
  }, []);

  const handleScratchpadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setScratchpadText(text);
    localStorage.setItem("studyos_scratchpad", text);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal = {
      id: `g-${Date.now()}`,
      text: newGoalText.trim(),
      done: false
    };

    saveGoals([...todayGoals, newGoal]);
    setNewGoalText("");
  };

  const handleToggleGoal = (id: string) => {
    const updated = todayGoals.map(g => {
      if (g.id === id) {
        const nextState = !g.done;
        // Trigger confetti if a goal is completed
        if (nextState) {
          confetti({
            particleCount: 40,
            spread: 40,
            origin: { y: 0.8, x: 0.9 },
            colors: ["#D5E3E8", "#E4E3BC", "#344945"]
          });
        }
        return { ...g, done: nextState };
      }
      return g;
    });

    saveGoals(updated);
  };

  const handleDeleteGoal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveGoals(todayGoals.filter(g => g.id !== id));
  };

  // Convert scratchpad text into a real note
  const handleSaveScratchAsNote = () => {
    if (!scratchpadText.trim()) return;
    
    const lines = scratchpadText.split("\n");
    const title = lines[0].slice(0, 30) || "Scratchpad Note";

    const newNote = {
      id: `n-${Date.now()}`,
      title: title.startsWith("#") ? title.replace("#", "").trim() : title.trim(),
      content: scratchpadText,
      folderId: "f-1", // Computer science default
      tags: ["scratchpad"],
      pinned: false,
      createdAt: new Date().toISOString()
    };

    saveNotes([newNote, ...notes]);
    setScratchpadText("");
    localStorage.removeItem("studyos_scratchpad");
    setActiveTab("notes");

    // Success alert confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8, x: 0.9 },
      colors: ["#344945", "#E4E3BC"]
    });
  };

  const completedCount = todayGoals.filter(g => g.done).length;
  const progressPercent = todayGoals.length > 0 ? Math.round((completedCount / todayGoals.length) * 100) : 0;

  return (
    <aside className="h-full overflow-y-auto p-6 flex flex-col gap-6 select-none">
      
      {/* 1. Daily Progress Ring & Streak */}
      <div className="glass-card p-5 rounded-[2rem] border border-stone/60 flex flex-col gap-4 shadow-soft">
        <div className="flex justify-between items-center">
          <span className="font-serif text-sm font-bold text-viridian">Today's Focus</span>
          <div className="flex items-center gap-1 font-mono text-[10px] text-viridian/60 bg-stone/40 px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3 h-3 text-viridian" />
            <span>Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* SVG Progress Circular Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="32" cy="32" r="26" 
                stroke="var(--color-stone)" strokeWidth="4.5" fill="transparent"
              />
              <motion.circle 
                cx="32" cy="32" r="26" 
                stroke="var(--color-viridian)" strokeWidth="4.5" fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - progressPercent / 100) }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-viridian">{progressPercent}%</span>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-bounce" />
              <span className="font-serif text-base font-bold text-viridian">{streak} Day Streak!</span>
            </div>
            <span className="font-mono text-[10px] text-viridian/70">
              {completedCount} of {todayGoals.length} goals complete. Keep it up!
            </span>
          </div>
        </div>
      </div>

      {/* 2. Today's Goals Checklist */}
      <div className="glass-card p-5 rounded-[2rem] border border-stone/60 flex flex-col gap-4 shadow-soft">
        <span className="font-serif text-sm font-bold text-viridian">Today's Goals</span>

        <form onSubmit={handleAddGoal} className="flex gap-2">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Add task for today..."
            className="flex-1 px-3 py-2 rounded-xl border border-stone/80 bg-shell/50 font-mono text-[11px] text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian focus:bg-shell transition-all"
          />
          <button 
            type="submit"
            className="p-2 rounded-xl bg-viridian text-shell hover:bg-viridian-hover shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {todayGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onClick={() => handleToggleGoal(goal.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all hover:bg-stone/20 ${goal.done ? "bg-stone/30 border-stone text-viridian/50" : "bg-shell/40 border-stone/40 text-viridian"}`}
              >
                {goal.done ? (
                  <CheckCircle2 className="w-4 h-4 text-viridian shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-viridian/60 shrink-0" />
                )}
                <span className={`font-mono text-[11px] leading-tight truncate flex-1 ${goal.done ? "line-through" : ""}`}>
                  {goal.text}
                </span>
                <button
                  onClick={(e) => handleDeleteGoal(goal.id, e)}
                  className="p-1 rounded text-viridian/45 hover:text-red-500 hover:bg-stone/30 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {todayGoals.length === 0 && (
            <div className="text-center py-6 font-mono text-[10px] text-viridian/40 italic">
              No goals set for today.
            </div>
          )}
        </div>
      </div>

      {/* 3. Quick Scratchpad */}
      <div className="glass-card p-5 rounded-[2rem] border border-stone/60 flex flex-col gap-4 shadow-soft flex-1 min-h-[160px]">
        <div className="flex justify-between items-center">
          <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1.5">
            <FileEdit className="w-4 h-4 text-viridian" />
            Quick Desk Scratchpad
          </span>
          {scratchpadText.trim() && (
            <button 
              onClick={handleSaveScratchAsNote}
              className="font-mono text-[9px] text-viridian/70 hover:text-viridian font-bold flex items-center gap-1 bg-sky px-2 py-0.5 rounded border border-viridian/15"
              title="Save scratchpad to your notes folder"
            >
              <BookOpen className="w-2.5 h-2.5" />
              Save Note
            </button>
          )}
        </div>

        <textarea
          value={scratchpadText}
          onChange={handleScratchpadChange}
          placeholder="Start typing jotting notes, formulas, lists... Auto-saved to local browser."
          className="flex-1 w-full p-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-[11px] leading-relaxed text-viridian placeholder-viridian/45 resize-none focus:outline-none focus:border-viridian focus:bg-shell transition-all"
        />
      </div>

      {/* 4. Mini Badges Highlight */}
      <div className="glass-card p-4 rounded-[2rem] border border-stone/60 flex items-center gap-3 shadow-soft bg-honeydew/30">
        <div className="w-8 h-8 rounded-full bg-honeydew border border-viridian/25 flex items-center justify-center shrink-0">
          <Award className="w-4 h-4 text-viridian" />
        </div>
        <div className="min-w-0">
          <p className="font-serif text-xs font-bold text-viridian">Calm Thinker Badge</p>
          <p className="font-mono text-[9px] text-viridian/60 truncate">Active for completing 3 pomodoros.</p>
        </div>
      </div>

      {/* Desk Plant Companion */}
      <div className="glass-card p-3 rounded-[2rem] border border-stone/60 flex flex-col items-center justify-center shadow-soft bg-stone/20">
        <PlantCompanion />
      </div>

    </aside>
  );
}
