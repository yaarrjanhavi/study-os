import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Award,
  CircleHelp
} from "lucide-react";
import confetti from "canvas-confetti";
import { Flashcard } from "../app/dashboard/page";

interface FlashcardsProps {
  flashcards: Flashcard[];
  saveFlashcards: (cards: Flashcard[]) => void;
}

export default function Flashcards({ flashcards, saveFlashcards }: FlashcardsProps) {
  // Navigation states
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Custom card creator
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [showCreator, setShowCreator] = useState(false);

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      difficulty: "medium"
    };

    saveFlashcards([...flashcards, newCard]);
    setNewQuestion("");
    setNewAnswer("");
    setShowCreator(false);
    setActiveIdx(flashcards.length); // jump to newly created card

    confetti({
      particleCount: 20,
      spread: 30,
      colors: ["#344945", "#E4E3BC"]
    });
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = flashcards.filter(c => c.id !== id);
    saveFlashcards(remaining);
    
    // adjust index
    if (activeIdx >= remaining.length && remaining.length > 0) {
      setActiveIdx(remaining.length - 1);
    } else if (remaining.length === 0) {
      setActiveIdx(0);
    }
    setIsFlipped(false);
  };

  const handleScoreReview = (id: string, diff: "easy" | "medium" | "hard") => {
    const updated = flashcards.map(c => {
      if (c.id === id) {
        return {
          ...c,
          difficulty: diff,
          lastReviewed: new Date().toISOString()
        };
      }
      return c;
    });

    saveFlashcards(updated);
    setIsFlipped(false);

    // Trigger feedback confetti on review success
    confetti({
      particleCount: 15,
      spread: 20,
      colors: ["#D5E3E8", "#E4E3BC"]
    });

    // Move to next card
    if (activeIdx < flashcards.length - 1) {
      setActiveIdx(prev => prev + 1);
    } else {
      alert("Deck review complete! Excellent learning progress.");
      setActiveIdx(0);
    }
  };

  const activeCard = flashcards[activeIdx];

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-12 select-none items-center justify-center">
      
      {/* 1. Deck actions row */}
      <div className="w-full max-w-xl flex justify-between items-center shrink-0">
        <h1 className="font-serif text-xl font-bold text-viridian flex items-center gap-2">
          <BookOpen className="w-5.5 h-5.5 text-viridian" />
          Desk Study Decks
        </h1>
        
        <button
          onClick={() => setShowCreator(!showCreator)}
          className="flex items-center gap-1 font-mono text-[10px] bg-viridian text-shell px-3 py-2 rounded-xl hover:bg-viridian-hover shadow-soft transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Card
        </button>
      </div>

      {/* 2. Custom Card Creator Box */}
      <AnimatePresence>
        {showCreator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-xl glass-card p-5 rounded-[2rem] border border-stone/50 shadow-soft overflow-hidden"
          >
            <form onSubmit={handleCreateCard} className="flex flex-col gap-3 font-mono text-[10px]">
              <div className="flex flex-col gap-1">
                <label className="text-viridian/70">Question / Front Concept</label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What is Spatial Locality?"
                  className="px-3 py-2 rounded-xl border border-stone/80 bg-shell/50 text-viridian focus:outline-none focus:border-viridian"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-viridian/70">Answer / Back Explanation</label>
                <textarea
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. Maximizing the access of adjacent physical memory addresses..."
                  className="p-3 rounded-xl border border-stone/80 bg-shell/50 text-viridian focus:outline-none focus:border-viridian h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowCreator(false)}
                  className="px-3 py-2 border border-stone text-viridian rounded-xl hover:bg-stone/30"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-viridian text-shell rounded-xl hover:bg-viridian-hover shadow-soft"
                >
                  Add Card
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Interactive Active Flashcard 3D canvas */}
      {activeCard ? (
        <div className="w-full max-w-xl flex flex-col gap-6 items-center">
          
          {/* Progress indicators bar */}
          <div className="w-full flex items-center justify-between font-mono text-[9px] text-viridian/60">
            <span>Progress: Card {activeIdx + 1} of {flashcards.length}</span>
            {activeCard.lastReviewed && (
              <span>Last active: {new Date(activeCard.lastReviewed).toLocaleDateString()}</span>
            )}
          </div>

          <div className="w-full h-[1.5rem] bg-stone/40 border border-stone-dark/30 rounded-full overflow-hidden shrink-0">
            <div 
              className="h-full bg-viridian transition-all duration-300"
              style={{ width: `${((activeIdx + 1) / flashcards.length) * 100}%` }}
            />
          </div>

          {/* Perspective container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 relative cursor-pointer group"
            style={{ perspective: "1000px" }}
          >
            {/* Card Shell */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full h-full relative"
            >
              {/* CARD FRONT PANEL */}
              <div 
                className="absolute inset-0 bg-shell rounded-[2.5rem] border border-stone shadow-calm p-8 flex flex-col justify-between"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-viridian/60 bg-stone/30 px-2 py-0.5 rounded border border-viridian/10">
                    <CircleHelp className="w-3.5 h-3.5" />
                    Question Card
                  </div>
                  <button
                    onClick={(e) => handleDeleteCard(activeCard.id, e)}
                    className="p-1 rounded text-viridian/45 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center py-4">
                  <h2 className="font-serif text-lg md:text-xl font-bold text-viridian leading-normal">
                    {activeCard.question}
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-1.5 font-mono text-[9px] text-viridian/40">
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                  Click to Flip & Reveal
                </div>
              </div>

              {/* CARD BACK PANEL */}
              <div 
                className="absolute inset-0 bg-shell-dark/35 rounded-[2.5rem] border border-stone shadow-calm p-8 flex flex-col justify-between"
                style={{ 
                  backfaceVisibility: "hidden", 
                  transform: "rotateY(180deg)" 
                }}
              >
                <div className="flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-viridian/60 bg-honeydew/60 px-2 py-0.5 rounded border border-viridian/10">
                    <Award className="w-3.5 h-3.5" />
                    Answer Card
                  </div>
                </div>

                <div className="text-center py-4 overflow-y-auto max-h-[140px] px-1 select-text">
                  <p className="font-mono text-xs leading-relaxed text-viridian/90">
                    {activeCard.answer}
                  </p>
                </div>

                <div className="flex justify-center gap-3 shrink-0 select-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleScoreReview(activeCard.id, "hard"); }}
                    className="px-4 py-2 border border-red-300 text-red-700 bg-red-100 hover:bg-red-200 rounded-xl font-mono text-[9px]"
                  >
                    Still Hard
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleScoreReview(activeCard.id, "medium"); }}
                    className="px-4 py-2 border border-stone text-viridian bg-stone/40 hover:bg-stone rounded-xl font-mono text-[9px]"
                  >
                    Good Review
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleScoreReview(activeCard.id, "easy"); }}
                    className="px-4 py-2 border border-viridian/25 text-viridian bg-honeydew hover:bg-honeydew-dark rounded-xl font-mono text-[9px]"
                  >
                    Too Easy
                  </button>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-4 mt-2 shrink-0">
            <button
              onClick={() => { setActiveIdx(prev => (prev > 0 ? prev - 1 : flashcards.length - 1)); setIsFlipped(false); }}
              className="p-3 border border-stone text-viridian hover:bg-stone/30 rounded-2xl transition-all shadow-soft"
              title="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => { setActiveIdx(prev => (prev < flashcards.length - 1 ? prev + 1 : 0)); setIsFlipped(false); }}
              className="p-3 border border-stone text-viridian hover:bg-stone/30 rounded-2xl transition-all shadow-soft"
              title="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 font-mono text-[10px] text-viridian/40 italic flex flex-col gap-3 items-center">
          <Award className="w-10 h-10 text-viridian/25 animate-float" />
          No cards loaded in deck. Use AI Notes to generate decks or click &quot;Create Card&quot; to build.
        </div>
      )}

    </div>
  );
}
