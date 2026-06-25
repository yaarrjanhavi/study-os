"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  Search, 
  Flame, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Compass,
  Sun,
  Moon
} from "lucide-react";

// Components
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import DashboardOverview from "@/components/DashboardOverview";
import AINotes from "@/components/AINotes";
import AIChat from "@/components/AIChat";
import YouTubePlayer from "@/components/YouTubePlayer";
import PDFStudy from "@/components/PDFStudy";
import SmartTodo from "@/components/SmartTodo";
import StudyTimer from "@/components/StudyTimer";
import Leaderboard from "@/components/Leaderboard";
import StudyAnalytics from "@/components/StudyAnalytics";
import Flashcards from "@/components/Flashcards";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import GlobalSearch from "@/components/GlobalSearch";
import Settings from "@/components/Settings";
import ExamPlanner, { Exam } from "@/components/ExamPlanner";

// Type definitions
export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  column: "todo" | "inProgress" | "done";
  dueDate?: string;
  subtasks: { id: string; text: string; done: boolean }[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed?: string;
  nextReview?: string;
  interval?: number; // days
}

export interface PomodoroSession {
  id: string;
  duration: number; // minutes
  type: "focus" | "shortBreak" | "longBreak";
  date: string;
}

export interface VideoStudy {
  id: string; // youtube id
  title: string;
  thumbnail: string;
  notes: string;
  savedTimestamps: { time: number; note: string }[];
}

export interface PDFDoc {
  id: string;
  name: string;
  summary: string;
  formulas: string[];
  notes: string;
}

