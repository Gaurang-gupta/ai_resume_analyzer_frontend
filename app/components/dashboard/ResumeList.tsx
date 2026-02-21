"use client"
import Link from "next/link"
import {FrontEndAnalyzeData, FrontEndResumeData} from "@/types";
import {resume} from "react-dom/server";
export default function ResumeList(
    { resumes, analyses }:
    {
        resumes: FrontEndResumeData[],
        analyses: FrontEndAnalyzeData[]
    }) {
    if (!resumes.length) {
        return (
            <div className="border rounded-lg p-10 text-center text-gray-500">
                No resumes uploaded yet.
            </div>
        );
    }

    const completedAnalyses = (id: string): number => {
        const completed = analyses.filter((analyse) =>
            analyse.status === "completed" && analyse.resume_id === id
        )
        return completed.length;
    }

    return (
        <div className="space-y-4">
            {resumes.map((resume) => {

                return (
                    <div
                        key={resume.id}
                        className="border rounded-lg p-6 max-sm:flex-col sm:flex justify-between items-center"
                    >
                        <div className="max-sm:mb-2">
                            <p className="font-medium">{resume.filename}</p>
                            <p className="text-sm text-gray-500">
                                Uploaded {new Date(resume.created_at).toLocaleDateString("en-IN")}
                            </p>

                            <p className="text-sm text-gray-500">Analysis run: {resume.analyses.length}</p>
                            <p className="text-sm text-gray-500">Analysis completed: {completedAnalyses(resume.id)}</p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`/resumes/${resume.id}`}
                                className="px-3 py-2 border rounded-lg text-md bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                View Resume
                            </Link>
                            <Link
                                href={`/resumes/${resume.id}/newAnalyses`}
                                className="px-3 py-2 border rounded-lg text-md outline-indigo-600 hover:outline-indigo-700 text-indigo-600 hover:text-indigo-700"
                            >
                                New Analysis
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
