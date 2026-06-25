import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Target 
} from "lucide-react";
import { Note, Task, PomodoroSession } from "../app/dashboard/page";

interface StudyAnalyticsProps {
  timerHistory: PomodoroSession[];
  tasks: Task[];
  notes: Note[];
}

export default function StudyAnalytics({
  timerHistory,
  tasks,
  notes,
}: StudyAnalyticsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Calculations
  const focusSessions = timerHistory.filter(h => h.type === "focus");
  const totalMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedTasks = tasks.filter(t => t.column === "done").length;
  const pendingTasks = tasks.filter(t => t.column !== "done").length;

  // 2. Prepare chart data for last 7 days study hours
  const getDailyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dataMap: Record<string, number> = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      dataMap[dayName] = 0;
    }

    // Accumulate actual timer history hours
    focusSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayName = days[sessionDate.getDay()];
      if (dayName in dataMap) {
        dataMap[dayName] += session.duration / 60; // hours
      }
    });

    // Map to array
    return Object.entries(dataMap).map(([day, val]) => ({
      day,
      hours: Number(val.toFixed(1))
    }));
  };

  const chartData = getDailyData();

  // 3. Subjects Distribution calculations (Notes per folders)
  const getSubjectStats = () => {
    // Folders counts mapping
    const subjectsMap: Record<string, number> = {
      "Computer Science": 0,
      "Engineering": 0,
      "Mathematics": 0,
      "General Study": 0
    };

    notes.forEach(note => {
      if (note.folderId === "f-1") subjectsMap["Computer Science"] += 1;
      else if (note.folderId === "f-2") subjectsMap["Engineering"] += 1;
      else if (note.folderId === "f-3") subjectsMap["Mathematics"] += 1;
      else subjectsMap["General Study"] += 1;
    });

    const totalNotes = notes.length || 1;

    return Object.entries(subjectsMap).map(([subject, count]) => ({
      subject,
      count,
      percentage: Math.round((count / totalNotes) * 100)
    })).sort((a, b) => b.count - a.count);
  };

  const subjectStats = getSubjectStats();

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-12 select-none">
      
      {/* 1. Header */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <h1 className="font-serif text-2xl font-bold text-viridian flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-viridian" />
          Desk Analytics
        </h1>
        <p className="font-mono text-xs text-viridian/70">
          Visualize your study time, productivity ratings, and subject distributions.
        </p>
      </div>

      {/* 2. Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky/50 flex items-center justify-center text-viridian shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Study Hours</p>
            <p className="font-serif text-xl font-bold text-viridian">{totalHours}h</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-honeydew/50 flex items-center justify-center text-viridian shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Tasks Finished</p>
            <p className="font-serif text-xl font-bold text-viridian">{completedTasks}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone/50 flex items-center justify-center text-viridian shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Notes Stored</p>
            <p className="font-serif text-xl font-bold text-viridian">{notes.length}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky/30 flex items-center justify-center text-viridian shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-viridian/60">Task backlog</p>
            <p className="font-serif text-xl font-bold text-viridian">{pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* 3. Recharts Weekly Hours distribution & Subject distributions */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Weekly hours chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-[2.5rem] border border-stone/50 shadow-soft flex flex-col gap-4 bg-shell/65 min-h-[320px]">
          <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Weekly Focus Distribution (Hours)
          </span>

          <div className="flex-1 w-full mt-2 font-mono text-[9px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={chartData} margin={{ left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#344945" strokeWidth={1} tickLine={false} />
                  <YAxis stroke="#344945" strokeWidth={1} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#F7F5F1", 
                      border: "1px solid #E0DCD1",
                      borderRadius: "12px",
                      fontFamily: "var(--font-geist-mono)"
                    }} 
                  />
                  <Bar dataKey="hours" fill="#344945" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">Loading chart canvas...</div>
            )}
          </div>
        </div>

        {/* Folder/Subject Distributions */}
        <div className="lg:col-span-5 glass-card p-6 rounded-[2.5rem] border border-stone/50 shadow-soft flex flex-col gap-4 bg-shell/65 justify-between">
          <span className="font-serif text-sm font-bold text-viridian">Most Studied Subjects</span>

          <div className="space-y-4 flex-1 mt-2">
            {subjectStats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1.5 font-mono text-[10px]">
                <div className="flex justify-between items-center text-viridian">
                  <span className="font-bold">{stat.subject}</span>
                  <span className="text-viridian/60">{stat.count} notes ({stat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone/40 overflow-hidden border border-stone-dark/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full bg-viridian rounded-full"
                  />
                </div>
              </div>
            ))}

            {notes.length === 0 && (
              <div className="text-center py-12 font-mono text-[9px] text-viridian/40 italic">
                No folders/notes parsed. Stats will unlock once study files are added.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
