import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { heroSlides, reviews } from "../data/content";
import { useApp } from "../context/AppContext";
import { Button, GlassCard, Reveal, SectionHeading } from "./ui";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

const reviewGallery = [
  new URL("../../.uploads/cf83d7d9-366a-4e2b-a551-6395286b2e7b_screenshot_1.png", import.meta.url)
    .href,
  new URL("../../.uploads/37bce12c-91d3-4805-bcc1-5d6a702da1b8_photo_2026-08-13_19-42-16.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/0006db5c-b933-4eb5-a2d1-6855c23d33b5_photo_2026-08-13_19-42-12.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/a54e51ec-160e-43cb-9bc6-673c84d90969_photo_2026-08-13_19-42-09.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/0272740b-3e1e-4a43-9058-a269eb186b3b_photo_2026-08-13_19-42-06.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/f9b399fb-8e72-4088-aa8a-a8735daaa88d_photo_2026-08-13_19-42-03.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/75fa1186-0617-45e0-8b96-a30301821d67_photo_2026-08-13_19-42-00.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/59800203-11a5-4b7f-966f-b3bbd80c0889_photo_2026-08-13_19-41-56.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/8f80042d-855f-4694-aa24-c027eb46d337_photo_2026-08-13_19-41-53.jpg", import.meta.url)
    .href,
  new URL("../../.uploads/6dc22ccd-e458-43d6-93fc-e55832a709b2_photo_2026-08-13_19-41-50.jpg", import.meta.url)
    .href,
];

