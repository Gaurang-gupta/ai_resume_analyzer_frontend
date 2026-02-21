import Link from "next/link";
import { Download, ChartColumn, History } from 'lucide-react';
export default async function Header({filename, created_at, signedUrl, resume_id }:
    {
        filename: string,
        created_at: string,
        signedUrl?: string,
        resume_id: string
    }
    ) {
    return (
        <div className="max-sm:flex-col sm:flex justify-between items-center mb-8">
            <div>
                <Link href={`/resumes/${resume_id}`} className="text-2xl font-semibold">
                    {filename}
                </Link>
                <p className="text-sm text-gray-500">
                    Uploaded {new Date(created_at).toLocaleDateString()}
                </p>
            </div>

            <div className="flex items-center max-sm:justify-start sm:justify-center gap-2 max-sm:mt-4">
                <Link
                    href={`/resumes/${resume_id}/newAnalyses`}
                    className="p-4 border rounded-full text-center text-md outline-indigo-600 hover:outline-indigo-700 text-indigo-600 hover:text-indigo-700"
                >
                    <ChartColumn />
                </Link>

                <Link
                    href={`/resumes/${resume_id}/allAnalyses`}
                    className="p-4 border rounded-full text-center text-md outline-indigo-600 hover:outline-indigo-700 text-indigo-600 hover:text-indigo-700"
                >
                    <History />
                </Link>

                {signedUrl && (
                    <Link
                        href={signedUrl}
                        className="p-4 text-white rounded-full text-md text-center bg-indigo-600 hover:bg-indigo-700"
                        target="_blank"
                    >
                        <Download/>
                    </Link>
                )}
            </div>
        </div>
    );
}
