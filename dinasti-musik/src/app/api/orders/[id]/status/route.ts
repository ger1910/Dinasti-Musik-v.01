import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

interface Params { params: Promise<{ id: string }> }
const VALID_STATUSES = ["Pending","Confirmed","Processing","Shipped","Completed","Cancelled"];

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireRole("owner");
    const { id } = await params;
    const { status, paymentStatus } = await request.json();

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }

    const db = readDB();
    const idx = (db.orders || []).findIndex((o) => o.id === id);
    if (idx === -1) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });

    const prev = db.orders[idx].status;
    if (status) db.orders[idx].status = status;
    if (paymentStatus) db.orders[idx].paymentStatus = paymentStatus;
    db.orders[idx].updatedAt = new Date().toISOString();
    writeDB(db);

    logAudit({ userId: user.id, userName: user.name, action: "ORDER_STATUS_CHANGED", entity: "ORDER", entityId: id, metadata: { from: prev, to: status } });
    return NextResponse.json({ message: "Status berhasil diperbarui.", order: db.orders[idx] });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memperbarui status." }, { status: 500 });
  }
}