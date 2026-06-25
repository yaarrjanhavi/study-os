import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  BookOpen, 
  ArrowRight,
  ListTodo,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { Task } from "../app/dashboard/page";

export interface Exam {
  id: string;
  subject: string;
  date: string;
  syllabus: string;
  plan?: string;
}

interface ExamPlannerProps {
  exams: Exam[];
  saveExams: (exams: Exam[]) => void;
  tasks: Task[];
  saveTasks: (tasks: Task[]) => void;
  apiKey: string;
}

export default function ExamPlanner({
  exams,
  saveExams,
  tasks,
  saveTasks,
  apiKey,
}: ExamPlannerProps) {
  // Add exam states
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Selector state
  const [selectedExamId, setSelectedExamId] = useState<string | null>(exams[0]?.id || null);

  // AI planning states
  const [aiLoading, setAiLoading] = useState(false);
  const [activePlanText, setActivePlanText] = useState<string | null>(null);

  // Calendar dates
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-indexed

  // Sync selected exam on data updates
  useEffect(() => {
    if (selectedExamId) {
      const exam = exams.find(e => e.id === selectedExamId);
      if (exam) {
        setActivePlanText(exam.plan || null);
      }
    } else if (exams.length > 0) {
      setSelectedExamId(exams[0].id);
    } else {
      setActivePlanText(null);
    }
  }, [selectedExamId, exams]);

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !examDate || !syllabus.trim()) return;

    const newExam: Exam = {
      id: `ex-${Date.now()}`,
      subject: subject.trim(),
      date: examDate,
      syllabus: syllabus.trim()
    };

    const updated = [newExam, ...exams];
    saveExams(updated);
    setSelectedExamId(newExam.id);
    setSubject("");
    setExamDate("");
    setSyllabus("");
    setShowAddForm(false);

    confetti({
      particleCount: 30,
      spread: 30,
      colors: ["#344945", "#E4E3BC", "#D5E3E8"]
    });
  };

  const handleDeleteExam = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = exams.filter(ex => ex.id !== id);
    saveExams(remaining);
    if (selectedExamId === id) {
      setSelectedExamId(remaining[0]?.id || null);
    }
  };

  // Generate portion cover study guide
  const handleGenerateStudyPlan = async () => {
    const exam = exams.find(e => e.id === selectedExamId);
    if (!exam || aiLoading) return;

    setAiLoading(true);
    setActivePlanText(null);

    const query = `Create a daily coverage plan for ${exam.subject} exam on ${newExamDateFormat(exam.date)}. Syllabus topics: ${exam.syllabus}`;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "exam-planner",
          prompt: query,
          context: exam.syllabus,
          userApiKey: apiKey
        })
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Save plan text to the active exam object
      const updated = exams.map(ex => {
        if (ex.id === exam.id) {
          return { ...ex, plan: data.text };
        }
        return ex;
      });
      saveExams(updated);
      setActivePlanText(data.text);

      confetti({
        particleCount: 50,
        spread: 60,
        colors: ["#E4E3BC", "#D5E3E8", "#344945"]
      });
    } catch (err) {
      alert("Failed to build portion planner.");
    } finally {
      setAiLoading(false);
    }
  };

  // Push AI plan directly into Kanban todo tasks list
  const handleImportPlanToTasks = () => {
    if (!activePlanText || !selectedExamId) return;
    const exam = exams.find(e => e.id === selectedExamId);
    if (!exam) return;

    // Parse checkboxes or bullet lines from plan
    const lines = activePlanText
      .split("\n")
      .map(l => l.replace(/^[-*]\s*\[\s*\]\s*/g, "").replace(/^[-*]\s*/g, "").trim())
      .filter(l => l.length > 0);

    const newTasks: Task[] = lines.map((l, index) => ({
      id: `t-ai-exam-${Date.now()}-${index}`,
      text: `[${exam.subject}] ${l}`,
      priority: "medium" as const,
      column: "todo" as const,
      dueDate: exam.date,
      subtasks: []
    }));

    saveTasks([...newTasks, ...tasks]);

    confetti({
      particleCount: 80,
      spread: 70,
      colors: ["#D5E3E8", "#E4E3BC", "#344945"]
    });

    alert(`Wonderful! Generated ${newTasks.length} daily revision tasks and imported them into your active study backlog.`);
  };

  const getDaysRemaining = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Completed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 Day Left";
    return `${diffDays} Days Left`;
  };

  const newExamDateFormat = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  // 4. Generate Calendar Grid cells
  const getCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Sun = 0, Mon = 1, etc.
    
    const days = [];
    
    // pad previous month empty days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, dateStr: null });
    }

    // current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const monthStr = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      days.push({ day: i, dateStr });
    }

    return days;
  };

  const calendarDays = getCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Helper to check if a calendar date matches any exam date
  const getExamForDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return exams.find(e => e.date === dateStr) || null;
  };

  const activeExam = exams.find(e => e.id === selectedExamId);

  // Render markdown with checks
  const renderMarkdown = (text: string) => {
    if (!text) return "";
    let html = text
      .replace(/^[-*]\s*\[\s*\]\s*(.*$)/gim, '<li class="ml-4 list-none flex items-start gap-2 text-[10px] text-viridian/95 font-mono mb-2"><span class="w-3.5 h-3.5 border border-stone-dark rounded flex items-center justify-center shrink-0 bg-shell mt-0.5"></span><span>$1</span></li>')
      .replace(/^[-*]\s*(.*$)/gim, '<li class="ml-4 list-disc text-[10px] text-viridian/90 font-mono mb-1.5">$1</li>')
      .replace(/\n$/gim, "<br />");

    return <div className="space-y-1" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="lg:h-full flex flex-col gap-6 select-none relative">
      
      {/* 1. Header controls */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-serif text-xl font-bold text-viridian flex items-center gap-2">
            <CalendarIcon className="w-5.5 h-5.5 text-viridian" />
            Exam Planner & Coverage Assistant
          </h1>
          <p className="font-mono text-[10px] text-viridian/70">
            Map out your tests schedule and trigger Lumi AI to divide portions evenly.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 font-mono text-[10px] bg-viridian text-shell px-3 py-2 rounded-xl hover:bg-viridian-hover shadow-soft transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Exam
        </button>
      </div>

      {/* 2. Add Exam Form overlay */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft overflow-hidden shrink-0"
          >
            <form onSubmit={handleAddExam} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-end font-mono text-[10px]">
              
              <div className="md:col-span-4 flex flex-col gap-1.5 w-full">
                <label className="uppercase tracking-wider text-viridian/70">Subject / Exam Name</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Advanced Calculus Midterm"
                  className="px-3 py-2.5 rounded-xl border border-stone/80 bg-shell/50 text-viridian focus:outline-none focus:border-viridian"
                />
              </div>

              <div className="md:col-span-3 flex flex-col gap-1.5 w-full">
                <label className="uppercase tracking-wider text-viridian/70">Exam Date</label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone/80 bg-shell/50 text-viridian focus:outline-none focus:border-viridian"
                />
              </div>

              <div className="md:col-span-5 flex flex-col gap-1.5 w-full">
                <label className="uppercase tracking-wider text-viridian/70">Syllabus Topics (comma separated)</label>
                <input
                  type="text"
                  required
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="e.g. Chapter 1: Limits, Chapter 2: Integrals, Chapter 3: Sequences"
                  className="px-3 py-2.5 rounded-xl border border-stone/80 bg-shell/50 text-viridian focus:outline-none focus:border-viridian"
                />
              </div>

              <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 border border-stone text-viridian rounded-xl hover:bg-stone/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-viridian text-shell rounded-xl hover:bg-viridian-hover shadow-soft"
                >
                  Save Exam
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Grid layout: Timetable + Calendar + AI planner */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:overflow-hidden">
        
        {/* LEFT COLUMN: Exams Timetable list */}
        <div className="lg:col-span-4 flex flex-col gap-3 lg:h-full lg:overflow-hidden min-h-[220px]">
          <span className="font-serif text-xs font-bold text-viridian shrink-0">Exams Timetable</span>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {exams.map(ex => {
              const isSelected = selectedExamId === ex.id;
              const daysLeft = getDaysRemaining(ex.date);

              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExamId(ex.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 relative group ${isSelected ? "bg-shell/80 border-viridian/30 shadow-soft" : "bg-shell/30 border-stone/50 hover:bg-stone/20"}`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-serif text-xs font-bold text-viridian truncate pr-12">
                      {ex.subject}
                    </h3>
                    <button
                      onClick={(e) => handleDeleteExam(ex.id, e)}
                      className="absolute right-3 top-3 p-1 rounded hover:bg-red-500/20 text-viridian/65 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center font-mono text-[9px] text-viridian/60 mt-0.5">
                    <span className="bg-stone px-2 py-0.5 rounded border border-viridian/10">
                      {newExamDateFormat(ex.date)}
                    </span>
                    <span className={`px-2 py-0.5 rounded border font-bold
                      ${daysLeft === "Completed" ? "bg-stone text-viridian/45 border-stone-dark/30" : "bg-honeydew text-[#344945] border-viridian/20"}
                    `}>
                      {daysLeft}
                    </span>
                  </div>

                  <p className="font-mono text-[9px] text-viridian/60 line-clamp-2 leading-relaxed mt-1">
                    Syllabus: {ex.syllabus}
                  </p>
                </div>
              );
            })}

            {exams.length === 0 && (
              <div className="text-center py-12 font-mono text-[9px] text-viridian/40 italic flex flex-col gap-2 items-center justify-center border border-dashed border-stone rounded-2xl bg-shell/25">
                <AlertCircle className="w-6 h-6 text-viridian/30" />
                No exams scheduled yet. Click &quot;Add Exam&quot; above.
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Calendar view */}
        <div className="lg:col-span-4 glass-card p-5 rounded-3xl border border-stone/50 shadow-soft flex flex-col gap-3 bg-shell/65 h-fit">
          <div className="flex justify-between items-center shrink-0">
            <span className="font-serif text-xs font-bold text-viridian">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(prev => prev - 1);
                  } else {
                    setCurrentMonth(prev => prev - 1);
                  }
                }}
                className="p-1 rounded bg-stone/40 border border-stone hover:bg-stone text-[9px] font-bold"
              >
                &lt;
              </button>
              <button
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(prev => prev + 1);
                  } else {
                    setCurrentMonth(prev => prev + 1);
                  }
                }}
                className="p-1 rounded bg-stone/40 border border-stone hover:bg-stone text-[9px] font-bold"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[9px] text-viridian/65 font-bold border-b border-stone/30 pb-1.5 shrink-0">
            {weekdays.map((w, idx) => <span key={idx}>{w}</span>)}
          </div>

          {/* Calendar Grid cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              const exam = getExamForDate(cell.dateStr);
              const isToday = cell.dateStr === new Date().toISOString().split("T")[0];

              return (
                <div
                  key={idx}
                  onClick={() => { if (exam) setSelectedExamId(exam.id); }}
                  className={`aspect-square w-full p-1.5 rounded-xl border flex flex-col justify-between transition-all text-left relative
                    ${!cell.day ? "border-transparent bg-transparent pointer-events-none" : ""}
                    ${cell.day && !exam ? "bg-shell/45 border-stone/30" : ""}
                    ${exam ? "bg-sky/60 border-viridian/20 hover:scale-105 cursor-pointer shadow-soft font-bold" : ""}
                    ${isToday && !exam ? "border-viridian bg-honeydew/30 font-bold" : ""}
                  `}
                >
                  {cell.day && (
                    <>
                      <span className={`font-mono text-[8px] ${exam || isToday ? "text-viridian font-bold" : "text-viridian/70"}`}>
                        {cell.day}
                      </span>
                      {exam && (
                        <div className="absolute bottom-1 right-1 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Study Planner */}
        <div className="lg:col-span-4 glass-card p-5 rounded-3xl border border-stone/50 shadow-soft bg-shell/65 flex flex-col gap-4 lg:h-full lg:overflow-hidden min-h-[300px]">
          <span className="font-serif text-xs font-bold text-viridian shrink-0">Portion Coverer</span>

          {activeExam ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              <div className="flex flex-col gap-0.5 border-b border-stone/30 pb-3 shrink-0">
                <span className="font-mono text-[8px] uppercase tracking-wider text-viridian/50">ACTIVE PLANNER TARGET:</span>
                <span className="font-serif text-xs font-bold text-viridian truncate">{activeExam.subject}</span>
              </div>

              {/* Syllabus reference */}
              <div className="bg-stone/20 border border-stone p-2.5 rounded-xl font-mono text-[9px] leading-relaxed text-viridian/65 shrink-0 mt-2">
                <strong>Syllabus portion:</strong> {activeExam.syllabus}
              </div>

              {/* AI Plan text container */}
              <div className="flex-1 overflow-y-auto space-y-3 mt-3 pr-1">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <span className="w-5 h-5 border-2 border-viridian/30 border-t-viridian rounded-full animate-spin"></span>
                    <span className="font-mono text-[9px] text-viridian/60">Lumi is dividing portion dates...</span>
                  </div>
                ) : activePlanText ? (
                  <div className="p-3 bg-shell/55 border border-stone rounded-2xl shadow-soft font-mono text-[10px] leading-relaxed">
                    <div className="flex items-center gap-1.5 mb-3 font-bold border-b border-stone/30 pb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-viridian animate-pulse-soft" />
                      Lumi Daily Revision Plan
                    </div>
                    {renderMarkdown(activePlanText)}
                  </div>
                ) : (
                  <div className="text-center py-12 font-mono text-[10px] text-viridian/40 italic flex flex-col gap-2 items-center justify-center h-full">
                    <HelpCircle className="w-8 h-8 text-viridian/25 animate-float" />
                    Lumi will help you cover this exam portion day-by-day. Click the button below to generate a study guide.
                  </div>
                )}
              </div>

              {/* Control Action Buttons */}
              <div className="mt-3 shrink-0 flex flex-col gap-2 border-t border-stone/30 pt-3">
                {!activePlanText && !aiLoading && (
                  <button
                    onClick={handleGenerateStudyPlan}
                    className="w-full bg-viridian hover:bg-viridian-hover text-shell font-mono text-[9px] py-3 rounded-xl transition-all shadow-soft flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse-soft" />
                    Generate AI Study Portion Plan
                  </button>
                )}

                {activePlanText && !aiLoading && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateStudyPlan}
                      className="flex-1 border border-stone text-viridian hover:bg-stone/30 font-mono text-[9px] py-3 rounded-xl transition-all"
                    >
                      Regenerate Plan
                    </button>
                    <button
                      onClick={handleImportPlanToTasks}
                      className="flex-1 bg-viridian hover:bg-viridian-hover text-shell font-mono text-[9px] py-3 rounded-xl transition-all shadow-soft flex items-center justify-center gap-1.5"
                    >
                      <ListTodo className="w-3.5 h-3.5" />
                      Import Tasks
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 font-mono text-[10px] text-viridian/40 italic flex flex-col gap-2 items-center justify-center h-full">
              <Clock className="w-8 h-8 text-viridian/25 animate-spin-slow" />
              Schedule or select an exam in the left table to enable AI portion planning.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
