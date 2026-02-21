import Card from "@/app/components/ui/Card"
import Link from "next/link";
import StatusBadge from "@/app/components/ui/StatusBadge";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {notFound} from "next/navigation";
interface PageProps {
    params: {
        resumeId: string
    }
}
export default async function AllAnalyses({ params }: PageProps) {
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

    const { data: analyses } = await supabase
        .from("analyses")
        .select("*")
        .eq("resume_id", resumeId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    if(resumeError) {
        return notFound()
    }
    return (
        <>
            {/* Analysis History */}
            <Card>
                <h2 className="text-lg font-semibold mb-4">
                    Analysis History
                </h2>

                {analyses && analyses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b">
                            <tr>
                                <th className="py-2">Job Title</th>
                                <th className="py-2">Experience</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Score</th>
                                <th className="py-2">Created</th>
                            </tr>
                            </thead>
                            <tbody>
                            {analyses.map((analysis) => (
                                <tr
                                    key={analysis.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-3">
                                        <Link
                                            href={`/analyses/${analysis.id}`}
                                            className="text-indigo-600 hover:underline"
                                        >
                                            {analysis.job_title}
                                        </Link>
                                    </td>

                                    <td className="py-3">
                                        {analysis.experience_level}
                                        {analysis.experience_level == "0-2" || analysis.experience_level == "3-5" ||
                                        analysis.experience_level == "6+"
                                            ? " years" : ""
                                        }
                                    </td>

                                    <td className="py-3">
                                        <StatusBadge
                                            status={analysis.status}
                                        />
                                    </td>

                                    <td className="py-3">
                                        {analysis.status === "completed" &&
                                        analysis.result
                                            ? `${analysis.result.overallScore}%`
                                            : "-"}
                                    </td>

                                    <td className="py-3 text-gray-500">
                                        {new Date(
                                            analysis.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No analyses yet. Run your first analysis above.
                    </p>
                )}
            </Card>
        </>
    )
}