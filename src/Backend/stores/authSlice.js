import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auth from "../services/auth";

// Async action for login
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await auth.login(credentials);
    localStorage.setItem("token", response.data.token);
    return { user: response.data.user, token: response.data.token };
  } catch (error) {
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

// Async action for logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await auth.logout();
  localStorage.removeItem("token");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "logged_in";
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "logged_out";
      });
  },
});

export default authSlice.reducer;
