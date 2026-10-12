import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { requireRole, AuthError } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.storeConfig || {});
  } catch {
    return NextResponse.json({ error: 'Gagal memuat konfigurasi toko' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireRole('owner');
    const body = await request.json();

    const db = readDB();
    db.storeConfig = {
      ...db.storeConfig,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);

    logAudit({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_CONFIG',
      entity: 'CONFIG',
      metadata: { keys: Object.keys(body) },
    });

    return NextResponse.json({ message: 'Pengaturan toko berhasil diperbarui.', storeConfig: db.storeConfig });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Gagal menyimpan pengaturan toko.' }, { status: 500 });
  }
}
