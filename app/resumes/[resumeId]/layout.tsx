import {ReactNode} from "react";
import Header from "@/app/components/Header";
import {notFound} from "next/navigation";
import {createSupabaseServerClient} from "@/lib/supabase/server";


export default async function ResumeLayout({ children, params }: {
    children: ReactNode,
    params: Promise<{
        resumeId: string;
    }>
}) {
    const supabase = await createSupabaseServerClient()
    const { resumeId } = await params
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return notFound()
    }
    const { data: resume, error: resumeError } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .eq("user_id", user.id)
        .single()

    if (!resume || resumeError) {
        return notFound()
    }

    const { data: signedData, error: signedError } =
        await supabase.storage
            .from("resumes")
            .createSignedUrl(resume.storage_path, 60*60);
    return (
        <div className="space-y-8">
            <Header
                filename={resume.filename}
                signedUrl={signedData?.signedUrl}
                created_at={resume.created_at}
                resume_id={resumeId}
            />
            {children}
        </div>
    )
}