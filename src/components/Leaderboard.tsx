import { motion } from "framer-motion";
import { 
  Award, 
  Flame, 
  Clock, 
  CheckCircle, 
  Zap, 
  Lock, 
  Unlock,
  TrendingUp
} from "lucide-react";
import { PomodoroSession } from "../app/dashboard/page";

interface LeaderboardProps {
  timerHistory: PomodoroSession[];
  streak: number;
}

export default function Leaderboard({ timerHistory, streak }: LeaderboardProps) {
  // Calculations
  const focusSessions = timerHistory.filter(h => h.type === "focus");
  const totalFocusBlocks = focusSessions.length;
  
  // Calculate this week's hours vs previous weeks (seeded values)
  const currentWeekMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const currentWeekHours = Number((currentWeekMinutes / 60).toFixed(1));
  
  const weeklyData = [
    { label: "3 Weeks Ago", hours: 8.4 },
    { label: "2 Weeks Ago", hours: 12.0 },
    { label: "Last Week", hours: 14.5 },
    { label: "Current Week", hours: currentWeekHours }
  ];

  // Productivity score calculation: base 50 + (streak * 5) + (focus * 3) max 100
  const productivityScore = Math.min(50 + (streak * 5) + (totalFocusBlocks * 3), 100);

  // Dynamic Badges list loaded and checked against active state values!
  const badgesList = [
    {
      id: "b-1",
      title: "First Step Scholar",
      desc: "Complete your first focus Pomodoro session.",
      condition: totalFocusBlocks >= 1,
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: "b-2",
      title: "Streak Committer",
      desc: "Keep a study streak of 3 days or more.",
      condition: streak >= 3,
      icon: <Flame className="w-5 h-5" />
    },
    {
      id: "b-3",
      title: "Deep Work Architect",
      desc: "Complete 5 focus blocks in your workspace.",
      condition: totalFocusBlocks >= 5,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: "b-4",
      title: "High-Volume Scholar",
      desc: "Accumulate 10 or more focus blocks.",
      condition: totalFocusBlocks >= 10,
      icon: <Award className="w-5 h-5" />
    }
  ];

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-12 select-none">
      
      {/* 1. Header */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <h1 className="font-serif text-2xl font-bold text-viridian flex items-center gap-2">
          <Award className="w-6 h-6 text-viridian" />
          Desk Achievements Board
        </h1>
        <p className="font-mono text-xs text-viridian/70">
          Track your growth consistency, review weekly progress, and unlock milestones.
        </p>
      </div>

      {/* 2. Top Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-1.5 bg-shell/70">
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/65">Study Streak</span>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-600 fill-orange-500" />
            <span className="font-serif text-2xl font-bold text-viridian">{streak} Days</span>
          </div>
          <span className="font-mono text-[10px] text-viridian/50">Consistent daily targets</span>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-1.5 bg-shell/70">
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/65">Productivity Rating</span>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-600 fill-yellow-400" />
            <span className="font-serif text-2xl font-bold text-viridian">{productivityScore}/100</span>
          </div>
          <span className="font-mono text-[10px] text-viridian/50">Calculated focus metric</span>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-1.5 col-span-2 lg:col-span-1 bg-shell/70">
          <span className="font-mono text-[9px] uppercase tracking-wider text-viridian/65">Focus Milestones</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-viridian" />
            <span className="font-serif text-2xl font-bold text-viridian">
              {badgesList.filter(b => b.condition).length} / {badgesList.length}
            </span>
          </div>
          <span className="font-mono text-[10px] text-viridian/50">Badges unlocked</span>
        </div>
      </div>

      {/* 3. Comparing weeks over time */}
      <div className="glass-card p-6 rounded-[2rem] border border-stone/50 shadow-soft flex flex-col gap-4 bg-shell/65">
        <div className="flex justify-between items-center">
          <span className="font-serif text-sm font-bold text-viridian">Weekly Study Hours Progress</span>
          <span className="font-mono text-[10px] text-viridian/50 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Compare past weeks
          </span>
        </div>

        {/* Visual progress bar representation */}
        <div className="space-y-4 pt-2">
          {weeklyData.map((week, index) => {
            // Find max hours to scale bar lengths
            const maxHrs = Math.max(...weeklyData.map(w => w.hours), 1);
            const percentWidth = (week.hours / maxHrs) * 100;

            return (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-mono text-[10px]">
                <span className="w-28 text-viridian/70">{week.label}</span>
                <div className="flex-1 h-3 rounded-full bg-stone/40 overflow-hidden border border-stone-dark/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentWidth}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${index === weeklyData.length - 1 ? "bg-viridian" : "bg-sky"}`}
                  />
                </div>
                <span className="w-12 text-right font-bold text-viridian">{week.hours} hrs</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Badges Collection */}
      <div className="flex flex-col gap-4">
        <span className="font-serif text-sm font-bold text-viridian">Milestone Badges Collection</span>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border flex gap-4 transition-all relative ${badge.condition ? "bg-shell/80 border-stone/60 shadow-soft" : "bg-stone/20 border-stone-dark/30 text-viridian/45"}`}
            >
              {/* Icon Holder */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-soft
                ${badge.condition ? "bg-honeydew border-viridian/20 text-viridian animate-pulse-soft" : "bg-stone-light/50 border-stone text-viridian/30"}
              `}>
                {badge.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pr-6">
                <h3 className={`font-serif text-sm font-bold ${badge.condition ? "text-viridian" : "text-viridian/50"}`}>
                  {badge.title}
                </h3>
                <p className="font-mono text-[10px] text-viridian/60 leading-relaxed mt-1">
                  {badge.desc}
                </p>
              </div>

              {/* Status Lock/Unlock icon */}
              <div className="absolute right-4 top-4">
                {badge.condition ? (
                  <Unlock className="w-3.5 h-3.5 text-viridian" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-viridian/30" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
