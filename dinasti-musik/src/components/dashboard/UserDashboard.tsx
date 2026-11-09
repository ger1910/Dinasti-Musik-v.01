"use client";
import React, { useEffect, useState } from "react";
import { User, Order } from "@/types";
import {
  Package,
  LogOut,
  Clock,
  CheckCircle,
  CreditCard,
  XCircle,
  ArrowRight,
  Settings,
  Shield,
  Bell,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useApp } from "@/components/layout/AppProvider";

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onContinueShopping: () => void;
}

export function UserDashboard({
  user,
  onLogout,
  onContinueShopping,
}: UserDashboardProps) {
  const { setUser, theme, setTheme } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "settings">("orders");

  // Settings form states
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [waNotification, setWaNotification] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setUser({
        ...user,
        name: editName,
        phone: editPhone,
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-amber-300 bg-amber-500/20 border-amber-500/50 shadow-xs ring-1 ring-amber-500/30 font-bold";
      case "Confirmed":
      case "Processing":
        return "text-blue-300 bg-blue-500/20 border-blue-500/50 shadow-xs ring-1 ring-blue-500/30 font-bold";
      case "Shipped":
        return "text-indigo-300 bg-indigo-500/20 border-indigo-500/50 shadow-xs ring-1 ring-indigo-500/30 font-bold";
      case "Completed":
        return "text-emerald-300 bg-emerald-500/20 border-emerald-500/50 shadow-xs ring-1 ring-emerald-500/30 font-bold";
      case "Cancelled":
        return "text-red-300 bg-red-500/20 border-red-500/50 shadow-xs ring-1 ring-red-500/30 font-bold";
      default:
        return "text-[#999999] bg-[#141414] border-[#292929]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "Completed":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "Cancelled":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-8 border-b border-black/[0.07] dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#bb6a33] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm">
              Member Dinasti Musik
            </span>
          </div>
          <h1 className="font-bold text-2xl md:text-3xl text-[#0D1317] dark:text-[#F3F0E8]">
            Halo, {user.name.split(" ")[0]}
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#999999] mt-1">
            Pantau status pesanan, data profil, dan invoice pembelian instrumen Anda.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onContinueShopping}
            className="flex-1 md:flex-none px-4 py-2 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center rounded-lg"
          >
            Lanjut Belanja
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 border border-black/[0.08] dark:border-white/10 bg-white dark:bg-[#141414] hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 dark:text-red-400 hover:border-red-300 dark:hover:border-red-500/40 text-xs font-semibold uppercase tracking-wider transition-colors text-center flex items-center gap-2 justify-center rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-8 border-b border-black/[0.07] dark:border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-lg flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-[#0D1317] dark:bg-white text-white dark:text-[#0D1317] shadow-sm"
              : "bg-white dark:bg-[#141414] text-gray-500 dark:text-gray-400 border border-black/[0.07] dark:border-white/10 hover:text-black dark:hover:text-white"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Pesanan Saya</span>
          {orders.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-[#bb6a33] text-white font-bold rounded-full">
              {orders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-lg flex items-center gap-2 ${
            activeTab === "profile"
              ? "bg-[#0D1317] dark:bg-white text-white dark:text-[#0D1317] shadow-sm"
              : "bg-white dark:bg-[#141414] text-gray-500 dark:text-gray-400 border border-black/[0.07] dark:border-white/10 hover:text-black dark:hover:text-white"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Profil Akun</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-lg flex items-center gap-2 ${
            activeTab === "settings"
              ? "bg-[#0D1317] dark:bg-white text-white dark:text-[#0D1317] shadow-sm"
              : "bg-white dark:bg-[#141414] text-gray-500 dark:text-gray-400 border border-black/[0.07] dark:border-white/10 hover:text-black dark:hover:text-white"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Pengaturan</span>
        </button>
      </div>

      {/* TAB 1: RIWAYAT PESANAN */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#F3F0E8] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D97732]" />
              <span>Riwayat Pesanan</span>
            </h3>
            <span className="text-xs text-[#999999]">Total {orders.length} transaksi</span>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-7 h-7 border-2 border-[#bb6a33] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl text-center flex flex-col items-center justify-center shadow-xs">
              <Package className="w-10 h-10 text-gray-300 dark:text-[#444444] mb-3" />
              <p className="text-sm font-semibold text-[#0D1317] dark:text-[#F3F0E8] mb-4">
                Anda belum pernah melakukan pemesanan instrumen.
              </p>
              <button
                onClick={onContinueShopping}
                className="px-5 py-2.5 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 rounded-full"
              >
                <span>Jelajahi Katalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl shadow-xs"
                >
                  <div className="flex flex-wrap gap-4 items-start justify-between mb-4 border-b border-black/[0.06] dark:border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] text-gray-400 dark:text-[#777777] font-semibold tracking-wider uppercase block mb-0.5">
                        ID Transaksi
                      </span>
                      <span className="font-bold text-sm text-[#0D1317] dark:text-[#F3F0E8]">
                        #{order.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 dark:text-[#777777] font-semibold tracking-wider uppercase block mb-0.5">
                        Tanggal Pesanan
                      </span>
                      <span className="text-xs font-medium text-gray-500 dark:text-[#999999]">
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.05] dark:border-white/10 overflow-hidden shrink-0 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0D1317] dark:text-[#F3F0E8] truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-[#777777]">
                            {item.qty} x {formatRupiah(item.price)}
                          </p>
                        </div>
                        <div className="text-xs font-bold text-[#0D1317] dark:text-[#F3F0E8]">
                          {formatRupiah(item.price * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/[0.06] dark:border-white/10 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-[#777777]">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{order.paymentMethod}</span>
                      <span>•</span>
                      <span
                        className={
                          order.paymentStatus === "Paid"
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "text-amber-600 dark:text-amber-400 font-semibold"
                        }
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`/invoice?id=${order.id}`}
                        className="text-[11px] font-semibold text-[#bb6a33] hover:underline"
                      >
                        Lihat Invoice
                      </a>
                      <div className="text-right">
                        <span className="text-gray-400 mr-1.5 font-normal text-xs">Total Tagihan:</span>
                        <span className="text-base font-semibold text-[#bb6a33]">
                          {formatRupiah(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFIL SAYA */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-6 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl text-center flex flex-col items-center shadow-xs">
            <div className="w-16 h-16 bg-[#bb6a33] text-white font-bold text-xl flex items-center justify-center mb-4 rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-base text-[#0D1317] dark:text-[#F3F0E8]">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-[#999999] mt-0.5">{user.email}</p>
            <span className="mt-3 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/30 rounded-full">
              Akun Terverifikasi
            </span>
          </div>

          <div className="md:col-span-2 p-6 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl space-y-4 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0D1317] dark:text-[#F3F0E8] border-b border-black/[0.06] dark:border-white/10 pb-3">
              Informasi Pribadi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#777777] font-semibold mb-1">
                  Nama Lengkap
                </span>
                <span className="block text-sm font-medium text-[#0D1317] dark:text-[#F3F0E8]">
                  {user.name}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#777777] font-semibold mb-1">
                  Alamat Email
                </span>
                <span className="block text-sm font-medium text-[#0D1317] dark:text-[#F3F0E8]">
                  {user.email}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#777777] font-semibold mb-1">
                  Nomor WhatsApp
                </span>
                <span className="block text-sm font-medium text-[#0D1317] dark:text-[#F3F0E8]">
                  {user.phone || "Belum diatur"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#777777] font-semibold mb-1">
                  Tipe Akun
                </span>
                <span className="block text-sm font-medium text-[#0D1317] dark:text-[#F3F0E8] capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/[0.06] dark:border-white/10">
              <button
                onClick={() => setActiveTab("settings")}
                className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-[#1c1c1c] dark:hover:bg-[#252525] border border-black/[0.08] dark:border-white/10 text-xs font-semibold text-[#0D1317] dark:text-[#F3F0E8] transition-colors rounded-lg"
              >
                Ubah di Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENGATURAN */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Theme Switcher Card */}
          <div className="p-6 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0D1317] dark:text-[#F3F0E8] flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#bb6a33]" />
                  <span>Tema Tampilan Website</span>
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-[#999999] mt-1">
                  Pilih mode tema yang Anda sukai untuk kenyamanan berbelanja.
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#bb6a33]/10 text-[#bb6a33] border border-[#bb6a33]/20">
                Aktif: {theme === "dark" ? "Mode Gelap" : "Mode Terang"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* Light Mode Option */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-200 ${
                  theme === "light"
                    ? "border-[#bb6a33] bg-amber-50/50 dark:bg-amber-950/20 shadow-xs ring-1 ring-[#bb6a33]"
                    : "border-black/[0.08] dark:border-white/10 bg-white dark:bg-[#1A1A1A] hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  theme === "light" ? "bg-[#bb6a33] text-white" : "bg-gray-100 dark:bg-white/10 text-amber-500"
                }`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0D1317] dark:text-white">
                      ☀️ Mode Terang (Light)
                    </span>
                    {theme === "light" && (
                      <span className="w-2 h-2 rounded-full bg-[#bb6a33]" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    Latar putih & bersih, kontras tinggi, ideal di siang hari.
                  </p>
                </div>
              </button>

              {/* Dark Mode Option */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-200 ${
                  theme === "dark"
                    ? "border-[#bb6a33] bg-amber-50/50 dark:bg-amber-950/20 shadow-xs ring-1 ring-[#bb6a33]"
                    : "border-black/[0.08] dark:border-white/10 bg-white dark:bg-[#1A1A1A] hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  theme === "dark" ? "bg-[#bb6a33] text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400"
                }`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0D1317] dark:text-white">
                      🌙 Mode Gelap (Dark)
                    </span>
                    {theme === "dark" && (
                      <span className="w-2 h-2 rounded-full bg-[#bb6a33]" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    Latar Obsidian Noir, minim silau, nuansa studio musik malam.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0D1317] dark:text-[#F3F0E8] mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#bb6a33]" />
              <span>Pengaturan Akun & Kontak</span>
            </h3>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 rounded-lg">
                <Check className="w-4 h-4" />
                <span>Data profil berhasil diperbarui!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 dark:text-[#999999] block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-white/10 text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-500 dark:text-[#999999] block mb-1">
                  Alamat Email (Akun)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-[#111111] border border-black/[0.06] dark:border-white/[0.06] text-xs text-gray-400 dark:text-[#666666] cursor-not-allowed rounded-lg"
                />
                <span className="text-[10px] text-gray-400 dark:text-[#666666] mt-1 block">
                  Email digunakan sebagai kredensial login utama akun Anda.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-500 dark:text-[#999999] block mb-1">
                  Nomor WhatsApp Pengiriman
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-white/10 text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-full"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0D1317] dark:text-[#F3F0E8] mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#bb6a33]" />
              <span>Notifikasi Transaksi</span>
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#0D1317] dark:text-[#F3F0E8]">
                  Update Status via WhatsApp
                </p>
                <p className="text-[11px] text-gray-500 dark:text-[#999999]">
                  Kirim pemberitahuan nomor resi pengiriman dan konfirmasi pesanan langsung ke nomor WA Anda
                </p>
              </div>
              <input
                type="checkbox"
                checked={waNotification}
                onChange={(e) => setWaNotification(e.target.checked)}
                className="w-4 h-4 accent-[#bb6a33] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
