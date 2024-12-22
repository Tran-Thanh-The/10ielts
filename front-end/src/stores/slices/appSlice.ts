import { RootState } from '@/stores/store';
import { IRole } from '@/types/interface/Account';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'date-fns';

interface AppState {
  appLoading: boolean;
  roles: IRole[];
}

const initialState: AppState = {
  appLoading: false,
  roles: [],
};

const cartSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    },
    setRoles: (state, action: PayloadAction<any[]>) => {
      state.roles = action.payload;
    },
  },
});

export const selectAppLoading = (state: RootState) => state.appState.appLoading;
export const selectRoles = (state: RootState) => state.appState.roles;

export const { setAppLoading, setRoles } = cartSlice.actions;
export default cartSlice.reducer;
