"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  BookOpen, 
  Tv, 
  Activity, 
  Clock, 
  GitBranch, 
  ArrowRight,
  Smile,
  ShieldCheck,
  Feather
} from "lucide-react";

export default function LandingPage() {
  // Features lists
  const features = [
    {
      icon: <BookOpen className="w-5 h-5 text-viridian" />,
      title: "AI Note Editor",
      description: "Distraction-free markdown workspace. Convert notes to quizzes, simplify math, and get instant summaries."
    },
    {
      icon: <Tv className="w-5 h-5 text-viridian" />,
      title: "Distraction-Free Video",
      description: "Watch lectures without comments, ads, or recommended videos. Takes notes side-by-side with clickable timestamps."
    },
    {
      icon: <GitBranch className="w-5 h-5 text-viridian" />,
      title: "Dynamic Knowledge Graph",
      description: "Watch your study materials connect automatically. Visualise relationships between notes, topics, and lectures."
    },
    {
      icon: <Clock className="w-5 h-5 text-viridian" />,
      title: "Calming Pomodoro",
      description: "Beautiful timer layouts designed to pace your brain with custom intervals and satisfying milestone bells."
    },
    {
      icon: <Activity className="w-5 h-5 text-viridian" />,
      title: "Mindful Analytics",
      description: "Track focus hours, streaks, and subject progress without stress or competitive leaderboards."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-viridian" />,
      title: "Interactive AI Tutor",
      description: "Query your study context, generate analogies, or run custom quizzes on your lecture files and notes."
    }
  ];

  return (
    <div className="min-h-screen calm-mesh flex flex-col selection:bg-sky selection:text-viridian">
      {/* Floating Glass Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-4 z-50 mx-auto w-[90%] max-w-6xl"
      >
        <div className="glass-card px-4 md:px-6 py-3 md:py-4 rounded-3xl flex justify-between items-center shadow-soft">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="/logo (light).png" 
              alt="StudyOS Logo" 
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-serif text-2xl font-bold tracking-tight text-viridian">
              StudyOS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-mono text-viridian/80">
            <a href="#features" className="hover:text-viridian transition-colors">Features</a>
            <a href="#philosophy" className="hover:text-viridian transition-colors">Philosophy</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              onClick={() => {
                try {
                  const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                  audio.volume = 0.25;
                  audio.play().catch(() => {});
                } catch(e){}
              }}
              className="bg-viridian hover:bg-viridian-hover text-shell text-xs md:text-sm font-mono px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl transition-all shadow-soft flex items-center gap-1.5 md:gap-2 whitespace-nowrap shrink-0"
            >
              <span className="hidden sm:inline">Open Workspace</span>
              <span className="sm:hidden">Open</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-16 pb-24 md:pt-24 flex flex-col md:grid md:grid-cols-12 gap-12 items-center">
        {/* Left Intro Column */}
        <div className="md:col-span-6 flex flex-col gap-6 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="self-center md:self-start bg-honeydew text-viridian text-xs font-mono px-3 py-1.5 rounded-full border border-stone flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Your Mindful Study Environment
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl md:text-6xl font-bold text-viridian leading-[1.1] tracking-tight"
          >
            A peaceful desk for your digital mind.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg font-mono text-viridian/70 leading-relaxed max-w-md mx-auto md:mx-0"
          >
            StudyOS unifies notes, documents, lectures, and timers into a single, distraction-free environment enhanced with Gemini AI support.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2"
          >
            <Link 
              href="/dashboard"
              onClick={() => {
                try {
                  const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                  audio.volume = 0.25;
                  audio.play().catch(() => {});
                } catch(e){}
              }}
              className="bg-viridian hover:bg-viridian-hover text-shell font-mono px-8 py-4 rounded-2xl transition-all shadow-calm text-center flex items-center justify-center gap-2 group text-base"
            >
              Enter StudyOS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#features"
              className="border border-stone hover:bg-stone/20 text-viridian font-mono px-8 py-4 rounded-2xl transition-all text-center text-base"
            >
              Explore Features
            </a>
          </motion.div>
        </div>

        {/* Right Animated Desktop Illustration Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 w-full flex justify-center items-center"
        >
          <div className="relative w-full max-w-[450px] aspect-square rounded-[2.5rem] bg-stone/40 border border-stone flex items-center justify-center p-8 shadow-soft">
            {/* Ambient desk lamp glow */}
            <div className="absolute top-8 right-16 w-32 h-32 rounded-full bg-honeydew/30 blur-2xl animate-pulse-soft"></div>
            
            {/* SVG Desktop Elements with Framer Motion */}
            <svg viewBox="0 0 400 400" className="w-full h-full text-viridian drop-shadow-sm select-none">
              {/* Table base line */}
              <line x1="30" y1="340" x2="370" y2="340" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              
              {/* Laptop Body */}
              <rect x="110" y="170" width="180" height="120" rx="12" fill="#F7F5F1" stroke="currentColor" strokeWidth="2.5" />
              {/* Laptop screen divider */}
              <line x1="110" y1="260" x2="290" y2="260" stroke="currentColor" strokeWidth="1.5" />
              {/* Laptop base */}
              <polygon points="90,290 310,290 320,305 80,305" fill="#E0DCD1" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Screen Content - Knowledge Nodes */}
              <circle cx="160" cy="210" r="10" fill="#D5E3E8" stroke="currentColor" strokeWidth="2" />
              <circle cx="240" cy="200" r="8" fill="#E4E3BC" stroke="currentColor" strokeWidth="2" />
              <circle cx="200" cy="235" r="12" fill="#F7F5F1" stroke="currentColor" strokeWidth="2" />
              <line x1="160" y1="210" x2="200" y2="235" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="240" y1="200" x2="200" y2="235" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Floating Coffee Cup */}
              <motion.g 
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M60,250 L80,250 L78,280 L62,280 Z" fill="#E0DCD1" stroke="currentColor" strokeWidth="2" />
                <path d="M80,257 C85,257 88,260 88,265 C88,270 85,273 80,273" fill="none" stroke="currentColor" strokeWidth="2" />
                {/* Coffee steam lines */}
                <path d="M65,242 C67,238 65,236 67,232" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M73,243 C75,239 73,237 75,233" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </motion.g>

              {/* Desk Plant */}
              <rect x="300" y="270" width="30" height="35" rx="4" fill="#E0DCD1" stroke="currentColor" strokeWidth="2" />
              {/* Plant Leaves */}
              <path d="M315,270 Q305,250 295,255" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M315,270 Q315,240 325,245" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M315,270 Q325,250 335,252" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

              {/* Timer/Clock on the wall */}
              <circle cx="200" cy="80" r="30" fill="#F7F5F1" stroke="currentColor" strokeWidth="2.5" />
              <line x1="200" y1="80" x2="200" y2="62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="200" y1="80" x2="215" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* Pomodoro Pulse Effect */}
              <motion.circle 
                cx="200" 
                cy="80" 
                r="36" 
                fill="none" 
                stroke="#D5E3E8" 
                strokeWidth="1.5"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Floating Notes Sheet */}
              <motion.g
                animate={{ y: [0, -5, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <rect x="60" y="110" width="60" height="75" rx="6" fill="#F7F5F1" stroke="currentColor" strokeWidth="2" />
                <line x1="70" y1="125" x2="110" y2="125" stroke="currentColor" strokeWidth="1.5" />
                <line x1="70" y1="140" x2="105" y2="140" stroke="currentColor" strokeWidth="1.5" />
                <line x1="70" y1="155" x2="95" y2="155" stroke="currentColor" strokeWidth="1.5" />
                <path d="M105,110 L120,110 L120,125" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </motion.g>

              {/* Glowing desk lamp */}
              <path d="M330,340 L330,180 L290,180 L290,195 L310,195 L310,340" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="280,195 320,195 300,180" fill="currentColor" />
            </svg>

            {/* Micro Badge widget floating */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 right-6 glass-card px-4 py-2 rounded-2xl border border-stone shadow-soft flex items-center gap-2 text-xs font-mono text-viridian"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-honeydew border border-viridian/20 animate-ping"></span>
              Focus: 45m Session
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid Section */}
      <section id="features" className="py-24 border-t border-stone bg-stone/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-lg mx-auto mb-16 flex flex-col gap-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-viridian tracking-tight">
              Designed for Flow, Not Distraction.
            </h2>
            <p className="font-mono text-sm text-viridian/70">
              No endless feeds. No notifications. Just your study desk, structured beautifully.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="glass-card p-8 rounded-[2rem] border border-stone/60 shadow-soft hover:shadow-calm transition-all flex flex-col gap-4 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-sky flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-viridian">
                  {feature.title}
                </h3>
                <p className="font-mono text-xs text-viridian/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-viridian tracking-tight">
            Our Calm Study Philosophy
          </h2>
          <p className="font-mono text-xs text-viridian/70 leading-relaxed">
            The modern web is built to capture your attention. Recommended feeds, alerts, and badges turn studying into a chore. 
          </p>
          <p className="font-mono text-xs text-viridian/70 leading-relaxed">
            StudyOS is built on the belief that **silence is key**. By bringing all your files, video lectures, and notes into one elegant space, we help your brain drop into alpha-waves faster and remain focused.
          </p>
          <div className="flex flex-col gap-3 font-mono text-xs text-viridian pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-honeydew flex items-center justify-center"><Feather className="w-3 h-3 text-viridian" /></div>
              No ad-tech, tracking, or scrolling traps.
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-honeydew flex items-center justify-center"><Smile className="w-3 h-3 text-viridian" /></div>
              A warm, relaxing paper-like aesthetic.
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-honeydew flex items-center justify-center"><ShieldCheck className="w-3 h-3 text-viridian" /></div>
              Gemini AI as your collaborative editor, not your replacement.
            </div>
          </div>
        </div>
        <div className="bg-sky/40 border border-stone p-8 rounded-[2.5rem] flex flex-col justify-center gap-6 shadow-soft aspect-[4/3]">
          <span className="font-serif text-5xl font-bold text-viridian/30">“</span>
          <p className="font-serif text-xl md:text-2xl text-viridian leading-relaxed italic">
            I used to open 14 tabs for a single lecture: slides, YouTube, chat, notes. With StudyOS, I have one desk, and my study time is finally peaceful.
          </p>
          <span className="font-mono text-xs text-viridian/60">— Clara, Medical Student</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone py-12 bg-shell-dark/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-mono text-viridian/60">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-viridian">StudyOS</span>
            <span>© {new Date().getFullYear()} — All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-viridian transition-colors">Privacy</a>
            <a href="#" className="hover:text-viridian transition-colors">Terms of Service</a>
            <a href="https://github.com" className="hover:text-viridian transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
