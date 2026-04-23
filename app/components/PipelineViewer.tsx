"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { DemoEntry } from "../types";

interface Props {
  entry: DemoEntry;
}

const STEPS = [
  {
    id: 0,
    label: "Detection",
    module: "Module 1 — YOLOv11-seg",
    description:
      "YOLOv11 scans the full field image and detects every visible strawberry. Each berry gets a segmentation mask. The largest detection by bounding-box area is selected as the harvest target, and a padded crop is extracted — with extra space above the fruit to ensure the peduncle is in frame.",
    stat: (e: DemoEntry) => `${e.image_w} × ${e.image_h} px crop`,
    badge: { text: "mAP50 0.927", color: "#3b82f6" },
    imageKey: "crop" as const,
    imageLabel: "Extracted ROI crop — the input to U-Net",
  },
  {
    id: 1,
    label: "Segmentation",
    module: "Module 3 — U-Net V2 (3-class)",
    description:
      "A U-Net with ~31 million parameters segments the crop into three classes: background (dark), fruit body (red), and peduncle/crown (green). The model was trained on 1,197 per-fruit crops from four annotators with class-weighted loss to handle the rare peduncle class.",
    stat: (e: DemoEntry) => `${e.ped_pixels_pred.toLocaleString()} peduncle px predicted`,
    badge: { text: "mIoU 0.584", color: "#22c55e" },
    imageKey: "segmentation" as const,
    imageLabel: "3-class prediction — dark / red / green",
  },
  {
    id: 2,
    label: "Stem Angle",
    module: "Module 4 — PCA",
    description:
      "Principal Component Analysis is applied to the set of green (peduncle) pixel coordinates. The first principal component gives the axis of maximum variance — the stem's orientation. The angle from horizontal tells the robot how to rotate its gripper before cutting.",
    stat: (e: DemoEntry) => `Gripper rotation: ${Math.abs(e.angle_deg).toFixed(1)}°`,
    badge: { text: "92.7% coverage", color: "#f59e0b" },
    imageKey: "angle" as const,
    imageLabel: "PCA principal axis overlaid on peduncle region",
  },
];

export default function PipelineViewer({ entry }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set([0]));
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset when entry changes
  useEffect(() => {
    setActiveStep(0);
    setRevealed(new Set([0]));
    setImgLoaded(false);
  }, [entry.slug]);

  const goToStep = (idx: number) => {
    if (idx <= Math.max(...Array.from(revealed)) + 1) {
      setActiveStep(idx);
      setRevealed((prev) => new Set([...prev, idx]));
      setImgLoaded(false);
    }
  };

  const step = STEPS[activeStep];
  const isLast = activeStep === STEPS.length - 1;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      {/* Title bar */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h2 className="font-semibold text-lg">Pipeline · Image {entry.id + 1}</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Annotator: <span className="font-medium" style={{ color: "var(--text)" }}>{entry.contributor}</span>
            &nbsp;·&nbsp; Filename: <span className="font-mono" style={{ color: "var(--muted)" }}>{entry.filename.slice(0, 40)}…</span>
          </p>
        </div>
        {/* Final angle badge */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Stem angle</span>
          <span className="text-2xl font-bold tabular-nums" style={{ color: "#f59e0b" }}>
            {entry.angle_deg > 0 ? "+" : ""}{entry.angle_deg.toFixed(1)}°
          </span>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)" }}>
        {STEPS.map((s, i) => {
          const isUnlocked = i <= Math.max(...Array.from(revealed)) + 1;
          const isActive   = i === activeStep;
          return (
            <button
              key={s.id}
              onClick={() => isUnlocked && goToStep(i)}
              disabled={!isUnlocked}
              className="flex-1 py-3 px-2 text-sm font-medium transition-all relative"
              style={{
                color: isActive ? "var(--text)" : isUnlocked ? "var(--muted)" : "#2d3748",
                background: isActive ? "var(--bg)" : "transparent",
                cursor: isUnlocked ? "pointer" : "default",
              }}>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{
                    background: isActive ? "var(--accent)" : revealed.has(i) ? "#1a4a2a" : "var(--border)",
                    color: isActive ? "#000" : revealed.has(i) ? "var(--accent)" : "var(--muted)",
                  }}>
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--accent)" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Left: explanation */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                {step.module}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-medium"
                style={{ background: "#0f2a1a", color: step.badge.color, border: `1px solid ${step.badge.color}33` }}>
                {step.badge.text}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {step.description}
            </p>
          </div>

          {/* Stat chip */}
          <div className="rounded-xl p-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Measurement</p>
            <p className="font-semibold text-base">{step.stat(entry)}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {activeStep > 0 && (
              <button
                onClick={() => goToStep(activeStep - 1)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}>
                ← Previous
              </button>
            )}
            {!isLast ? (
              <button
                onClick={() => goToStep(activeStep + 1)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                style={{ background: "var(--accent)", color: "#000" }}>
                Next Step →
              </button>
            ) : (
              <div className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-center"
                style={{ background: "#0f2a1a", color: "var(--accent)", border: "1px solid #1a4a2a" }}>
                ✓ Pipeline complete — {entry.angle_deg.toFixed(1)}° from horizontal
              </div>
            )}
          </div>
        </div>

        {/* Right: image */}
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden aspect-[4/3]"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse"
                style={{ background: "var(--bg)" }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
              </div>
            )}
            <Image
              key={`${entry.slug}-${step.imageKey}`}
              src={`/${entry.paths[step.imageKey]}`}
              alt={step.imageLabel}
              fill
              className="object-contain transition-opacity duration-300"
              style={{ opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
              unoptimized
            />
          </div>
          <p className="mt-2 text-xs text-center" style={{ color: "var(--muted)" }}>
            {step.imageLabel}
          </p>

          {/* Colour legend for segmentation step */}
          {activeStep === 1 && (
            <div className="mt-3 flex justify-center gap-4 text-xs">
              {[
                { color: "#2d2d2d", label: "Background" },
                { color: "#dc3c3c", label: "Fruit body" },
                { color: "#3cc850", label: "Peduncle / Crown" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
                    style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
