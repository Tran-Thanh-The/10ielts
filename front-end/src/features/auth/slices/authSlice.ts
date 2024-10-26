import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import loginApi from '@/api/loginApi';
import { Account } from '@/types/interface/Account';

interface User {
  id: number;
  email: string;
  provider: string;
  socialId: string | null;
  fullName: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpires: number | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  tokenExpires: null,
  user: null,
  loading: false,
  error: null,
};

// Thunk để đăng nhập
export const login = createAsyncThunk<
  { token: string; refreshToken: string; tokenExpires: number; user: User },
  Account,
  { rejectValue: string }
>('auth/login', async (account: Account, { rejectWithValue }) => {
  try {
    const response = await loginApi.postLogin(account);
    return response.data; // Dữ liệu từ server
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Đăng nhập thất bại');
  }
});

// Thunk để làm mới token
export const refreshToken = createAsyncThunk<
  { token: string; tokenExpires: number },
  { refreshToken: string },
  { rejectValue: string }
>('auth/refreshToken', async ({ refreshToken }, { rejectWithValue }) => {
  try {
    const response = await loginApi.postRefreshToken({ refreshToken });
    return response.data; // Dữ liệu mới từ server
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Gia hạn token thất bại');
  }
});

// Thunk để tải thông tin xác thực từ local storage
export const loadAuthFromLocalStorage = createAsyncThunk<
  void,
  void,
  { dispatch: any }
>('auth/loadAuthFromLocalStorage', async (_, { dispatch }) => {
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    const authData = JSON.parse(storedAuth);
    const { token, refreshToken, tokenExpires, user } = authData;

    // Kiểm tra xem token đã hết hạn chưa
    if (tokenExpires && Date.now() > tokenExpires) {
      await dispatch(refreshToken({ refreshToken }));
    } else {
      dispatch(setAuthData({ token, refreshToken, tokenExpires, user }));
    }
  }
});

// Action để cập nhật dữ liệu xác thực
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      console.log('Logout reducer triggered');
      state.token = null;
      state.refreshToken = null;
      state.tokenExpires = null;
      state.user = null;
      localStorage.removeItem('auth');
      console.log('Auth removed from localStorage');
    },
    setAuthData: (state, action) => {
      const { token, refreshToken, tokenExpires, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.tokenExpires = tokenExpires;
      state.user = user;

      // Lưu thông tin vào local storage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
          refreshToken,
          tokenExpires,
          user,
        }),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { token, refreshToken, tokenExpires, user } = action.payload;
        state.token = token;
        state.refreshToken = refreshToken;
        state.tokenExpires = tokenExpires;
        state.user = user;

        // Lưu thông tin vào local storage
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        const { token, tokenExpires } = action.payload;
        state.token = token;
        state.tokenExpires = tokenExpires;

        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          localStorage.setItem(
            'auth',
            JSON.stringify({
              ...authData,
              token,
              tokenExpires,
            }),
          );
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload as string;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpires = null;
        state.user = null;
        localStorage.removeItem('auth');
      })
      .addCase(loadAuthFromLocalStorage.fulfilled, (state, action) => {
        // Không làm gì ở đây, tất cả đã được xử lý trong thunk
      });
  },
});

// Xuất ra các action và reducer
export const { logout, setAuthData } = authSlice.actions;
export default authSlice.reducer;
