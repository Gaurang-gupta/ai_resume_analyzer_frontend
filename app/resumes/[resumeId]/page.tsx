// // app/resumes/[resumeId]/page.tsx
//
// import { notFound } from "next/navigation"
// import { createSupabaseServerClient } from "@/lib/supabase/server"
// import AnalysisGraph from "@/app/components/AnalysisGraph";
// import { FrontEndFullAnalzeRow } from "@/types";
// import Card from "@/app/components/ui/Card"; // Assuming same Card component
//
// interface PageProps {
//     params: Promise<{
//         resumeId: string
//     }>
// }
//
// export default async function ResumeWorkspace({ params }: PageProps) {
//     const supabase = await createSupabaseServerClient()
//     const { resumeId } = await params
//
//     const {
//         data: { user },
//     } = await supabase.auth.getUser()
//
//     if (!user) {
//         return notFound()
//     }
//
//     // 1️⃣ Fetch resume (ownership check)
//     const { data: resume, error: resumeError } = await supabase
//         .from("resumes")
//         .select("*")
//         .eq("id", resumeId)
//         .eq("user_id", user.id)
//         .single()
//
//     if (!resume || resumeError) {
//         return notFound()
//     }
//
//     // Fetch all analyses for particular resume
//     const { data: analyses, error: analysesError } = await supabase
//         .from("analyses")
//         .select("*")
//         .eq("user_id", user.id)
//         .eq("resume_id", resume.id)
//         .order('created_at', { ascending: true });
//
//     if (analysesError) return notFound()
//
//     const analysesTypecasted = analyses as FrontEndFullAnalzeRow[]
//     const totalAnalyses = analysesTypecasted.length;
//
//     return (
//         <div className="max-w-6xl mx-auto px-4 py-10 antialiased text-slate-900">
//             <main className="space-y-8">
//                 {/* ===== Trends Section ===== */}
//                 <Card className="p-8 border-slate-200 shadow-xl rounded-3xl bg-white relative overflow-hidden">
//                     {/* Subtle Background Glow */}
//                     <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
//
//                     <div className="relative">
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-bold text-slate-800">Performance Trends</h2>
//                             <p className="text-slate-500 text-sm">Visualize your resume&apos;s evolution and skill alignment over time.</p>
//                         </div>
//
//                         <div className="min-h-[400px] w-full bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
//                             {totalAnalyses > 0 ? (
//                                 <AnalysisGraph analyses={analysesTypecasted}/>
//                             ) : (
//                                 <div className="h-[350px] flex flex-col items-center justify-center text-slate-400">
//                                     <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
//                                     </svg>
//                                     <p>No analysis data available yet.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </Card>
//
//                 {/* ===== Help/Empty State Footer ===== */}
//                 {totalAnalyses === 1 && (
//                     <div className="bg-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
//                         <div className="space-y-1">
//                             <h4 className="font-bold">Unlock Trend Analysis</h4>
//                             <p className="text-indigo-100 text-sm">Run another analysis against a different job description to see how your resume adapts.</p>
//                         </div>
//                         <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
//                             New Analysis
//                         </button>
//                     </div>
//                 )}
//             </main>
//         </div>
//     )
// }

// app/resumes/[resumeId]/page.tsx

import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import AnalysisGraph from "@/app/components/AnalysisGraph";
import { FrontEndFullAnalzeRow } from "@/types";
import Card from "@/app/components/ui/Card";
import { TrendingUp, Award, Target, PlusCircle } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        resumeId: string
    }>
}

export default async function ResumeWorkspace({ params }: PageProps) {
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

    const { data: analyses, error: analysesError } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .eq("resume_id", resume.id)
        .order('created_at', { ascending: true });

    if (analysesError) return notFound()

    const analysesTypecasted = analyses as FrontEndFullAnalzeRow[]
    const totalAnalyses = analysesTypecasted.length;

    // Calculate simple stats for the top row
    const latestScore = totalAnalyses > 0 ? analysesTypecasted[totalAnalyses - 1].result?.overallScore : 0;
    const avgScore = totalAnalyses > 0
        ? Math.round(analysesTypecasted.reduce((acc, curr) => acc + (curr.result?.overallScore || 0), 0) / totalAnalyses)
        : 0;

    return (
        <div className="max-w-6xl mx-auto sm:px-6 py-8 lg:py-12 antialiased text-slate-900">
            <main className="space-y-6 sm:space-y-8">

                {/* ===== Quick Stats Grid ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatBox
                        label="Latest Score"
                        value={`${latestScore}%`}
                        icon={<Target className="w-5 h-5 text-indigo-600" />}
                        description="From your last analysis"
                    />
                    <StatBox
                        label="Average Match"
                        value={`${avgScore}%`}
                        icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                        description="Across all job roles"
                    />
                    <StatBox
                        label="Total Reports"
                        value={totalAnalyses.toString()}
                        icon={<Award className="w-5 h-5 text-amber-600" />}
                        description="Analyses generated"
                    />
                </div>

                {/* ===== Main Content Area ===== */}
                <div className="grid grid-cols-1 gap-8">
                    <Card className="p-0 border-slate-200 shadow-2xl rounded-[2rem] bg-white overflow-hidden group">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-50/50 to-transparent blur-3xl -z-10 group-hover:opacity-100 transition-opacity opacity-50" />

                        <div className="p-6 sm:p-10">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                                        Performance Trends
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        Visualizing your resume&apos;s adaptability over time.
                                    </p>
                                </div>

                                {totalAnalyses > 0 && (
                                    <Link href={`/resumes/${resumeId}/newAnalyses`} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                                        <PlusCircle className="w-4 h-4" />
                                        New Scan
                                    </Link>
                                )}
                            </div>

                            <div className="relative min-h-[450px] w-full bg-slate-50/30 rounded-[1.5rem] p-4 sm:p-8 border border-slate-100 backdrop-blur-sm">
                                {totalAnalyses > 0 ? (
                                    <AnalysisGraph analyses={analysesTypecasted}/>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                            <TrendingUp className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-slate-600">No Data Points Yet</p>
                                            <p className="text-sm">Run your first analysis to see trends appear.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* ===== Call to Action (Appears after 1st analysis) ===== */}
                    {totalAnalyses === 1 && (
                        <div className="relative group overflow-hidden bg-slate-900 rounded-[2rem] p-1 shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-slate-900 rounded-[1.9rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left space-y-2">
                                    <h4 className="text-xl font-bold text-white">Unlock Progress Tracking</h4>
                                    <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                                        Compare your resume against different job descriptions to build a more versatile, high-impact profile.
                                    </p>
                                </div>
                                <button className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95">
                                    Run Second Scan
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function StatBox({ label, value, icon, description }: { label: string, value: string, icon: React.ReactNode, description: string }) {
    return (
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 hover:border-indigo-100 transition-colors">
            <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            </div>
            <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                <p className="text-[11px] font-medium text-slate-500">{description}</p>
            </div>
        </Card>
    );
}