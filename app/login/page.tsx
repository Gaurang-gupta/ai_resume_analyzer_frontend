'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
    const supabase = createSupabaseBrowserClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        // 🔑 CRITICAL
        router.refresh()
        router.push('/')
    }

    return (
        <div className="bg-slate-50 shadow-2xl py-8 px-6 rounded-2xl mt-20 max-sm:w-11/12 sm:w-3/5 lg:w-[400px] mx-auto border border-gray-100">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 tracking-tight mb-6">Welcome Back</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="block w-full px-4 py-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 rounded-xl text-gray-700 placeholder:text-gray-400"
                    name="email"
                    type="email"
                    required
                    placeholder="E-mail"
                />
                <input
                    className="block w-full px-4 py-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 rounded-xl text-gray-700 placeholder:text-gray-400"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                />

                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                <button
                    className="bg-indigo-600 w-full cursor-pointer hover:bg-indigo-700 active:scale-[0.98] transition-transform duration-150 rounded-xl py-3 text-white font-semibold shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Logging in…' : 'Login'}
                </button>

                <Link href={"/signup"} className="w-full text-center block">New Here? Sign up</Link>
            </form>
        </div>

    )
}
