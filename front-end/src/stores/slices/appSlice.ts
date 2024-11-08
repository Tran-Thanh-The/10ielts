import { RootState } from '@/stores/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  appLoading: boolean;
}

const initialState: AppState = {
  appLoading: false,
};

const cartSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    }
  },
});

export const selectAppLoading = (state: RootState) => state.appState.appLoading;

export const { setAppLoading } =
  cartSlice.actions;
export default cartSlice.reducer;
