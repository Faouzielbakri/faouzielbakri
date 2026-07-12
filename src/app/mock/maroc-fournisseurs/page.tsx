import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * Redesigned Maroc Fournisseurs hero, built purely to be screenshotted for the
 * portfolio (the client's live landing doesn't do the product justice, and we
 * don't touch client code). Not linked anywhere, not indexed.
 */
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Maroc Fournisseurs — Trouvez le bon fournisseur marocain",
  robots: { index: false, follow: false },
};

const MAROON = "#a61e4d";
const CRIMSON = "#c2255c";
const INK = "#3d1522";

function SearchIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className} style={style} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.4 6.2 20.4l1.1-6.5-4.7-4.6 6.5-.95L12 2.5Z" />
    </svg>
  );
}

function SupplierCard({
  name,
  city,
  rating,
  reviews,
  tags,
  featured = false,
}: {
  name: string;
  city: string;
  rating: string;
  reviews: number;
  tags: string[];
  featured?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3.5 rounded-2xl border bg-white p-3.5"
      style={{
        borderColor: featured ? "rgba(194,37,92,0.35)" : "rgba(61,21,34,0.08)",
        boxShadow: featured ? "0 12px 30px -14px rgba(166,30,77,0.4)" : "0 4px 14px -10px rgba(61,21,34,0.25)",
      }}
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold text-white"
        style={{ background: `linear-gradient(140deg, ${CRIMSON}, ${MAROON})` }}
      >
        {name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold" style={{ color: INK }}>
            {name}
          </p>
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" style={{ color: CRIMSON }} aria-hidden>
            <path
              fill="currentColor"
              d="M12 2l2.4 1.8 3-.2 1 2.8 2.5 1.6-1 2.9 1 2.9-2.5 1.6-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8-2.5-1.6 1-2.9-1-2.9 2.5-1.6 1-2.8 3 .2L12 2Z"
            />
            <path fill="#fff" d="m8.6 12 2.2 2.2 4.6-4.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-0.5 text-xs" style={{ color: "rgba(61,21,34,0.55)" }}>
          {city}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "rgba(194,37,92,0.08)", color: MAROON }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end">
        <div className="flex items-center gap-1">
          <StarIcon className="size-3.5" />
          <span className="text-sm font-bold" style={{ color: INK }}>
            {rating}
          </span>
        </div>
        <p className="mt-0.5 text-[10px]" style={{ color: "rgba(61,21,34,0.45)" }}>
          {reviews} avis
        </p>
      </div>
    </div>
  );
}

function SearchPanel() {
  return (
    <div className="relative w-[420px]">
      <div
        className="rounded-[1.8rem] border bg-[#fbf6f1] p-4 shadow-2xl"
        style={{ borderColor: "rgba(61,21,34,0.08)" }}
      >
        {/* Search bar */}
        <div
          className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5"
          style={{ borderColor: "rgba(194,37,92,0.25)", boxShadow: "0 8px 22px -14px rgba(166,30,77,0.5)" }}
        >
          <SearchIcon className="size-5" style={{ color: CRIMSON }} />
          <span className="text-sm font-medium" style={{ color: INK }}>
            fournisseur textile
          </span>
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse" style={{ background: CRIMSON }} />
          <span
            className="ml-auto rounded-lg px-2.5 py-1 text-[10px] font-bold text-white"
            style={{ background: CRIMSON }}
          >
            0,3 s
          </span>
        </div>

        {/* Result meta */}
        <p className="mt-3 px-1 text-[11px] font-semibold" style={{ color: "rgba(61,21,34,0.5)" }}>
          38 fournisseurs · triés par pertinence
        </p>

        {/* Results */}
        <div className="mt-2 space-y-2.5">
          <SupplierCard
            name="Atlas Textile"
            city="Casablanca"
            rating="4.8"
            reviews={214}
            tags={["Coton", "Confection", "Export"]}
            featured
          />
          <SupplierCard
            name="Sté Rif Filature"
            city="Fès"
            rating="4.6"
            reviews={98}
            tags={["Fil", "Teinture"]}
          />
          <SupplierCard
            name="Medina Denim"
            city="Tanger"
            rating="4.9"
            reviews={156}
            tags={["Jean", "Grandes séries"]}
          />
        </div>
      </div>

      {/* Floating negotiation chat */}
      <div
        className="absolute -bottom-8 -left-10 w-[250px] rounded-2xl border bg-white p-3.5 shadow-2xl"
        style={{ borderColor: "rgba(61,21,34,0.08)" }}
      >
        <div className="flex items-center gap-2 border-b pb-2.5" style={{ borderColor: "rgba(61,21,34,0.07)" }}>
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: "#22c55e" }} />
            <span className="relative inline-flex size-2.5 rounded-full" style={{ background: "#22c55e" }} />
          </span>
          <p className="text-xs font-bold" style={{ color: INK }}>
            Négociation · Atlas Textile
          </p>
        </div>
        <div className="mt-3 space-y-2">
          <div
            className="w-fit max-w-[85%] rounded-xl rounded-tl-sm px-3 py-1.5 text-[11px] leading-snug"
            style={{ background: "#f1f0f2", color: INK }}
          >
            Bonjour, 5 000 m de coton bio, prix ?
          </div>
          <div
            className="ml-auto w-fit max-w-[85%] rounded-xl rounded-tr-sm px-3 py-1.5 text-[11px] leading-snug text-white"
            style={{ background: MAROON }}
          >
            42 DH/m, livraison sous 10 j 👍
          </div>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = ["Textile", "Agroalimentaire", "BTP", "Emballage", "Cosmétique", "Plastique", "Métallurgie"];

