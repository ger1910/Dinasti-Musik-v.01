import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("owner");
    const db = readDB();
    const customers = (db.users || [])
      .filter(u => u.role === "customer")
      .map(({ password: _, ...u }) => ({
        ...u,
        orderCount: (db.orders || []).filter(o => o.customerId === u.id).length,
        totalSpent: (db.orders || [])
          .filter(o => o.customerId === u.id && o.status === "Completed")
          .reduce((s, o) => s + o.total, 0),
      }));
    return NextResponse.json({ customers, total: customers.length });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memuat data pelanggan." }, { status: 500 });
  }
}