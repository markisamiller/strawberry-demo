"use client";

import { useEffect } from "react";

export default function AboutModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div
        className="relative max-w-2xl w-full rounded-2xl p-8 overflow-y-auto max-h-[90vh]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}>
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-1">How the Pipeline Works</h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          AIDA 2158 Final Project — Mark Miller · Red Deer Polytechnic · April 2026
        </p>

        <div className="space-y-6">
          {/* Overview */}
          <div className="p-4 rounded-xl text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--muted)" }}>
              This is a complete deep learning perception pipeline for robotic strawberry
              harvesting. It takes a raw field photograph and produces the one number a
              robot arm needs: the angle to rotate its gripper before cutting the peduncle.
            </p>
          </div>

          {/* Steps */}
          {[
            {
              num: "1",
              title: "YOLOv11-seg — Strawberry Detection",
              color: "#3b82f6",
              stats: "mAP50 0.927 (box) · 0.918 (mask) · trained on 2,800 images",
              body: "YOLOv11 (small, pre-trained on COCO) was fine-tuned on 2,800 annotated field images for 48 epochs with early stopping. It detects and segments every strawberry in the scene simultaneously. The largest bounding-box detection is selected as the harvest target. A crop is extracted with asymmetric padding: extra height above the berry (100% of bbox height) ensures the peduncle and crown are always in frame.",
            },
            {
              num: "2",
              title: "U-Net V2 — 3-Class Segmentation",
              color: "#22c55e",
              stats: "Best val mIoU 0.584 · Peduncle IoU 0.195 · trained on 1,197 per-fruit crops",
              body: "A standard U-Net (~31M parameters) was trained to segment each crop into three classes: background, fruit body, and peduncle/crown. Four contributors annotated 357 source images using Roboflow + SAM3, producing 1,197 per-fruit crops after YOLO-based expansion. Class-weighted loss (background 1×, fruit 4.6×, peduncle 12×) compensates for the extreme class imbalance — peduncle pixels are only ~1% of each image. Three training runs tuned the peduncle weight from unweighted (recall 33.5%) through 26× over-corrected (precision 18.7%) to the final 12× cap (recall 54%, precision 23.4%).",
            },
            {
              num: "3",
              title: "PCA — Stem Angle Extraction",
              color: "#f59e0b",
              stats: "178/192 valid angles · 92.7% coverage · angles folded to [−90°, +90°]",
              body: "After the U-Net predicts the peduncle class, the largest connected component is retained to remove noise. Principal Component Analysis is then applied to the set of peduncle pixel coordinates. The first principal component — the axis of maximum variance — points along the stem. Its angle from horizontal is the gripper rotation angle. A mean angle of ~12° reflects the near-upright growth direction of most strawberries in this dataset.",
            },
          ].map((s) => (
            <div key={s.num}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}55` }}>
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-base">{s.title}</h3>
                  <p className="text-xs" style={{ color: s.color }}>{s.stats}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed pl-10" style={{ color: "var(--muted)" }}>{s.body}</p>
            </div>
          ))}

          {/* Dataset */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <h3 className="font-semibold mb-2">Dataset & Annotation</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Training images (YOLO)", "2,800"],
                ["Validation images (YOLO)", "100"],
                ["Test images (YOLO)", "200"],
                ["Manually annotated sources", "357"],
                ["Per-fruit training crops", "1,197"],
                ["Annotation contributors", "4"],
                ["Tools used", "Roboflow + SAM3"],
                ["Annotations vs minimum required", "3.5× (357 vs 100)"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between p-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-2.5 rounded-xl font-semibold text-sm transition-colors"
          style={{ background: "var(--accent)", color: "#000" }}>
          Close
        </button>
      </div>
    </div>
  );
}
