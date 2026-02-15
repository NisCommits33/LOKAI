"use client";

import { LayoutGrid, Bell, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border glass px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-lg">
                    <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">
                    LOKAI
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-muted rounded-full transition-colors relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </button>
                <div className="h-8 w-[1px] bg-border mx-1"></div>
                <button className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium hidden md:block">Account</span>
                </button>
            </div>
        </header>
    );
}
