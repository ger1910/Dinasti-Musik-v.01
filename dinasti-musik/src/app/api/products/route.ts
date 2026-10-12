import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { Product } from "@/types";
import { randomUUID } from "crypto";

// GET /api/products — Public
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const db = readDB();
    let items = db.products || [];

    if (category && category !== "All" && category !== "Semua") {
      items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (q && q.trim() !== "") {
      const qs = q.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(qs) ||
          p.brand.toLowerCase().includes(qs) ||
          p.category.toLowerCase().includes(qs) ||
          (p.description && p.description.toLowerCase().includes(qs))
      );
    }

    return NextResponse.json({ total: items.length, products: items });
  } catch {
    return NextResponse.json({ error: "Gagal memuat produk." }, { status: 500 });
  }
}

// POST /api/products — Owner only
export async function POST(request: Request) {
  try {
    const user = await requireRole("owner");
    const body = await request.json();
    const { name, brand, category, price, stock, description, image } = body;

    if (!name?.trim() || price == null) {
      return NextResponse.json({ error: "Nama dan harga produk wajib diisi." }, { status: 400 });
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ error: "Harga tidak valid." }, { status: 400 });
    }

    const db = readDB();
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: "PROD-" + randomUUID().slice(0, 6).toUpperCase(),
      name: name.trim(),
      brand: brand?.trim() || "Dinasti Custom",
      category: category || "Gitar",
      price: Number(price),
      stock: Math.max(0, Number(stock) || 0),
      image: image?.trim() || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      rating: 5.0,
      status: Number(stock) > 0 ? "In Stock" : "Out of Stock",
      description: description?.trim() || "",
      createdAt: now,
      updatedAt: now,
    };

    db.products = db.products || [];
    db.products.unshift(newProduct);
    writeDB(db);

    logAudit({ userId: user.id, userName: user.name, action: "PRODUCT_CREATED", entity: "PRODUCT", entityId: newProduct.id, metadata: { name: newProduct.name, price: newProduct.price } });

    return NextResponse.json({ message: "Produk berhasil ditambahkan.", product: newProduct }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[products POST]", error);
    return NextResponse.json({ error: "Gagal menambahkan produk." }, { status: 500 });
  }
}
