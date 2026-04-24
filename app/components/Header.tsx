"use client";

import { useState, useRef, useEffect } from "react";

const GH_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const TEAM_REPOS = [
  { name: "Mark Miller", href: "https://github.com/markisamiller/aida2158-final-project" },
  { name: "Kelsey Biberdorf", href: "https://github.com/kbiberdorf/AIDA-2158-Final-Project" },
  { name: "Herve Junior", href: "" },
];

export default function Header({
  onAboutClick,
  onReportClick,
}: {
  onAboutClick: () => void;
  onReportClick: () => void;
}) {
  const [ghOpen, setGhOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setGhOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between"
      style={{ background: "rgba(10,14,20,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3">
        <span className="text-xl">🍓</span>
        <span className="font-semibold text-sm sm:text-base tracking-tight">
          Strawberry Harvesting Pipeline
        </span>
      </div>

      <div className="flex items-center gap-2">

        {/* GitHub dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setGhOpen((o) => !o)}
            className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
            {GH_ICON}
            GitHub
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {ghOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", top: "100%" }}>
              <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Team Repositories</p>
              </div>
              {TEAM_REPOS.map((repo) =>
                repo.href ? (
                  <a
                    key={repo.name}
                    href={repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setGhOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-white/5">
                    {GH_ICON}
                    <span>{repo.name}</span>
                  </a>
                ) : (
                  <div
                    key={repo.name}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm opacity-40 cursor-not-allowed">
                    {GH_ICON}
                    <span>{repo.name}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Report button */}
        <button
          onClick={onReportClick}
          className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Report
        </button>

        {/* How it works */}
        <button
          onClick={onAboutClick}
          className="text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
          style={{ background: "var(--accent)", color: "#000" }}>
          How it works
        </button>
      </div>
    </header>
  );
}
