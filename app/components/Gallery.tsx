"use client";

import Image from "next/image";
import type { DemoEntry } from "../types";

interface Props {
  entries: DemoEntry[];
  selected: DemoEntry | null;
  onSelect: (entry: DemoEntry) => void;
}

const CONTRIBUTOR_COLORS: Record<string, string> = {
  aida2154:    "#f59e0b",
  biberdork:   "#3b82f6",
  hervejunior: "#a855f7",
  markm:       "#22c55e",
};

export default function Gallery({ entries, selected, onSelect }: Props) {
  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--muted)" }}>
        <span className="font-medium">Annotator:</span>
        {Object.entries(CONTRIBUTOR_COLORS).map(([name, color]) => (
          <span key={name} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
            {name}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
        {entries.map((entry) => {
          const isSelected = selected?.slug === entry.slug;
          const color = CONTRIBUTOR_COLORS[entry.contributor] ?? "#64748b";
          return (
            <button
              key={entry.slug}
              onClick={() => onSelect(entry)}
              title={`${entry.contributor} · ${entry.angle_deg}°`}
              className="relative aspect-square rounded-lg overflow-hidden group transition-all duration-150"
              style={{
                outline: isSelected ? `2px solid ${color}` : "2px solid transparent",
                outlineOffset: "2px",
                boxShadow: isSelected ? `0 0 12px ${color}55` : "none",
              }}>
              <Image
                src={`/${entry.paths.thumbnail}`}
                alt={`Strawberry crop ${entry.id + 1}`}
                fill
                className="object-cover transition-transform duration-150 group-hover:scale-110"
                sizes="80px"
                unoptimized
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
                <span className="text-white text-xs font-bold">{entry.angle_deg}°</span>
              </div>
              {/* Contributor dot */}
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: color }} />
              {/* Selected check */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.35)" }}>
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white drop-shadow-lg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
