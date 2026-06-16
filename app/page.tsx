import Link from "next/link";

const features = [
  {
    icon: "⚡️",
    title: "Instant Provisioning",
    desc: "Your isolated PostgreSQL database is ready in under 10 seconds.",
  },
  {
    icon: "🔒",
    title: "Fully Isolated",
    desc: "Each DB runs in its own Docker container with no internet access.",
  },
  {
    icon: "⏱️",
    title: "24-Hour TTL",
    desc: "Databases auto-expire and are cleaned up automatically - no manual steps.",
  },
  {
    icon: "🗒️",
    title: "Connection String",
    desc: "Get a ready-to-use postgresql:// connection string you can paste anywhere.",
  },
];

const terminalSteps = [
  { type: "comment", text: "# 1. Register an account" },
  {
    type: "cmd",
    text: "$ curl -X POST https://db.nareshchoudhary.com/api/auth/register \\",
  },
  {
    type: "cmd-cont",
    text: '        -d \'{"email":"you@example.com","password":"..."}\'',
  },
  { type: "out", text: '→ {"accessToken":"eyJhbGciOiJIUzI1NiJ9..."}' },
  { type: "gap", text: "" },
  { type: "comment", text: "# 2. Create a PostgreSQL database" },
  {
    type: "cmd",
    text: "$ curl -X POST https://db.nareshchoudhary.com/api/db/create \\",
  },
  {
    type: "cmd-cont",
    text: '        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."',
  },
  {
    type: "out",
    text: '→ {"id":"abcde", "status":"PROVISIONING" ,"directUri":"postgresql://..."}',
  },
  { type: "gap", text: "" },
  { type: "comment", text: "# 3. Connect with psql" },
  {
    type: "cmd",
    text: '$ psql "postgresql://dbuser:abc@db.nareshchoudhary.com:5433/db_xyz"',
  },
  { type: "out", text: "db_xyz=# |" },
];

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 text-xs px-3 py-1.5 rounded-full mb-8 font-medium whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />{" "}
          Self-hosted on Raspberry Pi 5 ᐧ PostgreSQL 15
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
          A free PostgreSQL DB
          <br />
          <span className="text-indigo-400"> in 10 seconds.</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Sign up and instantly get an isolation PostgreSQL database with a
          connection string. 24-hour TTL, 128 MB RAM limit, auto-cleanup.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            Get started - it&apos;s free!
          </Link>
          <Link
            href="/login"
            className="border bg-indigo-700 hover:bg-indigo-500 text-gray-300 hover:text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Terminal demo */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900/80">
            <div className="w-2 h-2 rounded-full bg-red-500/80" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <div className="w-2 h-2 rounded-full bg-green-500/80" />
            <span></span>
          </div>

          <div className="p-5 font-mono text-sm leading-7 overflow-x-auto">
            {terminalSteps.map((line, i) => {
              if (line.type === "gap") return <div key={i} className="h-2" />;
              if (line.type === "comment")
                return (
                  <p key={i} className="text-gray-600">
                    {line.text}
                  </p>
                );
              if (line.type === "out")
                return (
                  <p key={i} className="text-emerald-400">
                    {line.text}
                  </p>
                );
              if (line.type === "cmd")
                return (
                  <p key={i} className="text-gray-300">
                    {line.text}
                  </p>
                );
              if (line.type === "cmd-cont")
                return (
                  <p key={i} className="text-gray-300">
                    {line.text}
                  </p>
                );

              return (
                <p key={i} className="text-gray-200">
                  {line.text}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features grid */}

      <section className="max-w-5xl mx-auto px-4 pb-24">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-10">
          What you get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900/60 border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-800 bg-gray-900/40">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to try it?</h2>
          <p className="text-gray-400 text-sm mb-8">
            No credit card. No setup. Just a PostgreSQL database.
          </p>
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm inline-block"
          >
            Create free database
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 py-6">
        <p className="text-center text-xs text-gray-700">
          Build on Raspberry Pi 5 . Docker . Spring Boot . Traefik . Cloudflare
        </p>
      </footer>
    </main>
  );
}
