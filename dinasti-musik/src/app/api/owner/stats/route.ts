import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("owner");
    const db = readDB();
    const orders = db.orders || [];
    const products = db.products || [];
    const customers = (db.users || []).filter(u => u.role === "customer");

    const completedOrders = orders.filter(o => o.status === "Completed");
    const pendingOrders = orders.filter(o => ["Pending","Confirmed","Processing"].includes(o.status));
    const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      lowStockCount: products.filter(p => p.stock <= 3).length,
      totalCustomers: customers.length,
      recentOrders: orders.slice(0, 5),
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memuat statistik." }, { status: 500 });
  }
}