import type { RootState } from '../store';
import type { Location, Product, InventoryRecord, Transfer, PurchaseOrder } from '../types';

export interface ApiClientOptions {
  baseUrl: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(opts: ApiClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '');
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
    }
    return (await res.json()) as T;
  }

  // Endpoints placeholders - to be wired with your VPS URLs
  getLocations() {
    return this.request<Location[]>('/locations');
  }
  getProducts() {
    return this.request<Product[]>('/products');
  }
  getInventory() {
    return this.request<InventoryRecord[]>('/inventory');
  }
  getTransfers() {
    return this.request<Transfer[]>('/transfers');
  }
  getPurchaseOrders() {
    return this.request<PurchaseOrder[]>('/purchase-orders');
  }
}

export function createClientFromState(state: RootState): ApiClient | null {
  const base = state.config.apiBaseUrl;
  if (!base) return null;
  return new ApiClient({ baseUrl: base });
}
