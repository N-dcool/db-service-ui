'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const route = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, [pathname]);

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        route.push("/");
    };

    const navLink = (href: string, label: string) => {
        const isActive = pathname === href;
        return (
            <Link href={href} className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                isActive ? 
                    'text-white bg-gray-800'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}>
                {label}
            </Link>        );
    };

    return (
        <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-white text-base tracking-tight"
                >
                    <Image src="/pi.png" alt="PiBase" width={24} height={24} /> PiBase
                </Link>

                <div className="flex items-center gap-1">
                    {isLoggedIn ? (
                        <>
                            {navLink('/dashboard', 'Dashboard')}
                            {navLink('/playground', 'Playground')}
                            <div className="w-px h-5 bg-gray-800 mx-1.5" />
                            <button
                                onClick={logout}
                                className="text-sm text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {navLink('/login', 'Login')}
                            <Link
                                href="/register"
                                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md font-medium transition-colors"
                            >
                                Sign Up Free
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
