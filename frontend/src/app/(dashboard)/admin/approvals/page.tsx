"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    CheckCircle2,
    XCircle,
    UserCheck,
    Search,
    Filter,
    MoreVertical,
    Building2,
    Calendar,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApprovalsPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("users")
            .select(`
                *,
                organizations (name),
                departments (name),
                job_levels (name)
            `)
            .eq("verification_status", "pending")
            .order("created_at", { ascending: false });

        setUsers(data || []);
        setLoading(false);
    };

    const handleAction = async (userId: string, status: "approved" | "rejected") => {
        setActioningId(userId);
        const { error } = await supabase
            .from("users")
            .update({
                verification_status: status,
                is_active: status === "approved",
                approved_at: status === "approved" ? new Date().toISOString() : null
            })
            .eq("id", userId);

        if (!error) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            alert("Action failed. Check permissions.");
        }
        setActioningId(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Pending Approvals</h1>
                    <p className="text-muted-foreground font-medium">Review and verify new employee registrations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 bg-muted/50 rounded-xl border border-border outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-background border border-border rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User Information</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Employment Detail</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Requested On</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground font-medium">
                                    No pending approvals found.
                                </td>
                            </tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/10 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            {user.full_name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground">{user.full_name}</div>
                                            <div className="text-sm text-muted-foreground font-medium">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-medium">
                                    <div className="flex items-center gap-1.5 text-foreground mb-1">
                                        <Building2 className="w-3.5 h-3.5 text-primary" />
                                        {user.organizations?.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex gap-2">
                                        <span>{user.departments?.name}</span>
                                        <span>•</span>
                                        <span>{user.job_levels?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            disabled={!!actioningId}
                                            onClick={() => handleAction(user.id, "approved")}
                                            className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                        >
                                            {actioningId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Approve
                                        </button>
                                        <button
                                            disabled={!!actioningId}
                                            onClick={() => handleAction(user.id, "rejected")}
                                            className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
