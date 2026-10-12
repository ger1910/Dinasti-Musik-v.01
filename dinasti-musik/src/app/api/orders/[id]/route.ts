import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireAuth, AuthError } from "@/lib/auth";

interface Params { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const db = readDB();
    const order = (db.orders || []).find((o) => o.id === id);
    if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    // Customer can only view their own orders
    if (user.role === "customer" && order.customerId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memuat pesanan." }, { status: 500 });
  }
}