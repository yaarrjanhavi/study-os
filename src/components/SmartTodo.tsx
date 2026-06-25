import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ListTodo
} from "lucide-react";
import confetti from "canvas-confetti";
import { Task } from "../app/dashboard/page";

interface SmartTodoProps {
  tasks: Task[];
  apiKey: string;
  saveTasks: (tasks: Task[]) => void;
}

export default function SmartTodo({ tasks, apiKey, saveTasks }: SmartTodoProps) {
  // Task input fields
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState("");
  
  // UI states
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [aiBreakdownLoading, setAiBreakdownLoading] = useState<string | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      text: taskText.trim(),
      priority,
      column: "todo",
      dueDate: dueDate || undefined,
      subtasks: []
    };

    saveTasks([...tasks, newTask]);
    setTaskText("");
    setDueDate("");
    setPriority("medium");

    confetti({
      particleCount: 15,
      spread: 25,
      colors: ["#344945", "#E4E3BC"]
    });
  };

  const handleDeleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const handleMoveColumn = (id: string, dir: "forward" | "backward") => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        let nextCol: "todo" | "inProgress" | "done" = t.column;
        if (dir === "forward") {
          if (t.column === "todo") nextCol = "inProgress";
          else if (t.column === "inProgress") {
            nextCol = "done";
            // Confetti on task fully complete
            confetti({
              particleCount: 35,
              spread: 40,
              colors: ["#D5E3E8", "#E4E3BC", "#344945"]
            });
          }
        } else {
          if (t.column === "done") nextCol = "inProgress";
          else if (t.column === "inProgress") nextCol = "todo";
        }
        return { ...t, column: nextCol };
      }
      return t;
    });
    saveTasks(updated);
  };

  // Toggle subtasks completion
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextSub = t.subtasks.map(st => {
          if (st.id === subtaskId) {
            const nextState = !st.done;
            if (nextState) {
              confetti({
                particleCount: 15,
                spread: 20,
                origin: { y: 0.8 },
                colors: ["#E4E3BC", "#344945"]
              });
            }
            return { ...st, done: nextState };
          }
          return st;
        });
        return { ...t, subtasks: nextSub };
      }
      return t;
    });
    saveTasks(updated);
  };

  // Add individual subtask manually
  const handleAddSubtask = (taskId: string, text: string) => {
    if (!text.trim()) return;
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...t.subtasks, { id: `st-${Date.now()}`, text: text.trim(), done: false }]
        };
      }
      return t;
    });
    saveTasks(updated);
  };

  // AI goal breakdown planner
  const handleAiBreakdown = async (taskId: string, taskDesc: string) => {
    setAiBreakdownLoading(taskId);
    setExpandedTaskId(taskId);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "todo-breakdown",
          prompt: `Break down this study goal: ${taskDesc}`,
          context: taskDesc,
          userApiKey: apiKey
        })
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Parse AI output lines
      const lines = data.text
        .split("\n")
        .map((l: string) => l.replace(/^[-*]\s*\[\s*\]\s*/g, "").replace(/^[-*]\s*/g, "").trim())
        .filter((l: string) => l.length > 0);

      const generatedSubtasks = lines.map((l: string, idx: number) => ({
        id: `st-ai-${Date.now()}-${idx}`,
        text: l,
        done: false
      }));

      const updated = tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: [...t.subtasks, ...generatedSubtasks]
          };
        }
        return t;
      });

      saveTasks(updated);

      // Milestone confetti
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ["#E4E3BC", "#D5E3E8", "#344945"]
      });
    } catch (err) {
      alert("Failed to connect to AI planner.");
    } finally {
      setAiBreakdownLoading(null);
    }
  };

  // Priority color badges helper
  const priorityBadge = (pri: "high" | "medium" | "low") => {
    switch (pri) {
      case "high":
        return <span className="bg-red-200 border border-red-300 text-red-700 text-[8px] font-mono font-bold px-2 py-0.5 rounded-md uppercase">High</span>;
      case "medium":
        return <span className="bg-sky text-viridian border border-viridian/10 text-[8px] font-mono font-bold px-2 py-0.5 rounded-md uppercase">Medium</span>;
      case "low":
        return <span className="bg-honeydew text-viridian border border-viridian/10 text-[8px] font-mono font-bold px-2 py-0.5 rounded-md uppercase">Low</span>;
    }
  };

  // Columns structure
  const columns = [
    { id: "todo", title: "Desk Backlog", style: "border-stone/40 bg-stone/10" },
    { id: "inProgress", title: "Active Study", style: "border-sky-dark/45 bg-sky/15" },
    { id: "done", title: "Completed Tasks", style: "border-honeydew-dark/45 bg-honeydew/15" }
  ];

  return (
    <div className="h-full flex flex-col gap-6 select-none">
      
      {/* 1. Header input form */}
      <div className="glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft shrink-0">
        <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4 items-end">
          
          <div className="flex-1 flex flex-col gap-1.5 w-full">
            <label className="font-mono text-[9px] uppercase tracking-wider text-viridian/70">
              Study Task or Goal Description
            </label>
            <input
              type="text"
              required
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="e.g. Study Machine Learning backpropagation algorithms..."
              className="w-full px-4 py-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian placeholder-viridian/45 focus:outline-none focus:border-viridian focus:bg-shell transition-all"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto shrink-0">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-mono text-[9px] uppercase tracking-wider text-viridian/70">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="px-3 py-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian focus:outline-none focus:border-viridian"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-mono text-[9px] uppercase tracking-wider text-viridian/70">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian focus:outline-none focus:border-viridian"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-6 py-3.5 rounded-xl transition-all shadow-soft flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>

        </form>
      </div>

      {/* 2. Three Columns Kanban workspace */}
      <div className="flex-1 grid md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.column === col.id);
          
          return (
            <div 
              key={col.id}
              className={`rounded-[2rem] border p-5 flex flex-col gap-4 h-full overflow-hidden ${col.style}`}
            >
              <div className="flex justify-between items-center shrink-0">
                <span className="font-serif text-xs font-bold text-viridian flex items-center gap-1.5">
                  <ListTodo className="w-4 h-4 text-viridian" />
                  {col.title}
                </span>
                <span className="font-mono text-[10px] bg-stone px-2 py-0.5 rounded border border-viridian/15 font-bold">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence initial={false}>
                  {colTasks.map(t => (
                    <motion.div
                      key={t.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="p-4 rounded-2xl border border-stone/50 bg-shell/75 shadow-soft flex flex-col gap-3 group relative"
                    >
                      {/* Priority & Date strip */}
                      <div className="flex justify-between items-center">
                        {priorityBadge(t.priority)}

                        {t.dueDate && (
                          <div className="flex items-center gap-1 text-[8px] font-mono text-viridian/60">
                            <Calendar className="w-3 h-3" />
                            <span>{t.dueDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Goal Text */}
                      <h4 className={`font-mono text-xs font-bold leading-snug text-viridian ${t.column === "done" ? "line-through text-viridian/50" : ""}`}>
                        {t.text}
                      </h4>

                      {/* Expandable subtasks checklist */}
                      {t.subtasks.length > 0 && (
                        <div className="border-t border-stone/40 pt-2.5 space-y-1.5">
                          {t.subtasks.map(st => (
                            <div 
                              key={st.id}
                              onClick={() => handleToggleSubtask(t.id, st.id)}
                              className="flex items-center gap-2 cursor-pointer text-[10px]"
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0
                                ${st.done ? "bg-viridian text-shell border-viridian" : "border-stone/80 bg-shell"}
                              `}>
                                {st.done && <CheckCircle className="w-3 h-3" />}
                              </div>
                              <span className={`font-mono leading-tight truncate ${st.done ? "line-through text-viridian/45" : "text-viridian/85"}`}>
                                {st.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions footer (Quick planning & columns transitions) */}
                      <div className="border-t border-stone/40 pt-3 flex items-center justify-between">
                        {/* AI Breakdown Button */}
                        {t.column !== "done" && (
                          <button
                            onClick={() => handleAiBreakdown(t.id, t.text)}
                            disabled={aiBreakdownLoading === t.id}
                            className="flex items-center gap-1 font-mono text-[8px] bg-honeydew text-viridian border border-viridian/15 px-2.5 py-1.5 rounded-lg hover:bg-honeydew-dark transition-all disabled:bg-honeydew/50 shadow-soft"
                          >
                            <Sparkles className="w-3 h-3 text-viridian" />
                            {aiBreakdownLoading === t.id ? "Structuring..." : "AI Plan"}
                          </button>
                        )}
                        <div className="flex gap-1.5 ml-auto">
                          {t.column !== "todo" && (
                            <button
                              onClick={() => handleMoveColumn(t.id, "backward")}
                              className="p-1 rounded bg-stone/40 border border-stone hover:bg-stone transition-all"
                              title="Move back"
                            >
                              <ArrowLeft className="w-3 h-3 text-viridian" />
                            </button>
                          )}
                          {t.column !== "done" && (
                            <button
                              onClick={() => handleMoveColumn(t.id, "forward")}
                              className="p-1 rounded bg-stone/40 border border-stone hover:bg-stone transition-all"
                              title="Move forward"
                            >
                              <ArrowRight className="w-3 h-3 text-viridian" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1 rounded bg-red-100 hover:bg-red-500/20 border border-red-200 text-red-500 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colTasks.length === 0 && (
                  <div className="text-center py-12 font-mono text-[9px] text-viridian/35 italic">
                    Column empty.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
