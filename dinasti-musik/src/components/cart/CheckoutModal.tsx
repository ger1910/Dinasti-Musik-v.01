"use client";
import React, { useState } from "react";
import { X, CreditCard, MapPin, Package, Building2, QrCode, Timer, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
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

  // QRIS State
  const [isQrisActive, setIsQrisActive] = useState(false);
  const [qrisOrderId, setQrisOrderId] = useState<string | null>(null);
  const [qrisTimeLeft, setQrisTimeLeft] = useState(15 * 60); // 15 menit
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // Timer countdown 15 menit
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQrisActive && qrisTimeLeft > 0) {
      timer = setInterval(() => {
        setQrisTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQrisActive, qrisTimeLeft]);

  if (!isOpen) return null;
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCheckPaymentStatus = () => {
    setIsCheckingPayment(true);
    setTimeout(() => {
      setIsCheckingPayment(false);
      const targetOrderId = qrisOrderId || `TRX-${Date.now().toString().slice(-6)}`;
      onOrderSuccess(targetOrderId);
      window.location.href = `/invoice?id=${targetOrderId}`;
    }, 2000);
  };

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
        if (paymentMethod === "QRIS / Gopay / OVO") {
          setQrisOrderId(data.order.id);
          setIsQrisActive(true);
          setQrisTimeLeft(15 * 60);
        } else {
          onOrderSuccess(data.order.id);
        }
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
            {isQrisActive ? <QrCode className="w-5 h-5" /> : <Package className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0D1317] dark:text-[#F3F0E8]">
              {isQrisActive ? "Pembayaran QRIS Dinasti Musik" : "Checkout Pesanan"}
            </h3>
            <span className="text-xs text-gray-500 dark:text-[#999999]">
              {isQrisActive
                ? `Order #${qrisOrderId || "TRX"} • Pindai kode QR untuk menyelesaikan tagihan`
                : "Alamat pengiriman dan metode pembayaran"}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-xs text-red-600 dark:text-red-400 font-medium rounded-lg">
            {errorMsg}
          </div>
        )}

        {isQrisActive ? (
          /* QRIS Payment Screen */
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            {/* Timer Banner */}
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-medium">
              <Timer className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Selesaikan pembayaran dalam waktu:</span>
              <span className="font-mono font-bold text-sm text-amber-900 dark:text-amber-200">
                {formatTimer(qrisTimeLeft)}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="inline-block p-6 bg-white dark:bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-[#bb6a33]/40 shadow-lg mx-auto">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
                <span className="text-[10px] font-bold tracking-widest text-[#bb6a33] uppercase">
                  QRIS STANDAR NASIONAL
                </span>
                <span className="text-[10px] text-gray-400 font-mono">DINASTI MUSIK</span>
              </div>

              {/* QR Graphic with scan overlay */}
              <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center shadow-inner">
                {/* SVG QR Code Pattern Placeholder */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-[#0D1317]"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="30" height="30" rx="4" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" rx="2" fill="white" />
                  <rect x="9" y="9" width="12" height="12" rx="1" fill="currentColor" />

                  <rect x="70" y="0" width="30" height="30" rx="4" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" rx="2" fill="white" />
                  <rect x="79" y="9" width="12" height="12" rx="1" fill="currentColor" />

                  <rect x="0" y="70" width="30" height="30" rx="4" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" rx="2" fill="white" />
                  <rect x="9" y="79" width="12" height="12" rx="1" fill="currentColor" />

                  <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="48" y="14" width="6" height="6" fill="currentColor" />
                  <rect x="56" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="36" y="24" width="6" height="6" fill="currentColor" />

                  <rect x="8" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="18" y="46" width="6" height="6" fill="currentColor" />
                  <rect x="12" y="56" width="6" height="6" fill="currentColor" />

                  <rect x="36" y="36" width="28" height="28" rx="2" fill="#bb6a33" />
                  <rect x="40" y="40" width="20" height="20" rx="2" fill="white" />
                  <circle cx="50" cy="50" r="5" fill="#bb6a33" />

                  <rect x="72" y="38" width="6" height="6" fill="currentColor" />
                  <rect x="82" y="46" width="6" height="6" fill="currentColor" />
                  <rect x="74" y="56" width="6" height="6" fill="currentColor" />

                  <rect x="38" y="72" width="6" height="6" fill="currentColor" />
                  <rect x="46" y="82" width="6" height="6" fill="currentColor" />
                  <rect x="58" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="72" y="72" width="6" height="6" fill="currentColor" />
                  <rect x="84" y="80" width="6" height="6" fill="currentColor" />
                  <rect x="76" y="88" width="6" height="6" fill="currentColor" />
                </svg>
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] text-gray-400 block">Total Tagihan:</span>
                <span className="text-lg font-bold text-[#bb6a33]">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-[#999999] max-w-sm mx-auto leading-relaxed">
              Buka aplikasi BCA Mobile, GoPay, OVO, Dana, atau mobile banking pilihan Anda, lalu scan kode QR di atas untuk menyelesaikan pesanan.
            </p>

            {/* Check Payment Button with 2s loading trigger */}
            <div className="space-y-3 pt-2 max-w-sm mx-auto">
              <button
                type="button"
                onClick={handleCheckPaymentStatus}
                disabled={isCheckingPayment}
                className="w-full py-3 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 rounded-full shadow-md hover:shadow-lg"
              >
                {isCheckingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cek Status Pembayaran</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsQrisActive(false)}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Ganti Metode Pembayaran
              </button>
            </div>
          </div>
        ) : (

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

              {/* Area Detail Pembayaran Dinamis (Conditional Rendering) */}
              {paymentMethod === "Transfer Bank (Mandiri)" && (
                <div className="mb-4 p-3.5 bg-gray-50 dark:bg-[#1c1c1c] border border-[#bb6a33]/40 dark:border-[#D97732]/40 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#bb6a33] dark:text-[#e9b999]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Rekening Tujuan Pembayaran</span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-white dark:bg-[#141414] p-3 rounded-lg border border-black/[0.05] dark:border-[#292929]">
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Nama Bank:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Bank Mandiri</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>No. Rekening:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white tracking-wider">1234-5678-9012</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Atas Nama:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">PT Suka Maju Jaya</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "Transfer Bank (BCA)" && (
                <div className="mb-4 p-3.5 bg-gray-50 dark:bg-[#1c1c1c] border border-[#bb6a33]/40 dark:border-[#D97732]/40 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#bb6a33] dark:text-[#e9b999]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Rekening Tujuan Pembayaran</span>
                  </div>
                  <div className="space-y-1.5 text-xs bg-white dark:bg-[#141414] p-3 rounded-lg border border-black/[0.05] dark:border-[#292929]">
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Nama Bank:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Bank BCA</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>No. Rekening:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white tracking-wider">8830-1234-56</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Atas Nama:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">PT Suka Maju Jaya</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "QRIS / Gopay / OVO" && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-[#1c1c1c] border border-[#bb6a33]/40 dark:border-[#D97732]/40 rounded-xl flex flex-col items-center text-center space-y-3 animate-in fade-in duration-200">
                  <div className="w-36 h-36 bg-white dark:bg-[#141414] border-2 border-dashed border-[#bb6a33]/50 dark:border-[#D97732]/50 rounded-xl flex flex-col items-center justify-center p-3 shadow-sm">
                    <QrCode className="w-12 h-12 text-[#bb6a33] dark:text-[#e9b999] mb-1.5" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-gray-700 dark:text-gray-300 uppercase">
                      QRIS PLACEHOLDER
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
                    Silakan pindai kode QR di atas untuk menyelesaikan pembayaran.
                  </p>
                </div>
              )}

              {paymentMethod === "Kartu Kredit / Debit" && (
                <div className="mb-4 p-3.5 bg-gray-50 dark:bg-[#1c1c1c] border border-[#bb6a33]/40 dark:border-[#D97732]/40 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#bb6a33] dark:text-[#e9b999]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Informasi Kartu Kredit / Debit</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1">
                      No. Kartu
                    </label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      className="w-full px-3 py-1.5 bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1">
                        Ekspirasi (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-1.5 bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-1.5 bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

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
        )}
      </div>
    </div>
  );
}
