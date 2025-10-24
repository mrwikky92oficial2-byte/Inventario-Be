import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PurchaseOrder, PurchaseOrdersState, PurchaseOrderStatus, UUID } from '../types';

const initialState: PurchaseOrdersState = {
  byId: {},
  allIds: [],
};

const purchaseOrdersSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    setAllPurchaseOrders(state, action: PayloadAction<PurchaseOrder[]>) {
      state.byId = {};
      state.allIds = [];
      for (const po of action.payload) {
        state.byId[po.id] = po;
        state.allIds.push(po.id);
      }
    },
    createPurchaseOrder(state, action: PayloadAction<PurchaseOrder>) {
      const po = action.payload;
      if (!state.byId[po.id]) {
        state.allIds.push(po.id);
      }
      state.byId[po.id] = po;
    },
    updatePurchaseOrderStatus(
      state,
      action: PayloadAction<{ id: UUID; status: PurchaseOrderStatus }>
    ) {
      const { id, status } = action.payload;
      if (state.byId[id]) {
        state.byId[id].status = status;
        state.byId[id].updatedAt = new Date().toISOString();
      }
    },
    appendPurchaseOrderItem(
      state,
      action: PayloadAction<{ id: UUID; productId: UUID; quantity: number; unitCost: number }>
    ) {
      const { id, productId, quantity, unitCost } = action.payload;
      const po = state.byId[id];
      if (po) {
        const existing = po.items.find((i) => i.productId === productId);
        if (existing) existing.quantity += quantity;
        else po.items.push({ productId, quantity, unitCost });
        po.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { setAllPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus, appendPurchaseOrderItem } = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;
