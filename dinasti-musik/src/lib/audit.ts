import { readDB, writeDB } from "@/lib/db";
import { AuditLog } from "@/types";
import { randomUUID } from "crypto";

interface AuditOptions {
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Appends an audit log entry. Never throws — failures are silently swallowed
 * so that audit logging never interrupts the main business flow.
 */
export function logAudit(opts: AuditOptions): void {
  try {
    const db = readDB();
    const entry: AuditLog = {
      id: "AUDIT-" + randomUUID().slice(0, 8).toUpperCase(),
      userId: opts.userId,
      userName: opts.userName,
      action: opts.action,
      entity: opts.entity,
      entityId: opts.entityId,
      metadata: opts.metadata,
      timestamp: new Date().toISOString(),
    };
    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift(entry);
    // Keep last 500 logs
    if (db.auditLogs.length > 500) {
      db.auditLogs = db.auditLogs.slice(0, 500);
    }
    writeDB(db);
  } catch {
    // Swallow silently
  }
}

/**
 * Creates a system notification.
 */
export function createNotification(
  type: "order" | "payment" | "stock" | "system",
  title: string,
  message: string,
  entityId?: string
): void {
  try {
    const db = readDB();
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: "NOTIF-" + randomUUID().slice(0, 8).toUpperCase(),
      type,
      title,
      message,
      isRead: false,
      entityId,
      createdAt: new Date().toISOString(),
    });
    // Keep last 100 notifications
    if (db.notifications.length > 100) {
      db.notifications = db.notifications.slice(0, 100);
    }
    writeDB(db);
  } catch {
    // Swallow silently
  }
}
