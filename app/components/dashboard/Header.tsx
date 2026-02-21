"use client"
import Link from "next/link";
export default function Header() {
    return (
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <Link
                href="/upload"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
                Upload Resume
            </Link>
        </div>
    );
}