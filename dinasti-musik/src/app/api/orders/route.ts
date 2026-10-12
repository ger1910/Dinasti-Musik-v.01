import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireAuth, AuthError } from "@/lib/auth";
import { logAudit, createNotification } from "@/lib/audit";
import { Order, ShippingAddress } from "@/types";
import { randomUUID } from "crypto";

// GET /api/orders
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const db = readDB();
    let orders = db.orders || [];

    // Customer can only see their own orders
    if (user.role === "customer") {
      orders = orders.filter((o) => o.customerId === user.id);
    } else {
      // Owner can filter by customerId optionally
      const customerId = searchParams.get("customerId");
      if (customerId) orders = orders.filter((o) => o.customerId === customerId);
    }

    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(orders);
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memuat pesanan." }, { status: 500 });
  }
}

// POST /api/orders - Checkout
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { items, paymentMethod, shippingAddress, notes } = body;

    // Items must only contain productId + qty — prices are ignored from frontend
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Keranjang kosong." }, { status: 400 });
    }

    // Validate shipping address
    const addr = shippingAddress as ShippingAddress | undefined;
    if (addr && (!addr.fullName?.trim() || !addr.phone?.trim() || !addr.address?.trim())) {
      return NextResponse.json({ error: "Informasi pengiriman tidak lengkap." }, { status: 400 });
    }

    const db = readDB();

    // Lock: verify stock and fetch server-side prices
    const resolvedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.productId || !item.qty || item.qty < 1) {
        return NextResponse.json({ error: "Data item tidak valid." }, { status: 400 });
      }
      const qty = Math.floor(Number(item.qty));
      const product = (db.products || []).find((p) => p.id === item.productId);

      if (!product) {
        return NextResponse.json({ error: `Produk tidak ditemukan: ${item.productId}` }, { status: 400 });
      }
      if (product.stock < qty) {
        return NextResponse.json({ error: `Stok ${product.name} tidak mencukupi (tersisa: ${product.stock}).` }, { status: 400 });
      }

      // USE SERVER-SIDE PRICE — never trust frontend price
      const serverPrice = product.price;
      resolvedItems.push({
        productId: product.id,
        name: product.name,
        price: serverPrice, // from DB
        image: product.image,
        qty,
      });
      subtotal += serverPrice * qty;
    }

    // Deduct stock (simple serial — JSON DB doesn't support true ACID)
    for (const item of resolvedItems) {
      const prod = db.products.find((p) => p.id === item.productId)!;
      prod.stock -= item.qty;
      prod.status = prod.stock <= 0 ? "Out of Stock" : "In Stock";
      prod.updatedAt = new Date().toISOString();
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const newOrder: Order = {
      id: `TRX-${dateStr}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || addr?.phone,
      shippingAddress: addr || undefined,
      items: resolvedItems,
      subtotal,
      shippingCost: 0,
      total: subtotal,
      paymentMethod: paymentMethod || "Transfer Bank (BCA)",
      paymentStatus: "Unpaid",
      status: "Pending",
      notes: notes?.trim() || undefined,
    };

    db.orders = db.orders || [];
    db.orders.unshift(newOrder);
    writeDB(db);

    logAudit({ userId: user.id, userName: user.name, action: "ORDER_CREATED", entity: "ORDER", entityId: newOrder.id, metadata: { total: newOrder.total, items: resolvedItems.length } });
    createNotification("order", "Pesanan Baru", `Pesanan ${newOrder.id} dari ${user.name} sebesar Rp ${newOrder.total.toLocaleString("id-ID")}.`, newOrder.id);

    return NextResponse.json({ message: "Pesanan berhasil dibuat.", order: newOrder }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[orders POST]", error);
    return NextResponse.json({ error: "Gagal memproses pesanan." }, { status: 500 });
  }
}