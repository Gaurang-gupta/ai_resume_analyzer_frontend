import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {AnalysisResult, FrontEndFullAnalzeRow} from "@/types"
import {SupabaseClient} from "@supabase/supabase-js";
import AnalysisReportPage from "@/app/components/AnalysesReportPage";
import { ResumeData } from "@/types";

interface PageProps {
    params: Promise<{
        analysisId: string
    }>
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

    const { data: signedData } =
        await supabase.storage.from("resumes").createSignedUrl(resumeData.storage_path, 60*60);

    const result = analysis.result as AnalysisResult;
    return (
        <AnalysisReportPage
            analysis={analysis as FrontEndFullAnalzeRow}
            resumeData={resumeData}
            signedUrl={signedData?.signedUrl}
            result={result}
        />
    )
}

