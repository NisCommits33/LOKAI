"use client";

import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-muted/20">
                    {children}
                </main>
            </div>
        </div>
    );
}
