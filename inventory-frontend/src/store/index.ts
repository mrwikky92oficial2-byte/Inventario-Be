import { configureStore, combineReducers } from '@reduxjs/toolkit';
import locationsReducer from '../slices/locationsSlice';
import productsReducer from '../slices/productsSlice';
import inventoryReducer from '../slices/inventorySlice';
import transfersReducer from '../slices/transfersSlice';
import purchaseOrdersReducer from '../slices/purchaseOrdersSlice';
import configReducer from '../slices/configSlice';
import { loadState, saveState } from '../utils/persistence';

const rootReducer = combineReducers({
  locations: locationsReducer,
  products: productsReducer,
  inventory: inventoryReducer,
  transfers: transfersReducer,
  purchaseOrders: purchaseOrdersReducer,
  config: configReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
