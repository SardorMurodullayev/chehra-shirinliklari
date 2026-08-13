import { createContext, useContext, useMemo, useState } from "react";
import { products, translations } from "../data/content";

const AppContext = createContext(null);

const getByPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

const formatPhone = (value) => value.replace(/[^\d+]/g, "").slice(0, 17);

export function AppProvider({ children }) {
  const [language, setLanguage] = useState("uz");
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const copy = translations[language];

  const playTone = (type = "click") => {
    if (typeof window === "undefined") return;

    const ToneContext = window.AudioContext || window.webkitAudioContext;

    if (!ToneContext) return;

    const ctx = new ToneContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const presets = {
      click: { freq: 520, duration: 0.04, gain: 0.02, wave: "triangle" },
      add: { freq: 720, duration: 0.08, gain: 0.03, wave: "sine" },
      success: { freq: 840, duration: 0.18, gain: 0.04, wave: "triangle" },
    };

    const config = presets[type] || presets.click;

    oscillator.type = config.wave;
    oscillator.frequency.setValueAtTime(config.freq, now);
    gain.gain.setValueAtTime(config.gain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + config.duration);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat(copy.locale, {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    }).format(value);

  const t = (path) => getByPath(copy, path) ?? path;

  const addToCart = (product) => {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);

      if (exists) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name[language],
          pricePerKg: product.pricePerKg,
          image: product.image,
          quantity: 1,
        },
      ];
    });

    playTone("add");
    setToast(`${product.name[language]} • ${t("actions.addToCart")}`);
    setCartOpen(true);
    window.setTimeout(() => setToast(null), 1800);
  };

  const updateQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
        )
        .filter(Boolean),
    );
    playTone("click");
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
    playTone("click");
  };

  const clearCart = () => {
    setCart([]);
    playTone("click");
  };

  const checkout = ({ phone, address }) => {
    if (!phone || !address) return false;
    playTone("success");
    setToast(t("cart.success"));
    setCart([]);
    window.setTimeout(() => setToast(null), 2200);
    return true;
  };

  const authenticateByPhone = ({ name, phone, code, mode }) => {
    if (code !== "123456" || !phone) return false;
    setUser({
      name: name || "Sweet Guest",
      phone: formatPhone(phone),
      method: "phone",
    });
    setAuthOpen(false);
    setToast(mode === "register" ? t("auth.successRegister") : t("auth.successLogin"));
    playTone("success");
    window.setTimeout(() => setToast(null), 2200);
    return true;
  };

  const authenticateWithGoogle = () => {
    setUser({
      name: "Google Guest",
      phone: "+998 90 777 77 77",
      method: "google",
    });
    setAuthOpen(false);
    setToast(t("auth.googleSuccess"));
    playTone("success");
    window.setTimeout(() => setToast(null), 2200);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      copy,
      t,
      authOpen,
      setAuthOpen,
      authView,
      setAuthView,
      user,
      setUser,
      cartOpen,
      setCartOpen,
      cart,
      products,
      toast,
      playTone,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      checkout,
      authenticateByPhone,
      authenticateWithGoogle,
      formatCurrency,
    }),
    [language, copy, authOpen, authView, user, cartOpen, cart, toast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
