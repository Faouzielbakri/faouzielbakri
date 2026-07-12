import Link from "next/link";

type ButtonProps = {
  href: string;
  variant?: "primary" | "outline";
  children: React.ReactNode;
  external?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200";

const variants = {
  primary: "bg-ink text-bg hover:bg-accent",
  outline: "border border-line text-ink hover:border-ink",
} as const;

export function Button({ href, variant = "primary", children, external }: ButtonProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variants[variant]}`}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}
