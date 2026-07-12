"use client";

import { useUiStore, type AudienceIntent } from "@/lib/store";

const options: { value: Exclude<AudienceIntent, null>; label: string; hint: string }[] = [
  { value: "hire", label: "Hire me", hint: "for a team" },
  { value: "project", label: "Work with me", hint: "on a project" },
];

/**
 * Hero segmented toggle. Sets the visitor's intent, which tailors microcopy
 * in Capabilities and Contact, and scrolls to the contact section.
 */
export function IntentToggle() {
  const intent = useUiStore((s) => s.audienceIntent);
  const setIntent = useUiStore((s) => s.setAudienceIntent);

  return (
    <div
      role="group"
      aria-label="What brings you here?"
      className="inline-flex rounded-full border border-line bg-surface/70 p-1 backdrop-blur"
    >
      {options.map((opt) => {
        const active = intent === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              setIntent(opt.value);
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
              active ? "bg-ink text-bg" : "text-ink-soft hover:text-ink"
            }`}
          >
            {opt.label}
            <span className="ml-1.5 hidden text-xs opacity-60 sm:inline">{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
