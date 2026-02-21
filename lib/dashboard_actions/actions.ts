'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
    'application/pdf'
]

async function hashText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer)
    return crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");
}

export async function uploadResume(formData: FormData) {
    const supabase = await createSupabaseServerClient()

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (!user || userError) {
        throw new Error('Unauthorized')
    }

    const file = formData.get('resume') as File | null

    if (!file) {
        throw new Error('No file provided')
    }

    // ✅ Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Only PDF or DOCX files are allowed')
    }

    // ✅ Validate file size
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be under 5MB')
    }

    // ✅ Hash
    const textHash = hashText(file);

    // ✅ Check duplicate BEFORE upload
    const { data: existing } = await supabase
        .from("resumes")
        .select("id")
        .eq("user_id", user.id)
        .eq("resume_text_hash", textHash)
        .maybeSingle();

    if (existing) {
        throw new Error("This resume has already been uploaded.");
    }

    // ✅ Upload to storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    // Upload to storage
    const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
            upsert: false
        })

    if (uploadError) {
        throw new Error(uploadError.message)
    }

    // Insert DB record
    const { data, error: dbError } = await supabase
        .from('resumes')
        .insert({
            user_id: user.id,
            filename: file.name,
            storage_path: filePath,
            resume_text_hash: textHash,
            text_extracted_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (dbError) {
        throw new Error(dbError.message)
    }
    return {
        ok: true,
        resumeId: data.id,
    }
}

export async function createAnalysis(formData: FormData) {
    const supabase = await createSupabaseServerClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const resumeId = formData.get('resume_id') as string
    const jobTitle = formData.get('job_title') as string
    const jobDescription = formData.get('job_description') as string
    const experienceId = formData.get('experience_id') as string

    if (!resumeId || !jobTitle || !jobDescription || !experienceId) {
        throw new Error('Missing fields')
    }

    const { data, error } = await supabase
        .from('analyses')
        .insert({
            user_id: user.id,
            resume_id: resumeId,
            job_title: jobTitle,
            job_description: jobDescription,
            experience_level: experienceId,
            status: 'queued',
        })
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return {
        ok: true,
        analysisId: data.id,
    }
}

