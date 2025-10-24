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

  private async request<T = unknown>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
    }
    const text = await res.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  // Endpoints placeholders - to be wired with your VPS URLs
  // Custom VPS API
  // Productos
  listProductos() { return this.request('/productos'); }
  getProducto(id: number | string) { return this.request(`/productos/${id}`); }
  createProducto(body: unknown) { return this.request('/productos', { method: 'POST', body: JSON.stringify(body) }); }
  updateProducto(id: number | string, body: unknown) { return this.request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
  deleteProducto(id: number | string) { return this.request(`/productos/${id}`, { method: 'DELETE' }); }
  activarProducto(id: number | string) { return this.request(`/productos/${id}/activar`, { method: 'PATCH' }); }
  desactivarProducto(id: number | string) { return this.request(`/productos/${id}/desactivar`, { method: 'PATCH' }); }
  productosByName(name: string) { return this.request(`/productos/by-name?name=${encodeURIComponent(name)}`); }
  productosByCategoria(id: number | string) { return this.request(`/productos/categoria/${id}`); }
  increaseProductoStock(id: number | string, quantity: number) { return this.request(`/productos/increase-stock/${id}?quantity=${encodeURIComponent(String(quantity))}`, { method: 'PUT' }); }
  decreaseProductoStock(id: number | string, quantity: number) { return this.request(`/productos/decrease-stock/${id}?quantity=${encodeURIComponent(String(quantity))}`, { method: 'PUT' }); }

  // Categorías
  listCategorias() { return this.request('/categorias'); }
  getCategoria(id: number | string) { return this.request(`/categorias/${id}`); }
  createCategoria(body: unknown) { return this.request('/categorias', { method: 'POST', body: JSON.stringify(body) }); }
  updateCategoria(id: number | string, body: unknown) { return this.request(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
  deleteCategoria(id: number | string) { return this.request(`/categorias/${id}`, { method: 'DELETE' }); }

  // Almacenes
  listAlmacenes() { return this.request('/almacenes'); }
  getAlmacen(id: number | string) { return this.request(`/almacenes/${id}`); }
  createAlmacen(body: unknown) { return this.request('/almacenes', { method: 'POST', body: JSON.stringify(body) }); }
  updateAlmacen(id: number | string, body: unknown) { return this.request(`/almacenes/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
  deleteAlmacen(id: number | string) { return this.request(`/almacenes/${id}`, { method: 'DELETE' }); }

  // Entregas
  listEntregas() { return this.request('/entregas'); }
  getEntrega(id: number | string) { return this.request(`/entregas/${id}`); }
  createEntrega(body: unknown) { return this.request('/entregas', { method: 'POST', body: JSON.stringify(body) }); }
  updateEntrega(id: number | string, body: unknown) { return this.request(`/entregas/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
  deleteEntrega(id: number | string) { return this.request(`/entregas/${id}`, { method: 'DELETE' }); }

  // Restablecimientos
  listRestablecimientos() { return this.request('/restablecimientos'); }
  getRestablecimiento(id: number | string) { return this.request(`/restablecimientos/${id}`); }
  createRestablecimiento(body: unknown) { return this.request('/restablecimientos', { method: 'POST', body: JSON.stringify(body) }); }
  updateRestablecimiento(id: number | string, body: unknown) { return this.request(`/restablecimientos/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
  deleteRestablecimiento(id: number | string) { return this.request(`/restablecimientos/${id}`, { method: 'DELETE' }); }

  // Gestiones
  listGestiones() { return this.request('/gestiones'); }
  getGestion(id: number | string) { return this.request(`/gestiones/${id}`); }
  createGestion(body: unknown) { return this.request('/gestiones', { method: 'POST', body: JSON.stringify(body) }); }
  aprobarGestion(id: number | string) { return this.request(`/gestiones/${id}/aprobar`, { method: 'PUT' }); }
  rechazarGestion(id: number | string) { return this.request(`/gestiones/${id}/rechazar`, { method: 'PUT' }); }
  deleteGestion(id: number | string) { return this.request(`/gestiones/${id}`, { method: 'DELETE' }); }

  // Legacy local endpoints mapping (optional): leave placeholders
  getLocations() { return this.request<Location[]>('/locations'); }
  getProducts() { return this.request<Product[]>('/products'); }
  getInventory() { return this.request<InventoryRecord[]>('/inventory'); }
  getTransfers() { return this.request<Transfer[]>('/transfers'); }
  getPurchaseOrders() { return this.request<PurchaseOrder[]>('/purchase-orders'); }
}

export function createClientFromState(state: RootState): ApiClient | null {
  const base = state.config.apiBaseUrl;
  if (!base) return null;
  return new ApiClient({ baseUrl: base });
}
