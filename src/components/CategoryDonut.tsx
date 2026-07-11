"use client";

import { useI18n } from "@/lib/i18n";
import {
  categoryLabel,
  CATEGORY_META,
  CATEGORY_ORDER,
  type CategoryKey,
} from "@/lib/categories";

export type DonutSlice = { key: CategoryKey; value: number };

/**
 * Grafico de rosca (part-to-whole): distribuicao de consultas por categoria.
 * Cores categoricas validadas (skill dataviz). Identidade nunca so por cor —
 * a legenda traz emoji + rotulo + contagem + %, e ha gap de 2px entre arcos.
 */
export function CategoryDonut({ slices, unit }: { slices: DonutSlice[]; unit: string }) {
  const { lang } = useI18n();

  const data = slices
    .filter((s) => s.value > 0)
    .sort(
      (a, b) => CATEGORY_ORDER.indexOf(a.key) - CATEGORY_ORDER.indexOf(b.key)
    );
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const r = 48;
  const C = 2 * Math.PI * r;
  const gap = data.length > 1 ? 3 : 0; // gap de superficie entre arcos

  let offset = 0;
  const arcs = data.map((d) => {
    const frac = d.value / total;
    const len = Math.max(0, frac * C - gap);
    const arc = {
      key: d.key,
      color: CATEGORY_META[d.key].color,
      dash: `${len} ${C - len}`,
      dashoffset: -offset,
      pct: Math.round(frac * 100),
      value: d.value,
    };
    offset += frac * C;
    return arc;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      {/* Rosca */}
      <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#171717" strokeWidth="14" />
        {arcs.map((a) => (
          <circle
            key={a.key}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={a.color}
            strokeWidth="14"
            strokeDasharray={a.dash}
            strokeDashoffset={a.dashoffset}
            strokeLinecap="butt"
          >
            <title>
              {categoryLabel(a.key, lang)}: {a.value} ({a.pct}%)
            </title>
          </circle>
        ))}
        {/* Total ao centro (contra-rotacionado para ficar na horizontal) */}
        <g transform="rotate(90 60 60)">
          <text x="60" y="56" textAnchor="middle" className="fill-gray-100 font-mono" fontSize="20" fontWeight="700">
            {total}
          </text>
          <text x="60" y="72" textAnchor="middle" className="fill-neutral-500 font-mono uppercase" fontSize="7" letterSpacing="1">
            {unit}
          </text>
        </g>
      </svg>

      {/* Legenda */}
      <ul className="w-full space-y-1.5 font-mono text-xs">
        {arcs.map((a) => (
          <li key={a.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
            <span className="shrink-0">{CATEGORY_META[a.key].emoji}</span>
            <span className="truncate text-gray-200">{categoryLabel(a.key, lang)}</span>
            <span className="ml-auto shrink-0 text-muted">
              {a.value} · <span className="text-gray-300">{a.pct}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
