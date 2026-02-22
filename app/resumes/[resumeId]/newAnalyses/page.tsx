import Card from "@/app/components/ui/Card";
import NewAnalysisForm from "@/app/components/resume/NewAnalysisForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Zap, Target, BarChart3, FileText } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        resumeId: string
    }>
}

export default async function NewAnalyses({ params }: PageProps) {
    const supabase = await createSupabaseServerClient()
    const { resumeId } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return notFound()

    const { data: resume, error: resumeError } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .eq("user_id", user.id)
        .single()

    if (!resume || resumeError) return notFound()

    const { data: analyses } = await supabase
        .from("analyses")
        .select("*")
        .eq("resume_id", resume.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    const total = analyses?.length || 0
    const completed = analyses?.filter(a => a.status === "completed") || []
    const avgScore = completed.length > 0
        ? Math.round(completed.reduce((sum, a) => sum + (a.result?.overallScore || 0), 0) / completed.length)
        : null

    return (
        <div className="max-w-6xl mx-auto space-y-10 antialiased">

            {/* ===== Action Header ===== */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                        New Analysis <Zap className="text-amber-500 fill-amber-500 w-6 h-6" />
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Target a specific job description to optimize your resume.
                    </p>
                </div>

                {/* Active Resume Pill */}
                <Link href={`/resumes/${resumeId}`} className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                        {resume.filename}
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* ===== Left Column: Stats & Context ===== */}
                <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                    <div className="grid grid-cols-1 gap-4">
                        <MetricSummary
                            label="Total Runs"
                            value={total}
                            icon={<BarChart3 className="w-5 h-5" />}
                            color="indigo"
                        />
                        <MetricSummary
                            label="Avg. Match"
                            value={avgScore !== null ? `${avgScore}%` : "-"}
                            icon={<Target className="w-5 h-5" />}
                            color="emerald"
                        />
                    </div>

                    <Card className="bg-slate-900 border-none p-8 rounded-[2rem] text-white overflow-hidden relative">
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                        <h3 className="text-lg font-bold mb-3 relative z-10">Pro Tip</h3>
                        <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                            The more specific the job description, the better the AI can identify missing keywords and experience gaps.
                        </p>
                    </Card>
                </div>

                {/* ===== Right Column: The Form ===== */}
                <div className="lg:col-span-8 order-1 lg:order-2">
                    <Card className="p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2.2rem] shadow-2xl shadow-indigo-100">
                        <div className="bg-white p-6 sm:p-10 rounded-[2rem]">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-900">Analysis Parameters</h2>
                                <p className="text-sm text-slate-500">Paste the job details below to begin the matching process.</p>
                            </div>

                            {/* We assume the NewAnalysisForm handles its own input styling */}
                            <NewAnalysisForm resumeId={resume.id} />
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}

function MetricSummary({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: 'indigo' | 'emerald' }) {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
    }

    return (
        <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl border ${colors[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="text-xl font-black text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    )
}