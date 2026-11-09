"use client";
import React from "react";
import { Package, Clock, Calendar, Store, FileText } from "lucide-react";
import { Order } from "@/types";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";

interface CustomerOrdersViewProps {
  orders: Order[];
  onBrowseCatalog: () => void;
}

const STATUS_BADGES: Record<string, string> = {
  Pending: "bg-amber-500/20 text-amber-300 border-amber-500/50 ring-1 ring-amber-500/30",
  Confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/50 ring-1 ring-blue-500/30",
  Processing: "bg-purple-500/20 text-purple-300 border-purple-500/50 ring-1 ring-purple-500/30",
  Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 ring-1 ring-emerald-500/30",
  Cancelled: "bg-red-500/20 text-red-300 border-red-500/50 ring-1 ring-red-500/30",
};

export function CustomerOrdersView({
  orders,
  onBrowseCatalog,
}: CustomerOrdersViewProps) {
  return (
    <section className="py-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <span className="text-[11px] uppercase font-mono tracking-widest text-[#D97732] font-semibold block mb-1">
          Dokumen Transaksi
        </span>
        <h2 className="text-2xl font-bold text-[#F3F0E8]">
          Riwayat Pesanan Anda
        </h2>
        <p className="text-xs text-[#999999] mt-1">
          Lacak status pemesanan, invoice pembelian, dan rincian pengiriman instrumen.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-[#181818] border border-[#292929] p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#141414] border border-[#292929] text-[#777777] flex items-center justify-center mx-auto mb-4">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#F3F0E8] mb-1">
            Belum Ada Transaksi
          </h3>
          <p className="text-xs text-[#999999] mb-6">
            Anda belum memiliki riwayat pemesanan instrumen di Dinasti Musik.
          </p>
          <button
            onClick={onBrowseCatalog}
            className="px-6 py-2.5 bg-[#D97732] hover:bg-[#c46828] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 mx-auto"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Jelajahi Katalog</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-[#181818] border border-[#292929] space-y-4 rounded-xl shadow-xs"
            >
              {/* Header with Prominent Status Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#292929] pb-3">
                <div>
                  <span className="font-mono font-bold text-xs text-[#D97732] tracking-wider block">
                    #{order.id}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#777777] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.date).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Primary Visual Focal Point: Status Badge */}
                <span
                  className={`px-3 py-1 text-xs font-bold uppercase border rounded-full shadow-xs ${
                    STATUS_BADGES[order.status] ||
                    "bg-[#141414] text-[#999999] border-[#292929]"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#999999] font-mono">{item.qty}x</span>
                      <span className="text-[#F3F0E8] font-medium">{item.name}</span>
                    </div>
                    <span className="text-[#999999]">
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Summary with restrained price size & Invoice link */}
              <div className="border-t border-[#292929] pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[#777777]">
                    Metode: <strong className="text-[#F3F0E8]">{order.paymentMethod}</strong>
                  </span>
                  <Link
                    href={`/invoice?id=${order.id}`}
                    className="text-[11px] font-semibold text-[#D97732] hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Lihat Invoice</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#777777]">Total Tagihan:</span>
                  <span className="font-semibold text-[#D97732] text-base">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