export default function MarocFournisseursMockPage() {
  return (
    <div
      lang="fr"
      className={`${jakarta.className} min-h-screen`}
      style={{
        background: "linear-gradient(165deg, #fdf8f3 0%, #fbeee6 55%, #f7e3d8 100%)",
        color: INK,
      }}
    >
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-9 items-center justify-center rounded-xl text-lg font-black text-white"
            style={{ background: `linear-gradient(140deg, ${CRIMSON}, ${MAROON})` }}
          >
            M
          </span>
          <p className="text-lg font-extrabold tracking-tight">
            Maroc<span style={{ color: CRIMSON }}>Fournisseurs</span>
          </p>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium opacity-75 md:flex">
          <span>Fournisseurs</span>
          <span>Catégories</span>
          <span>Comment ça marche</span>
          <span>Tarifs</span>
        </nav>
        <span
          className="rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg"
          style={{ background: CRIMSON, boxShadow: "0 10px 24px -12px rgba(194,37,92,0.7)" }}
        >
          Créer un compte
        </span>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-20 pt-10 lg:grid-cols-[6fr_5fr]">
        <div>
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
            style={{ background: "rgba(194,37,92,0.1)", color: MAROON }}
          >
            <span className="size-2 rounded-full" style={{ background: CRIMSON }} />
            Plus de 500 fournisseurs vérifiés
          </p>
          <h1 className="text-[2.7rem] font-extrabold leading-[1.08] tracking-tight md:text-[3.6rem]">
            Trouvez le bon
            <br />
            fournisseur marocain
            <br />
            <span style={{ color: CRIMSON }}>en quelques secondes.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed opacity-70">
            La marketplace B2B qui connecte acheteurs et fournisseurs du Maroc. Recherche
            instantanée, profils vérifiés et négociation en temps réel — le tout au même endroit.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold text-white shadow-lg"
              style={{ background: CRIMSON, boxShadow: "0 14px 30px -12px rgba(194,37,92,0.7)" }}
            >
              <SearchIcon className="size-5" /> Rechercher un fournisseur
            </span>
            <span
              className="rounded-full border-2 px-7 py-3 text-base font-bold"
              style={{ borderColor: "rgba(61,21,34,0.2)", color: INK }}
            >
              Devenir fournisseur
            </span>
          </div>
          <div className="mt-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider opacity-45">
              Catégories populaires
            </p>
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border bg-white/70 px-4 py-1.5"
                  style={{ borderColor: "rgba(61,21,34,0.1)", color: INK }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden justify-center lg:flex">
          <div
            className="absolute -right-8 -top-6 size-72 rounded-full opacity-25 blur-3xl"
            style={{ background: CRIMSON }}
          />
          <div
            className="absolute -bottom-4 left-0 size-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "#f08c00" }}
          />
          <SearchPanel />
        </div>
      </main>
    </div>
  );
}
