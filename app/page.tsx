import { createSupabaseServerClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import Header from "@/app/components/dashboard/Header"
import ResumeList from "@/app/components/dashboard/ResumeList";
import {FrontEndAnalyzeData, FrontEndResumeData} from "@/types";
import StatCard from "@/app/components/dashboard/StatCard";

export default async function DashboardPage() {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: resumes, error } = await supabase
        .from("resumes")
        .select(`
            id,
            filename,
            created_at,
            analyses (
                id,
                result,
                created_at
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const { data: analyses } = await supabase
        .from("analyses")
        .select(`
            id,
            user_id,
            resume_id,
            job_title,
            job_description,
            status,
            created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return <div>Failed to load dashboard.</div>;
    }


    return (
        <div className="max-w-6xl mx-auto">
            <Header />
            <Stats resumes={resumes ?? []} analyses={analyses ?? []}/>
            <ResumeList resumes={resumes ?? []} analyses={analyses ?? []}/>
        </div>
    )
}

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
