"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth registration
    setTimeout(() => {
      setLoading(false);
      // Auto login
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen calm-mesh flex flex-col justify-center items-center p-6 selection:bg-sky selection:text-viridian">
      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 font-mono text-xs text-viridian/70 hover:text-viridian flex items-center gap-1.5 bg-stone/40 border border-stone px-3 py-1.5 rounded-xl transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-card p-8 md:p-10 rounded-[2rem] shadow-calm border border-stone"
      >
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="w-10 h-10 rounded-full bg-viridian flex items-center justify-center text-shell font-serif font-bold text-xl">
            S
          </div>
          <h2 className="font-serif text-2xl font-bold text-viridian tracking-tight">
            Start studying today
          </h2>
          <p className="font-mono text-xs text-viridian/60">
            Create your account on StudyOS.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-viridian/70">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-viridian/50" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian transition-all focus:bg-shell"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-viridian/70">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-viridian/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian transition-all focus:bg-shell"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-viridian/70">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-viridian/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone/80 bg-shell/50 font-mono text-xs text-viridian placeholder-viridian/40 focus:outline-none focus:border-viridian transition-all focus:bg-shell"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-viridian hover:bg-viridian-hover disabled:bg-viridian/60 text-shell font-mono text-xs py-3.5 rounded-xl transition-all shadow-soft flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-shell/30 border-t-shell rounded-full animate-spin"></span>
            ) : (
              <>
                Create Desk Space
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 pt-6 border-t border-stone/50 text-center">
          <p className="font-mono text-xs text-viridian/60">
            Already have an account?{" "}
            <Link href="/login" className="text-viridian font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
