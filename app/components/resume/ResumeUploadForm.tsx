// app/components/resume/ResumeUploadForm.tsx

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { uploadResume } from "@/lib/dashboard_actions/actions"
import Button from "@/app/components/ui/Button"
import Card from "@/app/components/ui/Card"

export default function ResumeUploadForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function handleSubmit(formData: FormData) {
        setError(null)

        startTransition(async () => {
            try {
                const result = await uploadResume(formData)

                if (result?.resumeId) {
                    router.push(`/resumes/${result.resumeId}`)
                }
            } catch (err) {
                setError("Something went wrong")
                console.log(err)
            }
        })
    }

    return (
        <Card>
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Resume (PDF)
                    </label>

                    <input
                        type="file"
                        name="resume"
                        accept="application/pdf"
                        required
                        className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                <Button
                    type="submit"
                    loading={isPending}
                    fullWidth
                >
                    Upload Resume
                </Button>
            </form>
        </Card>
    )
}
