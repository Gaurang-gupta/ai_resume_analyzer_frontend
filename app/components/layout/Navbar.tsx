// // app/components/layout/Navbar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Avatar from "boring-avatars"
import { User } from "@supabase/auth-js";
import { LogOut, Sparkles } from "lucide-react";

const AVATAR_COLORS = ["#4f46e5", "#7c3aed", "#c026d3", "#2563eb", "#0ea5e9"];

export default function Navbar({ user }: { user: User | null }) {
    const supabase = createSupabaseBrowserClient()
    const router = useRouter();
    const pathname = usePathname()

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    async function handleLogout() {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    if (isAuthPage) return null;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

                {/* Brand - Now the Dashboard Link */}
                <Link
                    href="/"
                    className="flex items-center gap-2 group transition-transform active:scale-95"
                >
                    <div className="bg-indigo-600 p-1.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                        <Sparkles className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900">
                        Ingest<span className="text-indigo-600">AI</span>
                    </span>
                </Link>


                <div className="flex items-center gap-3 sm:gap-6">

                    <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-slate-100">
                        <Link
                            href="/skills"
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                pathname === "/skills"
                                    ? "text-indigo-600 bg-indigo-50"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                        >
                            Skill Lab
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        <div className="relative group cursor-pointer">
                            <div className="p-0.5 rounded-full border-2 border-transparent group-hover:border-indigo-100 transition-all">
                                <Avatar
                                    size={36}
                                    name={user?.email || "guest"}
                                    variant="marble"
                                    colors={AVATAR_COLORS}
                                />
                            </div>
                            <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-xl">
                                    {user?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}