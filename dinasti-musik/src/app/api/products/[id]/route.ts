import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth";
import { logAudit, createNotification } from "@/lib/audit";

interface Params { params: Promise<{ id: string }> }

// GET /api/products/[id] - Public
export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const db = readDB();
    const product = (db.products || []).find((p) => p.id === id);
    if (!product) return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Gagal memuat produk." }, { status: 500 });
  }
}

// PUT /api/products/[id] - Owner only
export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await requireRole("owner");
    const { id } = await params;
    const body = await request.json();
    const db = readDB();
    const idx = (db.products || []).findIndex((p) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });

    const oldProduct = db.products[idx];
    const updatedStock = body.stock !== undefined ? Math.max(0, Number(body.stock)) : oldProduct.stock;

    db.products[idx] = {
      ...oldProduct,
      ...(body.name !== undefined && { name: String(body.name).trim() }),
      ...(body.brand !== undefined && { brand: String(body.brand).trim() }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.description !== undefined && { description: String(body.description).trim() }),
      ...(body.image !== undefined && { image: String(body.image).trim() }),
      stock: updatedStock,
      status: updatedStock > 0 ? "In Stock" : "Out of Stock",
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);

    const action = body.stock !== undefined && body.name === undefined ? "STOCK_UPDATED" : "PRODUCT_UPDATED";
    logAudit({ userId: user.id, userName: user.name, action, entity: "PRODUCT", entityId: id, metadata: { changes: body } });

    if (updatedStock <= 3 && updatedStock > 0) {
      createNotification("stock", "Stok Menipis", `Stok ${db.products[idx].name} tersisa ${updatedStock} unit.`, id);
    }
    if (updatedStock === 0) {
      createNotification("stock", "Stok Habis", `${db.products[idx].name} sudah habis.`, id);
    }

    return NextResponse.json({ message: "Produk berhasil diperbarui.", product: db.products[idx] });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal memperbarui produk." }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Owner only
export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await requireRole("owner");
    const { id } = await params;
    const db = readDB();
    const product = (db.products || []).find((p) => p.id === id);
    if (!product) return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    db.products = db.products.filter((p) => p.id !== id);
    writeDB(db);
    logAudit({ userId: user.id, userName: user.name, action: "PRODUCT_DELETED", entity: "PRODUCT", entityId: id, metadata: { name: product.name } });
    return NextResponse.json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Gagal menghapus produk." }, { status: 500 });
  }
}