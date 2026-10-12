import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { logAudit, createNotification } from "@/lib/audit";
import { User } from "@/types";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Nama, email, dan password wajib diisi." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    const db = readDB();
    const existing = (db.users || []).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser: User & { password: string } = {
      id: "USR-" + randomUUID().slice(0, 8).toUpperCase(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: passwordHash,
      role: "customer",
      phone: phone?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    db.users = db.users || [];
    db.users.push(newUser);
    writeDB(db);

    await createSession(newUser.id, "customer");

    logAudit({ userId: newUser.id, userName: newUser.name, action: "REGISTER", entity: "USER", entityId: newUser.id });
    createNotification("system", "Pelanggan Baru", `${newUser.name} baru saja mendaftar.`, newUser.id);

    const { password: _, ...userSafe } = newUser;
    return NextResponse.json({ message: "Registrasi berhasil.", user: userSafe }, { status: 201 });
  } catch (error) {
    console.error("[auth/register]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
