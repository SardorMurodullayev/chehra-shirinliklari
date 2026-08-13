import { LogIn, ShoppingBag, Sparkles } from "lucide-react";
import { useApp } from "./context/AppContext";
import { AuthModal, CartDrawer, FloatingCart, ToastNotice } from "./components/commerce";
import {
  AboutSection,
  HeroSection,
  LocationSection,
  ProductCatalogSection,
  ReviewsSection,
} from "./components/sections";
import { Button, CartBubble, LanguageSwitcher } from "./components/ui";

function Header() {
  const { t, setAuthOpen, user, setUser, playTone } = useApp();

  const navItems = [
    ["home", t("nav.home")],
    ["menu", t("nav.menu")],
    ["about", t("nav.about")],
    ["reviews", t("nav.reviews")],
    ["location", t("nav.location")],
  ];

  return (
    <header className="sticky top-0 z-20 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="rounded-[28px] border border-white/45 bg-[rgba(255,255,255,0.74)] px-4 py-3 shadow-[0_18px_50px_rgba(70,26,105,0.1)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--violet),var(--gold))] text-white shadow-[0_12px_30px_rgba(94,38,133,0.24)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--violet)]">
                {t("brand.name")}
              </p>
              <p className="truncate text-xs text-[var(--text-soft)]">{t("brand.tagline")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => {
                if (user) {
                  setUser(null);
                  playTone("click");
                } else {
                  setAuthOpen(true);
                }
              }}
              className="hidden rounded-full bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--violet)] md:flex"
            >
              {user ? t("actions.logout") : t("actions.auth")}
            </button>
            <CartBubble />
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className="whitespace-nowrap rounded-full bg-[var(--surface-strong)] px-4 py-2.5 text-sm font-medium text-[var(--violet)]"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setAuthOpen(true)}
            className="ml-auto flex shrink-0 items-center gap-2 rounded-full bg-[var(--violet)] px-4 py-2.5 text-sm font-semibold text-white md:hidden"
          >
            <LogIn className="h-4 w-4" />
            {t("actions.auth")}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useApp();

  return (
    <footer className="pb-28 pt-12 text-center text-sm text-[var(--text-soft)]">
      <div className="rounded-[28px] border border-white/45 bg-white/60 px-6 py-6 shadow-[0_18px_50px_rgba(70,26,105,0.08)] backdrop-blur-xl">
        <p>{t("footer.note")}</p>
      </div>
    </footer>
  );
}

function MiniCta() {
  const { t, setAuthOpen, setCartOpen } = useApp();

  return (
    <section className="pt-8">
      <div className="rounded-[34px] bg-[linear-gradient(135deg,rgba(86,39,129,0.95),rgba(255,204,82,0.92))] p-6 text-white shadow-[0_24px_60px_rgba(86,39,129,0.24)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Premium checkout
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              Fast mobile ordering with elegant micro-interactions
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="soft" onClick={() => setAuthOpen(true)}>
              {t("actions.auth")}
            </Button>
            <Button
              className="bg-white text-[var(--violet)] shadow-none"
              onClick={() => setCartOpen(true)}
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                {t("actions.checkout")}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-main)]">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />

      <ToastNotice />
      <AuthModal />
      <CartDrawer />
      <FloatingCart />

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <Header />
        <main className="space-y-10">
          <HeroSection />
          <ProductCatalogSection />
          <AboutSection />
          <ReviewsSection />
          <LocationSection />
          <MiniCta />
        </main>
        <Footer />
      </div>
    </div>
  );
}
