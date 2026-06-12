'use client';

import Link from "next/link";
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

    return (
        <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-white text-base tracking-tight"
                >
                    <span className="text-indigo-400 text-lg">☁️</span> CloudDB
                </Link>

                <div className="flex items-center gap-1">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-500 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Login
                            </Link>
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
