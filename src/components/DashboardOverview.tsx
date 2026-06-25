import { motion } from "framer-motion";
import { 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  Flame, 
  ArrowRight,
  Tv,
  Brain,
  Quote
} from "lucide-react";

interface DashboardOverviewProps {
  username: string;
  notes: any[];
  tasks: any[];
  timerHistory: any[];
  streak: number;
  todayGoals: any[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({
  username,
  notes,
  tasks,
  timerHistory,
  streak,
  todayGoals,
  setActiveTab,
}: DashboardOverviewProps) {
  // Get time of day greeting
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return `Good morning, ${username}.`;
    if (hrs < 18) return `Good afternoon, ${username}.`;
    return `Good evening, ${username}.`;
  };

  // Get dynamic greeting message
  const getGreetingMessage = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Enjoy the quiet morning hours. Take a deep breath and start gently.";
    if (hrs < 18) return "Welcome to your study desk. Keep focus high and remember to take small breaks.";
    return "Wind down your day with some light review. You've done well.";
  };

  // Calming Quotes
  const quotes = [
    { text: "Quiet minds study best. Find your flow state in the silence.", author: "Zen proverb" },
    { text: "It is not that I am so smart, it is just that I stay with problems longer.", author: "Albert Einstein" },
    { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" }
  ];
  
  // Pick quote based on date so it shifts daily
  const quote = quotes[new Date().getDate() % quotes.length];

  // Calculations
  const pendingTasks = tasks.filter(t => t.column !== "done");
  const focusSessions = timerHistory.filter(h => h.type === "focus");
  const totalStudyMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  const quickActions = [
    {
      icon: <Clock className="w-5 h-5 text-viridian" />,
      title: "Start Pomodoro",
      description: "Begin a 25-minute focus interval.",
      tab: "timer",
      color: "bg-sky/55"
    },
    {
      icon: <BookOpen className="w-5 h-5 text-viridian" />,
      title: "Create Note",
      description: "Draft a new markdown folder document.",
      tab: "notes",
      color: "bg-honeydew/55"
    },
    {
      icon: <Tv className="w-5 h-5 text-viridian" />,
      title: "Watch Lecture",
      description: "Open YouTube video side-by-side with notes.",
      tab: "videos",
      color: "bg-stone/55"
    },
    {
      icon: <Brain className="w-5 h-5 text-viridian" />,
      title: "Practice Flashcards",
      description: "Trigger spaced repetition active review.",
      tab: "flashcards",
      color: "bg-sky/50"
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* 1. Header Greeting & Message */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-2"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-viridian flex items-center gap-2">
          {getGreeting()}
          <Sparkles className="w-6 h-6 text-viridian animate-pulse-soft hidden sm:inline" />
        </h1>
        <p className="font-mono text-xs text-viridian/70">
          {getGreetingMessage()}
        </p>
      </motion.div>

      {/* 2. Core Workspace Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Study Hours</span>
          <span className="font-serif text-3xl font-bold text-viridian">{totalStudyHours}h</span>
          <span className="font-mono text-[10px] text-viridian/50">Across {focusSessions.length} sessions</span>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Active Streak</span>
          <span className="font-serif text-3xl font-bold text-viridian flex items-center gap-1.5">
            {streak}
            <Flame className="w-6 h-6 text-orange-600 fill-orange-500" />
          </span>
          <span className="font-mono text-[10px] text-viridian/50">Consistent learning days</span>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Todo Backlog</span>
          <span className="font-serif text-3xl font-bold text-viridian">{pendingTasks.length}</span>
          <span className="font-mono text-[10px] text-viridian/50">Unfinished desk tasks</span>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Saved Notes</span>
          <span className="font-serif text-3xl font-bold text-viridian">{notes.length}</span>
          <span className="font-mono text-[10px] text-viridian/50">Stored study summaries</span>
        </div>
      </div>

      {/* 3. Floating Calming Quote */}
      <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-stone/50 bg-stone/20 text-center relative overflow-hidden shadow-soft flex flex-col items-center justify-center gap-3">
        <Quote className="w-8 h-8 text-viridian/25 animate-float" />
        <p className="font-serif text-lg md:text-xl text-viridian/90 max-w-2xl leading-relaxed italic">
          “{quote.text}”
        </p>
        <span className="font-mono text-[10px] text-viridian/60">— {quote.author}</span>
      </div>

      {/* 4. Quick Actions Trigger Panel */}
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-lg font-bold text-viridian">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              onClick={() => setActiveTab(action.tab)}
              className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft hover:shadow-calm transition-all cursor-pointer flex flex-col gap-3 group bg-shell/65"
            >
              <div className={`w-10 h-10 rounded-2xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                {action.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1 group-hover:text-viridian-hover">
                  {action.title}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </span>
                <span className="font-mono text-[10px] text-viridian/60 leading-normal">
                  {action.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Recent Items Context Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Note preview */}
        <div className="glass-card p-6 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-4">
          <span className="font-serif text-sm font-bold text-viridian">Recent Note</span>
          {notes.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h3 className="font-mono text-xs font-bold text-viridian underline truncate">
                {notes[0].title}
              </h3>
              <p className="font-mono text-[11px] text-viridian/70 line-clamp-3 leading-relaxed">
                {notes[0].content}
              </p>
              <button 
                onClick={() => setActiveTab("notes")}
                className="self-start mt-2 font-mono text-[10px] text-viridian hover:underline flex items-center gap-1.5"
              >
                Open Notes Editor
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="font-mono text-xs text-viridian/45 italic">No notes created yet.</span>
          )}
        </div>

        {/* Up next task */}
        <div className="glass-card p-6 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-4">
          <span className="font-serif text-sm font-bold text-viridian">Next in Backlog</span>
          {pendingTasks.length > 0 ? (
            <div className="flex flex-col gap-2 justify-between flex-1">
              <div className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-viridian shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <p className="font-mono text-xs font-bold text-viridian leading-snug">
                    {pendingTasks[0].text}
                  </p>
                  {pendingTasks[0].dueDate && (
                    <span className="font-mono text-[9px] text-red-500 mt-1">Due: {pendingTasks[0].dueDate}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setActiveTab("tasks")}
                className="self-start mt-4 font-mono text-[10px] text-viridian hover:underline flex items-center gap-1.5"
              >
                Go to Task Board
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="font-mono text-xs text-viridian/45 italic">All tasks completed!</span>
          )}
        </div>
      </div>

    </div>
  );
}
