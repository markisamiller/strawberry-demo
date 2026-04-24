"use client";

import { useEffect, useState } from "react";
import Gallery from "./components/Gallery";
import PipelineViewer from "./components/PipelineViewer";
import AboutModal from "./components/AboutModal";
import ReportModal from "./components/ReportModal";
import Header from "./components/Header";
import type { DemoEntry } from "./types";

export default function Home() {
  const [entries, setEntries] = useState<DemoEntry[]>([]);
  const [selected, setSelected] = useState<DemoEntry | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/demo-data/results.json")
      .then((r) => r.json())
      .then((data: DemoEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (entry: DemoEntry) => {
    setSelected(entry);
    setTimeout(() => {
      document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Header onAboutClick={() => setShowAbout(true)} onReportClick={() => setShowReport(true)} />

      {/* Hero */}
      <section className="px-6 pt-16 pb-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ background: "#0f2a1a", color: "var(--accent)", border: "1px solid #1a4a2a" }}>
          AIDA 2158 · Red Deer Polytechnic · April 2026
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
          Strawberry Harvesting{" "}
          <span style={{ color: "var(--accent)" }}>Pipeline Demo</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "var(--muted)" }}>
          A three-stage deep learning perception system that takes a raw field
          photograph and outputs the stem angle a robotic arm needs to grip and
          cut the target strawberry.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {[
            { label: "YOLOv11-seg", note: "mAP50 0.927", color: "#3b82f6" },
            { label: "U-Net V2", note: "3-class mIoU 0.584", color: "#22c55e" },
            { label: "PCA Angle", note: "92.7% coverage", color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span style={{ color: s.color }}>{s.label}</span>
              <span className="ml-2" style={{ color: "var(--muted)" }}>{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 pb-12 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {loading ? "Loading images…" : `${entries.length} Sample Images`}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Select any image to run through the pipeline step by step
            </p>
          </div>
          <button
            onClick={() => setShowAbout(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
            How it works
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg animate-pulse"
                style={{ background: "var(--surface)" }} />
            ))}
          </div>
        ) : (
          <Gallery entries={entries} selected={selected} onSelect={handleSelect} />
        )}
      </section>

      {/* Pipeline viewer */}
      {selected && (
        <section id="pipeline" className="px-4 pb-20 max-w-6xl mx-auto">
          <PipelineViewer entry={selected} />
        </section>
      )}

      {/* About modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      {/* Report modal */}
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}

      <footer className="text-center py-10 text-xs" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        Mark Miller · Kelsey Biberdorf · Herve Junior · AIDA 2158 Final Project · Red Deer Polytechnic · 2026
      </footer>
    </main>
  );
}
