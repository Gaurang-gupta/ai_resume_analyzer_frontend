"use client"

import { useState } from 'react'
import Link from 'next/link'
import Card from "@/app/components/ui/Card"
import SkillBadge from "./SkillBadge"
import ScoreGauge from "./ScoreGauge" // Assuming this uses your AnimatedScore logic
import { Maximize2, FileText, Calendar, ChevronLeft } from "lucide-react"
import {AnalysisResult, FrontEndFullAnalzeRow, ResumeData} from "@/types";

export default function AnalysisReportPage(
    { analysis, resumeData, result, signedUrl }:
    {
        signedUrl?: string,
        result: AnalysisResult,
        resumeData: ResumeData,
        analysis: FrontEndFullAnalzeRow
    }
) {
    const [isSplit, setIsSplit] = useState(true)

    return (
        <div className="flex flex-col bg-white overflow-hidden antialiased">
            {/* ===== Top Workspace Navigation ===== */}
            <header className="h-16 flex-none border-b border-slate-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-30">
                <div className="flex items-center gap-4">
                    <Link href={`/resumes/${resumeData.id}/allAnalyses`} className="p-2 hover:bg-slate-50 rounded-xl transition-colors group">
                        <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                    </Link>
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <FileText className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h1 className="font-bold text-xl text-slate-900 truncate max-w-[200px] sm:max-w-md">
                            {analysis.job_title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSplit(!isSplit)}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                    >
                        {isSplit && <Maximize2 className="w-4 h-4" /> }
                        {isSplit ? "Full Report" : "Side-by-Side"}
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                {/* ===== Left Side: PDF Viewer ===== */}
                {isSplit && (
                    <div className="hidden h-screen lg:block w-1/2 bg-slate-100 relative border-r border-slate-200">
                        <iframe
                            src={`${signedUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-none shadow-inner"
                            title="Resume Preview"
                        />
                    </div>
                )}

                {/* ===== Right Side: Analysis Results ===== */}
                <div className={`flex-1 overflow-y-auto bg-slate-50/30 transition-all duration-500 custom-scrollbar`}>
                    <div className={`mx-auto px-6 py-10 space-y-8 ${isSplit ? 'max-w-3xl' : 'max-w-6xl'}`}>

                        {/* Status Guard */}
                        {analysis.status !== "completed" ? (
                            <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                                <p className="text-slate-500 font-bold">Refining AI Analysis...</p>
                            </div>
                        ) : (
                            <>
                                {/* Quick Info Bar */}
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(analysis.created_at).toLocaleDateString()}
                                    </div>
                                    <span>•</span>
                                    <Link className="text-indigo-600 hover:underline" href={`/resumes/${resumeData.id}`}>
                                        Source: {resumeData.filename}
                                    </Link>
                                </div>

                                <div className={`grid gap-8 ${isSplit ? 'grid-cols-1' : 'lg:grid-cols-12'}`}>

                                    {/* Overview & Stats Column */}
                                    <div className={isSplit ? "space-y-6" : "lg:col-span-4 space-y-6"}>
                                        <Card className="p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] overflow-hidden shadow-xl">
                                            <div className="bg-white p-8 rounded-[2.2rem] flex flex-col items-center text-center space-y-6">
                                                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Match Score</h2>
                                                <div className="relative flex items-center justify-center">
                                                    {/* Your animated gauge goes here */}
                                                    <ScoreGauge score={result.overallScore} />
                                                </div>
                                                <p className="text-slate-600 leading-relaxed italic text-sm pt-4 border-t border-slate-50">
                                                    &ldquo;{result.summary}&rdquo;
                                                </p>
                                            </div>
                                        </Card>

                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { label: "Skills", value: result.breakdown.skillsMatch, color: "bg-indigo-500" },
                                                { label: "Experience", value: result.breakdown.experienceMatch, color: "bg-emerald-500" },
                                                { label: "Education", value: result.breakdown.educationMatch, color: "bg-amber-500" },
                                            ].map((stat) => (
                                                <div key={stat.label} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                                        <p className="text-lg font-black text-slate-900">{stat.value}%</p>
                                                    </div>
                                                    <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                                                        <div className={`${stat.color} h-full transition-all duration-1000`} style={{ width: `${stat.value}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Detailed Breakdown Column */}
                                    <div className={isSplit ? "space-y-6" : "lg:col-span-8 space-y-6"}>
                                        {/* Skills Deep Dive */}
                                        <Card className="p-8 border-slate-100 shadow-sm rounded-[2rem]">
                                            <div className="space-y-8">
                                                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                                    Skills Deep Dive
                                                </h2>
                                                <div className="space-y-6">
                                                    <section>
                                                        <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">✓ Matched Expertise</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {result.skills.matched.map((skill, idx) => (
                                                                <SkillBadge key={idx} variant="matched" label={skill} className="px-3 py-1.5 text-xs shadow-sm" />
                                                            ))}
                                                        </div>
                                                    </section>
                                                    <section>
                                                        <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">⚠ Growth Areas</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {result.skills.missing.map((skill, idx) => (
                                                                <SkillBadge key={idx} variant="missing" label={skill} className="px-3 py-1.5 text-xs border-dashed" />
                                                            ))}
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Experience & Education Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
                                                <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest">Experience</h3>
                                                <div className="space-y-3">
                                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Target</div>
                                                        <div className="font-black text-slate-700">{result.experience.requiredLevel}</div>
                                                    </div>
                                                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                                        <div className="text-[10px] font-bold text-indigo-400 uppercase">Inferred</div>
                                                        <div className="font-black text-indigo-700">{result.experience.inferredLevel}</div>
                                                    </div>
                                                </div>
                                            </Card>

                                            <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
                                                <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest">Education</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed p-4 bg-slate-50 rounded-xl min-h-[100px]">
                                                    {result.education.notes || "No requirements found."}
                                                </p>
                                            </Card>
                                        </div>

                                        {/* Strategy Card */}
                                        <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white">
                                            <h2 className="text-xl font-black mb-6 text-indigo-400 flex items-center gap-2">
                                                Optimization Strategy
                                            </h2>
                                            <ul className="space-y-4">
                                                {result.recommendations.map((rec, idx) => (
                                                    <li key={idx} className="flex gap-4 text-sm text-slate-300">
                                                        <span className="flex-none h-6 w-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="leading-relaxed font-medium">{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}