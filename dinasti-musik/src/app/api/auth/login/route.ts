import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { createSession, AuthError } from "@/lib/auth";
import { logAudit, createNotification } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const db = readDB();
    const user = (db.users || []).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      logAudit({ userId: "UNKNOWN", userName: email, action: "LOGIN_FAILED", entity: "AUTH", metadata: { reason: "user_not_found" } });
      return NextResponse.json({ error: "Email atau password tidak cocok." }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, user.password || "");
    if (!passwordValid) {
      logAudit({ userId: user.id, userName: user.name, action: "LOGIN_FAILED", entity: "AUTH", entityId: user.id, metadata: { reason: "wrong_password" } });
      return NextResponse.json({ error: "Email atau password tidak cocok." }, { status: 401 });
    }

    if (role && user.role !== role) {
      return NextResponse.json({ error: `Akun ini tidak memiliki hak akses sebagai ${role}.` }, { status: 403 });
    }

    await createSession(user.id, user.role);

    logAudit({ userId: user.id, userName: user.name, action: "LOGIN_SUCCESS", entity: "AUTH", entityId: user.id });

    const { password: _, ...userSafe } = user;
    return NextResponse.json({ message: "Login berhasil.", user: userSafe });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[auth/login]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
