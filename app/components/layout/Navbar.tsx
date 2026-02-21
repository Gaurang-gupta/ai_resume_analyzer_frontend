// app/components/layout/Navbar.tsx
"use client"
import Link from "next/link"
import Button from "@/app/components/ui/Button";
import {usePathname, useRouter} from "next/navigation";
import {createSupabaseBrowserClient} from "@/lib/supabase/client";
import Avatar from "boring-avatars"
import {User} from "@supabase/auth-js";

const colors = ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90", "#000000", "#ffffff", "#3F0FB7", "#001B94"]
export default function Navbar({ user } : { user : User | null}) {
    const supabase = createSupabaseBrowserClient()
    const router = useRouter();
    const pathname = usePathname()
    async function handleLogout() {
        await supabase.auth.signOut()

        // ensure proxy re-evaluates auth
        router.refresh()
        router.push('/login')
    }

    return (
        pathname === "/login" || pathname === "/signup" ? null :
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-semibold text-indigo-600"
                >
                    IngestAI
                </Link>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                    {/*<Link href="/resumes" className="hover:text-gray-900">*/}
                    {/*    Resumes*/}
                    {/*</Link>*/}
                    <Button onClick={handleLogout}>
                        Logout
                    </Button>
                    <Avatar
                        size={40}
                        name={user?.email}
                        variant="geometric"
                        colors={colors}
                    />
                </div>
            </div>
        </nav>
    )
}
