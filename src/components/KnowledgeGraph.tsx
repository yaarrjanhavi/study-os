import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  GitBranch, 
  BookOpen, 
  Tv, 
  FileText, 
  CheckSquare, 
  ExternalLink, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Note, VideoStudy, PDFDoc, Task } from "../app/dashboard/page";

interface KnowledgeGraphProps {
  notes: Note[];
  videos: VideoStudy[];
  pdfs: PDFDoc[];
  tasks: Task[];
  setActiveTab: (tab: string) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: "note" | "video" | "pdf" | "task";
  x: number;
  y: number;
  originalId: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export default function KnowledgeGraph({
  notes,
  videos,
  pdfs,
  tasks,
  setActiveTab,
}: KnowledgeGraphProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Generate nodes coordinates organics on state changes
  useEffect(() => {
    const list: GraphNode[] = [];
    const connectionLinks: GraphLink[] = [];

    let index = 0;
    const centerX = 200;
    const centerY = 200;
    const radiusStep = 75;

    // 1. Load notes nodes
    notes.forEach((n, idx) => {
      const angle = (index * 2 * Math.PI) / 8;
      const radius = radiusStep + (idx * 15);
      list.push({
        id: `node-note-${n.id}`,
        label: n.title,
        type: "note",
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        originalId: n.id
      });
      index++;
    });

    // 2. Load videos nodes
    videos.forEach((v, idx) => {
      const angle = (index * 2 * Math.PI) / 8;
      const radius = radiusStep + 10;
      list.push({
        id: `node-video-${v.id}`,
        label: v.title,
        type: "video",
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        originalId: v.id
      });
      index++;
    });

    // 3. Load PDFs nodes
    pdfs.forEach((p, idx) => {
      const angle = (index * 2 * Math.PI) / 8;
      const radius = radiusStep + 25;
      list.push({
        id: `node-pdf-${p.id}`,
        label: p.name,
        type: "pdf",
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        originalId: p.id
      });
      index++;
    });

    // 4. Load tasks nodes
    tasks.slice(0, 3).forEach((t, idx) => {
      const angle = (index * 2 * Math.PI) / 8;
      const radius = radiusStep + 35;
      list.push({
        id: `node-task-${t.id}`,
        label: t.text,
        type: "task",
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        originalId: t.id
      });
      index++;
    });

    // 5. Connect related nodes by tags/keywords overlap
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const nodeA = list[i];
        const nodeB = list[j];
        
        let shouldConnect = false;

        // Notes connection
        if (nodeA.type === "note" && nodeB.type === "note") {
          const noteAData = notes.find(n => n.id === nodeA.originalId);
          const noteBData = notes.find(n => n.id === nodeB.originalId);
          if (noteAData && noteBData) {
            // share tags
            shouldConnect = noteAData.tags.some(t => noteBData.tags.includes(t));
          }
        }
        
        // Video connection to note
        if (nodeA.type === "note" && nodeB.type === "video") {
          const noteData = notes.find(n => n.id === nodeA.originalId);
          const videoData = videos.find(v => v.id === nodeB.originalId);
          if (noteData && videoData) {
            shouldConnect = videoData.notes.toLowerCase().includes(noteData.title.slice(0, 8).toLowerCase());
          }
        }

        // PDF connection to note
        if (nodeA.type === "note" && nodeB.type === "pdf") {
          const noteData = notes.find(n => n.id === nodeA.originalId);
          const pdfData = pdfs.find(p => p.id === nodeB.originalId);
          if (noteData && pdfData) {
            shouldConnect = pdfData.summary.toLowerCase().includes(noteData.title.slice(0, 8).toLowerCase());
          }
        }

        // Chronological neighbor fallback to keep graph structured
        if (Math.abs(i - j) === 1) {
          shouldConnect = true;
        }

        if (shouldConnect) {
          connectionLinks.push({
            source: nodeA.id,
            target: nodeB.id
          });
        }
      }
    }

    setNodes(list);
    setLinks(connectionLinks);
  }, [notes, videos, pdfs, tasks]);

  const activeNode = nodes.find(n => n.id === selectedNodeId);

  // Get matching original object values
  const getOriginalDetails = () => {
    if (!activeNode) return null;
    switch (activeNode.type) {
      case "note":
        return notes.find(n => n.id === activeNode.originalId);
      case "video":
        return videos.find(v => v.id === activeNode.originalId);
      case "pdf":
        return pdfs.find(p => p.id === activeNode.originalId);
      case "task":
        return tasks.find(t => t.id === activeNode.originalId);
    }
  };

  const originalData = getOriginalDetails();

  const handleNodeJump = () => {
    if (!activeNode) return;
    switch (activeNode.type) {
      case "note":
        setActiveTab("notes");
        break;
      case "video":
        setActiveTab("videos");
        break;
      case "pdf":
        setActiveTab("pdfs");
        break;
      case "task":
        setActiveTab("tasks");
        break;
    }
  };

  return (
    <div className="lg:h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 select-none relative">
      
      {/* 1. Interactive SVG Canvas graph */}
      <div className="lg:col-span-8 flex flex-col lg:h-full bg-shell-dark/15 rounded-3xl border border-stone/50 overflow-hidden relative shadow-soft min-h-[320px]">
        {/* Header */}
        <div className="h-14 border-b border-stone/30 bg-shell/70 px-6 flex justify-between items-center shrink-0">
          <span className="font-serif text-xs font-bold text-viridian flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-viridian" />
            AI Knowledge Graph
          </span>
          <span className="font-mono text-[9px] text-viridian/50 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Drag nodes or click to query relationships
          </span>
        </div>

        {/* SVG Drawing Area */}
        <div className="flex-1 w-full bg-shell/25 relative overflow-hidden flex items-center justify-center p-4">
          <svg viewBox="0 0 400 400" className="w-full max-w-[380px] aspect-square overflow-visible">
            {/* Draw Links */}
            {links.map((link, idx) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              return (
                <line
                  key={idx}
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke="#CDC8BA"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              
              // Colors based on types
              let color = "#344945"; // viridian
              if (node.type === "note") color = "#E4E3BC"; // honeydew
              else if (node.type === "video") color = "#CDC8BA"; // stone
              else if (node.type === "pdf") color = "#D5E3E8"; // sky

              return (
                <motion.g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Draggable Circle Node wrapper */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 14 : 10}
                    fill={color}
                    stroke="#344945"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="shadow-soft transition-all duration-300"
                  />
                  {/* Text Badge name tag */}
                  <text
                    x={node.x}
                    y={node.y - 15}
                    textAnchor="middle"
                    className="font-mono text-[7px] font-bold fill-viridian bg-shell/80 px-1 py-0.5 rounded pointer-events-none"
                  >
                    {node.label.slice(0, 15)}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Side details inspector panel */}
      <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-stone/50 shadow-soft lg:h-full flex flex-col gap-4 overflow-y-auto min-h-[220px]">
        <span className="font-serif text-sm font-bold text-viridian">Concept Inspector</span>

        {activeNode && originalData ? (
          <div className="flex flex-col gap-4 h-full">
            
            {/* Header info */}
            <div className="flex flex-col gap-1 border-b border-stone/30 pb-3">
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-viridian/60">
                {activeNode.type === "note" && <BookOpen className="w-3.5 h-3.5 text-viridian" />}
                {activeNode.type === "video" && <Tv className="w-3.5 h-3.5 text-viridian" />}
                {activeNode.type === "pdf" && <FileText className="w-3.5 h-3.5 text-viridian" />}
                {activeNode.type === "task" && <CheckSquare className="w-3.5 h-3.5 text-viridian" />}
                <span>{activeNode.type} Node Details</span>
              </div>
              <h3 className="font-serif text-base font-bold text-viridian leading-snug mt-1">
                {activeNode.label}
              </h3>
            </div>

            {/* Description Details */}
            <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-viridian/80">
              {activeNode.type === "note" && (
                <p className="line-clamp-6">{(originalData as Note).content}</p>
              )}

              {activeNode.type === "video" && (
                <div className="space-y-2">
                  <p className="line-clamp-4">{(originalData as VideoStudy).notes}</p>
                  { (originalData as VideoStudy).savedTimestamps.length > 0 && (
                    <div className="mt-2 bg-stone/20 p-2 rounded-xl border border-stone">
                      <span className="font-bold text-[10px]">Time landmarks pinned:</span>
                      <ul className="list-disc pl-3 text-[9px] mt-1 space-y-1">
                        {(originalData as VideoStudy).savedTimestamps.map((t, idx) => (
                          <li key={idx}>At {Math.floor(t.time / 60)}:00 — {t.note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeNode.type === "pdf" && (
                <div className="space-y-2">
                  <p className="line-clamp-5">{(originalData as PDFDoc).summary}</p>
                  {(originalData as PDFDoc).formulas.length > 0 && (
                    <div className="mt-2 bg-stone/20 p-2 rounded-xl border border-stone">
                      <span className="font-bold text-[10px]">Formulas parsed:</span>
                      <ul className="list-disc pl-3 text-[9px] mt-1 space-y-1">
                        {(originalData as PDFDoc).formulas.map((f, idx) => (
                          <li key={idx} className="font-mono">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeNode.type === "task" && (
                <div className="space-y-2">
                  <p>Goal Status: <span className="font-bold">{(originalData as Task).column === "done" ? "Completed" : "Active"}</span></p>
                  <p>Task priority: <span className="font-bold">{(originalData as Task).priority}</span></p>
                </div>
              )}
            </div>

            {/* Action Jump buttons */}
            <button
              onClick={handleNodeJump}
              className="w-full mt-auto bg-viridian hover:bg-viridian-hover text-shell font-mono text-[10px] py-3 rounded-xl transition-all shadow-soft flex items-center justify-center gap-1.5 shrink-0"
            >
              Open File in Desk
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-20 font-mono text-[10px] text-viridian/40 italic flex flex-col gap-2 items-center justify-center h-full">
            <RefreshCw className="w-8 h-8 text-viridian/25 animate-spin-slow" />
            Click any network node node to inspect connections and summaries.
          </div>
        )}
      </div>

    </div>
  );
}
