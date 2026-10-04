import * as Flags from "country-flag-icons/react/3x2";
import { ArrowDownRight, ArrowUpRight, Globe, Minus, Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small shared pieces of the admin dashboard. All render on the server. */

export const fmt = new Intl.NumberFormat("en-US");
export const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
export function countryName(code: string | null | undefined) {
  if (!code || code.length !== 2 || code === "XX") return "Unknown";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export function ago(from: number, now: number) {
  const s = Math.max(0, Math.round((now - from) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86_400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86_400)}d ago`;
}

export function Tile({
  className,
  tone = "paper",
  children,
}: {
  className?: string;
  tone?: "paper" | "ink" | "accent" | "sand";
  children: React.ReactNode;
}) {
  const tones = {
    paper: "border border-line bg-surface text-ink",
    ink: "bg-ink text-bg",
    accent: "bg-accent text-white",
    sand: "border border-[#eadfc9] bg-[#f6ecd8] text-ink",
  };
  return (
    <section className={cn("relative overflow-hidden rounded-[28px] p-6", tones[tone], className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[10px] uppercase tracking-[0.22em] opacity-60", className)}>{children}</p>
  );
}

/** Change against the previous period, with an arrow so colour is never the only cue. */
export function Delta({ now, before, className }: { now: number; before: number; className?: string }) {
  if (!before && !now) return null;
  const change = before ? Math.round(((now - before) / before) * 100) : null;
  const Icon = change === null || change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-current/10 px-2 py-0.5 text-[12px] font-medium tabular-nums",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {change === null ? "new" : `${change > 0 ? "+" : ""}${change}%`}
      <span className="sr-only"> against the previous period</span>
    </span>
  );
}

export function Flag({ code, className }: { code: string | null | undefined; className?: string }) {
  const Svg = code ? (Flags as Record<string, React.ComponentType<{ className?: string; title?: string }>>)[code.toUpperCase()] : undefined;
  if (!Svg) {
    return (
      <span className={cn("inline-flex items-center justify-center rounded-[3px] bg-bg text-muted", className)}>
        <Globe className="size-3" aria-hidden />
      </span>
    );
  }
  return <Svg className={cn("rounded-[3px] shadow-[0_0_0_1px_rgba(20,18,16,0.08)]", className)} title={countryName(code)} />;
}

export function DeviceIcon({ device, className }: { device: string | null | undefined; className?: string }) {
  const Icon = device === "mobile" ? Smartphone : device === "tablet" ? Tablet : Monitor;
  return <Icon className={className} aria-hidden />;
}

/** A ranked list with a soft bar behind each row. */
export function BarRow({
  lead,
  label,
  value,
  max,
  total,
}: {
  lead?: React.ReactNode;
  label: string;
  value: number;
  max: number;
  total: number;
}) {
  return (
    <li className="relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-sm">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-xl bg-bg"
        style={{ width: `${Math.max(4, (value / Math.max(1, max)) * 100)}%` }}
      />
      {lead ? <span className="relative shrink-0">{lead}</span> : null}
      <span className="relative min-w-0 flex-1 truncate">{label}</span>
      <span className="relative tabular-nums font-medium">{fmt.format(value)}</span>
      <span className="relative w-9 text-right text-[12px] tabular-nums text-muted">{pct(value, total)}%</span>
    </li>
  );
}

/** A tiny picture of each homepage hero. */
export function HeroGlyph({ hero, className }: { hero: string; className?: string }) {
  const common = { className, viewBox: "0 0 40 40", fill: "none", "aria-hidden": true } as const;
  switch (hero) {
    case "look":
      return (
        <svg {...common}>
          <rect width="40" height="40" rx="11" fill="#e8590c" />
          {[13, 27].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="21" r="6.5" fill="#faf7f2" stroke="#141210" strokeWidth="1.8" />
              <circle cx={cx + 1.5} cy="22" r="2.6" fill="#141210" />
              <path d={`M${cx - 5} 11.5h10`} stroke="#141210" strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      );
    case "scratch":
      return (
        <svg {...common}>
          <rect width="40" height="40" rx="11" fill="#d9dce1" />
          <path d="M-2 30 12 14l7 9 8-13 15 16v16H-2z" fill="#e8590c" />
          <path d="M6 9c6 6 9-3 14 3s8-2 14 4" stroke="#faf7f2" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case "watcher":
      return (
        <svg {...common}>
          <rect width="40" height="40" rx="11" fill="#f6ecd8" />
          <path d="M20 12V7" stroke="#141210" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="20" cy="6" r="2.2" fill="#e8590c" />
          <rect x="9" y="12" width="22" height="18" rx="6" fill="#fff" stroke="#141210" strokeWidth="1.8" />
          <circle cx="16" cy="20" r="2" fill="#141210" />
          <circle cx="24" cy="20" r="2" fill="#141210" />
          <path d="M16.5 25.5q3.5 2 7 0" stroke="#141210" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "break":
      return (
        <svg {...common}>
          <rect width="40" height="40" rx="11" fill="#141210" />
          <rect x="8" y="10" width="5" height="14" fill="#faf7f2" />
          <rect x="17" y="17" width="5" height="14" fill="#faf7f2" transform="rotate(28 19 24)" />
          <rect x="27" y="22" width="5" height="11" fill="#faf7f2" transform="rotate(-62 29 28)" />
          <circle cx="33" cy="12" r="2.6" fill="#e8590c" />
        </svg>
      );
    case "brief":
      return (
        <svg {...common}>
          <rect width="40" height="40" rx="11" fill="#fff" stroke="#e7e1d8" />
          <rect x="7" y="9" width="17" height="6" rx="1.5" fill="#0fa37a" transform="rotate(-3 15 12)" />
          <rect x="7" y="18" width="24" height="6" rx="1.5" fill="#141210" />
          <rect x="7" y="27" width="14" height="6" rx="1.5" fill="#e8a30c" transform="rotate(2 14 30)" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect width="40" height="40" rx="11" fill="#faf7f2" stroke="#e7e1d8" />
          <path d="M11 26 17 18l5 5 7-9" stroke="#6e6a63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
