import Link from "next/link";
import { Download, History } from 'lucide-react';

export default async function Header({ filename, created_at, signedUrl, resume_id }:
                                     {
                                         filename: string,
                                         created_at: string,
                                         signedUrl?: string,
                                         resume_id: string
                                     }
) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200 max-sm:overflow-x-scroll">
            {/* Left Section: Info */}
            <div className="space-y-1">
                <Link
                    href={`/resumes/${resume_id}`}
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors inline-block"
                >
                    {filename}
                </Link>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs sm:text-sm font-medium text-slate-500">
                        Uploaded {new Date(created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                    </p>
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3">

                {/* History Button */}
                <Link
                    href={`/resumes/${resume_id}/allAnalyses`}
                    title="Analysis History"
                    className="flex-1 sm:flex-none p-3.5 border border-slate-200 rounded-2xl bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shadow-sm flex justify-center items-center group"
                >
                    <History size={20} className="group-hover:scale-110 transition-transform" />
                </Link>

                {/* Download Button */}
                {signedUrl && (
                    <Link
                        href={signedUrl}
                        className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95 group"
                        target="_blank"
                    >
                        <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span className="hidden lg:inline">Download</span>
                    </Link>
                )}
            </div>
        </div>
    );
}