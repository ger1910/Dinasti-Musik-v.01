import { NextResponse } from "next/server";
import { getSession, destroySession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST() {
  try {
    const user = await getSession();
    if (user) {
      logAudit({ userId: user.id, userName: user.name, action: "LOGOUT", entity: "AUTH", entityId: user.id });
    }
    await destroySession();
    return NextResponse.json({ message: "Logout berhasil." });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
