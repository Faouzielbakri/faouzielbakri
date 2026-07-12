/**
 * Literal miniature of each capability layer, painted portrait (9:16) — a
 * phone UI for Interface, an orchestration graph for AI, a terminal
 * exchange for API, a schema + store for Data, a rack + edge for
 * Infrastructure. SVG so they stay crisp inside the tilted stack glass and
 * tint with the layer color.
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
  /* A phone app screen: status bar, hero, media card, CTA, tab bar */
  interface: (color) => (
    <svg viewBox="0 0 160 284" className="h-full w-full" aria-hidden>
      <rect x="8" y="6" width="144" height="272" rx="14" fill={surface} stroke={line} />
      {/* status bar */}
      <rect x="62" y="14" width="36" height="7" rx="3.5" fill={ink} opacity="0.85" />
      <circle cx="136" cy="18" r="3" fill={line} />
      <circle cx="126" cy="18" r="3" fill={line} />
      {/* nav */}
      <rect x="20" y="36" width="40" height="9" rx="4.5" fill={color} opacity="0.9" />
      <rect x="116" y="36" width="24" height="9" rx="4.5" fill={line} />
      {/* headline */}
      <rect x="20" y="62" width="112" height="13" rx="6.5" fill={ink} />
      <rect x="20" y="81" width="82" height="13" rx="6.5" fill={ink} />
      <rect x="20" y="102" width="118" height="5" rx="2.5" fill={line} />
      <rect x="20" y="112" width="96" height="5" rx="2.5" fill={line} />
      {/* media card */}
      <rect x="20" y="130" width="120" height="76" rx="10" fill="none" stroke={line} />
      <path
        d="M26 196 l30 -30 20 16 26 -26 26 30"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="150" r="8" fill={color} opacity="0.5" />
      {/* CTA */}
      <rect x="20" y="220" width="76" height="18" rx="9" fill={color} />
      <rect x="104" y="220" width="36" height="18" rx="9" fill="none" stroke={line} />
      {/* tab bar */}
      <line x1="8" y1="254" x2="152" y2="254" stroke={line} />
      <circle cx="44" cy="266" r="4" fill={color} />
      <circle cx="80" cy="266" r="4" fill={line} />
      <circle cx="116" cy="266" r="4" fill={line} />
    </svg>
  ),

  /* Vertical orchestration: brief in → LLM core → tools fan → answer out */
  agents: (color) => (
    <svg viewBox="0 0 160 284" className="h-full w-full" aria-hidden>
      {/* input */}
      <rect x="48" y="14" width="64" height="22" rx="11" fill={surface} stroke={line} />
      <text x="80" y="29" textAnchor="middle" fontFamily={mono} fontSize="10" fill={ink}>
        brief
      </text>
      <path d="M80 36 v28" stroke={muted} strokeDasharray="4 4" />
      {/* core */}
      <rect x="44" y="66" width="72" height="44" rx="12" fill={color} />
      <text
        x="80"
        y="93"
        textAnchor="middle"
        fontFamily={mono}
        fontSize="15"
        fontWeight="bold"
        fill={surface}
      >
        LLM
      </text>
      {/* fan to tools */}
      <path d="M62 110 L34 146" stroke={muted} strokeDasharray="4 4" />
      <path d="M98 110 L126 146" stroke={muted} strokeDasharray="4 4" />
      <path d="M80 110 v36" stroke={muted} strokeDasharray="4 4" />
      {(
        [
          [10, 146, "web"],
          [58, 146, "rag"],
          [106, 146, "tools"],
        ] as const
      ).map(([x, y, label]) => (
        <g key={label}>
          <rect x={x} y={y} width="44" height="22" rx="8" fill={surface} stroke={line} />
          <text
            x={x + 22}
            y={y + 15}
            textAnchor="middle"
            fontFamily={mono}
            fontSize="9.5"
            fill={ink}
          >
            {label}
          </text>
        </g>
      ))}
      {/* results feed back and stream out */}
      <path d="M32 168 L62 204 M80 168 v36 M128 168 L98 204" stroke={muted} strokeDasharray="4 4" />
      <rect x="36" y="208" width="88" height="30" rx="9" fill={surface} stroke={color} strokeWidth="1.5" />
      <rect x="44" y="216" width="60" height="4" rx="2" fill={line} />
      <rect x="44" y="225" width="44" height="4" rx="2" fill={line} />
      {/* token stream */}
      <circle cx="80" cy="250" r="3" fill={color} />
      <circle cx="80" cy="261" r="2.4" fill={color} opacity="0.6" />
      <circle cx="80" cy="271" r="1.8" fill={color} opacity="0.35" />
    </svg>
  ),

  /* Portrait terminal: request → response → live socket */
  api: (color) => (
    <svg viewBox="0 0 160 284" className="h-full w-full" aria-hidden>
      <rect x="8" y="8" width="144" height="268" rx="12" fill={surface} stroke={line} />
      <line x1="8" y1="30" x2="152" y2="30" stroke={line} />
      <circle cx="22" cy="19" r="3" fill={line} />
      <circle cx="34" cy="19" r="3" fill={line} />
      <text x="20" y="54" fontFamily={mono} fontSize="10.5" fill={ink}>
        POST /api/
      </text>
      <text x="20" y="68" fontFamily={mono} fontSize="10.5" fill={ink}>
        checkout
      </text>
      <text x="20" y="90" fontFamily={mono} fontSize="9" fill={muted}>
        {'{ "amount": 249,'}
      </text>
      <text x="20" y="103" fontFamily={mono} fontSize="9" fill={muted}>
        {'  "currency": "MAD" }'}
      </text>
      <text x="20" y="128" fontFamily={mono} fontSize="10.5" fill={color} fontWeight="bold">
        → 201 Created
      </text>
      <text x="20" y="142" fontFamily={mono} fontSize="9" fill={muted}>
        42ms
      </text>
      <line x1="20" y1="158" x2="140" y2="158" stroke={line} strokeDasharray="3 4" />
      <text x="20" y="180" fontFamily={mono} fontSize="10" fill={ink}>
        ws ⟶
      </text>
      <text x="20" y="194" fontFamily={mono} fontSize="10" fill={ink}>
        order.updated
      </text>
      {/* live pulse */}
      <path
        d="M22 224 h22 l8 -12 10 24 8 -12 h30"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="122" cy="224" r="4" fill={color} />
      <text x="20" y="254" fontFamily={mono} fontSize="9" fill={muted}>
        3 clients subscribed
      </text>
    </svg>
  ),

  /* Schema on top, the store it lives in below */
  data: (color) => (
    <svg viewBox="0 0 160 284" className="h-full w-full" aria-hidden>
      {/* table */}
      <rect x="16" y="12" width="128" height="118" rx="10" fill={surface} stroke={line} />
      <rect x="16" y="12" width="128" height="28" rx="10" fill={color} opacity="0.16" />
      <text x="28" y="30" fontFamily={mono} fontSize="10.5" fontWeight="bold" fill={ink}>
        orders
      </text>
      {(
        [
          ["id", "uuid pk", 60],
          ["user_id", "uuid fk", 82],
          ["total", "numeric", 104],
          ["status", "enum", 126],
        ] as const
      ).map(([key, type, y]) => (
        <g key={key}>
          <text x="28" y={y - 6} fontFamily={mono} fontSize="9.5" fill={ink}>
            {key}
          </text>
          <text x="92" y={y - 6} fontFamily={mono} fontSize="9" fill={muted}>
            {type}
          </text>
          {y < 126 && <line x1="24" y1={y + 2} x2="136" y2={y + 2} stroke={line} />}
        </g>
      ))}
      {/* link down */}
      <path d="M80 134 v26" stroke={muted} strokeDasharray="3 3" />
      <path d="M76 154 l4 8 4 -8" fill="none" stroke={muted} />
      {/* store */}
      <ellipse cx="80" cy="182" rx="44" ry="13" fill={surface} stroke={color} strokeWidth="1.5" />
      <path d="M36 182 v66 a44 13 0 0 0 88 0 v-66" fill={surface} stroke={color} strokeWidth="1.5" />
      <ellipse cx="80" cy="182" rx="44" ry="13" fill={color} opacity="0.14" />
      <path d="M36 212 a44 13 0 0 0 88 0" fill="none" stroke={color} opacity="0.5" />
      <path d="M36 242 a44 13 0 0 0 88 0" fill="none" stroke={color} opacity="0.35" />
      <text x="80" y="230" textAnchor="middle" fontFamily={mono} fontSize="9.5" fill={ink}>
        postgres
      </text>
    </svg>
  ),

  /* Rack units shipping down to the edge */
  infra: (color) => (
    <svg viewBox="0 0 160 284" className="h-full w-full" aria-hidden>
      {[16, 52, 88].map((y, i) => (
        <g key={y}>
          <rect x="20" y={y} width="120" height="28" rx="7" fill={surface} stroke={line} />
          <circle cx="36" cy={y + 14} r="4.5" fill={i === 1 ? color : line} />
          {i === 1 && <circle cx="36" cy={y + 14} r="8.5" fill="none" stroke={color} opacity="0.4" />}
          <line x1="50" y1={y + 10} x2="108" y2={y + 10} stroke={line} />
          <line x1="50" y1={y + 19} x2="94" y2={y + 19} stroke={line} />
          <rect x="114" y={y + 8} width="18" height="12" rx="3" fill={color} opacity={0.3 + i * 0.25} />
        </g>
      ))}
      <text x="80" y="134" textAnchor="middle" fontFamily={mono} fontSize="8.5" fill={muted}>
        hetzner · docker · dokploy
      </text>
      {/* deploy arrow */}
      <path d="M80 144 v28" stroke={muted} strokeDasharray="4 3" />
      <path d="M76 166 l4 8 4 -8" fill="none" stroke={muted} />
      {/* cloud / edge */}
      <path
        d="M46 226 a18 18 0 0 1 9 -34 a23 23 0 0 1 44 -7 a17 17 0 0 1 14 30 a15 15 0 0 1 -12 11 z"
        fill={surface}
        stroke={color}
        strokeWidth="1.5"
      />
      <text x="80" y="210" textAnchor="middle" fontFamily={mono} fontSize="10" fill={ink}>
        edge
      </text>
      <text x="80" y="252" textAnchor="middle" fontFamily={mono} fontSize="9.5" fill={muted}>
        99.9% up
      </text>
    </svg>
  ),
};
