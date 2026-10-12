import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireRole("owner");
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 50);
    const db = readDB();
    const logs = (db.auditLogs || []).slice(0, Math.min(limit, 200));
    return NextResponse.json({ logs, total: db.auditLogs?.length || 0 });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memuat audit log." }, { status: 500 });
  }
}