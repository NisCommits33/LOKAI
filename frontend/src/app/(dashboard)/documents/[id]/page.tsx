"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Zap,
    BookOpen,
    Clock,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Award
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DocumentDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        loadDocument();
    }, [id]);

    const loadDocument = async () => {
        const { data } = await supabase
            .from("documents")
            .select("*, organizations(name)")
            .eq("id", id)
            .single();

        setDocument(data);
        setLoading(false);
    };

    if (loading) return <div className="p-20 text-center">Loading...</div>;
    if (!document) return <div className="p-20 text-center">Document not found.</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-10 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Documents
            </button>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left Side: Summary & Content */}
                <div className="lg:col-span-2 space-y-12">
                    <header>
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
                            <BookOpen className="w-4 h-4" /> Study Resource
                        </div>
                        <h1 className="text-4xl font-extrabold mb-6 leading-tight">{document.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" /> Added {new Date(document.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Award className="w-4 h-4" /> {document.organizations?.name}
                            </div>
                        </div>
                    </header>

                    {/* AI Summary Section */}
                    <section className="p-8 rounded-[2.5rem] bg-background border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">AI Knowledge Summary</h2>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            {document.ai_summary ? (
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    {document.ai_summary}
                                </p>
                            ) : (
                                <div className="p-6 rounded-2xl bg-muted/50 border border-border text-center">
                                    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                    <p className="font-bold text-muted-foreground">AI processing in progress...</p>
                                    <p className="text-xs text-muted-foreground mt-1">Check back in a few minutes.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Key Points Section */}
                    {document.key_points && Array.isArray(document.key_points) && document.key_points.length > 0 && (
                        <section className="space-y-6">
                            <h3 className="text-2xl font-bold">Strategic Key Points</h3>
                            <div className="grid gap-4">
                                {document.key_points.map((point: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 rounded-2xl bg-white border border-border flex gap-4 hover:border-primary/20 transition-all hover:shadow-md"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="text-muted-foreground font-medium leading-relaxed italic">
                                            "{point}"
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Side: Actions & Meta */}
                <div className="space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl sticky top-28">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">Exam Readiness</h3>
                            <p className="text-slate-400 text-sm">Prepare yourself for the departmental quiz.</p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Question Bank</span>
                                <span>120 MCQs</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Difficulty</span>
                                <span className="text-accent">Medium</span>
                            </div>
                        </div>

                        <Link
                            href={`/quiz/${document.id}`}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/40 group"
                        >
                            Start Practice Quiz
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="mt-8 pt-8 border-t border-white/10 text-xs text-slate-500 font-medium">
                            Quiz results will contribute to your department performance analytics.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
