"use client";

import {
    LayoutDashboard,
    FileText,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Documents", href: "/documents" },
    { icon: BookOpen, label: "Practice Quizzes", href: "/practice" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

const adminItems = [
    { icon: ShieldCheck, label: "Approvals", href: "/admin/approvals" },
    { icon: Settings, label: "Management", href: "/admin/users" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-border h-[calc(100vh-64px)] hidden lg:flex flex-col p-4 gap-8 bg-background/50">
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-3 mb-2">
                    Main Menu
                </span>
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium group",
                            pathname === item.href
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", pathname === item.href ? "" : "group-hover:scale-110 transition-transform")} />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-3 mb-2">
                    Administration
                </span>
                {adminItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium group",
                            pathname === item.href
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", pathname === item.href ? "" : "group-hover:scale-110 transition-transform")} />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all font-medium">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
