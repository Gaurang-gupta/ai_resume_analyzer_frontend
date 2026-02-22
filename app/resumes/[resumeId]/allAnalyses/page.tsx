// import Card from "@/app/components/ui/Card"
// import Link from "next/link";
// import StatusBadge from "@/app/components/ui/StatusBadge";
// import {createSupabaseServerClient} from "@/lib/supabase/server";
// import {notFound} from "next/navigation";
// interface PageProps {
//     params: Promise<{
//         resumeId: string
//     }>
// }
// export default async function AllAnalyses({ params }: PageProps) {
//     const supabase = await createSupabaseServerClient()
//     const { resumeId } = await params
//     const {
//         data: { user },
//     } = await supabase.auth.getUser()
//     if (!user) {
//         return notFound()
//     }
//     // 1️⃣ Fetch resume (ownership check)
//     const { data: resume, error: resumeError } = await supabase
//         .from("resumes")
//         .select("*")
//         .eq("id", resumeId)
//         .eq("user_id", user.id)
//         .single()
//
//     const { data: analyses } = await supabase
//         .from("analyses")
//         .select("*")
//         .eq("resume_id", resumeId)
//         .eq("user_id", user.id)
//         .order("created_at", { ascending: false })
//     if(resumeError) {
//         return notFound()
//     }
//     return (
//         <>
//             {/* Analysis History */}
//             <Card>
//                 <h2 className="text-lg font-semibold mb-4">
//                     Analysis History
//                 </h2>
//
//                 {analyses && analyses.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm text-left">
//                             <thead className="border-b">
//                             <tr>
//                                 <th className="py-2">Job Title</th>
//                                 <th className="py-2">Experience</th>
//                                 <th className="py-2">Status</th>
//                                 <th className="py-2">Score</th>
//                                 <th className="py-2">Created</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {analyses.map((analysis) => (
//                                 <tr
//                                     key={analysis.id}
//                                     className="border-b hover:bg-gray-50 cursor-pointer"
//                                 >
//                                     <td className="py-3">
//                                         <Link
//                                             href={`/analyses/${analysis.id}`}
//                                             className="text-indigo-600 hover:underline"
//                                         >
//                                             {analysis.job_title}
//                                         </Link>
//                                     </td>
//
//                                     <td className="py-3">
//                                         {analysis.experience_level}
//                                         {analysis.experience_level == "0-2" || analysis.experience_level == "3-5" ||
//                                         analysis.experience_level == "6+"
//                                             ? " years" : ""
//                                         }
//                                     </td>
//
//                                     <td className="py-3">
//                                         <StatusBadge
//                                             status={analysis.status}
//                                         />
//                                     </td>
//
//                                     <td className="py-3">
//                                         {analysis.status === "completed" &&
//                                         analysis.result
//                                             ? `${analysis.result.overallScore}%`
//                                             : "-"}
//                                     </td>
//
//                                     <td className="py-3 text-gray-500">
//                                         {new Date(
//                                             analysis.created_at
//                                         ).toLocaleDateString()}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <p className="text-sm text-gray-500">
//                         No analyses yet. Run your first analysis above.
//                     </p>
//                 )}
//             </Card>
//         </>
//     )
// }

// app/resumes/[resumeId]/allAnalyses/page.tsx

import Card from "@/app/components/ui/Card"
import Link from "next/link";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, Briefcase, ChevronRight, FileBarChart } from "lucide-react";

interface PageProps {
    params: Promise<{
        resumeId: string
    }>
}

export default async function AllAnalyses({ params }: PageProps) {
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

    const { data: analyses } = await supabase
        .from("analyses")
        .select("*")
        .eq("resume_id", resumeId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (resumeError) return notFound()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <FileBarChart className="text-indigo-600 w-6 h-6" />
                    Analysis History
                </h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                    {analyses?.length || 0} Total
                </span>
            </div>

            <Card className="p-0 overflow-hidden border-slate-200 shadow-xl rounded-[2rem] bg-white">
                {analyses && analyses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Job Title</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Level</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Score</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Created</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {analyses.map((analysis) => (
                                <tr
                                    key={analysis.id}
                                    className="group hover:bg-indigo-50/30 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <Link href={`/analyses/${analysis.id}`} className="block">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white border border-slate-100 rounded-lg group-hover:border-indigo-200 transition-colors">
                                                    <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                                </div>
                                                <span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors truncate max-w-[180px] sm:max-w-xs">
                                                        {analysis.job_title}
                                                    </span>
                                            </div>
                                        </Link>
                                    </td>

                                    <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                {analysis.experience_level}
                                                {['0-2', '3-5', '6+'].includes(analysis.experience_level) ? " yrs" : ""}
                                            </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <StatusBadge status={analysis.status} />
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            {analysis.status === "completed" && analysis.result ? (
                                                <div className="flex flex-col items-center">
                                                        <span className={`text-sm font-black ${
                                                            analysis.result.overallScore >= 80 ? 'text-emerald-600' :
                                                                analysis.result.overallScore >= 60 ? 'text-amber-600' : 'text-slate-600'
                                                        }`}>
                                                            {analysis.result.overallScore}%
                                                        </span>
                                                    <div className="w-8 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className={`h-full ${
                                                                analysis.result.overallScore >= 80 ? 'bg-emerald-500' :
                                                                    analysis.result.overallScore >= 60 ? 'bg-amber-500' : 'bg-slate-400'
                                                            }`}
                                                            style={{ width: `${analysis.result.overallScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(analysis.created_at).toLocaleDateString()}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/analyses/${analysis.id}`}>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-all transform group-hover:translate-x-1" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                            <FileBarChart className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-600 font-bold">No analyses yet</p>
                        <p className="text-sm text-slate-400 mt-1">Run your first analysis to see results here.</p>
                    </div>
                )}
            </Card>
        </div>
    )
}