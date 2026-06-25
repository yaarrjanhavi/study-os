import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  CheckSquare, 
  Tv, 
  FileText, 
  Award,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Note, Task, Flashcard, VideoStudy, PDFDoc } from "../app/dashboard/page";

interface GlobalSearchProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  notes: Note[];
  tasks: Task[];
  flashcards: Flashcard[];
  videos: VideoStudy[];
  pdfs: PDFDoc[];
  setActiveTab: (tab: string) => void;
}

export default function GlobalSearch({
  isOpen,
  setIsOpen,
  notes,
  tasks,
  flashcards,
  videos,
  pdfs,
  setActiveTab,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  // Filter items matching query
  const getResults = () => {
    if (!query.trim()) return [];

    const results: { id: string; title: string; category: string; tab: string; icon: any }[] = [];
    const q = query.toLowerCase();

    // Notes
    notes.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        results.push({ id: n.id, title: n.title, category: "Notes", tab: "notes", icon: <BookOpen className="w-3.5 h-3.5" /> });
      }
    });

    // Tasks
    tasks.forEach(t => {
      if (t.text.toLowerCase().includes(q)) {
        results.push({ id: t.id, title: t.text, category: "Tasks", tab: "tasks", icon: <CheckSquare className="w-3.5 h-3.5" /> });
      }
    });

    // Flashcards
    flashcards.forEach(f => {
      if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
        results.push({ id: f.id, title: f.question, category: "Flashcards", tab: "flashcards", icon: <Award className="w-3.5 h-3.5" /> });
      }
    });

    // Videos
    videos.forEach(v => {
      if (v.title.toLowerCase().includes(q) || v.notes.toLowerCase().includes(q)) {
        results.push({ id: v.id, title: v.title, category: "YouTube Lectures", tab: "videos", icon: <Tv className="w-3.5 h-3.5" /> });
      }
    });

    // PDFs
    pdfs.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)) {
        results.push({ id: p.id, title: p.name, category: "Uploaded PDFs", tab: "pdfs", icon: <FileText className="w-3.5 h-3.5" /> });
      }
    });

    return results;
  };

  const results = getResults();

  const handleResultClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      <div 
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-viridian/20 backdrop-blur-sm z-50 flex items-start justify-center p-6 md:p-24"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-shell rounded-[2rem] border border-stone shadow-calm flex flex-col max-h-[80%] overflow-hidden"
        >
          {/* Search Input block */}
          <div className="relative p-4 border-b border-stone/30 shrink-0">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-viridian/45" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across notes, tasks, flashcards, videos..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian transition-all focus:bg-shell"
            />
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {results.map((res, i) => (
              <div
                key={i}
                onClick={() => handleResultClick(res.tab)}
                className="p-3 rounded-xl border border-stone/40 hover:border-viridian/35 hover:bg-stone/20 cursor-pointer transition-all flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky/50 flex items-center justify-center text-viridian shrink-0">
                    {res.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[9px] text-viridian/50 uppercase tracking-wider">{res.category}</span>
                    <span className="font-mono text-xs font-bold text-viridian truncate mt-0.5">{res.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[9px] text-viridian/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Go to tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}

            {query.trim() && results.length === 0 && (
              <div className="text-center py-12 font-mono text-[10px] text-viridian/40 italic">
                No matching notes or documents found.
              </div>
            )}

            {!query.trim() && (
              <div className="text-center py-12 font-mono text-[10px] text-viridian/40 italic flex flex-col gap-2 items-center justify-center">
                <Sparkles className="w-7 h-7 text-viridian/25 animate-float" />
                Type keywords above to search all active study materials.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