export default function DashboardPage() {
  // Master navigation view
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Core Data States (Empty for new workspace)
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [timerHistory, setTimerHistory] = useState<PomodoroSession[]>([]);
  const [videos, setVideos] = useState<VideoStudy[]>([]);
  const [pdfs, setPdfs] = useState<PDFDoc[]>([]);
  const [exams, setExams] = useState<Exam[]>([]); // New Exams State
  const [streak, setStreak] = useState<number>(0); // Starts at 0
  const [todayGoals, setTodayGoals] = useState<{ id: string; text: string; done: boolean }[]>([]);
  
  // Settings State
  const [username, setUsername] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState<HTMLAudioElement | null>(null);
  
  // Onboarding States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempName, setTempName] = useState("");
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [tempApiKey, setTempApiKey] = useState("");
  
  // Theme State
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);

    const storedNotes = localStorage.getItem("studyos_notes");
    const storedFolders = localStorage.getItem("studyos_folders");
    const storedTasks = localStorage.getItem("studyos_tasks");
    const storedFlashcards = localStorage.getItem("studyos_flashcards");
    const storedHistory = localStorage.getItem("studyos_timer_history");
    const storedVideos = localStorage.getItem("studyos_videos");
    const storedPdfs = localStorage.getItem("studyos_pdfs");
    const storedStreak = localStorage.getItem("studyos_streak");
    const storedGoals = localStorage.getItem("studyos_goals");
    const storedUsername = localStorage.getItem("studyos_username");
    const storedApiKey = localStorage.getItem("studyos_apikey");

    // Populate or Fallback to initial seeds
    if (storedNotes) setNotes(JSON.parse(storedNotes));
    else {
      setNotes([]);
      localStorage.setItem("studyos_notes", JSON.stringify([]));
    }

    if (storedFolders) setFolders(JSON.parse(storedFolders));
    else {
      const initialFolders = [
        { id: "f-1", name: "General Study" }
      ];
      setFolders(initialFolders);
      localStorage.setItem("studyos_folders", JSON.stringify(initialFolders));
    }

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    else {
      setTasks([]);
      localStorage.setItem("studyos_tasks", JSON.stringify([]));
    }

    if (storedFlashcards) setFlashcards(JSON.parse(storedFlashcards));
    else {
      setFlashcards([]);
      localStorage.setItem("studyos_flashcards", JSON.stringify([]));
    }

    if (storedHistory) setTimerHistory(JSON.parse(storedHistory));
    else {
      setTimerHistory([]);
      localStorage.setItem("studyos_timer_history", JSON.stringify([]));
    }

    if (storedVideos) setVideos(JSON.parse(storedVideos));
    else {
      setVideos([]);
      localStorage.setItem("studyos_videos", JSON.stringify([]));
    }

    if (storedPdfs) setPdfs(JSON.parse(storedPdfs));
    else {
      setPdfs([]);
      localStorage.setItem("studyos_pdfs", JSON.stringify([]));
    }

    if (storedStreak) setStreak(Number(storedStreak));
    if (storedGoals) setTodayGoals(JSON.parse(storedGoals));
    else {
      setTodayGoals([]);
      localStorage.setItem("studyos_goals", JSON.stringify([]));
    }

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setShowOnboarding(true);
    }
    if (storedApiKey) setGeminiApiKey(storedApiKey);

    const storedExams = localStorage.getItem("studyos_exams");
    if (storedExams) setExams(JSON.parse(storedExams));
    else {
      setExams([]);
      localStorage.setItem("studyos_exams", JSON.stringify([]));
    }

    // Audio setup
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav"); // Calm click/bell
    // For background noise we use a soft looping fireplace or rain, let's use rain sound URL
    const bgAudio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // placeholder loop
    bgAudio.loop = true;
    bgAudio.volume = 0.15;
    setAmbientAudio(bgAudio);

    // Initialise Theme Preference
    const storedTheme = localStorage.getItem("studyos_theme") || "light";
    setTheme(storedTheme as "light" | "dark");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return () => {
      bgAudio.pause();
    };
  }, []);

  // Save hook helper functions
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("studyos_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("studyos_notes", JSON.stringify(updated));
  };
  const saveFolders = (updated: Folder[]) => {
    setFolders(updated);
    localStorage.setItem("studyos_folders", JSON.stringify(updated));
  };
  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem("studyos_tasks", JSON.stringify(updated));
  };
  const saveFlashcards = (updated: Flashcard[]) => {
    setFlashcards(updated);
    localStorage.setItem("studyos_flashcards", JSON.stringify(updated));
  };
  const saveTimerHistory = (updated: PomodoroSession[]) => {
    setTimerHistory(updated);
    localStorage.setItem("studyos_timer_history", JSON.stringify(updated));
  };
  const saveVideos = (updated: VideoStudy[]) => {
    setVideos(updated);
    localStorage.setItem("studyos_videos", JSON.stringify(updated));
  };
  const savePdfs = (updated: PDFDoc[]) => {
    setPdfs(updated);
    localStorage.setItem("studyos_pdfs", JSON.stringify(updated));
  };
  const saveGoals = (updated: { id: string; text: string; done: boolean }[]) => {
    setTodayGoals(updated);
    localStorage.setItem("studyos_goals", JSON.stringify(updated));
  };
  const saveExams = (updated: Exam[]) => {
    setExams(updated);
    localStorage.setItem("studyos_exams", JSON.stringify(updated));
  };

  // Keyboard shortcut listener for global search (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle ambient audio
  const toggleAmbientSound = () => {
    if (!ambientAudio) return;
    if (isAmbientPlaying) {
      ambientAudio.pause();
    } else {
      ambientAudio.play().catch(err => console.log("Audio play deferred until user interaction"));
    }
    setIsAmbientPlaying(!isAmbientPlaying);
  };

  const handleCompleteOnboarding = () => {
    if (!tempName.trim()) return;
    setUsername(tempName.trim());
    localStorage.setItem("studyos_username", tempName.trim());
    
    if (tempApiKey.trim()) {
      setGeminiApiKey(tempApiKey.trim());
      localStorage.setItem("studyos_apikey", tempApiKey.trim());
    }

    setShowOnboarding(false);
    
    // burst confetti
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ["#344945", "#D5E3E8", "#E4E3BC"]
    });

    try {
      const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
      chime.volume = 0.35;
      chime.play().catch(() => {});
    } catch (e) {}
  };

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-shell flex items-center justify-center font-mono text-xs text-viridian/60">
        <div className="flex flex-col items-center gap-3">
          <span className="w-6 h-6 border-2 border-viridian/30 border-t-viridian rounded-full animate-spin"></span>
          Preparing Study Desk...
        </div>
      </div>
    );
  }

  // Swap central workspace panel based on activeTab
  const renderMainWorkspace = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview 
            username={username}
            notes={notes}
            tasks={tasks}
            timerHistory={timerHistory}
            streak={streak}
            todayGoals={todayGoals}
            setActiveTab={setActiveTab}
          />
        );
      case "notes":
        return (
          <AINotes 
            notes={notes} 
            folders={folders} 
            apiKey={geminiApiKey}
            saveNotes={saveNotes} 
            saveFolders={saveFolders}
            saveFlashcards={saveFlashcards}
            flashcards={flashcards}
          />
        );
      case "tasks":
        return (
          <SmartTodo 
            tasks={tasks} 
            apiKey={geminiApiKey}
            saveTasks={saveTasks} 
          />
        );
      case "timer":
        return (
          <StudyTimer 
            timerHistory={timerHistory}
            saveTimerHistory={saveTimerHistory}
            streak={streak}
            setStreak={setStreak}
          />
        );
      case "exams":
        return (
          <ExamPlanner 
            exams={exams}
            saveExams={saveExams}
            tasks={tasks}
            saveTasks={saveTasks}
            apiKey={geminiApiKey}
          />
        );
      case "flashcards":
        return (
          <Flashcards 
            flashcards={flashcards} 
            saveFlashcards={saveFlashcards} 
          />
        );
      case "chat":
        return (
          <AIChat 
            notes={notes} 
            pdfs={pdfs}
            apiKey={geminiApiKey}
          />
        );
      case "videos":
        return (
          <YouTubePlayer 
            videos={videos} 
            saveVideos={saveVideos} 
          />
        );
      case "pdfs":
        return (
          <PDFStudy 
            pdfs={pdfs} 
            savePdfs={savePdfs} 
            apiKey={geminiApiKey}
          />
        );
      case "analytics":
        return (
          <StudyAnalytics 
            timerHistory={timerHistory} 
            tasks={tasks} 
            notes={notes}
          />
        );
      case "graph":
        return (
          <KnowledgeGraph 
            notes={notes}
            videos={videos}
            pdfs={pdfs}
            tasks={tasks}
            setActiveTab={setActiveTab}
          />
        );
      case "leaderboard":
        return (
          <Leaderboard 
            timerHistory={timerHistory}
            streak={streak}
          />
        );
      case "settings":
        return (
          <Settings 
            username={username}
            setUsername={(val) => { setUsername(val); localStorage.setItem("studyos_username", val); }}
            geminiApiKey={geminiApiKey}
            setGeminiApiKey={(val) => { setGeminiApiKey(val); localStorage.setItem("studyos_apikey", val); }}
          />
        );
      default:
        return <div>Component not found.</div>;
    }
  };

  return (
    <div className="h-screen w-full calm-mesh flex overflow-hidden selection:bg-sky selection:text-viridian relative">
      {/* Mobile Top Navbar */}
      <header className="md:hidden absolute top-0 left-0 right-0 h-16 border-b border-stone/50 bg-shell/80 backdrop-blur-md px-6 flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
          <img 
            src={theme === "dark" ? "/logo (dark).png" : "/logo (light).png"} 
            alt="StudyOS Logo" 
            className="w-7 h-7 object-contain"
          />
          <span className="font-serif text-lg font-bold text-viridian">StudyOS</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-stone/30 text-viridian/80"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-xl hover:bg-stone/30 text-viridian/80"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-stone/30 text-viridian/80"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        notesCount={notes.length}
        tasksCount={tasks.filter(t => t.column !== "done").length}
        theme={theme}
        username={username}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pt-16 md:pt-0">
        {/* Desktop Top Workspace Control Strip */}
        <div className="hidden md:flex h-16 border-b border-stone/30 bg-shell/45 px-8 items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 font-mono text-xs text-viridian/40 border border-stone bg-shell/40 px-4 py-2 rounded-xl hover:border-viridian/30 transition-all w-64 text-left shadow-soft"
            >
              <Search className="w-3.5 h-3.5" />
              Search workspace...
              <span className="ml-auto text-[9px] border border-stone/80 px-1.5 py-0.5 rounded text-viridian/40 bg-stone/20">⌘K</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Trigger */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-stone/50 hover:bg-stone/30 text-viridian/70 transition-all shadow-soft bg-shell/40"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-viridian" /> : <Sun className="w-4 h-4 text-viridian" />}
            </button>

            {/* Ambient Sound Trigger */}
            <button 
              onClick={toggleAmbientSound}
              className={`p-2.5 rounded-xl border border-stone/50 hover:bg-stone/30 text-viridian/70 transition-all flex items-center gap-2 text-xs font-mono shadow-soft ${isAmbientPlaying ? "bg-sky/40 border-sky-dark/40" : "bg-shell/40"}`}
              title="Ambient Focus Music"
            >
              {isAmbientPlaying ? <Volume2 className="w-4 h-4 text-viridian" /> : <VolumeX className="w-4 h-4 text-viridian/50" />}
              <span className="hidden lg:inline">{isAmbientPlaying ? "Focus Audio: On" : "Focus Audio"}</span>
            </button>

            {/* Streak flame decoration */}
            <div className="flex items-center gap-1.5 bg-honeydew/60 border border-stone/80 px-3.5 py-2 rounded-xl text-xs font-mono text-viridian shadow-soft">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Dynamic Center Work Area */}
        <div className="flex-1 overflow-y-auto relative p-6 md:p-8 bg-shell/15">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {renderMainWorkspace()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Right Sidebar Companion panel (Always visible on desktop dashboard view, or floating toggle) */}
      <div className="hidden xl:block shrink-0 w-80 h-full border-l border-stone/30 bg-shell/30">
        <RightSidebar 
          streak={streak}
          todayGoals={todayGoals}
          saveGoals={saveGoals}
          setActiveTab={setActiveTab}
          notes={notes}
          saveNotes={saveNotes}
        />
      </div>

      {/* Global Command palette search modal */}
      <GlobalSearch 
        isOpen={searchOpen} 
        setIsOpen={setSearchOpen}
        notes={notes}
        tasks={tasks}
        flashcards={flashcards}
        videos={videos}
        pdfs={pdfs}
        setActiveTab={setActiveTab}
      />

      {/* Onboarding Multi-Step Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 bg-viridian/40 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md md:max-w-lg bg-shell p-6 md:p-8 rounded-[2.5rem] border border-stone shadow-calm text-center flex flex-col items-center gap-5 max-h-[90vh] overflow-y-auto"
            >
              <img 
                src="/logo (light).png" 
                alt="StudyOS Logo" 
                className="w-10 h-10 object-contain"
              />

              {onboardingStep === 1 && (
                <div className="flex flex-col items-center gap-5 w-full">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-serif text-2xl font-bold text-viridian tracking-tight">
                      Welcome to StudyOS
                    </h2>
                    <p className="font-mono text-xs text-viridian/60 leading-normal">
                      Let&apos;s prepare your digital study desk. What should we call you?
                    </p>
                  </div>

                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian placeholder-viridian/45 text-center focus:outline-none focus:border-viridian transition-all focus:bg-shell"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tempName.trim()) {
                        setOnboardingStep(2);
                      }
                    }}
                  />

                  <button
                    onClick={() => setOnboardingStep(2)}
                    disabled={!tempName.trim()}
                    className="w-full bg-viridian hover:bg-viridian-hover disabled:bg-viridian/45 text-shell font-mono text-xs py-3.5 rounded-xl transition-all shadow-soft font-bold"
                  >
                    Continue
                  </button>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="font-serif text-xl font-bold text-viridian tracking-tight flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-viridian animate-pulse-soft" />
                      Activate Lumi AI Tutor
                    </h2>
                    <p className="font-mono text-[10px] text-viridian/65 leading-relaxed">
                      Lumi AI powers notes explanation, chapters digests, formula extractions, and exam planners. You can generate a secure key for free.
                    </p>
                  </div>

                  <div className="w-full bg-sky/30 border border-sky-dark/25 rounded-2xl p-4 text-left font-mono text-[9px] text-viridian/85 flex flex-col gap-2">
                    <span className="font-bold flex items-center gap-1">How to get a key:</span>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>
                        Open{" "}
                        <a 
                          href="https://aistudio.google.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-bold underline hover:text-viridian-dark"
                        >
                          aistudio.google.com
                        </a>
                      </li>
                      <li>Click the blue <strong>&quot;Create API Key&quot;</strong> button.</li>
                      <li>Copy the long code (starts with <code>AIza...</code>) and paste it below.</li>
                    </ol>
                  </div>

                  <input
                    type="text"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Paste Gemini API Key (Optional)..."
                    className="w-full px-4 py-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian placeholder-viridian/45 text-center focus:outline-none focus:border-viridian transition-all focus:bg-shell"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setOnboardingStep(3);
                      }
                    }}
                  />

                  <div className="flex flex-col gap-2.5 w-full mt-1">
                    <button
                      onClick={() => setOnboardingStep(3)}
                      className="w-full bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs py-3.5 rounded-xl transition-all shadow-soft font-bold"
                    >
                      {tempApiKey.trim() ? "Activate & Continue" : "Continue in Demo Mode"}
                    </button>
                    
                    {!tempApiKey.trim() && (
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="font-mono text-[9px] text-viridian/60 hover:text-viridian underline transition-colors"
                      >
                        I will set this up later
                      </button>
                    )}
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="flex flex-col items-center gap-5 w-full">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-serif text-2xl font-bold text-viridian tracking-tight">
                      Ready to Learn, {tempName}!
                    </h2>
                    <p className="font-mono text-xs text-viridian/65 leading-relaxed">
                      Your calming digital study desk is fully prepared.
                    </p>
                  </div>

                  <div className="w-full bg-stone/40 border border-stone-dark/20 p-4 rounded-2xl text-center font-mono text-[10px] text-viridian/70 leading-normal">
                    💡 <strong>Quick Tip:</strong> If you chose to skip the API key setup for now, you can configure it at any time in the <strong>Settings</strong> tab on the sidebar.
                  </div>

                  <button
                    onClick={handleCompleteOnboarding}
                    className="w-full bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs py-3.5 rounded-xl transition-all shadow-soft font-bold flex items-center justify-center gap-2"
                  >
                    Begin Studying
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
