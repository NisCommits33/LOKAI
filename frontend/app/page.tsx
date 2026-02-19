"use client"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Sparkles,
  BookOpen,
  Bot,
  ShieldCheck,
  ArrowRight,
  Code2,
  Globe2,
  Cpu,
  Database,
  Github,
  Award,
  CheckCircle2,
  BrainCircuit
} from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    )
  }

  const techStack = [
    { name: "Next.js", icon: <Globe2 className="h-4 w-4" /> },
    { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
    { name: "Gemini AI", icon: <Cpu className="h-4 w-4" /> },
    { name: "Tailwind", icon: <Code2 className="h-4 w-4" /> },
    { name: "Framer", icon: <CheckCircle2 className="h-4 w-4" /> },
  ]

  const containers = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="relative bg-white text-slate-900">
      {/* Hero Section */}
      <div className="pt-16 pb-12 sm:pt-20 sm:pb-20 border-b border-slate-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <Sparkles className="h-3 w-3 text-primary" />
              LokAI v2.0 Available for 2081
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Nepal's AI-Powered <br />
              Exam Preparation Platform.
            </h1>
            <p className="mt-8 text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
              A  environment for civil service aspirants. Harness AI for document intelligence,
              manage official materials securely, and master GK with ease.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none transition-all">
                  Start Preparation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" className="h-12 px-8 text-base font-semibold rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  Pricing & Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* GK Quiz CTA Section */}
      <div className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        </div>
        <Container>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary">
                <BrainCircuit className="h-3 w-3" />
                Now in Public Beta
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready to Master the <br />
                <span className="text-primary italic">General Knowledge</span> Section?
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Dive into our curated question bank covering Nepal's Constitution, History, Geography, and current affairs. Practice with a live timer and track your progress.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link href="/quizzes" className="w-full sm:w-auto">
                  <Button size="lg" className="h-14 w-full sm:w-auto px-10 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-95">
                    Start Free Practice
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="ghost" className="h-14 w-full sm:w-auto px-8 text-base font-bold rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    Sign in to track progress
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/0 rounded-[32px] blur opacity-25" />
              <div className="relative bg-black/40 border border-white/5 backdrop-blur-sm rounded-[32px] p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Question Preview</span>
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <p className="text-white font-bold text-lg leading-snug">
                  "In which year was the Treaty of Sugauli signed between Nepal and the British East India Company?"
                </p>
                <div className="space-y-3">
                  {["1814", "1815", "1816", "1817"].map((yr, i) => (
                    <div key={i} className={`p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between ${yr === '1816' ? 'ring-1 ring-primary/50 bg-primary/5' : ''}`}>
                      <span className="text-xs font-bold text-slate-400">{yr}</span>
                      {yr === '1816' && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Project Summary (College Feel, Minimalist) */}
      <div className="py-16 bg-slate-50/30">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Innovative Approach to Lok Sewa.</h2>
              <p className="text-base text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
                LokAI represents a paradigm shift in how government exam materials are processed.
                Our architecture focuses on performance, accessibility, and AI integration.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  "AI-Powered Document Intelligence",
                  "Institutional RBAC for Ministries",
                  "Nepal Constitution Specialized GK",
                  "High Performance Architecture"
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Technical Stack</h3>
                <div className="space-y-3">
                  {techStack.map((tech, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-50 hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-slate-400">{tech.icon}</div>
                        <span className="text-sm font-semibold text-slate-900">{tech.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">2081 Ready</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] font-bold text-slate-400">LOK-AI-2026-FYP</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-50">
        <Container>
          <div className="flex flex-col items-center gap-6">
            <span className="text-sm font-bold tracking-tight text-slate-400">LokAI Project Team &copy; 2081</span>
            <div className="flex items-center gap-8">
              <Github className="h-4 w-4 text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
              <Globe2 className="h-4 w-4 text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
              <Link href="/pricing" className="text-xs font-bold text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">Pricing</Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}

