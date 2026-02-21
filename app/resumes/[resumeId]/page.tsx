// app/resumes/[resumeId]/page.tsx

import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import AnalysisGraph from "@/app/components/AnalysisGraph";
import {FrontEndFullAnalzeRow} from "@/types";

interface PageProps {
    params: {
        resumeId: string
    }
}

export default async function ResumeWorkspace({ params }: PageProps) {
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

    // Fetch all analyses for particular resume
    const {data: analyses, error: analysesError} = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .eq("resume_id", resume.id)

    if(analysesError) return notFound()
    // get analysis -> then with a line graph, show overall score graph, missing skill counts, present skill counts
    const analysesTypecasted = analyses as FrontEndFullAnalzeRow[]
    return (
        <AnalysisGraph analyses={analysesTypecasted}/>
    )
}
