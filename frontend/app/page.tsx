"use client"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
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
  Users
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
      <div className="pt-24 pb-20 sm:pt-32 sm:pb-32 border-b border-slate-50">
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
              A minimalist environment for civil service aspirants. Harness AI for document intelligence,
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

      {/* Feature Highlights */}
      <div className="py-24 border-b border-slate-50">
        <Container>
          <motion.div
            variants={containers}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                title: "GK Practice",
                description: "Curated question bank covering constitutional history and geography.",
                icon: <BookOpen className="h-5 w-5" />,
                border: "border-slate-100"
              },
              {
                title: "AI Doc Lab",
                description: "Let machine intelligence summarize and quiz you on uploaded materials.",
                icon: <Bot className="h-5 w-5" />,
                border: "border-slate-100"
              },
              {
                title: "Org Access",
                description: "Official ministerial circulars and internal resources for verified staff.",
                icon: <ShieldCheck className="h-5 w-5" />,
                border: "border-slate-100"
              }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={item} className="space-y-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </div>

      {/* Project Summary (College Feel, Minimalist) */}
      <div className="py-24 bg-slate-50/30">
        <Container>
          <div className="grid lg:grid-cols-12 gap-16 items-start">
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
      <footer className="py-16 border-t border-slate-50">
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

import { Sparkles } from "lucide-react"
