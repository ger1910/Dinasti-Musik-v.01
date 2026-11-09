"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Product, StoreConfig } from "@/types";

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  products: Product[];
  storeConfig: StoreConfig | null;
  cart: { productId: string; qty: number }[];
  addToCart: (productId: string, qty: number) => void;
  updateCartQty: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<boolean>;
  fetchData: () => Promise<void>;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;
  isAuthOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function AppProvider({ children, initialUser = null }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("dm_theme");
      if (savedTheme === "dark") {
        setThemeState("dark");
        document.documentElement.classList.add("dark");
      }
      const savedCart = localStorage.getItem("dm_cart");
      if (savedCart) setCart(JSON.parse(savedCart) || []);
      const savedWishlist = localStorage.getItem("dm_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist) || []);
    } catch {}
  }, []);

  const openAuthModal = useCallback(() => setIsAuthOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthOpen(false), []);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/config"),
      ]);
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData.products || []);
      }
      if (cRes.ok) {
        setStoreConfig(await cRes.json());
      }
    } catch (e) {
      console.error("Gagal memuat data awal:", e);
    }
  }, []);

  // Initialization: load products, config, cart, auth, local wishlist
  useEffect(() => {
    let isMounted = true;

    Promise.all([fetch("/api/products"), fetch("/api/config")])
      .then(async ([pRes, cRes]) => {
        if (!isMounted) return;
        if (pRes.ok) {
          const pData = await pRes.json();
          setProducts(pData.products || []);
        }
        if (cRes.ok) {
          setStoreConfig(await cRes.json());
        }
      })
      .catch((e) => console.error("Gagal memuat data awal:", e));

    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Refresh current session if not set from server
    if (!initialUser) {
      fetch("/api/auth/me")
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (isMounted && data?.user) setUser(data.user);
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [initialUser, theme]);

  // Sync wishlist when user logs in or changes
  useEffect(() => {
    if (user) {
      fetch("/api/wishlist")
        .then(r => (r.ok ? r.json() : []))
        .then((serverWishlist: string[]) => {
          // Merge with any guest wishlist items in localStorage
          try {
            const guestWish = JSON.parse(localStorage.getItem("dm_wishlist") || "[]") as string[];
            const merged = Array.from(new Set([...serverWishlist, ...guestWish]));
            setWishlist(merged);
            localStorage.setItem("dm_wishlist", JSON.stringify(merged));
            // Sync any newly merged items back to server
            guestWish.forEach(id => {
              if (!serverWishlist.includes(id)) {
                fetch("/api/wishlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: id })
                }).catch(() => {});
              }
            });
          } catch {
            setWishlist(serverWishlist);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem("dm_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Save wishlist backup
  useEffect(() => {
    try {
      localStorage.setItem("dm_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
    try {
      localStorage.setItem("dm_theme", t);
    } catch {}
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const addToCart = (productId: string, qty: number = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < qty) return;

    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i =>
          i.productId === productId
            ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
            : i
        );
      }
      return [...prev, { productId, qty }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.productId === productId) {
          const product = products.find(p => p.id === productId);
          if (!product) return i;
          return { ...i, qty: Math.max(1, Math.min(i.qty + delta, product.stock)) };
        }
        return i;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    const isWished = wishlist.includes(productId);
    const nextState = isWished
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];

    // Optimistically update state
    setWishlist(nextState);
    try {
      localStorage.setItem("dm_wishlist", JSON.stringify(nextState));
    } catch {}

    // If user is authenticated, sync to database
    if (user) {
      try {
        const method = isWished ? "DELETE" : "POST";
        await fetch("/api/wishlist", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } catch (e) {
        console.error("Gagal update wishlist server:", e);
      }
    }

    return !isWished;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        products,
        storeConfig,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        fetchData,
        theme,
        toggleTheme,
        setTheme,
        isAuthOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
