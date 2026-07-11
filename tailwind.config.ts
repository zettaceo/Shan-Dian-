import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema ultra-escuro / cyberpunk terminal
        base: "#0a0a0a",
        panel: "#0d0d0d",
        "panel-2": "#111111",
        line: "#1c1c1c",
        "line-soft": "#171717",
        neon: "#22c55e", // verde neon (ON / OK / salvar)
        "neon-dim": "#16a34a",
        gold: "#f59e0b", // laranja / dourado (titulos de secao)
        "gold-dim": "#b45309",
        cyan: "#22d3ee", // valores tecnicos / codigos
        muted: "#6b7280", // texto secundario
        "muted-2": "#3f3f46",
        danger: "#ef4444",
        warn: "#eab308",
      },
      fontFamily: {
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(34,197,94,0.25), 0 0 18px -6px rgba(34,197,94,0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
