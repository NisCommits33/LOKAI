"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  GraduationCap,
  LayoutGrid
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-6 md:px-12 glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            LOKAI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/login" className="bg-primary text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">Get Started</Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now Live for CAAN, NOC & NT
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8">
                The Smartest Way to <br />
                <span className="text-primary">Grow Your Career</span> <br />
                in Government.
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                AI-powered exam preparation specifically tailored for Nepal government enterprise employees. Practice with confidence, track your growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                  Join the platform <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 bg-muted text-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all border border-border">
                  View Demo
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border shadow-2xl p-8 transform rotate-2">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-4 w-32 bg-muted rounded-full"></div>
                  <div className="h-8 w-8 bg-primary/20 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/30">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/2 bg-muted rounded-full"></div>
                        <div className="h-2 w-full bg-muted/50 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Built for Performance</h2>
            <p className="text-muted-foreground text-lg">Every feature is designed to accelerate your learning experience.</p>
          </div>
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={GraduationCap}
              title="AI Exam Sim"
              description="Generated questions based on your specific document patterns."
            />
            <FeatureCard
              icon={Zap}
              title="Quick Summaries"
              description="Complex acts and regulations summarized into key actionable points."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Platform"
              description="Official government SSO integration and verified employee profiles."
            />
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-medium">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <LayoutGrid className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-foreground">LOKAI</span>
        </div>
        <p>© 2026 LOKAI. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-background border border-border hover:border-primary/30 transition-all hover:shadow-xl group">
      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
