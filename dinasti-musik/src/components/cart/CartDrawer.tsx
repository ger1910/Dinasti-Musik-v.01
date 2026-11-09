"use client";
import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { OrderItem } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  items: OrderItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onOpenCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#141414] border-l border-black/[0.06] dark:border-[#292929] text-[#0D1317] dark:text-[#F3F0E8] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-black/[0.06] dark:border-[#292929] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#bb6a33]/10 border border-[#bb6a33]/30 text-[#bb6a33] flex items-center justify-center rounded-lg">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0D1317] dark:text-[#F3F0E8]">
                  Keranjang Belanja
                </h3>
                <span className="text-[11px] text-gray-500 dark:text-[#999999]">
                  {items.length} item dipilih
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-[#0D1317] dark:text-[#999999] dark:hover:text-[#F3F0E8] hover:bg-gray-100 dark:hover:bg-[#222222] transition-colors border border-transparent hover:border-black/[0.07] dark:hover:border-[#292929] rounded-lg"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {items.length === 0 ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-[#1c1c1c] border border-black/[0.06] dark:border-[#292929] flex items-center justify-center mx-auto text-gray-400 dark:text-[#666666] rounded-full">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-[#0D1317] dark:text-[#F3F0E8]">
                  Keranjang Anda masih kosong
                </p>
                <p className="text-xs text-gray-400 dark:text-[#777777] max-w-xs mx-auto">
                  Pilih produk favorit Anda dari katalog resmi Dinasti Musik.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3.5 p-3 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.06] dark:border-[#292929] rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover bg-gray-100 dark:bg-[#222222] border border-black/[0.05] dark:border-[#292929] rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs text-[#0D1317] dark:text-[#F3F0E8] truncate mb-0.5">
                      {item.name}
                    </h4>
                    <span className="font-bold text-xs text-[#bb6a33]">
                      {formatRupiah(item.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-[#111111] px-2 py-1 border border-black/[0.06] dark:border-[#292929] rounded-lg">
                    <button
                      onClick={() => onUpdateQty(item.productId, -1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-[#999999] hover:text-[#0D1317] dark:hover:text-[#F3F0E8] transition-colors"
                      title="Kurangi"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-semibold text-[#0D1317] dark:text-[#F3F0E8]">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.productId, 1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-[#999999] hover:text-[#0D1317] dark:hover:text-[#F3F0E8] transition-colors"
                      title="Tambah"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="p-1.5 text-gray-400 hover:text-red-500 dark:text-[#666666] dark:hover:text-red-400 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-black/[0.06] dark:border-[#292929] bg-gray-50 dark:bg-[#1c1c1c] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#999999]">
                  Total Pembayaran
                </span>
                <span className="text-lg font-bold text-[#bb6a33]">
                  {formatRupiah(total)}
                </span>
              </div>

              <button
                onClick={onOpenCheckout}
                className="w-full py-3.5 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-full"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
