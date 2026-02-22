"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createAnalysis } from "@/lib/dashboard_actions/actions"
import Button from "@/app/components/ui/Button"
import { Briefcase, Layers, FileSearch, AlertCircle } from "lucide-react"

interface NewAnalysisFormProps {
    resumeId: string
}

export default function NewAnalysisForm({ resumeId }: NewAnalysisFormProps) {
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
            } catch (err) {
                setError("Failed to create analysis. Please try again.")
                console.log(err)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Briefcase className="w-4 h-4 text-indigo-500" />
                        Job Title
                    </label>
                    <input
                        type="text"
                        name="job_title"
                        placeholder="e.g. Senior Frontend Engineer"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        Target Level
                    </label>
                    <div className="relative">
                        <select
                            name="experience_id"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="student">Student / Intern</option>
                            <option value="0-2">Junior (0-2 years)</option>
                            <option value="3-5">Mid-Level (3-5 years)</option>
                            <option value="6+">Senior (6+ years)</option>
                            <option value="career_switcher">Career Switcher</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <FileSearch className="w-4 h-4 text-indigo-500" />
                    Job Description
                </label>
                <textarea
                    name="job_description"
                    rows={8}
                    placeholder="Paste the full job posting text here for the most accurate analysis..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="pt-2">
                <Button
                    className="h-14 rounded-2xl text-base font-bold shadow-xl shadow-indigo-200 transition-transform active:scale-[0.98]"
                    type="submit"
                    loading={isPending}
                    fullWidth
                >
                    {isPending ? "Processing Analysis..." : "Start AI Analysis"}
                </Button>
            </div>
        </form>
    )
}
