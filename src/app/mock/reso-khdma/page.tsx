import type { Metadata } from "next";
import { Tajawal } from "next/font/google";

/**
 * Redesigned RESO Khdma hero, built purely to be screenshotted for the
 * portfolio (the client's live landing doesn't do the product justice, and
 * we don't touch client code). Not linked anywhere, not indexed.
 */
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700", "800"] });

export const metadata: Metadata = {
  title: "RESO خدمة — الخدمة كتلقاك فالواتساب",
  robots: { index: false, follow: false },
};

const WA = "#25d366";
const CREAM = "#f4f1e6";
const BEZEL = "#0c1512";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.7.9-.5 1.2.7 1.2 1.6 2 2.8 2.6.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.3Z" />
    </svg>
  );
}

/** Real device proportions (390:844 screen), dark bezel, top-connected notch. */
function PhoneMock() {
  return (
    <div
      className="relative w-[272px] rounded-[2rem] border-[9px] shadow-[0_48px_90px_-28px_rgba(0,0,0,0.65)]"
      style={{ borderColor: BEZEL, background: BEZEL }}
    >
      <div
        className="relative flex flex-col overflow-hidden rounded-[1.45rem] bg-[#efe7db]"
        style={{ aspectRatio: "390 / 844" }}
      >
        {/* Notch */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 z-20 h-[21px] w-[38%] -translate-x-1/2 rounded-b-[0.55rem]"
          style={{ background: BEZEL }}
        />
        {/* WA header */}
        <div className="flex items-center gap-3 px-4 pb-3 pt-8" style={{ background: "#075e54" }}>
          <div
            className="flex size-9 items-center justify-center rounded-full bg-white/90 text-sm font-extrabold"
            style={{ color: "#128c7e" }}
          >
            ر
          </div>
          <div className="text-white">
            <p className="text-sm font-bold leading-none">RESO خدمة</p>
            <p className="mt-1 text-[10px] leading-none text-white/70">متصل الآن</p>
          </div>
          <div className="mr-auto flex items-center gap-3 text-white/60">
            <span className="text-sm">⋮</span>
          </div>
        </div>
        {/* Thread — fills the real screen height */}
        <div
          className="flex-1 space-y-2.5 overflow-hidden px-3 py-4 text-[13px] leading-relaxed"
          style={{
            color: "#1c2b24",
            backgroundImage:
              "radial-gradient(circle at 25% 20%, rgba(11,61,44,0.05) 1.5px, transparent 1.5px)",
            backgroundSize: "42px 42px",
          }}
        >
          <p className="mx-auto w-fit rounded-full bg-black/5 px-3 py-0.5 text-[10px]">اليوم</p>
          <div className="mr-8 w-fit rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-sm">
            سلام 👋 كنقلب على خدمة ديال الكهربا فأكادير
          </div>
          <div className="ml-8 w-fit rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">
            مرحبا خويا! تسجلتي معنا؟ قوليا شنو كتعرف تخدم وفين ساكن 🔧
          </div>
          <div className="mr-8 w-fit rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-sm">
            كهربائي، 6 سنين ديال الخبرة، حي الداخلة
          </div>
          <div className="ml-8 w-fit rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">
            <p className="font-bold" style={{ color: "#0b3d2c" }}>
              ✨ لقينا ليك 3 فرص:
            </p>
            <div className="mt-2 space-y-1.5">
              {["شركة بناء — أكادير المدينة", "مشروع فيلا — تغزوت", "صيانة فندق — تالبرجت"].map(
                (job) => (
                  <p key={job} className="rounded-lg bg-[#f0f7f2] px-2.5 py-1.5 text-[12px]">
                    ⚡ {job}
                  </p>
                ),
              )}
            </div>
          </div>
          <div className="mr-8 w-fit rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-sm">
            نعم! الأولى مزيانة ليا 🙌
          </div>
          <div className="ml-8 flex w-fit items-center gap-1.5 rounded-xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-pulse rounded-full bg-black/30"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
        {/* Input */}
        <div className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2.5">
          <div className="flex h-8 flex-1 items-center rounded-full bg-white px-3 text-[11px] text-black/30">
            كتب رسالة…
          </div>
          <div
            className="flex size-8 items-center justify-center rounded-full text-white"
            style={{ background: "#128c7e" }}
          >
            <WhatsAppIcon className="size-4" />
          </div>
        </div>
      </div>

      {/* Floating match card */}
      <div
        className="absolute -left-16 top-24 w-44 -rotate-6 rounded-xl bg-white p-3 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.45)]"
        dir="rtl"
      >
        <p className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: "#128c7e" }}>
          <span className="size-1.5 rounded-full" style={{ background: WA }} />
          تطابق جديد
        </p>
        <p className="mt-1.5 text-[12px] font-bold leading-snug" style={{ color: "#12211a" }}>
          كهربائي فأكادير — متاح هاد السيمانة
        </p>
        <p className="mt-1 text-[10px] text-black/45">تطابق دلالي ٩٢٪ · بالدارجة</p>
      </div>
      {/* Floating trust pill */}
      <div
        className="absolute -right-10 bottom-16 rotate-3 rounded-full px-4 py-2 text-[11px] font-bold shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]"
        style={{ background: WA, color: "#06281a" }}
      >
        بلا CV · بلا تطبيق
      </div>
    </div>
  );
}

