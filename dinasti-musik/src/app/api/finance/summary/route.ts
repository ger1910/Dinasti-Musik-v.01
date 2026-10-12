import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireRole("owner");
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all"; // all | month | week

    const db = readDB();
    let orders = db.orders || [];
    const expenses = db.expenses || [];

    const now = new Date();
    if (period === "month") {
      const cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
      orders = orders.filter(o => new Date(o.date) >= cutoff);
    } else if (period === "week") {
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      orders = orders.filter(o => new Date(o.date) >= cutoff);
    }

    const completedOrders = orders.filter(o => o.status === "Completed");
    const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Confirmed" || o.status === "Processing");
    const cancelledOrders = orders.filter(o => o.status === "Cancelled");

    const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
    const pendingRevenue = pendingOrders.reduce((s, o) => s + o.total, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const profit = totalRevenue - totalExpenses;

    // Revenue by payment method
    const byPayment: Record<string, number> = {};
    for (const o of completedOrders) {
      byPayment[o.paymentMethod] = (byPayment[o.paymentMethod] || 0) + o.total;
    }

    return NextResponse.json({
      period,
      totalRevenue,
      pendingRevenue,
      totalExpenses,
      profit,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      cancelledOrders: cancelledOrders.length,
      byPaymentMethod: byPayment,
      expenses: expenses.slice(0, 20),
      recentOrders: orders.slice(0, 10),
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memuat ringkasan keuangan." }, { status: 500 });
  }
}