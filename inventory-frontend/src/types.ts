export type UUID = string;

export type LocationType = 'store' | 'warehouse';

export interface Location {
  id: UUID;
  name: string;
  type: LocationType;
  address?: string;
  active: boolean;
}

export interface Product {
  id: UUID;
  sku: string;
  name: string;
  costPrice: number; // precio de compra
  salePrice: number; // precio de venta
  minQty: number;
  maxQty: number;
  active: boolean;
}

export interface InventoryRecord {
  id: UUID; // unique per (productId, locationId)
  productId: UUID;
  locationId: UUID;
  quantity: number;
}

export interface TransferItem {
  productId: UUID;
  quantity: number;
}

export type TransferStatus = 'requested' | 'shipped' | 'received' | 'cancelled';

export interface Transfer {
  id: UUID;
  fromLocationId: UUID;
  toLocationId: UUID;
  items: TransferItem[];
  status: TransferStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes?: string;
}

export interface PurchaseOrderItem {
  productId: UUID;
  quantity: number;
  unitCost: number;
}

export type PurchaseOrderStatus = 'open' | 'received' | 'cancelled';

export interface PurchaseOrder {
  id: UUID;
  vendor: string; // proveedor
  toLocationId: UUID;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface LocationsState {
  byId: Record<UUID, Location>;
  allIds: UUID[];
}

export interface ProductsState {
  byId: Record<UUID, Product>;
  allIds: UUID[];
}

export interface InventoryState {
  byId: Record<UUID, InventoryRecord>;
  allIds: UUID[];
}

export interface TransfersState {
  byId: Record<UUID, Transfer>;
  allIds: UUID[];
}

export interface PurchaseOrdersState {
  byId: Record<UUID, PurchaseOrder>;
  allIds: UUID[];
}

export interface RootStateShape {
  locations: LocationsState;
  products: ProductsState;
  inventory: InventoryState;
  transfers: TransfersState;
  purchaseOrders: PurchaseOrdersState;
}
