import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  apiBaseUrl: string;
}

const initialState: ConfigState = {
  apiBaseUrl: (import.meta as any).env?.VITE_API_BASE_URL ?? '',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setApiBaseUrl(state, action: PayloadAction<string>) {
      state.apiBaseUrl = action.payload;
    },
  },
});

export const { setApiBaseUrl } = configSlice.actions;
export default configSlice.reducer;
