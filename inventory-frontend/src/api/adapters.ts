import type { InventoryRecord, Location, Product, UUID } from '../types';
import { computeInventoryId } from '../slices/inventorySlice';

// Best-effort adapters to map backend Spanish fields to frontend types
export function adaptProductoToProduct(raw: any): Product {
  const id: UUID = String(raw.id ?? raw.productoId ?? raw.productId ?? cryptoRandomId());
  const sku = String(raw.sku ?? raw.codigo ?? raw.code ?? id);
  const name = String(raw.nombre ?? raw.name ?? raw.descripcion ?? 'Producto');
  const costPrice = numberOr(raw.precioCompra ?? raw.costPrice ?? raw.cost ?? 0);
  const salePrice = numberOr(raw.precioVenta ?? raw.salePrice ?? raw.price ?? 0);
  const minQty = numberOr(raw.minQty ?? raw.minimo ?? raw.min ?? 0);
  const maxQty = numberOr(raw.maxQty ?? raw.maximo ?? raw.max ?? 0);
  const active = booleanOr(raw.activo ?? raw.active ?? true);
  return { id, sku, name, costPrice, salePrice, minQty, maxQty, active };
}

export function adaptAlmacenToLocation(raw: any): Location {
  const id: UUID = String(raw.id ?? raw.almacenId ?? raw.locationId ?? cryptoRandomId());
  const name = String(raw.nombre ?? raw.name ?? raw.codigo ?? 'Almacén');
  const address = raw.direccion ?? raw.address ?? undefined;
  const active = booleanOr(raw.activo ?? raw.active ?? true);
  // Treat all as warehouses by default
  return { id, name, type: 'warehouse', address, active };
}

export function buildInventoryFromEntregas(entregas: any[]): InventoryRecord[] {
  const map = new Map<string, InventoryRecord>();
  for (const e of entregas ?? []) {
    const producto = e.producto ?? {};
    const almacen = e.almacen ?? {};
    const productId: UUID = String(producto.id ?? producto.productoId ?? e.productoId ?? e.productId ?? '');
    const locationId: UUID = String(almacen.id ?? almacen.almacenId ?? e.almacenId ?? e.locationId ?? '');
    if (!productId || !locationId) continue;
    const qty = numberOr(e.cantidad ?? e.quantity ?? 0);
    const id = computeInventoryId(productId, locationId);
    const existing = map.get(id) ?? { id, productId, locationId, quantity: 0 };
    existing.quantity += qty;
    map.set(id, existing);
  }
  return Array.from(map.values());
}

function numberOr(v: any, d = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function booleanOr(v: any, d = false): boolean {
  if (typeof v === 'boolean') return v;
  if (v === 'true' || v === '1' || v === 1) return true;
  if (v === 'false' || v === '0' || v === 0) return false;
  return d;
}

function cryptoRandomId(): UUID {
  // Fallback ID generator if backend doesn't provide one
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}
