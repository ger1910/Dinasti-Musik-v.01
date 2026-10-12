import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDB();
  const wishlists = db.wishlists || {};
  return NextResponse.json(wishlists[user.id] || []);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const db = readDB();
    if (!db.wishlists) db.wishlists = {};
    if (!db.wishlists[user.id]) db.wishlists[user.id] = [];

    if (!db.wishlists[user.id].includes(productId)) {
      db.wishlists[user.id].push(productId);
      writeDB(db);
    }
    
    return NextResponse.json({ success: true, wishlist: db.wishlists[user.id] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const db = readDB();
    if (!db.wishlists) db.wishlists = {};
    if (!db.wishlists[user.id]) db.wishlists[user.id] = [];

    db.wishlists[user.id] = db.wishlists[user.id].filter(id => id !== productId);
    writeDB(db);
    
    return NextResponse.json({ success: true, wishlist: db.wishlists[user.id] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
