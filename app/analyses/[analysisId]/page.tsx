import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link"
import {AnalysisResult} from "@/types"
import Card from "@/app/components/ui/Card"
import StatCard from "@/app/components/dashboard/StatCard";
import {SupabaseClient} from "@supabase/supabase-js";
import SkillBadge from "@/app/components/SkillBadge";
import ScoreBadge from "@/app/components/ScoreBadge";
import ScoreGauge from "@/app/components/ScoreGauge";

interface PageProps {
    params: Promise<{
        analysisId: string
    }>
}

interface ResumeData {
    id: string,
    user_id : string,
    filename: string,
    storage_path: string,
    created_at: string,
}

async function resume_data(resumeId: string, supabase: SupabaseClient, userId:string) {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .eq("user_id", userId)
        .single();

    return {
        resumeData: data as ResumeData,
        resumeError: error
    }
}

export default async function AnalysesDetailPage({ params }: PageProps) {
    const { analysisId } = await params;
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <div className="p-8">Not authenticated</div>;
    }

    const { data: analysis, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .eq("user_id", user.id)
        .single();

    const resumeId = analysis.resume_id as string;
    const { resumeData, resumeError } = await resume_data(resumeId, supabase, user.id)

    if (error || !analysis || resumeError) {
        notFound();
    }

    const result = analysis.result as AnalysisResult;
    return (
        // <div className="max-w-5xl mx-auto space-y-10">
        //     {/* ===== Header ===== */}
        //     <div className="space-y-3">
        //         <h1 className="text-3xl font-bold">Analysis Result</h1>
        //         <p className="text-gray-600">
        //             Job Title: <span className="font-medium">{analysis.job_title}</span>
        //         </p>
        //         <p className="text-gray-600">
        //             Resume: <Link className="text-indigo-600" href={`/resumes/${resumeData.id}`}><span className="font-medium">{resumeData.filename}</span></Link>
        //         </p>
        //     </div>
        //
        //     {analysis.status !== "completed" ?
        //         // <div className="p-8">Analysis not completed yet.</div>
        //         <>
        //             <div className="flex items-center justify-center">
        //                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        //             </div>
        //             <div className="text-center">
        //                 Analysing...
        //             </div>
        //         </>
        //         :
        //         <>
        //     {/* ===== Overall Score ===== */}
        //     <Card>
        //         <div className="space-y-4">
        //             <h2 className="text-xl font-semibold">Resume Review</h2>
        //             <ScoreGauge score={result.overallScore}/>
        //             <ScoreBadge score={result.overallScore}/>
        //
        //             <p className="text-gray-700">{result.summary}</p>
        //         </div>
        //     </Card>
        //
        //     {/* ===== Breakdown ===== */}
        //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        //         <StatCard
        //             label="Skills Match"
        //             value={`${result.breakdown.skillsMatch}%`}
        //         />
        //         <StatCard
        //             label="Experience Match"
        //             value={`${result.breakdown.experienceMatch}%`}
        //         />
        //         <StatCard
        //             label="Education Match"
        //             value={`${result.breakdown.educationMatch}%`}
        //         />
        //     </div>
        //
        //     {/* ===== Skills Section ===== */}
        //     <Card>
        //         <div className="space-y-6">
        //             <h2 className="text-xl font-semibold">Skills Analysis</h2>
        //
        //             <div>
        //                 <h3 className="font-medium mb-2">Matched Skills</h3>
        //                 <div className="flex flex-wrap gap-2">
        //                     {result.skills.matched.map((skill, idx) => (
        //                         <SkillBadge key={idx} variant="matched" label={skill} />
        //                     ))}
        //                 </div>
        //             </div>
        //
        //             <div>
        //                 <h3 className="font-medium mb-2">Missing Skills</h3>
        //                 <div className="flex flex-wrap gap-2">
        //                     {result.skills.missing.map((skill, idx) => (
        //                         <SkillBadge key={idx} variant="missing" label={skill}/>
        //                     ))}
        //                 </div>
        //             </div>
        //         </div>
        //     </Card>
        //
        //     {/* ===== Experience Section ===== */}
        //     <Card>
        //         <div className="space-y-4">
        //             <h2 className="text-xl font-semibold">Experience Evaluation</h2>
        //
        //             <div className="space-y-2">
        //                 <p>
        //                     <span className="font-medium">Required Level:</span>{" "}
        //                     {result.experience.requiredLevel}
        //                 </p>
        //                 <p>
        //                     <span className="font-medium">Inferred Level:</span>{" "}
        //                     {result.experience.inferredLevel}
        //                 </p>
        //
        //                 {result.experience.gapReason && (
        //                     <div className="text-sm text-red-600">
        //                         {result.experience.gapReason}
        //                     </div>
        //                 )}
        //             </div>
        //         </div>
        //     </Card>
        //
        //     {/* ===== Education Section ===== */}
        //     <Card>
        //         <div className="space-y-4">
        //             <h2 className="text-xl font-semibold">Education Evaluation</h2>
        //             {result.education.notes && (
        //                 <p className="text-gray-700 text-sm">
        //                     {result.education.notes}
        //                 </p>
        //             )}
        //         </div>
        //     </Card>
        //     {/* ========= Strengths ========= */}
        //     <Card className="bg-green-50">
        //         <div className="space-y-4">
        //             <h2 className="text-xl font-semibold">Strengths</h2>
        //
        //             <ul className="list-disc list-inside space-y-2 text-gray-800">
        //                 {result.strengths.map((rec, idx) => (
        //                     <li key={idx}>{rec}</li>
        //                 ))}
        //             </ul>
        //         </div>
        //     </Card>
        //
        //     {/* ===== Recommendations ===== */}
        //     <Card>
        //         <div className="space-y-4">
        //             <h2 className="text-xl font-semibold flex">
        //                 Recommendations
        //             </h2>
        //
        //             <ul className="list-disc list-inside space-y-2 text-gray-800">
        //                 {result.recommendations.map((rec, idx) => (
        //                     <li key={idx}>{rec}</li>
        //                 ))}
        //             </ul>
        //         </div>
        //     </Card>
        //     </>
        //     }
        // </div>
        <div className="max-w-6xl mx-auto px-4 py-10 antialiased text-slate-900">
            {/* ===== Header Area ===== */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                        Analysis Report
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        {analysis.job_title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <p className="flex items-center gap-1">
                            <span className="font-semibold text-slate-700">Resume:</span>
                            <Link className="hover:text-indigo-600 transition-colors underline decoration-slate-300 underline-offset-4" href={`/resumes/${resumeData.id}`}>
                                {resumeData.filename}
                            </Link>
                        </p>
                        <span>•</span>
                        <p>{new Date(analysis.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </header>

            {analysis.status !== "completed" ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium text-slate-600 animate-pulse">Processing analysis...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ===== Left Column: Overview & Scoring ===== */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden shadow-xl">
                            <div className="bg-white p-8 rounded-[22px] flex flex-col items-center text-center space-y-6">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Match Score</h2>
                                <div className="relative flex items-center justify-center scale-110">
                                    <ScoreGauge score={result.overallScore} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="sr-only">{result.overallScore}%</span>
                                    </div>
                                </div>
                                <div className="w-full pt-4 border-t border-slate-100">
                                    <p className="text-slate-600 leading-relaxed italic text-sm">
                                        &ldquo;{result.summary}&rdquo;
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: "Skills Match", value: result.breakdown.skillsMatch, color: "bg-blue-500" },
                                { label: "Experience Match", value: result.breakdown.experienceMatch, color: "bg-emerald-500" },
                                { label: "Education Match", value: result.breakdown.educationMatch, color: "bg-amber-500" },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase">{stat.label}</p>
                                        <p className="text-xl font-bold text-slate-900">{stat.value}%</p>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className={`${stat.color} h-full transition-all duration-1000`} style={{ width: `${stat.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== Right Column: Detailed Breakdown ===== */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Skills Analysis */}
                        <Card className="p-8 border-slate-200 shadow-sm rounded-3xl">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">Skills Deep Dive</h2>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            ✓ Matched Expertise
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.skills.matched.map((skill, idx) => (
                                                <SkillBadge key={idx} variant="matched" label={skill} className="px-4 py-2 text-sm shadow-sm" />
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            ⚠ Growth Areas
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.skills.missing.map((skill, idx) => (
                                                <SkillBadge key={idx} variant="missing" label={skill} className="px-4 py-2 text-sm border-dashed" />
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </Card>

                        {/* Experience & Education */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Experience Match</h3>
                                <div className="space-y-4">
                                    <div className="flex-col justify-between items-center text-sm p-3 bg-white rounded-xl border border-slate-100">
                                        <div className="text-slate-500">Required</div>
                                        <div className="font-bold text-slate-700">{result.experience.requiredLevel}</div>
                                    </div>
                                    <div className="flex-col justify-between items-center text-sm p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                        <div className="text-indigo-600 font-medium">Inferred</div>
                                        <div className="font-bold text-indigo-700">{result.experience.inferredLevel}</div>
                                    </div>
                                    {result.experience.gapReason && (
                                        <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-xl leading-relaxed">
                                            <span className="font-bold block mb-1">Gap Analysis:</span>
                                            {result.experience.gapReason}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-6 border-slate-200 shadow-sm rounded-3xl bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Education Check</h3>
                                {result.education.notes ? (
                                    <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-xl border border-slate-100 min-h-[120px]">
                                        {result.education.notes}
                                    </p>
                                ) : (
                                    <div className="flex items-center justify-center min-h-[120px] text-slate-400 italic text-sm">
                                        No specific education requirements noted.
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Strengths & Recommendations */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8">
                                <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                    Key Strengths
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {result.strengths.map((rec, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-emerald-800 bg-white/60 p-3 rounded-xl border border-emerald-100/50">
                                            <span className="text-emerald-500 font-bold leading-none">✦</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-slate-900 text-white">
                                <h2 className="text-xl font-bold mb-6 text-indigo-300 flex items-center gap-2">
                                    Optimization Strategy
                                </h2>
                                <ul className="space-y-4">
                                    {result.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex gap-4 text-sm text-slate-300 group">
                                            <span className="flex-none h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-indigo-400 group-hover:border-indigo-500 transition-colors">
                                                {idx + 1}
                                            </span>
                                            <span className="leading-relaxed">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

