'use client';

import { useAuthForm } from "@/hooks/useAuthForm";
import { register } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useAuthForm({
    apiFn: register,
    fallbackError: "Registration failed",
    validate: (_, pwd) =>
      pwd.length < 8 ? "Password must be at least 8 characters." : null,
  });

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Create an account</h1>
          <p className="text-gray-400 text-sm">
            Already have one?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm text-gray-400 mb-1.5"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-900 border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label
              className="block text-sm text-gray-400 mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-gray-900 border-gray-700 rounded-lg px-3 py-2.5 text-sm 
           text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 
           transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border-red-800/60 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 
             disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium text-sm 
             transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Fine print */}
        <p className="text-xs text-gray-600 text-center mt-6">
          One free database per account · 24h TTL · 128 MB RAM
        </p>
      </div>
    </main>
  );
}
