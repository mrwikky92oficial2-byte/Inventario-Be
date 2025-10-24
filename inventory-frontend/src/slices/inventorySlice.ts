import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { InventoryRecord, InventoryState, UUID } from '../types';

export function computeInventoryId(productId: UUID, locationId: UUID): UUID {
  return `${productId}:${locationId}`;
}

const initialState: InventoryState = {
  byId: {},
  allIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setAllInventory(state, action: PayloadAction<InventoryRecord[]>) {
      state.byId = {} as InventoryState['byId'];
      state.allIds = [];
      for (const r of action.payload) {
        state.byId[r.id] = r;
        state.allIds.push(r.id);
      }
    },
    setQuantity(
      state,
      action: PayloadAction<{ productId: UUID; locationId: UUID; quantity: number }>
    ) {
      const { productId, locationId, quantity } = action.payload;
      const id = computeInventoryId(productId, locationId);
      if (!state.byId[id]) {
        state.byId[id] = { id, productId, locationId, quantity: 0 } as InventoryRecord;
        state.allIds.push(id);
      }
      state.byId[id].quantity = quantity;
    },
    adjustQuantity(
      state,
      action: PayloadAction<{ productId: UUID; locationId: UUID; delta: number }>
    ) {
      const { productId, locationId, delta } = action.payload;
      const id = computeInventoryId(productId, locationId);
      if (!state.byId[id]) {
        state.byId[id] = { id, productId, locationId, quantity: 0 } as InventoryRecord;
        state.allIds.push(id);
      }
      state.byId[id].quantity += delta;
      if (state.byId[id].quantity < 0) {
        state.byId[id].quantity = 0;
      }
    },
  },
});

export const { setAllInventory, setQuantity, adjustQuantity } = inventorySlice.actions;
export default inventorySlice.reducer;
