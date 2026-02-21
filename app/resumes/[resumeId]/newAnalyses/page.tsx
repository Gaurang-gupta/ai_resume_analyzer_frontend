import Card from "@/app/components/ui/Card"
import NewAnalysisForm from "@/app/components/resume/NewAnalysisForm"
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {notFound} from "next/navigation";
interface PageProps {
    params: {
        resumeId: string
    }
}
export default async function NewAnalyses({ params }: PageProps) {
    const supabase = await createSupabaseServerClient()
    const { resumeId } = await params

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return notFound()
    }

    // 1️⃣ Fetch resume (ownership check)
    const { data: resume, error: resumeError } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .eq("user_id", user.id)
        .single()

    if (!resume || resumeError) {
        return notFound()
    }

    // 2️⃣ Fetch newAnalyses for this resume
    const { data: analyses } = await supabase
        .from("analyses")
        .select("*")
        .eq("resume_id", resume.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    // 3️⃣ Compute summary stats
    const total = analyses?.length || 0
    const completed = analyses?.filter(a => a.status === "completed") || []
    const avgScore =
        completed.length > 0
            ? Math.round(
                completed.reduce(
                    (sum, a) => sum + (a.result?.overallScore || 0),
                    0
                ) / completed.length
            )
            : null

    const { data: signedData, error: signedError } =
        await supabase.storage
            .from("resumes")
            .createSignedUrl(resume.storage_path, 60*60);

    if (signedError) {
        console.error("Signed URL error:", signedError);
    }
    return (
        <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <p className="text-sm text-gray-500">Total Analyses</p>
                    <p className="text-2xl font-semibold mt-1">{total}</p>
                </Card>

                <Card>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold mt-1">
                        {completed.length}
                    </p>
                </Card>

                <Card>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-semibold mt-1">
                        {avgScore !== null ? `${avgScore}%` : "-"}
                    </p>
                </Card>
            </div>

            {/* New Analysis Form */}
            <NewAnalysisForm resumeId={resume.id} />
        </>
    )
}