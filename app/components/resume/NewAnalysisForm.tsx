// app/components/resume/NewAnalysisForm.tsx

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createAnalysis } from "@/lib/dashboard_actions/actions"
import Card from "@/app/components/ui/Card"
import Button from "@/app/components/ui/Button"

interface NewAnalysisFormProps {
    resumeId: string
}

export default function NewAnalysisForm({
                                            resumeId,
                                        }: NewAnalysisFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function handleSubmit(formData: FormData) {
        setError(null)

        formData.append("resume_id", resumeId)

        startTransition(async () => {
            try {
                const result = await createAnalysis(formData)

                if (result?.analysisId) {
                    router.push(`/analyses/${result.analysisId}`)
                }
            } catch (err: any) {
                setError(err.message || "Failed to create analysis")
            }
        })
    }

    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4">
                Run New Analysis
            </h2>

            <form action={handleSubmit} className="space-y-4">
                {/* Job Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                    </label>
                    <input
                        type="text"
                        name="job_title"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Experience Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level
                    </label>
                    <select
                        name="experience_id"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {/*'student' | '0-2' | '3-5' | '6+' | 'career_switcher'*/}
                        <option value="student">student</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6+">6+ years</option>
                        <option value="career_switcher">Career Switcher</option>
                    </select>
                </div>

                {/* Job Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description
                    </label>
                    <textarea
                        name="job_description"
                        rows={6}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                <Button
                    className="cursor-pointer"
                    type="submit"
                    loading={isPending}
                    fullWidth
                >
                    Start Analysis
                </Button>
            </form>
        </Card>
    )
}