function ProductCard({ product, index }) {
  const { language, addToCart, formatCurrency, t } = useApp();
  const [grams, setGrams] = useState("350");
  const [budget, setBudget] = useState("");

  const result = useMemo(() => {
    if (grams) {
      return formatCurrency((Number(grams) / 1000) * product.pricePerKg);
    }

    if (budget) {
      const estimatedGrams = (Number(budget) / product.pricePerKg) * 1000;
      return `${Math.round(estimatedGrams)} g`;
    }

    return t("catalog.empty");
  }, [grams, budget, product.pricePerKg, formatCurrency, t]);

  return (
    <Reveal delay={index * 0.06}>
      <GlassCard className="group overflow-hidden p-0">
        <div className="relative h-56 overflow-hidden">
          <img
            src={product.image}
            alt={product.name[language]}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${product.accent} opacity-55 mix-blend-soft-light`}
          />
          <div className="absolute left-4 top-4 flex gap-2">
            {product.tags[language].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-semibold text-[var(--violet)] backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[var(--violet)]">
                {product.name[language]}
              </h3>
              <div className="text-right">
                <p className="text-xs text-[var(--text-soft)]">{t("catalog.from")}</p>
                <p className="text-sm font-semibold text-[var(--violet)]">
                  {formatCurrency(product.pricePerKg)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
              {product.description[language]}
            </p>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--violet)]">
                {t("catalog.calcTitle")}
              </p>
              <p className="text-xs text-[var(--text-soft)]">
                {formatCurrency(product.pricePerKg)} {t("catalog.perKg")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-soft)]">
                  {t("catalog.grams")}
                </span>
                <input
                  value={grams}
                  onChange={(event) => {
                    const next = event.target.value.replace(/\D/g, "");
                    setGrams(next);
                    setBudget("");
                  }}
                  placeholder={t("catalog.gramsHint")}
                  className="input-field"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-medium text-[var(--text-soft)]">
                  {t("catalog.budget")}
                </span>
                <input
                  value={budget}
                  onChange={(event) => {
                    const next = event.target.value.replace(/\D/g, "");
                    setBudget(next);
                    setGrams("");
                  }}
                  placeholder={t("catalog.budgetHint")}
                  className="input-field"
                />
              </label>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3">
              <div>
                <p className="text-xs text-[var(--text-soft)]">{t("catalog.result")}</p>
                <p className="text-sm font-semibold text-[var(--violet)]">{result}</p>
              </div>
              <Button onClick={() => addToCart(product)} className="px-4 py-2.5 text-xs">
                {t("catalog.add")}
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </Reveal>
  );
}

export function HeroSection() {
  const { language, t } = useApp();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, []);

  const slide = heroSlides[active];

  return (
    <section id="home" className="pt-6">
      <Reveal>
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="overflow-hidden p-0">
            <div className="relative min-h-[520px] overflow-hidden rounded-[28px] p-5 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.image}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <img src={slide.image} alt={slide.title[language]} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,15,58,0.14),rgba(36,15,58,0.75))]" />
                </motion.div>
              </AnimatePresence>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="chip bg-white/16 text-white backdrop-blur-xl">{t("hero.badge")}</span>
                  <span className="chip bg-[var(--gold)]/85 text-[var(--violet)]">
                    {t("brand.tagline")}
                  </span>
                </div>

                <div className="max-w-xl">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                    {slide.title[language]}
                  </p>
                  <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                    {t("hero.title")}
                  </h1>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                    {slide.description[language]} {t("hero.description")}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
                      {t("actions.explore")}
                    </Button>
                    <Button
                      variant="soft"
                      onClick={() =>
                        document.getElementById("location")?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      {t("actions.contact")}
                    </Button>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    [Truck, t("hero.delivery")],
                    [Sparkles, t("hero.fresh")],
                    [ShieldCheck, t("hero.custom")],
                  ].map(([Icon, label]) => (
                    <div
                      key={label}
                      className="rounded-[22px] border border-white/15 bg-white/10 px-4 py-4 text-white backdrop-blur-md"
                    >
                      <Icon className="mb-3 h-5 w-5 text-[var(--gold)]" />
                      <p className="text-sm font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-5">
            <Reveal delay={0.08}>
              <GlassCard className="grid gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,248,250,0.64))] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--violet)]">
                      {t("header.promo")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                      {t("brand.tagline")}
                    </p>
                  </div>
                  <div className="rounded-full bg-[var(--violet)]/7 p-3 text-[var(--violet)]">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {heroSlides.map((item, index) => (
                    <button
                      key={item.image}
                      onClick={() => setActive(index)}
                      className={`rounded-[24px] p-3 text-left transition ${
                        active === index
                          ? "bg-[var(--violet)] text-white shadow-[0_16px_35px_rgba(91,37,133,0.24)]"
                          : "bg-[var(--surface-strong)] text-[var(--violet)]"
                      }`}
                    >
                      <p className="text-sm font-semibold">{item.title[language]}</p>
                      <p className="mt-1 text-xs leading-5 opacity-80">{item.description[language]}</p>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.14}>
              <GlassCard className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["12+", "signature sweets"],
                  ["4.9/5", "guest rating"],
                  ["15 min", "quick reorder"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[22px] bg-white/70 p-4 text-center">
                    <p className="text-2xl font-semibold text-[var(--violet)]">{value}</p>
                    <p className="mt-1 text-xs text-[var(--text-soft)]">{label}</p>
                  </div>
                ))}
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function ProductCatalogSection() {
  const { products, t } = useApp();

  return (
    <section id="menu" className="space-y-8 pt-8">
      <SectionHeading
        eyebrow={t("catalog.eyebrow")}
        title={t("catalog.title")}
        description={t("catalog.description")}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

export function AboutSection() {
  const { t } = useApp();
  const points = t("about.points");

  return (
    <section id="about" className="space-y-8 pt-8">
      <SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} />
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative h-full min-h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=80"
                alt={t("about.title")}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(59,27,90,0.55))]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[26px] border border-white/20 bg-white/15 p-4 text-white backdrop-blur-md">
                <p className="text-sm leading-7">{t("about.description")}</p>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlassCard className="grid gap-4 p-5 sm:p-6">
            {points.map((point, index) => (
              <div
                key={point}
                className="flex items-start gap-4 rounded-[24px] bg-[var(--surface-strong)] p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--violet)]/10 text-[var(--violet)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--violet)]">
                    0{index + 1}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[var(--text-soft)]">{point}</p>
                </div>
              </div>
            ))}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-[var(--violet)] p-5 text-white">
                <Clock3 className="mb-3 h-5 w-5 text-[var(--gold)]" />
                <p className="text-lg font-semibold">Fresh daily batch</p>
                <p className="mt-2 text-sm text-white/75">
                  Small-batch baking keeps every texture soft and fragrant.
                </p>
              </div>
              <div className="rounded-[24px] bg-[var(--gold)]/18 p-5 text-[var(--violet)]">
                <ShieldCheck className="mb-3 h-5 w-5" />
                <p className="text-lg font-semibold">Premium ingredients</p>
                <p className="mt-2 text-sm text-[var(--text-soft)]">
                  Balanced sweetness, artisanal finish, and thoughtful packaging.
                </p>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const { language, t } = useApp();

  const galleryCopy = {
    uz: {
      title: "Mijozlarimizdan haqiqiy kadrlar",
      description: "Buyurtmalardan tushgan suratlar va chatdagi iliq fikrlar.",
      badge: "Real feedback",
    },
    ru: {
      title: "Реальные кадры от наших гостей",
      description: "Фотографии заказов и тёплые отзывы из переписки.",
      badge: "Real feedback",
    },
    en: {
      title: "Real moments from our customers",
      description: "Order photos and warm feedback captured from real conversations.",
      badge: "Real feedback",
    },
  };

  return (
    <section id="reviews" className="space-y-8 pt-8">
      <SectionHeading eyebrow={t("reviews.eyebrow")} title={t("reviews.title")} />
      <div className="grid gap-5 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <Reveal key={review.id} delay={index * 0.06}>
            <GlassCard className="h-full">
              <div className="mb-4 flex items-center gap-1 text-[var(--gold)]">
                {Array.from({ length: review.rating }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-7 text-[var(--text-soft)]">{review.text[language]}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--violet)]/12 text-sm font-semibold text-[var(--violet)]">
                  {review.author[language].slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--violet)]">{review.author[language]}</p>
                  <p className="text-xs text-[var(--text-soft)]">
                    {formatNumber(950 + review.id * 120)} happy orders
                  </p>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative min-h-[420px] overflow-hidden rounded-[28px]">
              <img
                src={reviewGallery[0]}
                alt={galleryCopy[language].title}
                className="h-full w-full object-cover object-left-top"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,12,36,0.05),rgba(24,12,36,0.72))]" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="max-w-md rounded-[26px] border border-white/20 bg-white/12 p-4 text-white backdrop-blur-md">
                  <span className="chip bg-[var(--gold)]/85 text-[var(--violet)]">
                    {galleryCopy[language].badge}
                  </span>
                  <p className="mt-4 text-xl font-semibold">
                    {galleryCopy[language].title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    {galleryCopy[language].description}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {reviewGallery.slice(1).map((image, index) => (
            <Reveal key={image} delay={index * 0.04}>
              <GlassCard className="group overflow-hidden p-0">
                <div className="relative aspect-[0.9] overflow-hidden rounded-[28px]">
                  <img
                    src={image}
                    alt={`${galleryCopy[language].title} ${index + 1}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(34,13,51,0.5))]" />
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationSection() {
  const { t } = useApp();

  return (
    <section id="location" className="space-y-8 pt-8">
      <SectionHeading eyebrow={t("location.eyebrow")} title={t("location.title")} />
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative min-h-[360px] bg-[radial-gradient(circle_at_top,rgba(255,214,102,0.4),transparent_35%),linear-gradient(140deg,rgba(255,255,255,0.92),rgba(246,236,249,0.9))] p-5">
              <div className="map-grid absolute inset-0 opacity-60" />
              <div className="absolute left-[18%] top-[28%] h-4 w-4 rounded-full bg-[var(--gold)] shadow-[0_0_0_10px_rgba(255,208,85,0.25)]" />
              <div className="absolute left-[58%] top-[48%] h-3 w-3 rounded-full bg-[var(--violet)] shadow-[0_0_0_10px_rgba(86,39,129,0.12)]" />
              <div className="absolute left-[38%] top-[60%] h-5 w-5 rounded-full bg-pink-300 shadow-[0_0_0_14px_rgba(255,182,193,0.28)]" />

              <div className="absolute bottom-5 left-5 right-5">
                <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-[0_16px_35px_rgba(86,39,129,0.12)] backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--violet)]">
                        {t("location.address")}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                        {t("location.mapDescription")}
                      </p>
                    </div>
                    <div className="rounded-full bg-[var(--violet)]/9 p-3 text-[var(--violet)]">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.08}>
          <GlassCard className="grid gap-4">
            {[
              [t("location.addressLabel"), t("location.address")],
              [t("location.hoursLabel"), t("location.hours")],
              [t("location.phoneLabel"), t("location.phone")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] bg-[var(--surface-strong)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--violet)]/55">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{value}</p>
              </div>
            ))}

            <Button
              onClick={() =>
                window.open("https://maps.google.com/?q=Tashkent+Yunusabad+bakery", "_blank")
              }
              className="justify-center"
            >
              {t("actions.map")}
            </Button>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
