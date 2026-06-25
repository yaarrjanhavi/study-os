import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Folder, 
  Pin, 
  Tag, 
  Sparkles, 
  Trash2, 
  Check, 
  Eye, 
  Edit3, 
  FileText,
  FileSpreadsheet,
  BrainCircuit,
  MessageSquareHelp,
  ArrowRight,
  Smile
} from "lucide-react";
import confetti from "canvas-confetti";
import { Note, Folder as FolderType, Flashcard } from "../app/dashboard/page";

interface AINotesProps {
  notes: Note[];
  folders: FolderType[];
  apiKey: string;
  saveNotes: (notes: Note[]) => void;
  saveFolders: (folders: FolderType[]) => void;
  saveFlashcards: (flashcards: Flashcard[]) => void;
  flashcards: Flashcard[];
}

export default function AINotes({
  notes,
  folders,
  apiKey,
  saveNotes,
  saveFolders,
  saveFlashcards,
  flashcards,
}: AINotesProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(true); // Toggle markdown edit/preview
  
  // Folders creation
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  // Note editor form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync editor fields when activeNoteId changes
  useEffect(() => {
    const activeNote = notes.find(n => n.id === activeNoteId);
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setTagsInput(activeNote.tags.join(", "));
      setAiOutput(null);
    } else if (notes.length > 0) {
      setActiveNoteId(notes[0].id);
    } else {
      setTitle("");
      setContent("");
      setTagsInput("");
    }
  }, [activeNoteId, notes]);

  // Track text selection for contextual AI queries
  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      if (start !== end) {
        setSelectedText(textareaRef.current.value.substring(start, end));
      } else {
        setSelectedText("");
      }
    }
  };

  // Auto-save changes
  const triggerAutoSave = (updatedTitle: string, updatedContent: string, updatedTags: string) => {
    if (!activeNoteId) return;
    
    const tagsArray = updatedTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updated = notes.map(n => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          title: updatedTitle,
          content: updatedContent,
          tags: tagsArray
        };
      }
      return n;
    });
    saveNotes(updated);
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `n-${Date.now()}`,
      title: "Untitled Note",
      content: "Type your notes here in Markdown format...",
      folderId: selectedFolderId === "all" ? folders[0]?.id || "f-1" : selectedFolderId,
      tags: [],
      pinned: false,
      createdAt: new Date().toISOString()
    };

    saveNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);

    confetti({
      particleCount: 20,
      spread: 30,
      colors: ["#344945", "#D5E3E8"]
    });
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = notes.filter(n => n.id !== id);
    saveNotes(remaining);
    if (activeNoteId === id) {
      setActiveNoteId(remaining[0]?.id || null);
    }
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveNotes(notes.map(n => {
      if (n.id === id) return { ...n, pinned: !n.pinned };
      return n;
    }));
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: FolderType = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim()
    };

    saveFolders([...folders, newFolder]);
    setNewFolderName("");
    setShowNewFolderInput(false);
  };

  // Run AI queries
  const handleAiAction = async (action: string, customPrompt?: string) => {
    if (!content.trim() && !customPrompt) return;
    setAiLoading(true);
    setAiOutput(null);
    setShowAiModal(true);

    const activeNote = notes.find(n => n.id === activeNoteId);
    
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          prompt: customPrompt || `Perform action ${action} on this note.`,
          context: selectedText || content,
          userApiKey: apiKey
        })
      });

      const data = await response.json();
      if (data.error) {
        setAiOutput(`### ⚠️ Error\n\n${data.error}`);
      } else {
        setAiOutput(data.text);
        
        // If it was a rewrite, allow replacing the text directly
        if (action === "rewrite" && !selectedText) {
          // Keep in output so user can review before inserting
        }
      }
    } catch (err: any) {
      setAiOutput(`### ⚠️ Connection Error\n\n${err.message || "Failed to contact local server."}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Insert AI rewritten text
  const applyAiRewrite = () => {
    if (!aiOutput) return;
    // Strip markdown formatting if it starts with codeblock etc
    let cleanText = aiOutput;
    if (cleanText.startsWith("```")) {
      const lines = cleanText.split("\n");
      if (lines[0].startsWith("```")) lines.shift();
      if (lines[lines.length - 1].startsWith("```")) lines.pop();
      cleanText = lines.join("\n");
    }

    setContent(cleanText);
    triggerAutoSave(title, cleanText, tagsInput);
    setShowAiModal(false);

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ["#E4E3BC", "#344945"]
    });
  };

  // Extract flashcards from AI output
  const importFlashcardsFromAi = () => {
    if (!aiOutput) return;

    try {
      // Find JSON block if AI output is wrapped in ```json
      let jsonString = aiOutput;
      const jsonStart = jsonString.indexOf("[");
      const jsonEnd = jsonString.lastIndexOf("]") + 1;
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonString = jsonString.substring(jsonStart, jsonEnd);
      }

      const generated = JSON.parse(jsonString);
      if (Array.isArray(generated)) {
        const newCards: Flashcard[] = generated.map((c: any, index: number) => ({
          id: `fc-${Date.now()}-${index}`,
          question: c.question || "Empty Question",
          answer: c.answer || "Empty Answer",
          difficulty: "medium"
        }));

        saveFlashcards([...flashcards, ...newCards]);
        setShowAiModal(false);

        // Notify user with satisfying confetti
        confetti({
          particleCount: 80,
          spread: 80,
          colors: ["#D5E3E8", "#E4E3BC", "#344945"]
        });
        alert(`Successfully generated and imported ${newCards.length} flashcards into your study desk!`);
      }
    } catch (err) {
      alert("AI response format wasn't compatible for direct card conversion. Try copying questions manually.");
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesFolder = selectedFolderId === "all" || n.folderId === selectedFolderId;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const activeNote = notes.find(n => n.id === activeNoteId);

  // Simple Markdown parsing renderer
  const renderMarkdown = (text: string) => {
    if (!text) return "";
    
    // Convert math blocks $$...$$ to span wrappers
    let html = text
      .replace(/\$\$([\s\S]+?)\$\$/g, '<div class="math-block bg-stone/20 p-3 rounded-lg font-mono my-3 border border-stone-dark overflow-x-auto">$1</div>')
      .replace(/\$([\s\S]+?)\$/g, '<code class="bg-stone/30 px-1 rounded font-mono text-[10px]">$1</code>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="font-serif text-sm font-bold text-viridian mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="font-serif text-base font-bold text-viridian mt-5 mb-2.5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="font-serif text-lg font-bold text-viridian mt-6 mb-3">$1</h1>')
      // Bold / Italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Bullet lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc font-mono text-[11px] leading-relaxed text-viridian/90">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc font-mono text-[11px] leading-relaxed text-viridian/90">$1</li>')
      // Paragraph spacing
      .replace(/\n$/gim, "<br />");

    return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="h-full flex gap-6 select-none relative">
      
      {/* 1. Folders & Notes Navigation list */}
      <div className="w-80 flex flex-col gap-4 h-full border-r border-stone/30 pr-6 shrink-0">
        <div className="flex justify-between items-center shrink-0">
          <span className="font-serif text-sm font-bold text-viridian">Study Notes</span>
          <button 
            onClick={handleCreateNote}
            className="flex items-center gap-1 font-mono text-[10px] bg-viridian text-shell px-2.5 py-1.5 rounded-xl hover:bg-viridian-hover shadow-soft transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Note
          </button>
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-viridian/45" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes / tags..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone/80 bg-shell/50 font-mono text-[11px] text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian focus:bg-shell transition-all"
          />
        </div>

        {/* Folders List */}
        <div className="flex flex-col gap-1.5 shrink-0 max-h-[140px] overflow-y-auto">
          <button
            onClick={() => setSelectedFolderId("all")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left font-mono text-[10px] transition-all ${selectedFolderId === "all" ? "bg-stone font-bold text-viridian" : "text-viridian/70 hover:bg-stone/30"}`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All Notes ({notes.length})</span>
          </button>

          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFolderId(f.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left font-mono text-[10px] transition-all ${selectedFolderId === f.id ? "bg-stone font-bold text-viridian" : "text-viridian/70 hover:bg-stone/30"}`}
            >
              <Folder className="w-3.5 h-3.5 text-viridian/60" />
              <span className="truncate">{f.name}</span>
            </button>
          ))}

          {showNewFolderInput ? (
            <form onSubmit={handleCreateFolder} className="flex gap-2 p-1">
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="flex-1 px-2.5 py-1.5 border border-stone/80 rounded-lg bg-shell/50 font-mono text-[9px] focus:outline-none focus:border-viridian"
              />
              <button type="submit" className="px-2 py-1 rounded bg-viridian text-shell font-mono text-[9px]">Add</button>
            </form>
          ) : (
            <button
              onClick={() => setShowNewFolderInput(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-viridian/50 hover:text-viridian font-mono text-[9px] hover:underline"
            >
              <Plus className="w-3 h-3" /> Add Folder
            </button>
          )}
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 relative group ${activeNoteId === note.id ? "bg-shell/80 border-viridian/30 shadow-soft" : "bg-shell/30 border-stone/50 hover:bg-stone/20"}`}
            >
              <div className="flex justify-between items-center gap-2">
                <span className={`font-mono text-xs font-bold truncate ${note.pinned ? "pr-4" : ""}`}>
                  {note.title || "Untitled"}
                </span>
                
                {note.pinned && <Pin className="w-3.5 h-3.5 text-viridian/60 shrink-0 fill-viridian/20" />}
              </div>

              <p className="font-mono text-[10px] text-viridian/60 line-clamp-2 leading-relaxed">
                {note.content}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-1">
                {note.tags.map((t, idx) => (
                  <span key={idx} className="bg-sky text-[8px] font-mono px-1.5 py-0.5 rounded border border-viridian/10">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Delete / Pin Actions on Hover */}
              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleTogglePin(note.id, e)}
                  className="p-1 rounded hover:bg-stone/60 text-viridian/65"
                  title="Pin note"
                >
                  <Pin className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="p-1 rounded hover:bg-red-500/20 text-viridian/65 hover:text-red-600"
                  title="Delete note"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12 font-mono text-[10px] text-viridian/40 italic">
              No notes found.
            </div>
          )}
        </div>
      </div>

      {/* 2. Text Editor Canvas */}
      <div className="flex-1 flex flex-col h-full bg-shell-dark/15 rounded-3xl border border-stone/50 overflow-hidden relative shadow-soft">
        {activeNote ? (
          <>
            {/* Editor Top Options Strip */}
            <div className="h-14 border-b border-stone/30 bg-shell/70 px-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center gap-1.5 font-mono text-[10px] px-3 py-1.5 rounded-xl border transition-all ${isEditing ? "bg-viridian text-shell border-viridian font-bold" : "bg-shell border-stone/70 text-viridian hover:bg-stone/20"}`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editor
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`flex items-center gap-1.5 font-mono text-[10px] px-3 py-1.5 rounded-xl border transition-all ${!isEditing ? "bg-viridian text-shell border-viridian font-bold" : "bg-shell border-stone/70 text-viridian hover:bg-stone/20"}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Reader
                </button>
              </div>

              {/* Context Selected Tooltip */}
              {selectedText && (
                <div className="flex items-center gap-2 bg-honeydew border border-stone px-3 py-1.5 rounded-xl animate-float">
                  <span className="font-mono text-[9px] text-viridian/80 font-bold truncate max-w-[120px]">Explain selection:</span>
                  <button 
                    onClick={() => handleAiAction("simplify")}
                    className="font-mono text-[9px] bg-viridian text-shell px-2 py-0.5 rounded hover:bg-viridian-hover"
                  >
                    Simplify
                  </button>
                  <button 
                    onClick={() => handleAiAction("chat", `Write an analogy explaining: "${selectedText}"`)}
                    className="font-mono text-[9px] border border-viridian/50 text-viridian px-2 py-0.5 rounded hover:bg-stone/30"
                  >
                    Analogy
                  </button>
                </div>
              )}

              {/* AI Assistant Triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAiAction("summarize")}
                  className="flex items-center gap-1 font-mono text-[9px] text-viridian hover:bg-stone/30 border border-stone/70 px-2.5 py-1.5 rounded-xl transition-all"
                  title="Generate structured summary"
                >
                  <FileText className="w-3.5 h-3.5 text-viridian" />
                  Summarize
                </button>
                <button
                  onClick={() => handleAiAction("simplify")}
                  className="flex items-center gap-1 font-mono text-[9px] text-viridian hover:bg-stone/30 border border-stone/70 px-2.5 py-1.5 rounded-xl transition-all"
                  title="Explain content with water pipeline/garden analogies"
                >
                  <Smile className="w-3.5 h-3.5 text-viridian" />
                  Simplify
                </button>
                <button
                  onClick={() => handleAiAction("quiz")}
                  className="flex items-center gap-1 font-mono text-[9px] text-viridian hover:bg-stone/30 border border-stone/70 px-2.5 py-1.5 rounded-xl transition-all"
                  title="Convert note into multiple choice study quizzes"
                >
                  <MessageSquareHelp className="w-3.5 h-3.5 text-viridian" />
                  Quiz Me
                </button>
                <button
                  onClick={() => handleAiAction("chat", "Turn these notes into flashcard questions and answers. Format strictly as a JSON array of objects: [ { \"question\": \"...\", \"answer\": \"...\" } ]. Make questions simple and core.")}
                  className="flex items-center gap-1 font-mono text-[9px] bg-sky text-viridian border border-viridian/25 hover:bg-sky-dark/40 px-2.5 py-1.5 rounded-xl transition-all"
                  title="Auto convert notes to decks cards"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-viridian" />
                  Make Cards
                </button>
              </div>
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); triggerAutoSave(e.target.value, content, tagsInput); }}
                placeholder="Title..."
                className="w-full bg-transparent font-serif text-xl font-bold text-viridian focus:outline-none border-b border-stone/30 pb-2"
              />

              <div className="flex-1 flex flex-col">
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => { setContent(e.target.value); triggerAutoSave(title, e.target.value, tagsInput); }}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleTextSelection}
                    placeholder="Write markdown here. (Support headers #, ##, ###, bullet points, bold and LaTeX math equations formulas like $$E=mc^2$$)..."
                    className="flex-1 w-full bg-transparent font-mono text-xs leading-relaxed text-viridian placeholder-viridian/45 resize-none focus:outline-none"
                  />
                ) : (
                  <div className="flex-1 prose prose-sm max-w-none overflow-y-auto">
                    {renderMarkdown(content)}
                  </div>
                )}
              </div>

              {/* Tags Panel */}
              <div className="flex items-center gap-2 border-t border-stone/30 pt-3 shrink-0">
                <Tag className="w-3.5 h-3.5 text-viridian/60" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => { setTagsInput(e.target.value); triggerAutoSave(title, content, e.target.value); }}
                  placeholder="Tags (comma separated, e.g. neural, hardware, math)"
                  className="flex-1 bg-transparent font-mono text-[10px] text-viridian placeholder-viridian/40 focus:outline-none"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-stone flex items-center justify-center text-viridian/55">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <p className="font-serif text-base font-bold text-viridian">No Note Active</p>
            <p className="font-mono text-xs text-viridian/60 max-w-xs">Select an existing note or click &quot;New Note&quot; to begin studying.</p>
          </div>
        )}
      </div>

      {/* 3. AI Output Popup Dialog Overlay */}
      <AnimatePresence>
        {showAiModal && (
          <div className="absolute inset-0 bg-viridian/20 backdrop-blur-sm z-30 flex items-center justify-center p-6 select-text">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-shell rounded-[2.5rem] border border-stone shadow-calm flex flex-col max-h-[85%] overflow-hidden"
            >
              {/* Header */}
              <div className="h-16 border-b border-stone/30 bg-stone/20 px-6 flex justify-between items-center shrink-0">
                <span className="font-serif text-sm font-bold text-viridian flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-viridian animate-pulse" />
                  Lumi Study Assistant
                </span>
                <button
                  onClick={() => { setShowAiModal(false); setAiOutput(null); }}
                  className="font-mono text-[10px] hover:underline text-viridian/65"
                >
                  Close
                </button>
              </div>

              {/* Output Content */}
              <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed text-viridian/90">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <span className="w-6 h-6 border-2 border-viridian/30 border-t-viridian rounded-full animate-spin"></span>
                    <span className="text-[10px] text-viridian/60">Lumi is organizing concepts...</span>
                  </div>
                ) : (
                  <div>{renderMarkdown(aiOutput || "Empty response.")}</div>
                )}
              </div>

              {/* Footer Actions */}
              {!aiLoading && aiOutput && (
                <div className="h-16 border-t border-stone/30 bg-shell-dark/25 px-6 flex justify-end items-center gap-3 shrink-0">
                  {/* Dynamic actions based on response content */}
                  {aiOutput.includes("[") && aiOutput.includes("]") && (
                    <button
                      onClick={importFlashcardsFromAi}
                      className="font-mono text-[10px] bg-viridian text-shell px-4 py-2 rounded-xl hover:bg-viridian-hover shadow-soft flex items-center gap-1.5"
                    >
                      Import Flashcards
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {/* Option to replace note text */}
                  {content && !selectedText && !aiOutput.includes("[") && (
                    <button
                      onClick={applyAiRewrite}
                      className="font-mono text-[10px] bg-viridian text-shell px-4 py-2 rounded-xl hover:bg-viridian-hover shadow-soft"
                    >
                      Replace Note Content
                    </button>
                  )}
                  <button
                    onClick={() => { setShowAiModal(false); setAiOutput(null); }}
                    className="font-mono text-[10px] border border-stone text-viridian px-4 py-2 rounded-xl hover:bg-stone/30"
                  >
                    Back to Editor
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
