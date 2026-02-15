"use client";

import { motion } from "framer-motion";
import LoginButton from "@/components/auth/LoginButton";
import { LayoutGrid, CheckCircle2 } from "lucide-react";

const features = [
    "AI-Powered mock questions",
    "Tailored for CAAN, NOC & NT",
    "Real-time analytics & tracking",
    "Bilingual support (English/Nepali)"
];

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Brand Section */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-white mb-12">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <LayoutGrid className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-3xl tracking-tight">LOKAI</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            Master Your Government <br /> Exam with Ease.
                        </h1>
                        <p className="text-white/80 text-xl max-w-md mb-8">
                            Join thousands of government employees preparing for career growth with our AI-powered learning platform.
                        </p>

                        <div className="grid gap-4">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/90">
                                    <CheckCircle2 className="w-5 h-5 text-accent" />
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full -ml-48 -mb-48 blur-3xl" />
            </div>

            {/* Login Section */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-12">
                        <div className="bg-primary p-2 rounded-lg">
                            <LayoutGrid className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl">LOKAI</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
                        <p className="text-muted-foreground">Please sign in with your government associated Google account to continue.</p>
                    </div>

                    <LoginButton />

                    <div className="mt-8 pt-8 border-t border-border">
                        <p className="text-xs text-center text-muted-foreground leading-relaxed">
                            By continuing, you confirm that you are a government employee.
                            Unauthorized access is strictly prohibited.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
