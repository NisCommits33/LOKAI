"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import {
    Building2,
    BookOpen,
    UserRound,
    Hash,
    CheckCircle2,
    Loader2,
    LayoutGrid
} from "lucide-react";

export default function ProfileSetupPage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [organizations, setOrganizations] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [jobLevels, setJobLevels] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        full_name: user?.user_metadata?.full_name || "",
        organization_id: "",
        department_id: "",
        job_level_id: "",
        employee_id: ""
    });

    useEffect(() => {
        // If profile already exists and is approved/pending, redirect away
        if (profile) {
            router.push("/dashboard");
        }
        loadInitialData();
    }, [profile, router]);

    const loadInitialData = async () => {
        const { data } = await supabase
            .from("organizations")
            .select("*")
            .eq("is_active", true);
        setOrganizations(data || []);
    };

    const handleOrgChange = async (orgId: string) => {
        setFormData(prev => ({ ...prev, organization_id: orgId, department_id: "", job_level_id: "" }));

        const [deptRes, levelRes] = await Promise.all([
            supabase.from("departments").select("*").eq("organization_id", orgId).eq("is_active", true),
            supabase.from("job_levels").select("*").eq("organization_id", orgId).eq("is_active", true).order("level_order")
        ]);

        setDepartments(deptRes.data || []);
        setJobLevels(levelRes.data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        const { error } = await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            full_name: formData.full_name,
            organization_id: formData.organization_id,
            department_id: formData.department_id,
            job_level_id: formData.job_level_id,
            employee_id: formData.employee_id,
            verification_status: "pending",
            is_active: false
        });

        if (!error) {
            router.push("/pending-approval");
        } else {
            console.error(error);
            alert("Failed to submit profile. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-background border border-border rounded-[2.5rem] shadow-2xl p-10"
            >
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">LOKAI</span>
                </div>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                    <p className="text-muted-foreground font-medium">Please provide your employment details to access the platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <UserRound className="w-4 h-4 text-primary" /> Full Name
                            </label>
                            <input
                                required
                                value={formData.full_name}
                                onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                placeholder="As per official documents"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" /> Organization
                            </label>
                            <select
                                required
                                value={formData.organization_id}
                                onChange={e => handleOrgChange(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none bg-white"
                            >
                                <option value="">Select your organization</option>
                                {organizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" /> Department
                                </label>
                                <select
                                    required
                                    disabled={!formData.organization_id}
                                    value={formData.department_id}
                                    onChange={e => setFormData(prev => ({ ...prev, department_id: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:bg-muted/50"
                                >
                                    <option value="">Select department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-primary" /> Employee ID
                                </label>
                                <input
                                    required
                                    value={formData.employee_id}
                                    onChange={e => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="e.g. NOC-2024-001"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" /> Job Level
                            </label>
                            <select
                                required
                                disabled={!formData.organization_id}
                                value={formData.job_level_id}
                                onChange={e => setFormData(prev => ({ ...prev, job_level_id: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:bg-muted/50"
                            >
                                <option value="">Select job level</option>
                                {jobLevels.map(level => (
                                    <option key={level.id} value={level.id}>{level.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100"
                    >
                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Request Verification"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