export default function ResoMockPage() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`${tajawal.className} relative min-h-screen overflow-hidden`}
      style={{
        background: "linear-gradient(165deg, #06231a 0%, #0b3d2c 58%, #0e4a35 100%)",
        color: CREAM,
      }}
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(37,211,102,0.14), transparent 32%), radial-gradient(circle at 88% 78%, rgba(37,211,102,0.1), transparent 36%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(244,241,230,0.09) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Nav */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <p className="text-2xl font-extrabold">
          RESO <span style={{ color: WA }}>خدمة</span>
        </p>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          <span>كيفاش كنخدمو</span>
          <span>الحرف</span>
          <span>للشركات</span>
          <span>تواصل معنا</span>
        </nav>
        <span
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold"
          style={{ background: WA, color: "#06281a" }}
        >
          <WhatsAppIcon className="size-4" /> ابدأ عبر واتساب
        </span>
      </header>

      {/* Hero */}
      <main className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-10 pt-6 lg:grid-cols-[7fr_5fr]">
        <div>
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold"
            style={{ borderColor: "rgba(37,211,102,0.4)", color: WA }}
          >
            <span className="size-2 rounded-full" style={{ background: WA }} />
            بالذكاء الاصطناعي — بالدارجة
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.12] md:text-[4.2rem]">
            الخدمة كتلقاك،
            <br />
            <span style={{ color: WA }}>فالواتساب</span> نيشان
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            منصة ذكية كتوصل الحرفيين والعمال بالشركات اللي محتاجاهم — بلا تطبيق
            جديد، بلا CV، غير برسالة فالواتساب. كتفهم الدارجة والعربية والفرنسية.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <span
              className="flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-extrabold shadow-[0_20px_44px_-14px_rgba(37,211,102,0.6)]"
              style={{ background: WA, color: "#06281a" }}
            >
              <WhatsAppIcon className="size-5" /> سجّل دابا — مجاني
            </span>
            <span
              className="rounded-full border px-7 py-3.5 text-base font-bold text-white/90"
              style={{ borderColor: "rgba(244,241,230,0.35)" }}
            >
              أنا شركة كنقلب على عمال
            </span>
          </div>
          <div className="mt-9 flex flex-wrap gap-2 text-sm font-medium">
            {["نجارة", "كهربا", "بناء", "طبخ", "حدادة", "صباغة", "ميكانيك", "+ حرف أخرى"].map(
              (craft) => (
                <span
                  key={craft}
                  className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-1.5 text-white/80"
                >
                  {craft}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="relative hidden justify-center pb-6 lg:flex">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: WA }}
          />
          <PhoneMock />
        </div>
      </main>

      {/* How it works strip */}
      <section className="relative mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          {[
            ["٠١", "صيفط «سلام» فالواتساب", "بلا تسجيل، بلا تطبيق — المحادثة هي الحساب ديالك"],
            ["٠٢", "وصف الحرفة ديالك بالدارجة", "الذكاء الاصطناعي كيفهم شنو كتعرف تخدم وفين"],
            ["٠٣", "توصل بالفرص نيشان", "تطابق دلالي مع الشركات اللي كتقلب عليك"],
          ].map(([n, title, sub]) => (
            <div key={n} className="flex gap-4">
              <span className="text-2xl font-extrabold" style={{ color: WA }}>
                {n}
              </span>
              <div>
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
