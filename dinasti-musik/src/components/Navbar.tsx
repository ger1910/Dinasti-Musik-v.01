"use client";
import React, { useState } from "react";
import {
  ShoppingBag,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Music2,
  Heart,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { User } from "@/types";
import { useApp } from "@/components/AppProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenOwnerSheet?: () => void;
}

export function Navbar({
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onOpenOwnerSheet,
}: NavbarProps) {
  const { theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    const active = isCurrent(path);
    return `px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 ${
      active
        ? "bg-[#bb6a33] text-white shadow-xs"
        : "text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white"
    }`;
  };

  const brandHref = !user
    ? "/"
    : user.role === "owner"
    ? "/admin"
    : "/catalog";

  const handleInfoTokoClick = (e: React.MouseEvent) => {
    if (!user && pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("tentang-toko");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
      return;
    }
    if (onOpenOwnerSheet) {
      onOpenOwnerSheet();
      setMobileMenuOpen(false);
    }
  };

  const handleBerandaClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-4 z-40 px-4 max-w-7xl mx-auto w-full transition-all">
      <div className="bg-white/90 dark:bg-[#080F0F]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] rounded-full px-5 py-3 flex items-center justify-between text-[#0D1317] dark:text-white transition-colors duration-200">
        {/* Brand Logo */}
        <Link href={brandHref} className="flex items-center gap-3 group text-left">
          <div className="w-10 h-10 rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/[0.05] dark:border-white/10 flex items-center justify-center text-[#bb6a33] transition-transform duration-300 group-hover:scale-105 shadow-xs">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wider uppercase block text-[#0D1317] dark:text-white leading-none">
              Dinasti Musik
            </span>
            <span className="text-[10px] text-[#bb6a33] dark:text-[#e9b999] tracking-[0.2em] uppercase font-semibold block mt-1">
              Creative Store
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/[0.04] dark:bg-white/5 px-2 py-1.5 rounded-full border border-black/[0.04] dark:border-white/10">
          {/* Kondisi 1: Belum Login */}
          {!user && (
            <>
              <Link href="/" onClick={handleBerandaClick} className={getLinkClass("/")}>
                Beranda
              </Link>
              <button
                type="button"
                onClick={handleInfoTokoClick}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-medium text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#bb6a33]" />
                <span>Info Toko</span>
              </button>
            </>
          )}

          {/* Kondisi 2: Login Pelanggan */}
          {user && user.role === "customer" && (
            <>
              <Link href="/catalog" className={getLinkClass("/catalog")}>
                Katalog
              </Link>
              <Link href="/wishlist" className={getLinkClass("/wishlist")}>
                <Heart className="w-3 h-3 text-[#bb6a33] dark:text-[#e9b999]" />
                <span>Wishlist</span>
              </Link>
              <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                <UserIcon className="w-3 h-3" />
                <span>Akun Saya</span>
              </Link>
              <button
                type="button"
                onClick={handleInfoTokoClick}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-medium text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#bb6a33]" />
                <span>Info Toko</span>
              </button>
            </>
          )}

          {/* Kondisi 3: Login Admin */}
          {user && user.role === "owner" && (
            <>
              <Link href="/admin" className={getLinkClass("/admin")}>
                <LayoutDashboard className="w-3.5 h-3.5 text-[#bb6a33] dark:text-[#e9b999]" />
                <span>Portal Admin</span>
              </Link>
              <Link href="/catalog" className={getLinkClass("/catalog")}>
                <span>Katalog Produk</span>
              </Link>
              <button
                type="button"
                onClick={handleInfoTokoClick}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-medium text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#bb6a33]" />
                <span>Info Toko</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/10 dark:hover:bg-white/15 text-[#0D1317] dark:text-white transition active:scale-95 border border-black/[0.04] dark:border-white/10"
            title={theme === "dark" ? "Ganti ke Tema Terang (Light)" : "Ganti ke Tema Gelap (Dark)"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700" />
            )}
          </button>

          {/* Keranjang Belanja: HANYA dirender jika user adalah pelanggan */}
          {user && user.role === "customer" && (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/10 dark:hover:bg-white/15 text-[#0D1317] dark:text-white transition active:scale-95 border border-black/[0.04] dark:border-white/10"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#bb6a33] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/10 pl-3 pr-1.5 py-1.5 rounded-full border border-black/[0.04] dark:border-white/10">
              <span className="text-xs font-medium text-[#0D1317] dark:text-white/90 hidden sm:inline">
                {user.role === "owner" ? "👑 " : ""}
                {user.name.split(" ")[0]}
              </span>
              {user.role === "owner" ? (
                <Link
                  href="/admin"
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#bb6a33] text-white uppercase tracking-wider hover:bg-[#A97E4F] transition"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/10 dark:bg-white/10 text-[#0D1317] dark:text-white hover:bg-[#bb6a33] hover:text-white transition"
                >
                  Akun
                </Link>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-red-500 transition"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-full bg-[#bb6a33] hover:bg-[#A97E4F] text-white text-xs font-semibold transition active:scale-95 shadow-sm group"
            >
              <span>Masuk</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-white" />
              </div>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/10 dark:hover:bg-white/15 text-[#0D1317] dark:text-white transition active:scale-95 border border-black/[0.04] dark:border-white/10"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-3 bg-white/95 dark:bg-[#080F0F]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 rounded-2xl shadow-xl flex flex-col gap-1 text-xs">
          {!user && (
            <>
              <Link
                href="/"
                onClick={handleBerandaClick}
                className={`px-4 py-2.5 rounded-xl font-medium ${isCurrent("/") ? "bg-[#bb6a33] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                Beranda
              </Link>
              <button
                type="button"
                onClick={handleInfoTokoClick}
                className="px-4 py-2.5 rounded-xl font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#bb6a33]" />
                <span>Info Toko</span>
              </button>
            </>
          )}

          {user && user.role === "customer" && (
            <>
              <Link
                href="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium ${isCurrent("/catalog") ? "bg-[#bb6a33] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                Katalog Produk
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 ${isCurrent("/wishlist") ? "bg-[#bb6a33] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <Heart className="w-4 h-4 text-[#bb6a33]" />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 ${isCurrent("/dashboard") ? "bg-[#bb6a33] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <UserIcon className="w-4 h-4 text-[#bb6a33]" />
                <span>Akun Saya</span>
              </Link>
              <button
                type="button"
                onClick={handleInfoTokoClick}
                className="px-4 py-2.5 rounded-xl font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#bb6a33]" />
                <span>Info Toko</span>
              </button>
            </>
          )}

          {user && user.role === "owner" && (
            <>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 ${isCurrent("/admin") ? "bg-[#bb6a33] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#bb6a33]" />
                <span>Portal Admin</span>
              </Link>
              <Link
                href="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium ${isCurrent("/catalog") ? "bg-[#bb6a33] text-white" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                Katalog Produk
              </Link>
              <button
                type="button"
                onClick={handleInfoTokoClick}
                className="px-4 py-2.5 rounded-xl font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#bb6a33]" />
                <span>Info Toko</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
