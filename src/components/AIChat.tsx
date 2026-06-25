import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Bot, 
  User, 
  Lightbulb, 
  Layers, 
  Award,
  ChevronRight
} from "lucide-react";
import { Note, PDFDoc } from "../app/dashboard/page";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  createdAt: string;
}

interface AIChatProps {
  notes: Note[];
  pdfs: PDFDoc[];
  apiKey: string;
}

export default function AIChat({ notes, pdfs, apiKey }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("studyos_chat_history");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      const welcome: Message = {
        id: "m-welcome",
        sender: "bot",
        text: "Hi! I'm Lumi, your personal study tutor. 🧘‍♂️\n\nI can read your active StudyOS notes and uploaded PDFs to help you learn. Try asking:\n* *'Give me an analogy for memory locality.'*\n* *'Summarize my AI notes.'*\n* *'Quiz me on computer hardware.'*",
        createdAt: new Date().toISOString()
      };
      setMessages([welcome]);
      localStorage.setItem("studyos_chat_history", JSON.stringify([welcome]));
    }
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const saveChatHistory = (updated: Message[]) => {
    setMessages(updated);
    localStorage.setItem("studyos_chat_history", JSON.stringify(updated));
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      createdAt: new Date().toISOString()
    };

    const nextMessages = [...messages, userMsg];
    saveChatHistory(nextMessages);
    setInputText("");
    setLoading(true);

    // Build context payload out of notes & pdfs
    const notesCtx = notes.map(n => `[Note: ${n.title}]\n${n.content}`).join("\n\n");
    const pdfsCtx = pdfs.map(p => `[PDF: ${p.name}]\nSummary: ${p.summary}\nFormulas: ${p.formulas.join(", ")}`).join("\n\n");
    const fullContext = `STUDENT NOTES DIRECTORY:\n${notesCtx || "None"}\n\nSTUDENT UPLOADED PDF DATA:\n${pdfsCtx || "None"}\n\nCHAT HISTORY:\n${messages.slice(-6).map(m => `${m.sender}: ${m.text}`).join("\n")}`;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          prompt: userMsg.text,
          context: fullContext,
          userApiKey: apiKey
        })
      });

      const data = await response.json();

      const botMsg: Message = {
        id: `msg-${Date.now()}-bot`,
        sender: "bot",
        text: data.error ? `⚠️ Error: ${data.error}` : data.text,
        createdAt: new Date().toISOString()
      };

      saveChatHistory([...nextMessages, botMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        id: `msg-${Date.now()}-err`,
        sender: "bot",
        text: `⚠️ Connection Error: ${err.message || "Failed to reach AI api."}`,
        createdAt: new Date().toISOString()
      };
      saveChatHistory([...nextMessages, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Reset conversation logs with Lumi?")) {
      const welcome: Message = {
        id: "m-welcome",
        sender: "bot",
        text: "Hi! I'm Lumi, your personal study tutor. 🧘‍♂️ Let's begin a fresh discussion.",
        createdAt: new Date().toISOString()
      };
      saveChatHistory([welcome]);
    }
  };

  // Quick suggestion prompts
  const suggestions = [
    { text: "Quiz me on my notes.", icon: <Award className="w-3.5 h-3.5" /> },
    { text: "Give an analogy explaining computer caches.", icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { text: "Summarize my active study notes.", icon: <Layers className="w-3.5 h-3.5" /> }
  ];

  // Render markdown with math blocks
  const renderMarkdown = (text: string) => {
    if (!text) return "";
    let html = text
      .replace(/\$\$([\s\S]+?)\$\$/g, '<div class="math-block bg-stone/30 p-2.5 rounded font-mono my-2 overflow-x-auto">$1</div>')
      .replace(/\$([\s\S]+?)\$/g, '<code class="bg-stone/40 px-1 rounded font-mono">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 class="font-serif text-xs font-bold text-viridian mt-3 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="font-serif text-sm font-bold text-viridian mt-4 mb-1.5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="font-serif text-base font-bold text-viridian mt-5 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\//g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc font-mono text-[11px] leading-relaxed">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc font-mono text-[11px] leading-relaxed">$1</li>')
      .replace(/\n$/gim, "<br />");

    return <div className="space-y-1.5" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="h-full flex flex-col bg-shell rounded-3xl border border-stone/50 overflow-hidden shadow-soft select-text">
      
      {/* Top Header */}
      <div className="h-16 border-b border-stone/30 bg-stone/20 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-viridian flex items-center justify-center text-shell shadow-soft shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold text-viridian">Lumi — AI Study Tutor</h2>
            <p className="font-mono text-[9px] text-viridian/60">Reads your Notes & PDFs contexts</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl hover:bg-stone/40 text-viridian/70 hover:text-red-600 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestion Prompts on Empty Chat */}
      {messages.length <= 1 && (
        <div className="px-6 pt-6 grid sm:grid-cols-3 gap-3 shrink-0 select-none">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.text)}
              className="p-3 text-left glass-card rounded-2xl border border-stone/50 hover:border-viridian/30 hover:bg-shell/80 transition-all flex flex-col gap-2 group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-sky/50 flex items-center justify-center text-viridian group-hover:scale-105 transition-transform">
                {s.icon}
              </div>
              <span className="font-mono text-[10px] text-viridian/85 leading-normal flex items-center gap-1.5">
                {s.text}
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Sender Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-stone/40 shadow-soft
              ${m.sender === "user" ? "bg-sky" : "bg-honeydew"}
            `}>
              {m.sender === "user" ? <User className="w-4 h-4 text-viridian" /> : <Bot className="w-4 h-4 text-viridian" />}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-3xl border text-xs font-mono leading-relaxed shadow-soft
              ${m.sender === "user" ? "bg-sky/35 border-sky-dark/40 text-viridian" : "bg-shell-dark/30 border-stone/50 text-viridian/90"}
            `}>
              {m.sender === "user" ? (
                <p className="whitespace-pre-wrap">{m.text}</p>
              ) : (
                <div>{renderMarkdown(m.text)}</div>
              )}
              <span className="block text-[8px] text-viridian/40 mt-2 text-right">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-8 h-8 rounded-full bg-honeydew border border-stone/40 flex items-center justify-center shrink-0 animate-bounce">
              <Bot className="w-4 h-4 text-viridian" />
            </div>
            <div className="px-4 py-3 bg-shell-dark/30 border border-stone/50 rounded-2xl flex items-center gap-1.5 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-viridian/50 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-viridian/50 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-viridian/50 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Panel */}
      <div className="p-4 border-t border-stone/30 bg-shell-dark/10 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Lumi anything... ('Quiz me', 'Explain', 'Create summary')"
            className="flex-1 px-4 py-3.5 rounded-2xl border border-stone/80 bg-shell font-mono text-xs text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="px-5 rounded-2xl bg-viridian text-shell hover:bg-viridian-hover disabled:bg-viridian/45 shadow-soft transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
