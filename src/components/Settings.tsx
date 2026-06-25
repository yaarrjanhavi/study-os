import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  User, 
  Key, 
  Trash2, 
  Check, 
  Lock,
  Volume2,
  Sparkles,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";

interface SettingsProps {
  username: string;
  setUsername: (name: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

export default function Settings({
  username,
  setUsername,
  geminiApiKey,
  setGeminiApiKey,
}: SettingsProps) {
  const [userNameInput, setUserNameInput] = useState(username);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  
  // Status states
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(userNameInput.trim() || "Alex");
    setGeminiApiKey(apiKeyInput.trim());

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);

    confetti({
      particleCount: 20,
      spread: 30,
      colors: ["#344945", "#E4E3BC"]
    });
  };

  const handleResetWorkspace = () => {
    if (confirm("WARNING: This will delete all your notes, tasks, flashcards, and custom histories. Are you sure you want to completely restore your study desk?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 shrink-0 border-b border-stone/30 pb-3">
        <h1 className="font-serif text-2xl font-bold text-viridian flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-viridian" />
          Workspace Settings
        </h1>
        <p className="font-mono text-xs text-viridian/70">
          Customize your study desk, profile values, and secure API keys.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-stone/50 shadow-soft max-w-xl bg-shell/65 shrink-0">
        <form onSubmit={handleSave} className="flex flex-col gap-5 font-mono text-[10px]">
          
          {/* Profile Name */}
          <div className="flex flex-col gap-1.5">
            <label className="uppercase tracking-wider text-viridian/70 flex items-center gap-1.5">
              <User className="w-4 h-4 text-viridian/65" />
              Student Profile Name
            </label>
            <input
              type="text"
              required
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-4 py-3.5 rounded-xl border border-stone/80 bg-shell/50 text-xs text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian focus:bg-shell transition-all"
            />
          </div>

          {/* API Key */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="uppercase tracking-wider text-viridian/70 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-viridian/65" />
                Gemini API Key
              </span>
              <button 
                type="button" 
                onClick={() => setShowKey(!showKey)}
                className="font-bold text-[9px] hover:underline"
              >
                {showKey ? "Hide key" : "Show key"}
              </button>
            </label>
            <input
              type={showKey ? "text" : "password"}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste your AI Generative API key here..."
              className="w-full px-4 py-3.5 rounded-xl border border-stone/80 bg-shell/50 text-xs text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian focus:bg-shell transition-all"
            />
            <div className="flex gap-1.5 items-start mt-1 text-[9px] text-viridian/60 bg-stone/30 p-2.5 rounded-lg border border-stone-dark/30">
              <Info className="w-3.5 h-3.5 text-viridian shrink-0 mt-0.5" />
              <p className="leading-normal">
                Your key is saved locally in your own browser cache. It is only sent directly to Google's endpoints to power RAG chat features. If left blank, the app will run in offline Lumi demo mode.
              </p>
            </div>

            {/* Non-Tech API Tutorial Guide */}
            <div className="mt-3 bg-sky/35 border border-sky-dark/35 rounded-2xl p-4 flex flex-col gap-2.5 text-viridian">
              <span className="font-serif text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 animate-pulse-soft" />
                Student Guide: Getting a Free API Key
              </span>
              
              <div className="space-y-2 font-mono text-[9px] leading-relaxed text-viridian/85">
                <p>
                  <strong>What is an API Key?</strong> Think of it as a secure lock key that lets Lumi (our AI tutor) connect directly to Google&apos;s brainstorming servers. Google provides these for free to students!
                </p>
                <p><strong>Follow these 3 easy steps to generate yours:</strong></p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    Open Google AI Studio:{" "}
                    <a 
                      href="https://aistudio.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold underline hover:text-viridian-dark inline-flex items-center"
                    >
                      aistudio.google.com
                    </a>
                  </li>
                  <li>Click the blue <strong>&quot;Create API Key&quot;</strong> button at the top left.</li>
                  <li>Select <strong>&quot;Create API key in new project&quot;</strong>, copy the long code (starts with <code>AIza...</code>), and paste it into the input box above. Click <strong>&quot;Save Configurations&quot;</strong> below.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-between border-t border-stone/30 pt-4 mt-2">
            {saveSuccess ? (
              <span className="text-[10px] text-green-700 bg-honeydew border border-green-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Changes saved successfully
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="bg-viridian hover:bg-viridian-hover text-shell px-6 py-3.5 rounded-xl transition-all shadow-soft font-bold"
            >
              Save Configurations
            </button>
          </div>

        </form>
      </div>

      {/* Advanced Reset Section */}
      <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-red-200/50 shadow-soft max-w-xl bg-red-100/10 shrink-0">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 text-red-500 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <h3 className="font-serif text-sm font-bold text-red-700">Danger Zone — Reset Workspace</h3>
            <p className="font-mono text-[10px] leading-relaxed text-viridian/70">
              Resetting deletes all notes, tasks, pomodoro histories, and custom cache tokens, restoring StudyOS to its original seeds. This action is irreversible.
            </p>
            <button
              onClick={handleResetWorkspace}
              className="self-start mt-2 bg-red-600 hover:bg-red-700 text-shell font-mono text-[10px] px-5 py-2.5 rounded-xl transition-all shadow-soft"
            >
              Reset Desk State
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
