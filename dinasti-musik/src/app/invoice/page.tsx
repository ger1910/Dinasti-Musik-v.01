"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Printer,
  ArrowLeft,
  X,
  CreditCard,
  MapPin,
  FileCheck,
  AlertCircle,
  Building2,
  Package,
} from "lucide-react";
import { Order } from "@/types";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function InvoicePage() {
  return (
    <React.Suspense fallback={<InvoiceLoading />}>
      <InvoiceContent />
    </React.Suspense>
  );
}

function InvoiceLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#bb6a33] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Memuat Invoice...
      </p>
    </div>
  );
}

function InvoiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Drag and Drop State
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadNote, setUploadNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        if (orderId) {
          const res = await fetch(`/api/orders/${orderId}`);
          if (res.ok) {
            const data = await res.json();
            setOrder(data);
            return;
          }
        }
        // Fallback: load latest order from user
        const resAll = await fetch("/api/orders");
        if (resAll.ok) {
          const orders: Order[] = await resAll.json();
          if (orders && orders.length > 0) {
            setOrder(orders[0]);
            return;
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data invoice:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [orderId]);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadError("");
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Format file harus berupa JPG, PNG, WEBP, atau PDF.");
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Silakan pilih file bukti transfer terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    // Simulate upload to server
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      if (order) {
        setOrder({
          ...order,
          paymentStatus: "Paid",
          status: "Confirmed",
        });
      }
    }, 1500);
  };

  if (loading) {
    return <InvoiceLoading />;
  }

  // Fallback demo order if none found
  const invoiceData: Order = order || {
    id: orderId || "TRX-DEMO-001",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    customerId: "usr_demo",
    customerName: "Musisi Indonesia",
    customerEmail: "musisi@dinastimusik.com",
    customerPhone: "081234567890",
    shippingAddress: {
      fullName: "Musisi Indonesia",
      phone: "081234567890",
      address: "Studio Musik Dinasti, Jl. Pasir Rahayu IV CC No. 22",
      city: "Bandung",
      province: "Jawa Barat",
      postalCode: "40254",
    },
    items: [
      {
        productId: "p1",
        name: "Fender American Ultra Stratocaster (HSS)",
        price: 34500000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800",
      },
    ],
    subtotal: 34500000,
    shippingCost: 0,
    total: 34500000,
    paymentMethod: "QRIS / Gopay / OVO",
    paymentStatus: "Unpaid",
    status: "Pending",
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 animate-in fade-in">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Pesanan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-black/[0.08] dark:border-white/10 bg-white dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#bb6a33]" />
            <span>Cetak Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Invoice Card */}
      <div className="bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-white/10 rounded-2xl shadow-xl p-6 sm:p-10 mb-8 overflow-hidden relative">
        {/* Subtle Watermark or Header Glow */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-black/[0.06] dark:border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-lg bg-[#bb6a33] text-white font-bold flex items-center justify-center text-xs tracking-tight">
                DM
              </span>
              <span className="font-serif font-bold text-xl text-[#0D1317] dark:text-[#F3F0E8]">
                Dinasti Musik
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#999999] max-w-xs leading-relaxed">
              Pusat instrumen & audio musik premium pilihan musisi profesional.
              <br />
              Jl. Pasir Rahayu IV, CC No. 22, Bandung • 0899-2221-537
            </p>
          </div>

          <div className="sm:text-right">
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/40 rounded-full text-[11px] font-bold uppercase tracking-wider inline-block mb-2">
              {invoiceData.paymentStatus === "Paid" ? "Lunas / Terverifikasi" : "Menunggu Pembayaran"}
            </span>
            <h1 className="font-mono font-bold text-xl sm:text-2xl text-[#0D1317] dark:text-[#F3F0E8]">
              #{invoiceData.id}
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#999999] mt-0.5">
              Tanggal: {formatDate(invoiceData.date)}
            </p>
          </div>
        </div>

        {/* Customer & Shipping Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-black/[0.06] dark:border-white/10 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-[#777777] block mb-1.5">
              Ditujukan Kepada
            </span>
            <p className="font-semibold text-sm text-[#0D1317] dark:text-[#F3F0E8]">
              {invoiceData.customerName}
            </p>
            <p className="text-gray-500 dark:text-[#999999] mt-0.5">{invoiceData.customerEmail}</p>
            {invoiceData.customerPhone && (
              <p className="text-gray-500 dark:text-[#999999]">{invoiceData.customerPhone}</p>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-[#777777] block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#bb6a33]" />
              <span>Alamat Pengiriman</span>
            </span>
            {invoiceData.shippingAddress ? (
              <div className="text-gray-600 dark:text-[#cccccc] leading-relaxed">
                <p className="font-medium text-[#0D1317] dark:text-[#F3F0E8]">
                  {invoiceData.shippingAddress.fullName}
                </p>
                <p>{invoiceData.shippingAddress.address}</p>
                <p>
                  {invoiceData.shippingAddress.city}, {invoiceData.shippingAddress.province}{" "}
                  {invoiceData.shippingAddress.postalCode}
                </p>
              </div>
            ) : (
              <p className="text-gray-400">Alamat standar pengiriman</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 border-b border-black/[0.06] dark:border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/10 text-gray-400 dark:text-[#777777] font-semibold uppercase tracking-wider">
                  <th className="pb-3">Deskripsi Instrumen</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Harga Satuan</th>
                  <th className="pb-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {invoiceData.items.map((item, idx) => (
                  <tr key={idx} className="group">
                    <td className="py-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#1f1f1f] border border-black/[0.06] dark:border-white/10 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-[#0D1317] dark:text-[#F3F0E8] block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-gray-400">Garansi Resmi 1 Tahun</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-mono">{item.qty}</td>
                    <td className="py-3.5 text-right font-medium text-gray-600 dark:text-gray-300">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="py-3.5 text-right font-bold text-[#0D1317] dark:text-[#F3F0E8]">
                      {formatRupiah(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Calculations */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1 text-xs">
            <span className="text-gray-500 dark:text-[#999999]">Metode Pembayaran:</span>
            <div className="flex items-center gap-2 font-semibold text-[#0D1317] dark:text-[#F3F0E8]">
              <CreditCard className="w-4 h-4 text-[#bb6a33]" />
              <span>{invoiceData.paymentMethod}</span>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500 dark:text-[#999999]">
              <span>Subtotal Instrumen</span>
              <span className="font-medium text-[#0D1317] dark:text-[#F3F0E8]">
                {formatRupiah(invoiceData.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-[#999999]">
              <span>Pengiriman (Asuransi)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Gratis</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-black/[0.06] dark:border-white/10 text-sm font-bold">
              <span className="text-[#0D1317] dark:text-[#F3F0E8]">Total Tagihan</span>
              <span className="text-[#bb6a33] text-base">{formatRupiah(invoiceData.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION UPLOAD BUKTI PEMBAYARAN (DRAG & DROP) */}
      <section className="bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl print:hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-[#0D1317] dark:text-[#F3F0E8]">
              Upload Bukti Transfer / Pembayaran
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#999999]">
              Kirimkan bukti struk transaksi QRIS atau bukti transfer bank agar pesanan segera diproses.
            </p>
          </div>
        </div>

        {uploadSuccess ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-600/40 rounded-xl text-center space-y-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
              Bukti Pembayaran Berhasil Diunggah!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
              Terima kasih! Tim Dinasti Musik sedang memverifikasi pembayaran Anda. Status pesanan akan otomatis terupdate dalam kurun waktu 1x24 jam.
            </p>
            <button
              onClick={() => setUploadSuccess(false)}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 underline hover:opacity-80 pt-2"
            >
              Upload Ulang / Ganti Bukti
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitProof} className="space-y-4">
            {uploadError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-xs text-red-600 dark:text-red-400 font-medium rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                dragActive
                  ? "border-[#bb6a33] bg-[#bb6a33]/5 scale-[1.01]"
                  : "border-black/[0.12] dark:border-white/15 bg-gray-50/50 dark:bg-[#1a1a1a]/50 hover:border-[#bb6a33]/60 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-[#bb6a33]/10 text-[#bb6a33] flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-xs font-bold text-[#0D1317] dark:text-[#F3F0E8] mb-1">
                Tarik &amp; lepas file bukti transfer ke sini, atau{" "}
                <span className="text-[#bb6a33] underline">klik untuk memilih</span>
              </p>
              <span className="text-[11px] text-gray-400">
                Mendukung file JPG, PNG, WEBP, atau PDF (Maksimal 5MB)
              </span>
            </div>

            {/* Selected File Card Preview */}
            {selectedFile && (
              <div className="p-4 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-white/10 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3 overflow-hidden">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-black/[0.06] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 shrink-0">
                      <FileCheck className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0D1317] dark:text-[#F3F0E8] truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Siap dikirim
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  title="Hapus file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Optional Note */}
            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-[#999999] block mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={uploadNote}
                onChange={(e) => setUploadNote(e.target.value)}
                placeholder="Contoh: Transfer atas nama Budi Santoso / Ref BCA 123456"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-white/10 text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full py-3 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-full shadow-md"
            >
              {isUploading ? "Mengunggah Bukti Pembayaran..." : "Kirim Bukti Pembayaran"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
