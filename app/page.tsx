import { createSupabaseServerClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import ResumeList from "@/app/components/dashboard/ResumeList";
import {FrontEndAnalyzeData, FrontEndResumeData} from "@/types";
import StatCard from "@/app/components/dashboard/StatCard";
import Link from "next/link";
import { Plus } from "lucide-react"
function Stats({ resumes, analyses }: { resumes: FrontEndResumeData[], analyses: FrontEndAnalyzeData[] }) {
    const totalResumes = resumes.length;
    const completedAnalyses = analyses.filter((analyse) =>
        analyse.status === "completed"
    )

    const totalAnalyses = resumes.reduce(
        (acc, r) => acc + (r.analyses?.length ?? 0),
        0
    );

    const avgScore =
        resumes
            .flatMap((r) => r.analyses ?? [])
            .reduce((acc, a) => acc + (a.result?.overallScore ?? 0), 0) /
        (completedAnalyses.length || 1);

    return (
        <div className="max-sm:grid-cols-1 sm:grid-cols-2 grid gap-4 mb-10">
            <StatCard label="Resumes" value={totalResumes} />
            <StatCard label="Analyses" value={totalAnalyses} />
            <StatCard label="Completed Analyses" value={completedAnalyses.length} />
            <StatCard label="Avg Score" value={Math.round(avgScore)} />
        </div>
    );
}


// app/dashboard/page.tsx

export default async function DashboardPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: resumes, error } = await supabase
        .from("resumes")
        .select(`
            id, filename, created_at,
            analyses ( id, result, created_at, status )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const { data: analyses } = await supabase
        .from("analyses")
        .select(`id, user_id, resume_id, job_title, status, created_at, job_description`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return <div className="p-10 text-center text-red-500">Failed to load dashboard.</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10 antialiased">
            <Header />
            <Stats resumes={resumes ?? []} analyses={analyses ?? []}/>

            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">Your Resumes</h2>
                    <span className="h-px flex-1 bg-slate-100" />
                </div>
                <ResumeList resumes={resumes ?? []} analyses={analyses ?? []}/>
            </div>
        </div>
    )
}

function Header() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-slate-100">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium">Welcome back. Here is your career progress at a glance.</p>
            </div>

            <Link
                href="/upload"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95 group"
            >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Upload Resume
            </Link>
        </div>
    );
}