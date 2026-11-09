"use client";
import React, { useState, useEffect, useCallback } from "react";
import { OwnerDashboardView } from "@/components/admin/OwnerDashboardView";
import { ProductCrudModal } from "@/components/admin/ProductCrudModal";
import { AdminSettingsView } from "@/components/admin/AdminSettingsView";
import { useApp } from "@/components/layout/AppProvider";
import { Product, Order } from "@/types";
import {
  BarChart3,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Edit2,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function AdminPage() {
  const { user, products, fetchData } = useApp();
  // 4 Tabs: dashboard, products, orders, settings
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "settings"
  >("dashboard");

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Products CRUD State
  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (user?.role === "owner") {
      fetch("/api/orders")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (active) setOrders(data);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [user]);

  if (!user || user.role !== "owner") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-red-950/40 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#F3F0E8] mb-2">Akses Terbatas</h2>
        <p className="text-xs text-[#999999] max-w-sm">
          Halaman ini khusus diperuntukkan bagi Pengelola Toko Dinasti Musik.
        </p>
      </div>
    );
  }

  // Update order status: 3 choices (Completed, Pending, Cancelled)
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: "Completed" | "Pending" | "Cancelled"
  ) => {
    setUpdatingOrderId(orderId);
    setActionMessage(null);

    const paymentStatus =
      newStatus === "Completed"
        ? "Paid"
        : newStatus === "Pending"
        ? "Unpaid"
        : undefined;

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, paymentStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  paymentStatus: paymentStatus || o.paymentStatus,
                }
              : o
          )
        );
        setActionMessage(
          `Status pesanan #${orderId} berhasil diubah ke ${newStatus}!`
        );
        setTimeout(() => setActionMessage(null), 3500);
      } else {
        const err = await res.json();
        setActionMessage(
          `Gagal mengubah status: ${err.error || "Terjadi kesalahan"}`
        );
      }
    } catch {
      setActionMessage("Gagal menghubungi server.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : "/api/products";
    const method = editingProduct ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      await fetchData();
      setIsCrudOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Yakin ingin menghapus "${productName}" dari katalog?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
        setActionMessage(`Produk "${productName}" berhasil dihapus.`);
        setTimeout(() => setActionMessage(null), 3500);
      } else {
        const err = await res.json();
        setActionMessage(`Gagal menghapus produk: ${err.error || "Terjadi kesalahan"}`);
      }
    } catch {
      setActionMessage("Gagal menghubungi server untuk menghapus produk.");
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      orderFilter === "all"
        ? true
        : orderFilter === "completed"
        ? o.status === "Completed"
        : orderFilter === "pending"
        ? o.status === "Pending" ||
          o.status === "Confirmed" ||
          o.status === "Processing"
        : orderFilter === "cancelled"
        ? o.status === "Cancelled"
        : true;

    const matchesSearch = !orderSearch.trim()
      ? true
      : o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 animate-in fade-in">
      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-[#181818] text-[#F3F0E8] p-6 sm:p-8 border border-[#292929]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#D97732] text-white text-[10px] font-bold uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl tracking-tight">
            Manajemen Toko Dinasti Musik
          </h1>
          <p className="text-xs text-[#999999] mt-1">
            Monitoring performa penjualan, katalog instrumen, kontrol transaksi pelanggan, dan konfigurasi toko.
          </p>
        </div>

        {/* 4 Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#141414] p-1.5 border border-[#292929]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "dashboard"
                ? "bg-[#D97732] text-white"
                : "text-[#999999] hover:text-[#F3F0E8]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "products"
                ? "bg-[#D97732] text-white"
                : "text-[#999999] hover:text-[#F3F0E8]"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produk</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-[#D97732] text-white"
                : "text-[#999999] hover:text-[#F3F0E8]"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.2 bg-black/40 text-[10px] font-bold">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-[#D97732] text-white"
                : "text-[#999999] hover:text-[#F3F0E8]"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan</span>
          </button>
        </div>
      </div>

      {/* Action Message Alert */}
      {actionMessage && (
        <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center justify-between">
          <span>{actionMessage}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-emerald-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <OwnerDashboardView />
        </div>
      )}

      {/* TAB 2: PRODUK */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#181818] p-5 border border-[#292929]">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#F3F0E8]">
                Inventaris Produk Dinasti Musik
              </h3>
              <p className="text-xs text-[#999999] mt-0.5">
                Total {products.length} instrumen terdaftar
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsCrudOpen(true);
              }}
              className="px-4 py-2 bg-[#D97732] hover:bg-[#c46828] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-[#181818] border border-[#292929] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] text-[#D97732] font-bold uppercase tracking-wider">
                        {p.brand} • {p.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#F3F0E8] mt-0.5 line-clamp-1">
                        {p.name}
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold border ${
                        p.stock <= 2
                          ? "bg-red-500/10 border-red-500/30 text-red-400"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      }`}
                    >
                      Stok: {p.stock}
                    </span>
                  </div>

                  <p className="font-bold text-base text-[#D97732] mb-4">
                    {formatRupiah(p.price)}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#292929] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#666666] font-mono">{p.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsCrudOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                      title="Edit Spesifikasi Instrumen"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                      title="Hapus Instrumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDER */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 bg-[#181818] border border-[#292929] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari ID pesanan, customer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] placeholder:text-[#666666] focus:outline-none focus:border-[#D97732]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-[#666666] shrink-0" />
              <button
                onClick={() => setOrderFilter("all")}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  orderFilter === "all"
                    ? "bg-[#D97732] text-white border-[#D97732]"
                    : "bg-[#141414] text-[#999999] border-[#292929] hover:text-[#F3F0E8]"
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter("pending")}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  orderFilter === "pending"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-[#141414] text-amber-400 border-[#292929] hover:border-amber-500/40"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setOrderFilter("completed")}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  orderFilter === "completed"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-[#141414] text-emerald-400 border-[#292929] hover:border-emerald-500/40"
                }`}
              >
                Selesai
              </button>
              <button
                onClick={() => setOrderFilter("cancelled")}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  orderFilter === "cancelled"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-[#141414] text-red-400 border-[#292929] hover:border-red-500/40"
                }`}
              >
                Batal
              </button>

              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="p-1.5 bg-[#141414] border border-[#292929] hover:bg-[#222222] text-[#999999] hover:text-[#F3F0E8] transition-colors ml-auto"
                title="Refresh pesanan"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${ordersLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Orders List */}
          {ordersLoading && orders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#D97732] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
                Memuat Pesanan...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 bg-[#181818] border border-[#292929] text-center">
              <ShoppingBag className="w-10 h-10 text-[#555555] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#F3F0E8]">
                Tidak ada pesanan ditemukan
              </p>
              <p className="text-xs text-[#777777] mt-1">
                Sesuaikan kata kunci pencarian atau filter status transaksi
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isUpdating = updatingOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="p-5 bg-[#181818] border border-[#292929]"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-[#292929]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#F3F0E8]">
                            #{order.id}
                          </span>
                          <span
                            className={`px-2 py-0.2 text-[10px] font-bold uppercase border ${
                              order.status === "Completed"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : order.status === "Cancelled"
                                ? "bg-red-500/10 border-red-500/30 text-red-400"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#999999] mt-1">
                          Pemesan:{" "}
                          <strong className="text-[#F3F0E8]">
                            {order.customerName}
                          </strong>{" "}
                          ({order.customerEmail})
                          {order.customerPhone && ` • WA: ${order.customerPhone}`}
                        </p>
                        <p className="text-[11px] text-[#666666] mt-0.5">
                          Waktu Order: {formatDate(order.date)}
                        </p>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#777777] tracking-wider">
                          Ubah Status:
                        </span>
                        <div className="flex items-center gap-1 bg-[#141414] p-1 border border-[#292929]">
                          <button
                            type="button"
                            disabled={isUpdating || order.status === "Completed"}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "Completed")
                            }
                            className={`px-2.5 py-1 text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                              order.status === "Completed"
                                ? "bg-emerald-600 text-white"
                                : "text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Selesai</span>
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating || order.status === "Pending"}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "Pending")
                            }
                            className={`px-2.5 py-1 text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                              order.status === "Pending"
                                ? "bg-amber-600 text-white"
                                : "text-amber-400 hover:bg-amber-500/10"
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating || order.status === "Cancelled"}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "Cancelled")
                            }
                            className={`px-2.5 py-1 text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                              order.status === "Cancelled"
                                ? "bg-red-600 text-white"
                                : "text-red-400 hover:bg-red-500/10"
                            }`}
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Batal</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Details */}
                    <div className="py-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 bg-[#141414] border border-[#292929] font-bold text-[#F3F0E8] flex items-center justify-center text-[10px]">
                              {item.qty}x
                            </span>
                            <span className="text-[#F3F0E8]">{item.name}</span>
                          </div>
                          <span className="text-[#999999]">
                            {formatRupiah(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping and Footer Row */}
                    <div className="pt-3 border-t border-[#292929] flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="text-[11px] text-[#999999] flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-[#666666]" />
                        <span>
                          Metode: <strong className="text-[#F3F0E8]">{order.paymentMethod}</strong>
                        </span>
                        <span>•</span>
                        <span
                          className={
                            order.paymentStatus === "Paid"
                              ? "text-emerald-400 font-semibold"
                              : "text-amber-400 font-semibold"
                          }
                        >
                          Status: {order.paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="text-[11px] text-[#777777] uppercase font-semibold">
                          Total Tagihan:
                        </span>
                        <span className="font-bold text-sm text-[#D97732]">
                          {formatRupiah(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <AdminSettingsView />
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <ProductCrudModal
        isOpen={isCrudOpen}
        initialProduct={editingProduct}
        onClose={() => {
          setIsCrudOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
