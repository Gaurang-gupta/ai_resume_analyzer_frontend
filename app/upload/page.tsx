"use client"

import { useRouter } from "next/navigation";
import { useState, useTransition, ChangeEvent } from "react";
import { uploadResume } from "@/lib/dashboard_actions/actions";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import { Upload, FileText, AlertCircle, Info } from "lucide-react";

export default function UploadPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) setFileName(file.name)
    }

    function handleSubmit(formData: FormData) {
        setError(null)
        startTransition(async () => {
            try {
                const result = await uploadResume(formData)
                if (!result.ok) {
                    setError("This resume is already uploaded")
                    return;
                }
                if (result?.resumeId) {
                    router.push(`/resumes/${result.resumeId}`)
                }
            } catch (err) {
                setError("Something went wrong. Please try a different PDF.")
                console.log(err)
            }
        })
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6 space-y-8 antialiased">
            {/* Header Content */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    Add Your Resume
                </h1>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                    Upload your latest PDF. We’ll extract the skills and experience data to power your Skill Lab.
                </p>
            </div>

            <Card className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] shadow-2xl shadow-indigo-100">
                <div className="bg-white rounded-[2.2rem] p-8 sm:p-12">
                    <form action={handleSubmit} className="space-y-8">
                        {/* Custom File Upload Area */}
                        <div className="relative">
                            <label className="group cursor-pointer block">
                                <div className={`
                                    border-2 border-dashed rounded-[2rem] p-10 
                                    flex flex-col items-center justify-center gap-4
                                    transition-all duration-300
                                    ${fileName
                                    ? 'border-indigo-400 bg-indigo-50/30'
                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                }
                                `}>
                                    <div className={`p-4 rounded-2xl ${fileName ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'} group-hover:scale-110 transition-transform`}>
                                        {fileName ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                                    </div>

                                    <div className="text-center">
                                        <p className="font-bold text-slate-700">
                                            {fileName ? fileName : "Click to select or drag and drop"}
                                        </p>
                                        <p className="text-sm text-slate-400 font-medium">
                                            Supports PDF format (Max 5MB)
                                        </p>
                                    </div>

                                    <input
                                        type="file"
                                        name="resume"
                                        accept="application/pdf"
                                        required
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </label>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            loading={isPending}
                            fullWidth
                            className="h-16 rounded-[1.5rem] text-lg font-black shadow-xl shadow-indigo-200 transition-all active:scale-95"
                        >
                            {isPending ? "Processing Document..." : "Initialize Analysis"}
                        </Button>
                    </form>
                </div>
            </Card>

            {/* Hint Box */}
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-500">
                    <Info className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Note: Our AI works best with clean, standard resume layouts. Avoid complex graphic elements or multi-column layouts that may interfere with skill extraction.
                </p>
            </div>
        </div>
    )
}