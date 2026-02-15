"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import {
    FileText,
    Upload,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Zap,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DocumentsPage() {
    const { profile } = useAuth();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        loadDocuments();
    }, [profile]);

    const loadDocuments = async () => {
        if (!profile) return;
        setLoading(true);

        let query = supabase
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false });

        // If not super_admin, filter by organization
        if (profile.role !== 'super_admin') {
            query = query.eq("organization_id", profile.organization_id);
        }

        const { data } = await query;
        setDocuments(data || []);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
                    <p className="text-muted-foreground font-medium">Browse documents and policies from your organization.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            placeholder="Search documents..."
                            className="pl-10 pr-4 py-2 bg-muted/50 rounded-xl border border-border outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm w-64"
                        />
                    </div>
                    {(profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'org_admin') && (
                        <Link
                            href="/admin/documents/upload"
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Upload className="w-4 h-4" />
                            Upload PDF
                        </Link>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-[2rem] bg-muted/20 animate-pulse border border-border"></div>
                    ))}
                </div>
            ) : documents.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-muted/10">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">No documents found</h3>
                    <p className="text-muted-foreground">Your organization hasn't uploaded any study materials yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                    ))}
                </div>
            )}
        </div>
    );
}

function DocumentCard({ doc }: { doc: any }) {
    const statusIcons: Record<string, { icon: any, color: string, bg: string, animate?: string }> = {
        pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        processing: { icon: Loader2, color: "text-primary", bg: "bg-primary/5", animate: "animate-spin" },
        completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        failed: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" }
    };

    const status = (doc.processing_status || 'pending') as keyof typeof statusIcons;
    const StatusIcon = statusIcons[status].icon;

    return (
        <div className="group rounded-[2rem] bg-background border border-border hover:border-primary/20 hover:shadow-xl transition-all overflow-hidden flex flex-col">
            <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className={cn("px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider", statusIcons[status].bg, statusIcons[status].color)}>
                        <StatusIcon className={cn("w-3 h-3", statusIcons[status].animate || "")} />
                        {status}
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {doc.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                    {doc.policy_tag && <span className="px-2 py-1 bg-muted rounded-md text-[10px] font-bold text-muted-foreground">{doc.policy_tag}</span>}
                    {doc.chapter_tag && <span className="px-2 py-1 bg-muted rounded-md text-[10px] font-bold text-muted-foreground">{doc.chapter_tag}</span>}
                </div>
            </div>

            <div className="px-8 pb-8 pt-0 mt-auto">
                <Link
                    href={`/documents/${doc.id}`}
                    className={cn(
                        "w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                        status === 'completed'
                            ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                >
                    <Zap className="w-4 h-4 fill-current" />
                    Start Learning
                </Link>
            </div>
        </div>
    );
}
