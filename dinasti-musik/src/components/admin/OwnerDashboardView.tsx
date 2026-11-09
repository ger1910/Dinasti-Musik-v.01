"use client";
import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { OwnerStats } from "@/types";
import { formatRupiah, formatDate } from "@/lib/utils";
import { ProfitRevenueChart } from "@/components/admin/ProfitRevenueChart";

interface FinanceSummary {
  period: string;
  totalRevenue: number;
  pendingRevenue: number;
  totalExpenses: number;
  profit: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  byPaymentMethod: Record<string, number>;
}

export function OwnerDashboardView() {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, financeRes] = await Promise.all([
          fetch("/api/owner/stats"),
          fetch("/api/finance/summary"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (financeRes.ok) setFinance(await financeRes.json());
      } catch {
        // Gagal memuat data
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D97732] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
          Memuat Analisis Bisnis...
        </p>
      </div>
    );
  }

  if (!stats)
    return (
      <div className="p-8 text-center text-red-400 bg-[#181818] border border-[#292929]">
        Gagal memuat statistik.
      </div>
    );

  const totalRevenue = finance?.totalRevenue ?? stats.totalRevenue ?? 0;
  const totalExpenses = finance?.totalExpenses ?? 15000000;
  const profit = finance?.profit ?? totalRevenue - totalExpenses;
  const pendingRevenue =
    finance?.pendingRevenue ?? stats.pendingOrders * 12500000;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Interactive Charts & Financial Metrics */}
      <ProfitRevenueChart
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        profit={profit}
        pendingRevenue={pendingRevenue}
      />

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#181818] border border-[#292929]">
          <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#999999] font-bold uppercase tracking-wider mb-1">
            Pesanan Selesai
          </p>
          <p className="font-bold text-2xl text-[#F3F0E8]">
            {stats.completedOrders || 0}
          </p>
        </div>

        <div className="p-5 bg-[#181818] border border-[#292929]">
          <div className="w-8 h-8 bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#999999] font-bold uppercase tracking-wider mb-1">
            Pesanan Pending
          </p>
          <p className="font-bold text-2xl text-amber-400">
            {stats.pendingOrders || 0}
          </p>
        </div>

        <div className="p-5 bg-[#181818] border border-[#292929]">
          <div className="w-8 h-8 bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
            <Package className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#999999] font-bold uppercase tracking-wider mb-1">
            Total Katalog
          </p>
          <p className="font-bold text-2xl text-[#F3F0E8]">
            {stats.totalProducts}
          </p>
        </div>

        <div className="p-5 bg-[#181818] border border-[#292929]">
          <div className="w-8 h-8 bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#999999] font-bold uppercase tracking-wider mb-1">
            Perlu Restock
          </p>
          <p className="font-bold text-2xl text-red-400">
            {stats.lowStockCount}
          </p>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 bg-[#181818] border border-[#292929]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#F3F0E8]">
            Aktivitas Transaksi Terbaru
          </h3>
          <span className="text-[11px] text-[#999999]">10 Transaksi Terakhir</span>
        </div>

        <div className="space-y-2.5">
          {stats.recentOrders?.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row justify-between sm:items-center p-3.5 bg-[#141414] border border-[#292929] gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-xs text-[#F3F0E8]">{order.id}</p>
                  <span
                    className={`text-[9px] px-2 py-0.2 font-bold uppercase ${
                      order.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : order.status === "Cancelled"
                        ? "bg-red-500/10 text-red-400 border border-red-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#777777] mt-0.5">
                  {order.customerName} • {formatDate(order.date)}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="font-bold text-sm text-[#D97732]">
                  {formatRupiah(order.total)}
                </p>
              </div>
            </div>
          ))}
          {(!stats.recentOrders || stats.recentOrders.length === 0) && (
            <p className="text-xs text-[#777777] text-center py-6">
              Belum ada pesanan terbaru tercatat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
