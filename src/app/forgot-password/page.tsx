"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate reset recovery email
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen calm-mesh flex flex-col justify-center items-center p-6 selection:bg-sky selection:text-viridian">
      {/* Back to Login */}
      <Link 
        href="/login" 
        className="absolute top-6 left-6 font-mono text-xs text-viridian/70 hover:text-viridian flex items-center gap-1.5 bg-stone/40 border border-stone px-3 py-1.5 rounded-xl transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Login
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-card p-8 md:p-10 rounded-[2rem] shadow-calm border border-stone"
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-honeydew/60 flex items-center justify-center text-viridian">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-viridian tracking-tight">
              Recovery Sent
            </h2>
            <p className="font-mono text-xs text-viridian/70 leading-relaxed">
              If an account exists for **{email}**, you will receive an email shortly with instructions to reset your password.
            </p>
            <Link 
              href="/login" 
              className="mt-4 bg-viridian hover:bg-viridian-hover text-shell font-mono text-xs px-6 py-3 rounded-xl transition-all shadow-soft"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            {/* Brand */}
            <div className="flex flex-col items-center gap-3 text-center mb-8">
              <div className="w-10 h-10 rounded-full bg-viridian flex items-center justify-center text-shell font-serif font-bold text-xl">
                S
              </div>
              <h2 className="font-serif text-2xl font-bold text-viridian tracking-tight">
                Reset Password
              </h2>
              <p className="font-mono text-xs text-viridian/60">
                Enter your email address and we will help you recover it.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-viridian hover:bg-viridian-hover disabled:bg-viridian/60 text-shell font-mono text-xs py-3.5 rounded-xl transition-all shadow-soft flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-shell/30 border-t-shell rounded-full animate-spin"></span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
