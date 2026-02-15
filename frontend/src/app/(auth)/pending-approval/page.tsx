"use client";

import { motion } from "framer-motion";
import { Clock, LayoutGrid, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function PendingApprovalPage() {
    const { signOut } = useAuth();

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center items-center gap-2 mb-12">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">LOKAI</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background border border-border rounded-[2.5rem] shadow-2xl p-10"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Clock className="w-10 h-10 text-primary animate-pulse" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Verification Pending</h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Your profile has been submitted successfully. An administrator from your organization will review your details shortly.
                    </p>

                    <div className="p-4 rounded-2xl bg-muted/50 text-sm text-muted-foreground flex items-center gap-3 mb-8">
                        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                        Status: Awaiting Administrator Approval
                    </div>

                    <button
                        onClick={() => signOut()}
                        className="w-full py-4 border border-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-all"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </motion.div>

                <p className="mt-8 text-sm text-muted-foreground">
                    Need help? Contact your department administrator or support at support@lokai.com.np
                </p>
            </div>
        </div>
    );
}
