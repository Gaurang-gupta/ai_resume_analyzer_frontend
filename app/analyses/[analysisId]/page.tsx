import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link"
import {AnalysisResult} from "@/types"
import Card from "@/app/components/ui/Card"
import StatCard from "@/app/components/dashboard/StatCard";
import {SupabaseClient} from "@supabase/supabase-js";
import SkillBadge from "@/app/components/SkillBadge";

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
        <div className="max-w-5xl mx-auto space-y-10">
            {/* ===== Header ===== */}
            <div className="space-y-3">
                <h1 className="text-3xl font-bold">Analysis Result</h1>
                <p className="text-gray-600">
                    Job Title: <span className="font-medium">{analysis.job_title}</span>
                </p>
                <p className="text-gray-600">
                    Resume: <Link className="text-indigo-600" href={`/resumes/${resumeData.id}`}><span className="font-medium">{resumeData.filename}</span></Link>
                </p>
            </div>

            {analysis.status !== "completed" ?
                // <div className="p-8">Analysis not completed yet.</div>
                <>
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                    <div className="text-center">
                        Analysing...
                    </div>
                </>
                :
                <>
            {/* ===== Overall Score ===== */}
            <Card>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Overall Match</h2>
                    <div className="text-5xl font-bold text-indigo-600">
                        {result.overallScore}%
                    </div>
                    <p className="text-gray-700">{result.summary}</p>
                </div>
            </Card>

            {/* ===== Breakdown ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Skills Match"
                    value={`${result.breakdown.skillsMatch}%`}
                />
                <StatCard
                    label="Experience Match"
                    value={`${result.breakdown.experienceMatch}%`}
                />
                <StatCard
                    label="Education Match"
                    value={`${result.breakdown.educationMatch}%`}
                />
            </div>

            {/* ===== Skills Section ===== */}
            <Card>
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Skills Analysis</h2>

                    <div>
                        <h3 className="font-medium mb-2">Matched Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.skills.matched.map((skill, idx) => (
                                <SkillBadge key={idx} variant="matched" label={skill} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Missing Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.skills.missing.map((skill, idx) => (
                                <SkillBadge key={idx} variant="missing" label={skill}/>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* ===== Experience Section ===== */}
            <Card>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Experience Evaluation</h2>

                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Required Level:</span>{" "}
                            {result.experience.requiredLevel}
                        </p>
                        <p>
                            <span className="font-medium">Inferred Level:</span>{" "}
                            {result.experience.inferredLevel}
                        </p>

                        {result.experience.gapReason && (
                            <div className="text-sm text-red-600">
                                {result.experience.gapReason}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* ===== Education Section ===== */}
            <Card>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Education Evaluation</h2>
                    {result.education.notes && (
                        <p className="text-gray-700 text-sm">
                            {result.education.notes}
                        </p>
                    )}
                </div>
            </Card>
            {/* ========= Strengths ========= */}
            <Card>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Strengths</h2>

                    <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {result.strengths.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </Card>

            {/* ===== Recommendations ===== */}
            <Card>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Recommendations</h2>

                    <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {result.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </Card>
            </>
            }
        </div>
    )
}

