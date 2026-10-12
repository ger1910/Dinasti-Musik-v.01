"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { LoginModal } from "@/components/LoginModal";
import { OwnerProfileSheet } from "@/components/OwnerProfileSheet";
import { useApp } from "@/components/AppProvider";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    user,
    setUser,
    storeConfig,
    cart,
    products,
    updateCartQty,
    removeFromCart,
    clearCart,
    isAuthOpen,
    openAuthModal,
    closeAuthModal,
  } = useApp();

  type ResolvedCartItem = {
    productId: string;
    name: string;
    price: number;
    image: string;
    qty: number;
  };

  const resolvedCart = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock <= 0) return null;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: Math.min(item.qty, product.stock),
      };
    })
    .filter((item): item is ResolvedCartItem => item !== null);

  const router = useRouter();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOwnerSheetOpen, setIsOwnerSheetOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    showToast("Anda telah keluar dari akun.", "info");
  };

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      showToast("Silakan login untuk menyelesaikan checkout.", "info");
      openAuthModal();
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderId: string) => {
    setIsCheckoutOpen(false);
    clearCart();
    showToast(`Pesanan #${orderId} berhasil diproses!`, "success");
    router.push("/dashboard");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth") === "login") {
        openAuthModal();
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [openAuthModal]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080F0F] flex flex-col relative pb-20 md:pb-0 font-sans text-[#0D1317] dark:text-[#F3F0E8] selection:bg-[#bb6a33] selection:text-white transition-colors duration-200">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 fade-in duration-300">
          <div
            className={`px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border text-sm font-semibold tracking-wide ${
              toast.type === "success"
                ? "bg-white dark:bg-[#181818] text-[#0D1317] dark:text-[#F3F0E8] border-emerald-500/30"
                : toast.type === "error"
                ? "bg-white dark:bg-[#181818] text-red-500 dark:text-red-400 border-red-500/30"
                : "bg-white dark:bg-[#181818] text-[#0D1317] dark:text-[#F3F0E8] border-black/10 dark:border-white/10"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <Info className="w-4 h-4 text-[#bb6a33]" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Floating Capsule Navbar */}
      <Navbar
        user={user}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={openAuthModal}
        onLogout={handleLogout}
        onOpenOwnerSheet={() => setIsOwnerSheetOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1 w-full relative z-10 transition-all duration-300">
        {children}
      </main>

      {/* Modals & Drawers */}
      <LoginModal
        isOpen={isAuthOpen}
        onClose={closeAuthModal}
        onLoginSuccess={(u) => {
          setUser(u);
          showToast(`Selamat datang kembali, ${u.name}!`, "success");
          if (u.role === "owner") {
            router.push("/admin");
          } else {
            router.push("/catalog");
          }
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={resolvedCart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onOpenCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={resolvedCart}
        user={user}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OwnerProfileSheet
        isOpen={isOwnerSheetOpen}
        config={storeConfig}
        onClose={() => setIsOwnerSheetOpen(false)}
      />
    </div>
  );
}
