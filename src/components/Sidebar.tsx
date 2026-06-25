import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  Tv, 
  FileText, 
  BarChart3, 
  Settings, 
  FolderLock,
  Flame,
  Award,
  GitBranch,
  Calendar,
  Coffee,
  Lock
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  notesCount: number;
  tasksCount: number;
  theme: string;
  username: string;
  timerMode: "focus" | "shortBreak" | "longBreak";
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  notesCount,
  tasksCount,
  theme,
  username,
  timerMode,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "notes", label: "Notes", icon: <BookOpen className="w-4 h-4" />, badge: notesCount },
    { id: "tasks", label: "Tasks", icon: <CheckSquare className="w-4 h-4" />, badge: tasksCount },
    { id: "timer", label: "Study Timer", icon: <Clock className="w-4 h-4" /> },
    { id: "exams", label: "Exam Planner", icon: <Calendar className="w-4 h-4" /> },
    { id: "flashcards", label: "Flashcards", icon: <Award className="w-4 h-4" /> },
    { 
      id: "breaks", 
      label: "Mind Breaks", 
      icon: timerMode === "shortBreak" || timerMode === "longBreak" 
        ? <Coffee className="w-4 h-4 text-orange-600 animate-pulse" /> 
        : <Lock className="w-4 h-4 text-viridian/45" /> 
    },
    { id: "chat", label: "AI Chat", icon: <Sparkles className="w-4 h-4" /> },
    { id: "videos", label: "Videos", icon: <Tv className="w-4 h-4" /> },
    { id: "pdfs", label: "PDFs", icon: <FileText className="w-4 h-4" /> },
    { id: "graph", label: "Knowledge Graph", icon: <GitBranch className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "leaderboard", label: "Leaderboard", icon: <Flame className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const navClasses = (id: string) => {
    const base = "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all relative group";
    if (activeTab === id) {
      return `${base} text-viridian font-bold bg-stone`;
    }
    return `${base} text-viridian/70 hover:text-viridian hover:bg-stone/30`;
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-viridian/20 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:relative top-0 bottom-0 left-0 w-64 border-r border-stone/30 bg-shell-dark/65 md:bg-shell-dark/30 z-50 transition-transform duration-300 flex flex-col pt-20 md:pt-0 shrink-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Brand Logo - Desktop */}
        <div className="hidden md:flex h-16 items-center px-8 gap-2 shrink-0">
          <img 
            src={theme === "dark" ? "/logo (dark).png" : "/logo (light).png"} 
            alt="StudyOS Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-serif text-xl font-bold tracking-tight text-viridian">
            StudyOS
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={navClasses(item.id)}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-bar"
                  className="absolute left-0 w-1 h-6 bg-viridian rounded-r-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="text-viridian/85 group-hover:scale-105 transition-transform">{item.icon}</span>
              <span>{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-sky text-viridian px-2 py-0.5 rounded-md text-[10px] font-bold border border-viridian/10">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer profile segment */}
        <div className="p-6 border-t border-stone/40 bg-shell-dark/10 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-sky flex items-center justify-center text-viridian border border-stone-dark font-serif font-bold shadow-soft">
            {username ? username[0].toUpperCase() : "?"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-xs font-bold text-viridian truncate">{username || "Student"}</span>
            <span className="font-mono text-[9px] text-viridian/50 truncate flex items-center gap-1">
              <FolderLock className="w-2.5 h-2.5" /> Workspace active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
