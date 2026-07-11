import type { ReactNode } from "react";

/** Semaforo decorativo (bolinhas vermelha, amarela e verde). */
function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-danger" />
      <span className="h-2.5 w-2.5 rounded-full bg-warn" />
      <span className="h-2.5 w-2.5 rounded-full bg-neon" />
    </div>
  );
}

type CardProps = {
  title: string;
  badge?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Painel base no estilo do design de referencia:
 * semaforo + icone + titulo monospace maiusculo a esquerda,
 * badge tecnico no canto superior direito.
 */
export function Card({ title, badge, icon, children, className }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-line bg-panel/80 backdrop-blur-sm ${className ?? ""}`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <TrafficLights />
          {icon ? <span className="text-gold shrink-0">{icon}</span> : null}
          <h2 className="truncate font-mono text-sm font-semibold uppercase tracking-[0.2em] text-gray-200">
            {title}
          </h2>
        </div>
        {badge ? (
          <span className="shrink-0 rounded border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-2">
            {badge}
          </span>
        ) : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
