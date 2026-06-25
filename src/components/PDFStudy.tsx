import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight,
  BookOpen,
  Send,
  HelpCircle,
  Hash
} from "lucide-react";
import confetti from "canvas-confetti";
import { PDFDoc } from "../app/dashboard/page";

interface PDFStudyProps {
  pdfs: PDFDoc[];
  savePdfs: (pdfs: PDFDoc[]) => void;
  apiKey: string;
}

export default function PDFStudy({ pdfs, savePdfs, apiKey }: PDFStudyProps) {
  const [activePdfId, setActivePdfId] = useState<string>(pdfs[0]?.id || "");
  const [activeSubTab, setActiveSubTab] = useState<"summary" | "formulas" | "qa">("summary");
  
  // Q&A state
  const [question, setQuestion] = useState("");
  const [answersList, setAnswersList] = useState<{ q: string; a: string }[]>([]);
  const [qaLoading, setQaLoading] = useState(false);

  // File Upload State
  const [dragActive, setDragActive] = useState(false);

  const activePdf = pdfs.find(p => p.id === activePdfId);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleFileUpload = (fileName: string) => {
    if (!fileName.endsWith(".pdf")) {
      alert("Please upload PDF files only.");
      return;
    }

    const docId = `pdf-${Date.now()}`;
    const cleanName = fileName.replace(".pdf", "");

    const newPdf: PDFDoc = {
      id: docId,
      name: fileName,
      summary: `### 📝 StudyOS AI Chapter Digest\n\n**Overview of ${cleanName}:**\nThis document outlines essential algorithms and methodologies. It covers foundational theorems, boundary constraints, optimizing conditions, and statistical evaluation formulas.\n\n**Core Topics Covered:**\n* **Topic 1:** Basic Definitions and mathematical structures.\n* **Topic 2:** Standard algorithmic workflows.\n* **Topic 3:** Convergence rates and complexity thresholds.`,
      formulas: [
        "f(x) = \\sigma(z) = \\frac{1}{1 + e^{-z}}",
        "E_{cost} = \\frac{1}{2n}\\sum_{i=1}^n(y^{(i)} - a^{(i)})^2"
      ],
      notes: "Auto-generated review sheet for exams."
    };

    savePdfs([...pdfs, newPdf]);
    setActivePdfId(docId);

    confetti({
      particleCount: 40,
      spread: 50,
      colors: ["#344945", "#E4E3BC", "#D5E3E8"]
    });
  };

  const handleDeletePdf = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = pdfs.filter(p => p.id !== id);
    savePdfs(remaining);
    if (activePdfId === id) {
      setActivePdfId(remaining[0]?.id || "");
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || qaLoading || !activePdf) return;

    const query = question.trim();
    setQuestion("");
    setQaLoading(true);

    const pdfContext = `ACTIVE DOCUMENT: ${activePdf.name}\nDOCUMENT SUMMARY:\n${activePdf.summary}\nEXTRACTED EQUATIONS:\n${activePdf.formulas.join("\n")}`;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          prompt: query,
          context: pdfContext,
          userApiKey: apiKey
        })
      });

      const data = await response.json();
      const reply = data.error ? `⚠️ Error: ${data.error}` : data.text;

      setAnswersList(prev => [...prev, { q: query, a: reply }]);
      
      confetti({
        particleCount: 20,
        spread: 30,
        colors: ["#D5E3E8", "#344945"]
      });
    } catch (err: any) {
      setAnswersList(prev => [...prev, { q: query, a: `⚠️ Connection Error: ${err.message || "Failed to reach AI api."}` }]);
    } finally {
      setQaLoading(false);
    }
  };

  // Simple Markdown Math renderer
  const renderContent = (text: string) => {
    if (!text) return "";
    let html = text
      .replace(/\$\$([\s\S]+?)\$\$/g, '<div class="math-block bg-stone/25 p-2 rounded font-mono my-2 overflow-x-auto">$1</div>')
      .replace(/\$([\s\S]+?)\$/g, '<code class="bg-stone/30 px-1 rounded font-mono">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 class="font-serif text-xs font-bold text-viridian mt-3 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="font-serif text-sm font-bold text-viridian mt-4 mb-1.5">$1</h2>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc font-mono text-[10px] leading-relaxed">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n$/gim, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="lg:h-full flex flex-col lg:flex-row gap-6 select-none">
      
      {/* 1. PDF Catalog sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4 lg:h-full border-b lg:border-b-0 lg:border-r border-stone/30 pb-6 lg:pb-0 lg:pr-6 shrink-0">
        <span className="font-serif text-sm font-bold text-viridian">PDF Documents</span>

        {/* Drag and Drop Mock Uploader */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center shrink-0
            ${dragActive ? "border-viridian bg-sky/30" : "border-stone bg-shell/45 hover:bg-stone/20"}
          `}
        >
          <UploadCloud className="w-6 h-6 text-viridian/60" />
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] font-bold text-viridian">Drag & Drop Lecture PDF</span>
            <span className="font-mono text-[8px] text-viridian/50">or click to browse files</span>
          </div>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0].name);
              }
            }} 
            className="hidden" 
            id="file-upload-input"
          />
          <label 
            htmlFor="file-upload-input"
            className="mt-1 bg-stone/60 border border-stone px-2.5 py-1 rounded-lg font-mono text-[9px] text-viridian hover:bg-stone transition-all cursor-pointer"
          >
            Upload PDF
          </label>
        </div>

        {/* PDFs list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[200px] lg:max-h-none">
          {pdfs.map(p => (
            <div
              key={p.id}
              onClick={() => { setActivePdfId(p.id); setAnswersList([]); }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 relative group ${activePdfId === p.id ? "bg-shell/80 border-viridian/30 shadow-soft" : "bg-shell/30 border-stone/50 hover:bg-stone/20"}`}
            >
              <FileText className="w-5 h-5 text-viridian shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] font-bold text-viridian truncate">{p.name}</p>
                <p className="font-mono text-[8px] text-viridian/50 mt-0.5">2.4 MB — AI parsed</p>
              </div>

              <button
                onClick={(e) => handleDeletePdf(p.id, e)}
                className="absolute right-2 top-2.5 p-1 rounded hover:bg-red-500/20 text-viridian/65 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {pdfs.length === 0 && (
            <div className="text-center py-12 font-mono text-[10px] text-viridian/40 italic">
              No PDFs loaded. Drag & drop a file to begin.
            </div>
          )}
        </div>
      </div>

      {/* 2. Main PDF Study deck */}
      <div className="flex-1 flex flex-col lg:h-full bg-shell-dark/15 rounded-3xl border border-stone/50 overflow-hidden relative shadow-soft min-h-[300px]">
        {activePdf ? (
          <>
            {/* Header Tabs */}
            <div className="h-14 border-b border-stone/30 bg-shell/70 px-6 flex justify-between items-center shrink-0">
              <span className="font-mono text-xs font-bold text-viridian truncate max-w-sm">
                Active: {activePdf.name}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSubTab("summary")}
                  className={`font-mono text-[9px] px-3 py-1.5 rounded-xl border transition-all ${activeSubTab === "summary" ? "bg-viridian text-shell border-viridian font-bold" : "bg-shell border-stone/70 text-viridian hover:bg-stone/20"}`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveSubTab("formulas")}
                  className={`font-mono text-[9px] px-3 py-1.5 rounded-xl border transition-all ${activeSubTab === "formulas" ? "bg-viridian text-shell border-viridian font-bold" : "bg-shell border-stone/70 text-viridian hover:bg-stone/20"}`}
                >
                  Equations
                </button>
                <button
                  onClick={() => setActiveSubTab("qa")}
                  className={`font-mono text-[9px] px-3 py-1.5 rounded-xl border transition-all ${activeSubTab === "qa" ? "bg-viridian text-shell border-viridian font-bold" : "bg-shell border-stone/70 text-viridian hover:bg-stone/20"}`}
                >
                  Q&A Desk
                </button>
              </div>
            </div>

            {/* Sub-tab content */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed text-viridian/90">
              {activeSubTab === "summary" && (
                <div className="prose prose-sm max-w-none">
                  {renderContent(activePdf.summary)}
                </div>
              )}

              {activeSubTab === "formulas" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-viridian animate-pulse" />
                    <span className="font-serif text-xs font-bold text-viridian">AI Extracted Scientific Equations</span>
                  </div>
                  
                  {activePdf.formulas.map((f, i) => (
                    <div 
                      key={i}
                      className="p-4 rounded-2xl bg-shell/80 border border-stone flex flex-col gap-2 shadow-soft font-mono text-[10px]"
                    >
                      <div className="flex items-center gap-2 text-viridian/50 shrink-0">
                        <Hash className="w-3.5 h-3.5" />
                        Formula #{i + 1}
                      </div>
                      <div className="bg-stone/20 p-3 rounded-lg text-center overflow-x-auto text-[11px] font-bold border border-stone-dark">
                        $${f}$$
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === "qa" && (
                <div className="flex flex-col h-full overflow-hidden">
                  
                  {/* Answers timeline */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 select-text">
                    {answersList.map((a, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex gap-2 items-center text-[10px] text-viridian font-bold bg-sky/20 border border-sky-dark/20 p-2.5 rounded-xl">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Q: {a.q}</span>
                        </div>
                        <div className="bg-shell-dark/30 border border-stone/50 p-3 rounded-xl leading-relaxed text-[11px]">
                          {renderContent(a.a)}
                        </div>
                      </div>
                    ))}

                    {qaLoading && (
                      <div className="flex items-center justify-center py-6 gap-2">
                        <span className="w-4 h-4 border-2 border-viridian/30 border-t-viridian rounded-full animate-spin"></span>
                        <span className="text-[10px] text-viridian/65">Lumi is reviewing pages...</span>
                      </div>
                    )}

                    {answersList.length === 0 && !qaLoading && (
                      <div className="text-center py-12 font-mono text-[10px] text-viridian/40 italic flex flex-col gap-2 items-center justify-center">
                        <BookOpen className="w-8 h-8 text-viridian/25 animate-float" />
                        Ask Lumi questions about concepts, definitions, or formulas in this PDF.
                      </div>
                    )}
                  </div>

                  {/* Ask Question footer */}
                  <form onSubmit={handleAskQuestion} className="flex gap-2 shrink-0 border-t border-stone/30 pt-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask Lumi about this document... ('Explain the backprop equation')"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-stone/80 bg-shell font-mono text-[10px] text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!question.trim() || qaLoading}
                      className="px-4 rounded-xl bg-viridian text-shell hover:bg-viridian-hover disabled:bg-viridian/45 shadow-soft transition-all flex items-center justify-center"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-stone flex items-center justify-center text-viridian/55">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-serif text-base font-bold text-viridian">No Document Active</p>
            <p className="font-mono text-xs text-viridian/60 max-w-xs">Drag and drop a PDF file or select one from the sidebar list to start studying.</p>
          </div>
        )}
      </div>

    </div>
  );
}
