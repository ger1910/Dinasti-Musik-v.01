import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("owner");
    const db = readDB();
    const notifs = (db.notifications || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ notifications: notifs, unread: notifs.filter(n => !n.isRead).length });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memuat notifikasi." }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    await requireRole("owner");
    const db = readDB();
    db.notifications = (db.notifications || []).map(n => ({ ...n, isRead: true }));
    writeDB(db);
    return NextResponse.json({ message: "Semua notifikasi ditandai sudah dibaca." });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memperbarui notifikasi." }, { status: 500 });
  }
}