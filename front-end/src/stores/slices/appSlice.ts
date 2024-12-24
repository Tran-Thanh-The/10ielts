import { RootState } from '@/stores/store';
import { IRole } from '@/types/interface/Account';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  appLoading: boolean;
  roles: IRole[];
  doExerciseForm: any;
}

const initialState: AppState = {
  appLoading: false,
  roles: [],
  doExerciseForm: null,
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
    setDoExerciseForm: (state, action: PayloadAction<any>) => {
      state.doExerciseForm = action.payload;
    },
  },
});

export const selectAppLoading = (state: RootState) => state.appState.appLoading;
export const selectRoles = (state: RootState) => state.appState.roles;
export const selectDoExerciseForm = (state: RootState) => state.appState.doExerciseForm;

export const { setAppLoading, setRoles, setDoExerciseForm } = cartSlice.actions;
export default cartSlice.reducer;
