import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Search, 
  Tv, 
  Clock, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  PlusCircle,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";
import { VideoStudy } from "../app/dashboard/page";

interface YouTubePlayerProps {
  videos: VideoStudy[];
  saveVideos: (videos: VideoStudy[]) => void;
}

export default function YouTubePlayer({ videos, saveVideos }: YouTubePlayerProps) {
  const [activeVideoId, setActiveVideoId] = useState<string>(videos[0]?.id || "9m7Tz_s1g_g");
  const [inputUrl, setInputUrl] = useState("");
  const [notesContent, setNotesContent] = useState("");
  const [timeNote, setTimeNote] = useState("");
  
  // Custom video seek start time to control play jumps
  const [seekTime, setSeekTime] = useState<number>(0);
  
  // Mock transcript
  const transcript = [
    { time: 10, text: "Welcome to this introductory session on neural systems." },
    { time: 60, text: "Let's first define what an activation threshold represents." },
    { time: 120, text: "We weight features using statistical matrices as inputs." },
    { time: 240, text: "Gradient descent works to converge towards the global loss minimum." },
    { time: 380, text: "Notice how local minima can sometimes trap basic SGD optimizers." },
    { time: 480, text: "We will resume backpropagation derivatives in the next section." }
  ];

  // Sync editor fields on video switch
  const activeVideo = videos.find(v => v.id === activeVideoId);
  
  useEffect(() => {
    if (activeVideo) {
      setNotesContent(activeVideo.notes);
    }
  }, [activeVideoId, videos]);

  // Extract ID from youtube URLs
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (!id) {
      alert("Invalid YouTube Link. Please copy a standard watch or share URL.");
      return;
    }

    // Check if already exists
    if (videos.some(v => v.id === id)) {
      setActiveVideoId(id);
      setInputUrl("");
      return;
    }

    const newVideo: VideoStudy = {
      id,
      title: `Lecture Video (${id})`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      notes: "Take notes on your lecture video here...",
      savedTimestamps: []
    };

    saveVideos([newVideo, ...videos]);
    setActiveVideoId(id);
    setInputUrl("");

    confetti({
      particleCount: 30,
      spread: 30,
      colors: ["#344945", "#D5E3E8"]
    });
  };

  const handleDeleteVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = videos.filter(v => v.id !== id);
    saveVideos(remaining);
    if (activeVideoId === id) {
      setActiveVideoId(remaining[0]?.id || "9m7Tz_s1g_g");
    }
  };

  const handleUpdateNotes = (text: string) => {
    setNotesContent(text);
    const updated = videos.map(v => {
      if (v.id === activeVideoId) return { ...v, notes: text };
      return v;
    });
    saveVideos(updated);
  };

  // Add custom timestamp mark
  const handleSaveTimestamp = (seconds: number) => {
    if (!activeVideo) return;
    const noteText = timeNote.trim() || "Important Concept";

    const newTimestamp = {
      time: seconds,
      note: noteText
    };

    const updatedTimestamps = [...activeVideo.savedTimestamps, newTimestamp].sort((a, b) => a.time - b.time);

    const updated = videos.map(v => {
      if (v.id === activeVideoId) return { ...v, savedTimestamps: updatedTimestamps };
      return v;
    });

    saveVideos(updated);
    setTimeNote("");

    confetti({
      particleCount: 15,
      spread: 20,
      colors: ["#D5E3E8", "#344945"]
    });
  };

  const handleDeleteTimestamp = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeVideo) return;
    const updatedTimestamps = activeVideo.savedTimestamps.filter(t => t.time !== seconds);
    const updated = videos.map(v => {
      if (v.id === activeVideoId) return { ...v, savedTimestamps: updatedTimestamps };
      return v;
    });
    saveVideos(updated);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="lg:h-full flex flex-col lg:flex-row gap-6 select-none">
      
      {/* 1. Sidebar Lecture library */}
      <div className="w-full lg:w-80 flex flex-col gap-4 lg:h-full border-b lg:border-b-0 lg:border-r border-stone/30 pb-6 lg:pb-0 lg:pr-6 shrink-0">
        <span className="font-serif text-sm font-bold text-viridian">Lectures Library</span>

        <form onSubmit={handleAddVideo} className="flex gap-2 shrink-0">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube Link..."
            className="flex-1 px-3 py-2 rounded-xl border border-stone/80 bg-shell/50 font-mono text-[10px] text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian focus:bg-shell transition-all"
          />
          <button 
            type="submit"
            className="p-2 rounded-xl bg-viridian text-shell hover:bg-viridian-hover shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[200px] lg:max-h-none">
          {videos.map(v => (
            <div
              key={v.id}
              onClick={() => setActiveVideoId(v.id)}
              className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 relative group ${activeVideoId === v.id ? "bg-shell/80 border-viridian/30 shadow-soft" : "bg-shell/30 border-stone/50 hover:bg-stone/20"}`}
            >
              <div 
                className="w-16 aspect-video bg-cover bg-center rounded-lg border border-stone/70 shrink-0"
                style={{ backgroundImage: `url(${v.thumbnail})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] font-bold text-viridian truncate">{v.title}</p>
                <p className="font-mono text-[8px] text-viridian/50 mt-0.5">YouTube ID: {v.id}</p>
              </div>

              <button
                onClick={(e) => handleDeleteVideo(v.id, e)}
                className="absolute right-2 top-2 p-1 rounded hover:bg-red-500/20 text-viridian/65 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {videos.length === 0 && (
            <div className="text-center py-12 font-mono text-[10px] text-viridian/40 italic">
              No videos added. Paste a lecture link above.
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Player Canvas */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:h-full lg:overflow-hidden">
        
        {/* Left Column: Player & Timestamps checklist */}
        <div className="lg:col-span-7 flex flex-col gap-4 lg:h-full lg:overflow-y-auto pr-1">
          
          {/* Iframe Distraction-Free player */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden border border-stone bg-black shadow-calm relative">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1&start=${seekTime}`}
              title="StudyOS Lecture Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
              key={`${activeVideoId}-${seekTime}`} // Forces reload on timestamp seek click
            />
          </div>

          {/* Quick Timestamp Tagger */}
          <div className="glass-card p-4 rounded-3xl border border-stone/60 flex items-center gap-3 shadow-soft bg-shell/70">
            <input
              type="text"
              value={timeNote}
              onChange={(e) => setTimeNote(e.target.value)}
              placeholder="Tag concepts at time (e.g. gradient proof)..."
              className="flex-1 px-3 py-2 rounded-xl border border-stone/80 bg-shell/50 font-mono text-[10px] text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian transition-all"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => handleSaveTimestamp(120)} // Mock current timestamp at 2m (120s)
                className="px-3 py-2 rounded-xl bg-viridian text-shell font-mono text-[10px] hover:bg-viridian-hover shadow-soft flex items-center gap-1 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add [2:00]
              </button>
              <button 
                onClick={() => handleSaveTimestamp(240)} // Mock current timestamp at 4m (240s)
                className="px-3 py-2 border border-stone text-viridian font-mono text-[10px] hover:bg-stone/30 rounded-xl shrink-0"
              >
                Add [4:00]
              </button>
            </div>
          </div>

          {/* Saved Timestamps list */}
          <div className="glass-card p-5 rounded-3xl border border-stone/60 flex flex-col gap-3 shadow-soft flex-1 overflow-y-auto min-h-[200px]">
            <span className="font-serif text-xs font-bold text-viridian">Saved Lecture Landmarks</span>
            <div className="space-y-2">
              {activeVideo?.savedTimestamps.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => setSeekTime(t.time)}
                  className="flex items-center justify-between p-2 rounded-xl border border-stone/50 bg-shell/45 cursor-pointer hover:bg-stone/20 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Clock className="w-3.5 h-3.5 text-viridian/60 shrink-0" />
                    <span className="font-mono text-[10px] bg-sky text-viridian px-2 py-0.5 rounded border border-viridian/10 font-bold shrink-0">
                      {formatTime(t.time)}
                    </span>
                    <span className="font-mono text-[10px] text-viridian truncate">
                      {t.note}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteTimestamp(t.time, e)}
                    className="p-1 rounded text-viridian/45 hover:text-red-500 transition-all shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {(!activeVideo || activeVideo.savedTimestamps.length === 0) && (
                <div className="text-center py-6 font-mono text-[9px] text-viridian/40 italic">
                  No landmark timestamps pinned yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Side-by-side Note taking & Transcript navigation */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:h-full lg:overflow-hidden min-h-[300px]">
          
          {/* Side Notes */}
          <div className="glass-card p-5 rounded-3xl border border-stone/60 flex flex-col gap-3 shadow-soft h-[50%]">
            <span className="font-serif text-xs font-bold text-viridian flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Side Study Notes
            </span>
            <textarea
              value={notesContent}
              onChange={(e) => handleUpdateNotes(e.target.value)}
              placeholder="Take notes while watching lectures. Automatically saved to this video's record..."
              className="flex-1 w-full p-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-[11px] leading-relaxed text-viridian placeholder-viridian/45 resize-none focus:outline-none focus:border-viridian focus:bg-shell transition-all"
            />
          </div>

          {/* Transcript Viewer */}
          <div className="glass-card p-5 rounded-3xl border border-stone/60 flex flex-col gap-3 shadow-soft h-[50%] overflow-hidden">
            <span className="font-serif text-xs font-bold text-viridian">Interactive Lecture Transcript</span>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {transcript.map((line, idx) => (
                <div
                  key={idx}
                  onClick={() => setSeekTime(line.time)}
                  className="p-2.5 rounded-xl bg-shell/40 border border-stone/30 hover:border-viridian/25 hover:bg-stone/20 transition-all cursor-pointer flex gap-3 text-[10px]"
                >
                  <span className="font-mono font-bold text-viridian bg-honeydew px-1.5 py-0.5 rounded border border-viridian/15 h-fit shrink-0">
                    {formatTime(line.time)}
                  </span>
                  <span className="font-mono text-viridian/80 leading-normal">
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
