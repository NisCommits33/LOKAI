"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full glass p-8 rounded-[2rem] text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
                <p className="text-muted-foreground mb-8">
                    Something went wrong during the sign-in process. This could be due to an expired link or a connection issue.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
