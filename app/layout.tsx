// app/layout.tsx

import "./globals.css"
import Navbar from "@/app/components/layout/Navbar"
import {createSupabaseServerClient} from "@/lib/supabase/server";

export const metadata = {
    title: "IngestAI",
    description: "AI-powered resume analysis dashboard",
}

export default async function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <html lang="en">
            <body className="bg-gray-50 min-h-screen text-gray-900">
                <Navbar user={user}/>
                <main className="max-w-6xl mx-auto px-6 py-8">
                    {children}
                </main>
            </body>
        </html>
    )
}
