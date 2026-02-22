"use client"
import {FrontEndAnalyzeData, FrontEndResumeData} from "@/types";
import Link from "next/link"
import { FileText, ChevronRight, Activity } from "lucide-react"

export default function ResumeList({ resumes, analyses }: { resumes: FrontEndResumeData[],
    analyses: FrontEndAnalyzeData[] }) {
    if (!resumes.length) {
        return (
            <div className="bg-slate-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-bold text-slate-600">No resumes yet</p>
                <Link href="/upload" className="text-indigo-600 font-bold hover:underline">Upload your first one to get started</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {resumes.map((resume) => {
                const completedCount = analyses.filter((a: FrontEndAnalyzeData) => a.status === "completed" && a.resume_id === resume.id).length;

                return (
                    <div key={resume.id} className="group relative bg-white border border-slate-200 p-5 sm:p-6 rounded-[2rem] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                    <FileText className="text-slate-400 group-hover:text-indigo-600 w-6 h-6" />
                                </div>
                                <div>
                                    <div className="relative group cursor-pointer">
                                        <h3 className="font-black text-slate-900 max-sm:text-md sm:text-lg group-hover:text-indigo-700 transition-colors">{resume.filename.slice(0, 30)}...</h3>
                                        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                            <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-xl">
                                                {resume.filename}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                        <p className="text-xs font-medium text-slate-400">
                                            Added {new Date(resume.created_at).toLocaleDateString("en-IN")}
                                        </p>
                                        <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block" />
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                                            <Activity className="w-3 h-3" />
                                            {completedCount} Analyses
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Link
                                    href={`/resumes/${resume.id}/newAnalyses`}
                                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors text-center"
                                >
                                    New Scan
                                </Link>
                                <Link
                                    href={`/resumes/${resume.id}`}
                                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    Workspace
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}