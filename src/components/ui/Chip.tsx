export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface/60 px-3 py-1 font-mono text-xs text-ink-soft">
      {children}
    </span>
  );
}
