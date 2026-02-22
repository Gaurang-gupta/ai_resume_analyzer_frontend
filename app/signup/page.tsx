// 'use client'
//
// import { useState, SubmitEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import { createSupabaseBrowserClient } from '@/lib/supabase/client'
// import Link from "next/link";
//
// export default function SignUpPage() {
//     const supabase = createSupabaseBrowserClient()
//     const router = useRouter()
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)
//
//     async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
//         e.preventDefault()
//         setLoading(true)
//         setError(null)
//
//         const formData = new FormData(e.currentTarget)
//         const password = formData.get('password')
//         const confirmPassword = formData.get('confirmPassword')
//         if(password !== confirmPassword) {
//             setError("Passwords don't match")
//             return;
//         }
//
//         const { error } = await supabase.auth.signUp({
//             email: formData.get('email') as string,
//             password: formData.get('password') as string,
//         })
//
//         if (error) {
//             setError(error.message)
//             console.log(error)
//             setLoading(false)
//             return
//         }
//
//         // 🔑 CRITICAL
//         alert('Check your email to confirm your account before logging in.')
//         // router.push('/login')
//     }
//
//     return (
//         <div className="bg-slate-50 shadow-2xl py-8 px-6 rounded-2xl mt-20 max-sm:w-11/12 sm:w-3/5 lg:w-[400px] mx-auto border border-gray-100">
//             <h1 className="text-3xl font-extrabold text-center text-gray-800 tracking-tight mb-6">Sign Up</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                     className="block w-full px-4 py-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 rounded-xl text-gray-700 placeholder:text-gray-400"
//                     name="email"
//                     type="email"
//                     required
//                     placeholder="E-mail"
//                 />
//                 <input
//                     className="block w-full px-4 py-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 rounded-xl text-gray-700 placeholder:text-gray-400"
//                     name="password"
//                     type="password"
//                     required
//                     placeholder="Password"
//                 />
//                 <input
//                     className="block w-full px-4 py-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 rounded-xl text-gray-700 placeholder:text-gray-400"
//                     name="confirmPassword"
//                     type="password"
//                     required
//                     placeholder="Confirm Password"
//                 />
//
//                 {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
//
//                 <button
//                     className="bg-indigo-600 w-full cursor-pointer hover:bg-indigo-700 active:scale-[0.98] transition-transform duration-150 rounded-xl py-3 text-white font-semibold shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
//                     disabled={loading}
//                 >
//                     {loading ? 'Signing in…' : 'Sign Up'}
//                 </button>
//
//                 <Link href={"/login"} className="w-full text-center block">Already have an account? Log in</Link>
//             </form>
//         </div>
//     )
// }

// app/signup/page.tsx
'use client'

import { useState, SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from "next/link";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react"

export default function SignUpPage() {
    const supabase = createSupabaseBrowserClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError("Passwords don't match")
            setLoading(false)
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        // With "Confirm Email" disabled in Supabase settings,
        // the user is now logged in. Refresh to sync auth state.
        router.refresh()
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-white to-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 antialiased">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 mb-2">
                    <Sparkles className="w-8 h-8 text-white fill-white" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Get Started</h2>
                <p className="text-slate-500 font-medium">Create your account and land your dream job faster.</p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
                <div className="bg-white/70 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all rounded-2xl text-slate-900 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all rounded-2xl text-slate-900 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all rounded-2xl text-slate-900 font-medium"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all rounded-2xl py-4 text-white font-black text-lg shadow-xl shadow-indigo-200 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Setting up Profile...' : 'Get Instant Access'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}