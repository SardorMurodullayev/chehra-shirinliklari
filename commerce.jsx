import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  PhoneCall,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Button, GlassCard } from "./ui";

function DrawerShell({ open, children, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[rgba(25,12,40,0.42)] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md overflow-y-auto border-l border-white/35 bg-[rgba(255,248,251,0.88)] p-4 shadow-[0_25px_80px_rgba(45,16,70,0.24)] backdrop-blur-2xl"
          >
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function FloatingCart() {
  const { cart, setCartOpen, playTone, formatCurrency } = useApp();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.pricePerKg / 4) * item.quantity, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 ? (
        <motion.button
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          onClick={() => {
            playTone("click");
            setCartOpen(true);
          }}
          className="fixed bottom-5 left-1/2 z-30 flex w-[min(calc(100%-2rem),420px)] -translate-x-1/2 items-center justify-between rounded-full bg-[var(--violet)] px-5 py-3 text-white shadow-[0_20px_50px_rgba(73,27,113,0.36)]"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/14">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold">{totalItems} items</span>
              <span className="block text-xs text-white/75">{formatCurrency(totalPrice)}</span>
            </span>
          </span>
          <span className="text-sm font-semibold">Open cart</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export function AuthModal() {
  const {
    authOpen,
    setAuthOpen,
    authView,
    setAuthView,
    authenticateByPhone,
    authenticateWithGoogle,
    t,
  } = useApp();
  const [method, setMethod] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");

  const closeModal = () => {
    setAuthOpen(false);
    setCodeSent(false);
    setMessage("");
  };

  return (
    <AnimatePresence>
      {authOpen ? (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-40 bg-[rgba(24,13,36,0.52)] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-50 mx-auto w-[min(100%-2rem,560px)]"
          >
            <GlassCard className="p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--violet)]">{t("auth.title")}</p>
                  <p className="mt-1 text-sm text-[var(--text-soft)]">{t("auth.subtitle")}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-full bg-[var(--surface-strong)] p-2 text-[var(--violet)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 flex rounded-full bg-[var(--surface-strong)] p-1">
                {["login", "register"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAuthView(mode)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      authView === mode
                        ? "bg-[var(--violet)] text-white"
                        : "text-[var(--violet)]/60"
                    }`}
                  >
                    {t(`auth.modes.${mode}`)}
                  </button>
                ))}
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                {["phone", "google"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setMethod(option)}
                    className={`rounded-[20px] border px-4 py-3 text-sm font-semibold transition ${
                      method === option
                        ? "border-[var(--violet)] bg-[var(--violet)]/8 text-[var(--violet)]"
                        : "border-transparent bg-[var(--surface-strong)] text-[var(--text-soft)]"
                    }`}
                  >
                    {t(`auth.methods.${option}`)}
                  </button>
                ))}
              </div>

              {method === "phone" ? (
                <div className="space-y-3">
                  {authView === "register" ? (
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="input-field"
                      placeholder={t("auth.namePlaceholder")}
                    />
                  ) : null}

                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="input-field"
                    placeholder={t("auth.phonePlaceholder")}
                  />

                  {codeSent ? (
                    <input
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      className="input-field"
                      placeholder={t("auth.codePlaceholder")}
                    />
                  ) : null}

                  {message ? (
                    <div className="rounded-2xl bg-[var(--gold)]/12 px-4 py-3 text-sm text-[var(--violet)]">
                      {message}
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      onClick={() => {
                        setCodeSent(true);
                        setMessage(t("auth.sent"));
                      }}
                    >
                      {t("actions.sendCode")}
                    </Button>
                    <Button
                      variant="soft"
                      onClick={() => {
                        const ok = authenticateByPhone({
                          name,
                          phone,
                          code,
                          mode: authView,
                        });
                        setMessage(ok ? "" : t("auth.sent"));
                      }}
                    >
                      {t("actions.confirmCode")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-[24px] bg-[var(--surface-strong)] p-4 text-sm leading-7 text-[var(--text-soft)]">
                    Google sign-in is simulated for demo UX and opens an instant premium flow.
                  </div>
                  <Button onClick={authenticateWithGoogle} className="w-full justify-center">
                    {t("actions.signWithGoogle")}
                  </Button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    formatCurrency,
    t,
    checkout,
  } = useApp();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.pricePerKg / 4) * item.quantity, 0),
    [cart],
  );

  return (
    <DrawerShell
      open={cartOpen}
      onClose={() => {
        setCartOpen(false);
        setSuccess(false);
      }}
    >
      <div className="flex min-h-full flex-col">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-[var(--violet)]">{t("cart.title")}</p>
            <p className="text-sm text-[var(--text-soft)]">{t("cart.note")}</p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="rounded-full bg-white/75 p-2 text-[var(--violet)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--violet)]/8 text-[var(--violet)]">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="text-lg font-semibold text-[var(--violet)]">{t("cart.empty")}</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--text-soft)]">
              {t("cart.emptyHint")}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto pb-4">
              {cart.map((item) => (
                <GlassCard key={item.id} className="flex items-center gap-3 p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-[22px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--violet)]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-soft)]">
                      {formatCurrency(item.pricePerKg / 4)} / 250 g
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full bg-[var(--surface-strong)] p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded-full p-2 text-[var(--violet)]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-[var(--violet)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded-full p-2 text-[var(--violet)]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-full bg-white/80 p-2 text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/55 pt-4">
              <div className="flex items-center justify-between rounded-[24px] bg-white/75 px-4 py-3">
                <span className="text-sm text-[var(--text-soft)]">{t("cart.subtotal")}</span>
                <span className="text-lg font-semibold text-[var(--violet)]">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="rounded-[28px] bg-[var(--surface-strong)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--violet)]">
                  <PhoneCall className="h-4 w-4" />
                  <span className="text-sm font-semibold">{t("cart.submit")}</span>
                </div>
                <div className="space-y-3">
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="input-field"
                    placeholder={t("cart.phone")}
                  />
                  <textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="input-field min-h-24 resize-none"
                    placeholder={t("cart.addressPlaceholder")}
                  />
                  <div className="grid gap-3">
                    <Button
                      className="w-full justify-center"
                      onClick={() => {
                        const ok = checkout({ phone, address });
                        if (ok) {
                          setSuccess(true);
                          setPhone("");
                          setAddress("");
                        }
                      }}
                    >
                      {t("cart.submit")}
                    </Button>
                    <Button variant="ghost" className="w-full justify-center" onClick={clearCart}>
                      {t("actions.clear")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-4 grid place-items-center rounded-[32px] bg-[rgba(255,248,251,0.95)] p-6 text-center shadow-[0_18px_50px_rgba(56,16,83,0.22)] backdrop-blur-2xl"
          >
            <div>
              <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[var(--gold)]/25 text-[var(--violet)]">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="text-xl font-semibold text-[var(--violet)]">{t("cart.success")}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                Chehra-Shirinliklari operatori siz bilan tez orada bog'lanadi.
              </p>
              <Button className="mt-5" onClick={() => setSuccess(false)}>
                {t("actions.continue")}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </DrawerShell>
  );
}

export function ToastNotice() {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+1rem)] z-[60] w-[min(calc(100%-2rem),420px)] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-full border border-white/45 bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm font-medium text-[var(--violet)] shadow-[0_18px_50px_rgba(69,26,104,0.16)] backdrop-blur-xl">
            <UserCircle2 className="h-5 w-5" />
            <span>{toast}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
