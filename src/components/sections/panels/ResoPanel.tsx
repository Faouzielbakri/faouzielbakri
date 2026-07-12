"use client";

/**
 * RESO Khdma — the project IS a conversation, so the panel is one: a
 * WhatsApp thread that pitches the project in Darija-flavored messages,
 * with the mock hero on a phone beside it.
 */
import Link from "next/link";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { ChipRow, IndexLabel, PanelShell, type PanelProps } from "./shared";

function Bubble({
  side,
  children,
}: {
  side: "in" | "out";
  children: React.ReactNode;
}) {
  const out = side === "out";
  return (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed text-[#111b21] shadow-md ${
        out ? "ml-auto rounded-tr-sm bg-[#d9fdd3]" : "mr-auto rounded-tl-sm bg-white"
      }`}
    >
      {children}
    </div>
  );
}

export function ResoPanel(props: PanelProps) {
  const { project, world } = props;

  return (
    <PanelShell world={world}>
      <div className="grid items-center gap-12 lg:grid-cols-[6fr_5fr]">
        <div>
          <IndexLabel {...props} />
          <h3
            className="mt-4 font-extrabold leading-tight"
            style={{
              fontFamily: "var(--font-tajawal)",
              fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
              color: world.fg,
            }}
          >
            RESO Khdma
          </h3>

          {/* The pitch, as a chat */}
          <div className="mt-6 max-w-md space-y-3">
            <Bubble side="out">Where do Moroccan workers actually look for jobs?</Bubble>
            <Bubble side="in">
              WhatsApp. So the platform lives there — an AI agent that speaks{" "}
              <strong>Darija, Arabic, and French</strong>.
            </Bubble>
            <Bubble side="out">And how does it match them?</Bubble>
            <Bubble side="in">
              Gemini embeddings + semantic search. A worker says what they do —
              recruiters find them, even when the words don&apos;t match. ✓✓
            </Bubble>
          </div>

          <ChipRow project={project} world={world} className="mt-6" max={5} />
          <div className="mt-8 flex items-center gap-5">
            <Link
              href={`/work/${project.slug}`}
              className="rounded-full px-6 py-3 text-sm font-bold transition-transform duration-200 hover:scale-[1.04]"
              style={{ background: world.cta.bg, color: world.cta.fg }}
            >
              Read case study →
            </Link>
          </div>
        </div>

        {/* The redesigned hero — desktop with the phone tucked in front */}
        <div className="relative hidden lg:block">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram="R"
          />
          {project.screenshots.mobile[0] && (
            <div className="absolute -bottom-8 -right-6 w-[22%]">
              <DeviceFrame
                src={project.screenshots.mobile[0]}
                alt={`${project.name} on mobile`}
                accent={project.accent}
                kind="mobile"
              />
            </div>
          )}
        </div>
        <div className="lg:hidden">
          <DeviceFrame
            src={project.screenshots.desktop[0]}
            alt={project.alt}
            accent={project.accent}
            kind="desktop"
            monogram="R"
            sizes="90vw"
          />
        </div>
      </div>
    </PanelShell>
  );
}
