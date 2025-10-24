import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Transfer, TransfersState, TransferStatus, UUID } from '../types';

const initialState: TransfersState = {
  byId: {},
  allIds: [],
};

const transfersSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    createTransfer(state, action: PayloadAction<Transfer>) {
      const t = action.payload;
      if (!state.byId[t.id]) {
        state.allIds.push(t.id);
      }
      state.byId[t.id] = t;
    },
    updateTransferStatus(state, action: PayloadAction<{ id: UUID; status: TransferStatus }>) {
      const { id, status } = action.payload;
      if (state.byId[id]) {
        state.byId[id].status = status;
        state.byId[id].updatedAt = new Date().toISOString();
      }
    },
    appendTransferItem(
      state,
      action: PayloadAction<{ id: UUID; productId: UUID; quantity: number }>
    ) {
      const { id, productId, quantity } = action.payload;
      const t = state.byId[id];
      if (t) {
        const existing = t.items.find((i) => i.productId === productId);
        if (existing) existing.quantity += quantity;
        else t.items.push({ productId, quantity });
        t.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { createTransfer, updateTransferStatus, appendTransferItem } = transfersSlice.actions;
export default transfersSlice.reducer;
