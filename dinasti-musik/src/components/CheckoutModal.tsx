"use client";
import React, { useState } from "react";
import { X, CreditCard, MapPin, Package } from "lucide-react";
import { OrderItem, User } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  items: OrderItem[];
  user: User | null;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

const PAYMENT_METHODS = [
  "Transfer Bank (BCA)",
  "Transfer Bank (Mandiri)",
  "QRIS / Gopay / OVO",
  "Kartu Kredit / Debit",
];

export function CheckoutModal({
  isOpen,
  items,
  user,
  onClose,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  // Shipping form state
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("Sesi telah habis, silakan login kembali.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          paymentMethod,
          shippingAddress: {
            fullName,
            phone,
            address,
            city,
            province,
            postalCode,
          },
          notes: "",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onOrderSuccess(data.order.id);
      } else {
        setErrorMsg(data.error || "Gagal memproses pesanan.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-[#292929] max-w-2xl w-full p-6 md:p-8 text-[#0D1317] dark:text-[#F3F0E8] shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto rounded-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#1c1c1c] dark:hover:bg-[#222222] text-gray-500 hover:text-[#0D1317] dark:text-[#999999] dark:hover:text-[#F3F0E8] border border-black/[0.07] dark:border-[#292929] transition-colors z-10 rounded-lg"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#bb6a33] text-white flex items-center justify-center font-bold rounded-full">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0D1317] dark:text-[#F3F0E8]">
              Checkout Pesanan
            </h3>
            <span className="text-xs text-gray-500 dark:text-[#999999]">
              Alamat pengiriman dan metode pembayaran
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-xs text-red-600 dark:text-red-400 font-medium rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Shipping Info */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-[#0D1317] dark:text-[#F3F0E8] uppercase tracking-wider border-b border-black/[0.06] dark:border-[#292929] pb-2 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#bb6a33]" />
              <span>Alamat Pengiriman</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 dark:text-[#999999] block mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 dark:text-[#999999] block mb-1">
                  No. Telepon / WA
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-500 dark:text-[#999999] block mb-1">
                Alamat Lengkap
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-gray-500 dark:text-[#999999] block mb-1">
                  Kota / Kab
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 dark:text-[#999999] block mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 dark:text-[#999999] block mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Summary */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#0D1317] dark:text-[#F3F0E8] uppercase tracking-wider border-b border-black/[0.06] dark:border-[#292929] pb-2 flex items-center gap-2 mb-3">
                <CreditCard className="w-3.5 h-3.5 text-[#bb6a33]" />
                <span>Metode Pembayaran</span>
              </h4>

              <div className="space-y-2 mb-4">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-2.5 border cursor-pointer transition-colors text-xs rounded-xl ${
                      paymentMethod === method
                        ? "bg-amber-50 dark:bg-[#D97732]/10 border-[#bb6a33] dark:border-[#D97732] text-[#0D1317] dark:text-[#F3F0E8]"
                        : "bg-gray-50 dark:bg-[#1c1c1c] border-black/[0.07] dark:border-[#292929] text-gray-600 dark:text-[#999999] hover:border-gray-300 dark:hover:border-[#444444]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#D97732]"
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.07] dark:border-[#292929] p-3 text-xs space-y-1.5 rounded-xl">
                <div className="flex justify-between text-gray-500 dark:text-[#999999]">
                  <span>Total Produk ({items.length} item)</span>
                  <span className="text-[#0D1317] dark:text-[#F3F0E8]">{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-[#999999]">
                  <span>Biaya Pengiriman</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-black/[0.06] dark:border-[#292929] text-sm font-bold">
                  <span className="text-[#0D1317] dark:text-[#F3F0E8]">Total Tagihan</span>
                  <span className="text-[#bb6a33]">{formatRupiah(total)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-full"
            >
              {isSubmitting ? "Memproses Pesanan..." : "Konfirmasi Pembelian"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
