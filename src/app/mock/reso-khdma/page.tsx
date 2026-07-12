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

const GREEN = "#128c7e";
const DARK = "#0b3d2c";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.7.9-.5 1.2.7 1.2 1.6 2 2.8 2.6.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.3Z" />
    </svg>
  );
}

function PhoneMock() {
  return (
    <div className="w-[300px] rounded-[2.4rem] border-[10px] border-[#0f1b17] bg-[#0f1b17] shadow-2xl">
      <div className="overflow-hidden rounded-[1.8rem] bg-[#e9e2d6]">
        {/* WA header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#075e54" }}>
          <div className="flex size-9 items-center justify-center rounded-full bg-white/90 text-sm font-extrabold" style={{ color: GREEN }}>
            ر
          </div>
          <div className="text-white">
            <p className="text-sm font-bold leading-none">RESO خدمة</p>
            <p className="mt-1 text-[10px] leading-none text-white/70">متصل الآن</p>
          </div>
        </div>
        {/* Thread */}
        <div
          className="space-y-2.5 px-3 py-4 text-[13px] leading-relaxed"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 20%, rgba(11,61,44,0.05) 1.5px, transparent 1.5px)",
            backgroundSize: "42px 42px",
          }}
        >
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
            <p className="font-bold" style={{ color: DARK }}>
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
        </div>
        {/* Input */}
        <div className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2.5">
          <div className="h-8 flex-1 rounded-full bg-white" />
          <div className="flex size-8 items-center justify-center rounded-full text-white" style={{ background: GREEN }}>
            <WhatsAppIcon className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResoMockPage() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`${tajawal.className} min-h-screen`}
      style={{ background: "linear-gradient(170deg, #f6fdf8 0%, #e8f7ee 70%, #ddf2e6 100%)", color: DARK }}
    >
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <p className="text-2xl font-extrabold">
          RESO <span style={{ color: GREEN }}>خدمة</span>
        </p>
        <nav className="hidden items-center gap-8 text-sm font-medium opacity-80 md:flex">
          <span>كيفاش كنخدمو</span>
          <span>الحرف</span>
          <span>للشركات</span>
          <span>تواصل معنا</span>
        </nav>
        <span
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
          style={{ background: GREEN }}
        >
          <WhatsAppIcon className="size-4" /> ابدأ عبر واتساب
        </span>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[7fr_5fr]">
        <div>
          <p
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
            style={{ background: "rgba(18,140,126,0.1)", color: GREEN }}
          >
            <span className="size-2 rounded-full" style={{ background: GREEN }} />
            بالذكاء الاصطناعي — بالدارجة
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.15] md:text-6xl">
            الخدمة كتلقاك،
            <br />
            <span style={{ color: GREEN }}>فالواتساب</span> نيشان
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed opacity-80">
            منصة ذكية كتوصل الحرفيين والعمال بالشركات اللي محتاجاهم — بلا تطبيق جديد، بلا
            CV، غير برسالة فالواتساب. كتفهم الدارجة والعربية والفرنسية.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold text-white shadow-lg"
              style={{ background: GREEN }}
            >
              <WhatsAppIcon className="size-5" /> سجّل دابا — مجاني
            </span>
            <span className="rounded-full border-2 px-7 py-3 text-base font-bold" style={{ borderColor: DARK }}>
              أنا شركة كنقلب على عمال
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-sm font-medium">
            {["نجارة", "كهربا", "بناء", "طبخ", "حدادة", "صباغة", "ميكانيك", "+ حرف أخرى"].map(
              (craft) => (
                <span
                  key={craft}
                  className="rounded-full bg-white/80 px-4 py-1.5 shadow-sm"
                  style={{ color: DARK }}
                >
                  {craft}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="relative hidden justify-center lg:flex">
          <div
            className="absolute -left-10 top-10 size-64 rounded-full opacity-30 blur-3xl"
            style={{ background: GREEN }}
          />
          <PhoneMock />
        </div>
      </main>
    </div>
  );
}
