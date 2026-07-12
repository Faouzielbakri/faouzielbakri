/**
 * Literal miniature of each capability layer — a browser UI for Interface,
 * an agent graph for AI, a terminal exchange for API, a table + store for
 * Data, a rack + cloud for Infrastructure. Drawn as SVG so they stay crisp
 * inside the tilted stack glass and tint with the layer color.
 */

const ink = "var(--color-ink-soft)";
const muted = "var(--color-muted)";
const line = "var(--color-line)";
const surface = "var(--color-surface)";
const mono = "var(--font-geist-mono), monospace";

export function LayerArt({ id, color }: { id: string; color: string }) {
  const art = ART[id];
  return art ? art(color) : null;
}

const ART: Record<string, (color: string) => React.ReactNode> = {
  /* A browser window: chrome, nav, headline, CTA, media card */
  interface: (color) => (
    <svg viewBox="0 0 304 160" className="h-full w-full" aria-hidden>
      <rect x="16" y="8" width="272" height="144" rx="10" fill={surface} stroke={line} />
      <line x1="16" y1="34" x2="288" y2="34" stroke={line} />
      <circle cx="30" cy="21" r="3.2" fill={line} />
      <circle cx="42" cy="21" r="3.2" fill={line} />
      <circle cx="54" cy="21" r="3.2" fill={line} />
      <rect x="70" y="14" width="150" height="14" rx="7" fill="none" stroke={line} />
      <text x="80" y="24" fontFamily={mono} fontSize="9" fill={muted}>
        https://
      </text>
      {/* nav */}
      <rect x="30" y="44" width="52" height="8" rx="4" fill={color} opacity="0.85" />
      <rect x="216" y="44" width="26" height="8" rx="4" fill={line} />
      <rect x="248" y="44" width="26" height="8" rx="4" fill={line} />
      {/* headline + copy */}
      <rect x="30" y="68" width="148" height="12" rx="6" fill={ink} />
      <rect x="30" y="86" width="104" height="12" rx="6" fill={ink} />
      <rect x="30" y="108" width="150" height="5" rx="2.5" fill={line} />
      <rect x="30" y="118" width="126" height="5" rx="2.5" fill={line} />
      {/* CTA */}
      <rect x="30" y="132" width="62" height="15" rx="7.5" fill={color} />
      {/* media card */}
      <rect x="200" y="66" width="76" height="81" rx="8" fill="none" stroke={line} />
      <path d="M204 132 l22 -22 14 12 18 -20 18 22" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="216" cy="84" r="6" fill={color} opacity="0.5" />
    </svg>
  ),

  /* Agent graph: model core orchestrating tools, data, and retrieval */
  agents: (color) => (
    <svg viewBox="0 0 304 160" className="h-full w-full" aria-hidden>
      {/* edges */}
      <path d="M120 80 L58 38" stroke={muted} strokeDasharray="4 4" />
      <path d="M120 80 L58 122" stroke={muted} strokeDasharray="4 4" />
      <path d="M184 80 L246 38" stroke={muted} strokeDasharray="4 4" />
      <path d="M184 80 L246 122" stroke={muted} strokeDasharray="4 4" />
      {/* core */}
      <rect x="116" y="60" width="72" height="40" rx="12" fill={color} />
      <text x="152" y="85" textAnchor="middle" fontFamily={mono} fontSize="13" fontWeight="bold" fill={surface}>
        LLM
      </text>
      {/* satellites */}
      {(
        [
          [40, 30, "tools"],
          [40, 114, "db"],
          [228, 30, "web"],
          [228, 114, "rag"],
        ] as const
      ).map(([x, y, label]) => (
        <g key={label}>
          <rect x={x} y={y} width="40" height="24" rx="8" fill={surface} stroke={line} />
          <text
            x={x + 20}
            y={y + 16}
            textAnchor="middle"
            fontFamily={mono}
            fontSize="9"
            fill={ink}
          >
            {label}
          </text>
        </g>
      ))}
      {/* token stream out of the core */}
      <circle cx="152" cy="116" r="2.5" fill={color} />
      <circle cx="152" cy="128" r="2" fill={color} opacity="0.6" />
      <circle cx="152" cy="138" r="1.5" fill={color} opacity="0.35" />
    </svg>
  ),

  /* Terminal: request in, response out, socket event streaming */
  api: (color) => (
    <svg viewBox="0 0 304 160" className="h-full w-full" aria-hidden>
      <rect x="16" y="8" width="272" height="144" rx="10" fill={surface} stroke={line} />
      <line x1="16" y1="30" x2="288" y2="30" stroke={line} />
      <circle cx="30" cy="19" r="3.2" fill={line} />
      <circle cx="42" cy="19" r="3.2" fill={line} />
      <text x="32" y="52" fontFamily={mono} fontSize="11" fill={ink}>
        POST /api/checkout
      </text>
      <text x="32" y="70" fontFamily={mono} fontSize="10" fill={muted}>
        {'{ "amount": 249, "currency": "MAD" }'}
      </text>
      <text x="32" y="92" fontFamily={mono} fontSize="11" fill={color} fontWeight="bold">
        → 201 Created · 42ms
      </text>
      <line x1="32" y1="104" x2="272" y2="104" stroke={line} strokeDasharray="3 4" />
      <text x="32" y="124" fontFamily={mono} fontSize="10" fill={ink}>
        ws ⟶ order.updated
      </text>
      {/* live pulse */}
      <path d="M180 120 h14 l6 -9 8 18 6 -9 h20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="240" cy="120" r="3.5" fill={color} />
      <text x="32" y="142" fontFamily={mono} fontSize="9" fill={muted}>
        3 clients subscribed
      </text>
    </svg>
  ),

  /* A real table + the store it lives in */
  data: (color) => (
    <svg viewBox="0 0 304 160" className="h-full w-full" aria-hidden>
      {/* table */}
      <rect x="22" y="24" width="168" height="112" rx="8" fill={surface} stroke={line} />
      <rect x="22" y="24" width="168" height="26" rx="8" fill={color} opacity="0.16" />
      <text x="34" y="41" fontFamily={mono} fontSize="10" fontWeight="bold" fill={ink}>
        orders
      </text>
      {(
        [
          ["id", "uuid pk", 68],
          ["user_id", "uuid fk", 90],
          ["total", "numeric", 112],
          ["status", "enum", 134],
        ] as const
      ).map(([key, type, y]) => (
        <g key={key}>
          <text x="34" y={y - 4} fontFamily={mono} fontSize="9.5" fill={ink}>
            {key}
          </text>
          <text x="120" y={y - 4} fontFamily={mono} fontSize="9.5" fill={muted}>
            {type}
          </text>
          {y < 134 && <line x1="30" y1={y + 4} x2="182" y2={y + 4} stroke={line} />}
        </g>
      ))}
      {/* store */}
      <ellipse cx="248" cy="46" rx="30" ry="11" fill={surface} stroke={color} strokeWidth="1.5" />
      <path d="M218 46 v62 a30 11 0 0 0 60 0 v-62" fill={surface} stroke={color} strokeWidth="1.5" />
      <ellipse cx="248" cy="46" rx="30" ry="11" fill={color} opacity="0.14" />
      <path d="M218 74 a30 11 0 0 0 60 0" fill="none" stroke={color} opacity="0.5" />
      {/* link */}
      <path d="M190 88 h20" stroke={muted} strokeDasharray="3 3" />
      <path d="M206 84 l6 4 -6 4" fill="none" stroke={muted} />
    </svg>
  ),

  /* Rack units shipping to the cloud */
  infra: (color) => (
    <svg viewBox="0 0 304 160" className="h-full w-full" aria-hidden>
      {[36, 70, 104].map((y, i) => (
        <g key={y}>
          <rect x="26" y={y} width="132" height="26" rx="6" fill={surface} stroke={line} />
          <circle cx="42" cy={y + 13} r="4" fill={i === 1 ? color : line} />
          {i === 1 && <circle cx="42" cy={y + 13} r="7.5" fill="none" stroke={color} opacity="0.4" />}
          <line x1="58" y1={y + 9} x2="118" y2={y + 9} stroke={line} />
          <line x1="58" y1={y + 17} x2="102" y2={y + 17} stroke={line} />
          <rect x="128" y={y + 7} width="22" height="12" rx="3" fill={color} opacity={0.25 + i * 0.25} />
        </g>
      ))}
      <text x="26" y="148" fontFamily={mono} fontSize="9" fill={muted}>
        hetzner · docker · dokploy
      </text>
      {/* cloud */}
      <path
        d="M212 78 a16 16 0 0 1 8 -30 a20 20 0 0 1 38 -6 a15 15 0 0 1 12 26 a13 13 0 0 1 -10 10 z"
        fill={surface}
        stroke={color}
        strokeWidth="1.5"
      />
      <text x="238" y="64" textAnchor="middle" fontFamily={mono} fontSize="9" fill={ink}>
        edge
      </text>
      {/* deploy arrows */}
      <path d="M162 60 q24 -10 44 -8" fill="none" stroke={muted} strokeDasharray="4 3" />
      <path d="M200 48 l8 3 -6 6" fill="none" stroke={muted} />
      <path d="M238 84 v34" stroke={muted} strokeDasharray="4 3" />
      <path d="M234 112 l4 8 4 -8" fill="none" stroke={muted} />
      <text x="238" y="136" textAnchor="middle" fontFamily={mono} fontSize="9" fill={muted}>
        99.9% up
      </text>
    </svg>
  ),
};
