import { createSupabaseServerClient } from "@/lib/supabase/server";
import {notFound, redirect} from "next/navigation";
import Card from "@/app/components/ui/Card";
import {Trophy, Lightbulb, Target, TrendingUp, Sparkles, AlertCircle} from "lucide-react";
import Link from "next/link";
import {AnalysisResult} from "@/types";

interface analysesType {
    id: string;
    status: string;
    result: AnalysisResult
}

export default async function SkillLabPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch only completed analyses to get accurate skill data
    const { data: analyses } = await supabase
        .from("analyses")
        .select("result, job_title")
        .eq("user_id", user.id)
        .eq("status", "completed");

    const { data: resumes, error: resumesError } = await supabase
        .from("resumes")
        .select(`
        id,
        filename,
        analyses (
            id,
            status,
            result
        )
    `).eq("user_id", user.id);

    if(resumesError) {
        return notFound()
    }

    // Aggregate Missing Skills
    const skillMap: Record<string, { count: number; jobs: string[] }> = {};

    analyses?.forEach(a => {
        const missing = a.result?.skills?.missing || [];
        missing.forEach((skill: string) => {
            const normalized = skill.toLowerCase();
            if (!skillMap[normalized]) {
                skillMap[normalized] = { count: 0, jobs: [] };
            }
            skillMap[normalized].count += 1;
            if (!skillMap[normalized].jobs.includes(a.job_title)) {
                skillMap[normalized].jobs.push(a.job_title);
            }
        });
    });

    const topMissingSkills = Object.entries(skillMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10); // Top 10 gaps

    // Find the resume with the lowest average score across its analyses
    const resumeHealthData = resumes?.map(resume => {
        // Filter for completed analyses that have a result/score
        const completedAnalyses = resume.analyses.filter(
            (a: analysesType) => a.status === "completed" && a.result?.overallScore !== undefined
        );

        // Calculate the average score for this specific resume
        const averageScore = completedAnalyses.length > 0
            ? completedAnalyses.reduce((sum: number, a: analysesType) => sum + a.result.overallScore, 0) / completedAnalyses.length
            : 0;

        return {
            id: resume.id,
            filename: resume.filename,
            avg: Math.round(averageScore),
            analysisCount: completedAnalyses.length
        };
    });

    // Identify the resume with the lowest average score (the one with the most to gain)
    // We filter for resumes that actually have at least one analysis
    const atRiskResume = resumeHealthData
        ?.filter(r => r.analysisCount > 0)
        .sort((a, b) => a.avg - b.avg)[0];


    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10 antialiased">
            {/* Header */}
            <header className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> AI Insights
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill Lab</h1>
                <p className="text-slate-500 font-medium">Identify consistent gaps across your application history.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Priority List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 rounded-[2rem] border-slate-200 shadow-xl">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Target className="text-rose-500 w-5 h-5" />
                            Priority Skill Gaps
                        </h2>

                        <div className="space-y-4">
                            {topMissingSkills.length > 0 ? topMissingSkills.map(([skill, data], index) => (
                                <div key={skill} className="group p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-black text-slate-700 capitalize">{skill}</span>
                                        <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-1 rounded-lg border border-indigo-50 shadow-sm">
                                            Found in {data.count} scans
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 transition-all"
                                            style={{ width: `${(data.count / (analyses?.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-slate-400 font-medium truncate">
                                        Required for: {data.jobs.join(", ")}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-slate-500 py-10 text-center">No significant gaps found. Keep scanning!</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right: Summary & Stats */}
                <div className="space-y-6">
                    <Card className="p-8 bg-slate-900 text-white border-none rounded-[2rem] shadow-2xl relative overflow-hidden">
                        <Trophy className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="text-emerald-400 w-5 h-5" />
                            Optimization Goal
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Closing your top 3 gaps could improve your average match score by up to 15% based on current market trends.
                        </p>
                    </Card>

                    <Card className="p-8 rounded-[2rem] border-slate-200 shadow-lg">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="text-amber-500 w-5 h-5" />
                            Next Step
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Pick the skill that appears most frequently and add a &#34;Projects&#34; or &#34;Certifications&#34; section to your resume to address it.
                        </p>
                    </Card>
                    <Card className="p-8 bg-indigo-50 border-indigo-100 rounded-[2rem] shadow-sm">
                        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="text-indigo-600 w-5 h-5" />
                            High Impact Update
                        </h3>
                        <p className="text-sm text-indigo-700 leading-relaxed mb-4">
                            Your resume <strong className="font-black">{atRiskResume?.filename}</strong> is currently trailing market demand. Adding the top 2 skills could boost its performance significantly.
                        </p>
                        <Link
                            href={`/resumes/${atRiskResume?.id}`}
                            className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Go to Workspace →
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}