import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - PiBase",
  description:
    "Learn about PiBase, a personal learning project running on a Raspberry Pi 5.",
};

const blogPosts = [
  {
    title: "How I Built a Home DBaaS on a Raspberry Pi",
    description:
      "The full architecture overview for PiBase: Cloudflare, Oracle VPS, WireGuard, HAProxy, SQL-over-HTTP, and a Raspberry Pi database host.",
    href: "https://nareshchoudhary.com/blogs/db-as-a-service-on-pi5-architecture",
  },
  {
    title: "The Cloudflare Edge Layer - One Domain, Two Backends",
    description:
      "How a Cloudflare Worker routes API requests to the Pi backend and frontend requests to Vercel under one domain.",
    href: "https://nareshchoudhary.com/blogs/cloudflare-edge-layer",
  },
  {
    title: "CGNAT & WireGuard Relay",
    description:
      "How I bypassed CGNAT using an Oracle Cloud VPS as a WireGuard relay to expose database TCP traffic from my Pi.",
    href: "https://nareshchoudhary.com/blogs/cgnat-wireguard-relay",
  },
  {
    title: "HAProxy SNI Routing - One Port, Unlimited Databases",
    description:
      "Using HAProxy and TLS SNI to route many database connections through the standard PostgreSQL port.",
    href: "https://nareshchoudhary.com/blogs/haproxy-sni-routing",
  },
  {
    title: "The Playground - SQL over HTTP",
    description:
      "How the browser playground runs SQL through an HTTP API because browsers and edge runtimes cannot open raw TCP sockets.",
    href: "https://nareshchoudhary.com/blogs/sql-over-http-gateway",
  },
  {
    title: "Database Wire Protocols vs HTTP",
    description:
      "Why Cloudflare Tunnel works for HTTP APIs but cannot carry PostgreSQL or MySQL wire protocol traffic.",
    href: "https://nareshchoudhary.com/blogs/database-wire-protocols-vs-http",
  },
  {
    title: "What I Borrowed from Neon, PlanetScale, and Other DBaaS Architectures",
    description:
      "A scaled-down look at the DBaaS patterns behind PiBase: proxy routing, SQL-over-HTTP, and tenant-aware access paths.",
    href: "https://nareshchoudhary.com/blogs/dbaas-architecture-patterns",
  },
];

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      {/* Disclaimer */}
      <section className="mb-16">
        <div
          className="inline-flex items-center gap-2 bg-indigo-950/60 border-indigo-800/50 
          text-indigo-400 text-xs px-3 py-1.5 rounded-full mb-6 font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Personal Project
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          About PiBase
        </h1>

        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            PiBase is a{" "}
            <span className="text-white font-medium">
              personal learning project
            </span>
            , not a production service. It runs on a single Raspberry Pi 5
            sitting on my desk, connected to the internet through a WireGuard
            tunnel because my ISP uses CGNAT.
          </p>
          <p>
            The entire stack – Spring Boot API, HAProxy, PostgreSQL containers,
            Cloudflare tunnel – runs on that one Pi. It supports a{" "}
            <span className="text-white font-medium">
              very limited number of users
            </span>{" "}
            and databases at any given time.
          </p>
          <p>
            Feel free to sign up, create a database, run some queries, and have
            fun. All databases auto-expire after 24 hours, so there's nothing to
            clean up. Just please don't abuse it – this little Pi is doing its
            best.
          </p>
          <p className="text-gray-500 italic">
            Through building this project I've learned a tremendous amount about
            networking, containers, security, and distributed systems. I hope
            you enjoy exploring it too.
          </p>
        </div>

        <div className="mt-8 flex-wrap gap-3">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium 
              transition-colors"
          >
            Try it out
          </Link>
          <a
            href="https://github.com/nareshchoudhary"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Architecture blog posts */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-6">
          Architecture & Engineering Blog
        </h2>
        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <a
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-gray-900/60 border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                    {post.description}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7v10"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mt-16 pt-8 border-t border-gray-800/50">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Raspberry Pi 5",
            "Spring Boot 3",
            "PostgreSQL 15",
            "Docker",
            "HAProxy",
            "WireGuard",
            "Cloudflare",
            "Next.js",
            "Tailwind CSS",
            "Oracle Cloud VPS",
          ].map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-900 border-gray-800 text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
