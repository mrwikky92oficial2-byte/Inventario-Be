import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductsState, Product, UUID } from '../types';

const initialState: ProductsState = {
  byId: {},
  allIds: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAllProducts(state, action: PayloadAction<Product[]>) {
      state.byId = {};
      state.allIds = [];
      for (const p of action.payload) {
        state.byId[p.id] = p;
        state.allIds.push(p.id);
      }
    },
    addProduct(state, action: PayloadAction<Product>) {
      const p = action.payload;
      if (!state.byId[p.id]) {
        state.allIds.push(p.id);
      }
      state.byId[p.id] = p;
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const p = action.payload;
      if (state.byId[p.id]) {
        state.byId[p.id] = p;
      }
    },
    setProductActive(state, action: PayloadAction<{ id: UUID; active: boolean }>) {
      const { id, active } = action.payload;
      if (state.byId[id]) {
        state.byId[id].active = active;
      }
    },
    removeProduct(state, action: PayloadAction<UUID>) {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter((x) => x !== id);
      }
    },
  },
});

export const { setAllProducts, addProduct, updateProduct, setProductActive, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
