// Bandeiras em SVG (renderizam bem no Android, ao contrario dos emojis 🇧🇷/🇨🇳).

export function FlagBR({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" className={className} aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#009c3b" />
      <path d="M14 3 25 10 14 17 3 10Z" fill="#ffdf00" />
      <circle cx="14" cy="10" r="4" fill="#002776" />
      <path d="M10.4 9.2a4 4 0 0 1 7.2 1.2" stroke="#fff" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

export function FlagCN({ className = "" }: { className?: string }) {
  const star = (cx: number, cy: number, r: number, rot = 0) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI / 180) * (rot + i * 72 - 90);
      const b = a + Math.PI / 5;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
      pts.push(`${cx + r * 0.4 * Math.cos(b)},${cy + r * 0.4 * Math.sin(b)}`);
    }
    return <polygon points={pts.join(" ")} fill="#ffde00" />;
  };
  return (
    <svg viewBox="0 0 28 20" className={className} aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#de2910" />
      {star(6, 6, 3.6)}
      {star(11.5, 3, 1.2, 20)}
      {star(13.5, 6, 1.2, -10)}
      {star(13.5, 9.5, 1.2, 15)}
      {star(11.5, 12, 1.2, 5)}
    </svg>
  );
}
