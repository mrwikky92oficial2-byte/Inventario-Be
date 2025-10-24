import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LocationsState, Location, UUID } from '../types';

const initialState: LocationsState = {
  byId: {},
  allIds: [],
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation(state, action: PayloadAction<Location>) {
      const loc = action.payload;
      if (!state.byId[loc.id]) {
        state.allIds.push(loc.id);
      }
      state.byId[loc.id] = loc;
    },
    updateLocation(state, action: PayloadAction<Location>) {
      const loc = action.payload;
      if (state.byId[loc.id]) {
        state.byId[loc.id] = loc;
      }
    },
    setLocationActive(state, action: PayloadAction<{ id: UUID; active: boolean }>) {
      const { id, active } = action.payload;
      if (state.byId[id]) {
        state.byId[id].active = active;
      }
    },
    removeLocation(state, action: PayloadAction<UUID>) {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter((x) => x !== id);
      }
    },
  },
});

export const { addLocation, updateLocation, setLocationActive, removeLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
