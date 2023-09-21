import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../apiRoute/api";

//register
export const register = createAsyncThunk(
  "/auth/signUp",
  async ({ registerValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.userRegister(registerValue);
      toast.success(response.data.message || "register success!");
      navigate("/account");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//login
export const login = createAsyncThunk(
  "/auth/login",
  async ({ loginValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.userLogin(loginValue);
      toast.success(response.data.message || "login successfully!");
      navigate("/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//profile(me)
export const profile = createAsyncThunk(
  "/auth/me",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.userMe();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update profile
export const updateMe = createAsyncThunk(
  "/auth/updateMe",
  async ({ updateData, toast }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.updateProfile(updateData);
      toast.success(response.data.message || "profile update success!");
      dispatch(profile());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//change password
export const changePassword = createAsyncThunk(
  "/auth/updatePassword",
  async ({ passwordValue, toast, navigate }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.passwordUpdate(passwordValue);
      toast.success(response.data.message || "password update success!");
      dispatch(setLogout());
      navigate("/account");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//forgotPassword
export const forgotPassword = createAsyncThunk(
  "/auth/forgotPassword",
  async ({ forgotValue, toast }, { rejectWithValue }) => {
    try {
      const response = await api.passwordForgot(forgotValue);
      toast.success(
        response.data.message || "email sent to your email,verify!"
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//resetPassword
export const resetPassword = createAsyncThunk(
  "/auth/resetPassword",
  async ({ token, resetValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.passwordReset(token, resetValue);
      toast.success(response.data.message || "password reset success!!");
      navigate("/account");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//logged in All users
export const allUsers = createAsyncThunk(
  "/auth/allUsers",
  async (fullName, { rejectWithValue }) => {
    try {
      const response = await api.loggedInUsers(fullName);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//delete profile
export const deleteMe = createAsyncThunk(
  "/auth/deleteProfile",
  async (__, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.profileDelete();
      dispatch(setLogout());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//userProfile

export const profileUser = createAsyncThunk(
  "/auth/user-profile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.userProfile(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//userFollow
export const followUser = createAsyncThunk(
  "/auth/userFollow",
  async ({ userId, toast }, { rejectWithValue }) => {
    try {
      const response = await api.userFollow(userId);
      toast.success(response.data.message || "user followed!");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    users: [],
    isAuthenticated: false,
    loading: false,
    isLoading: false,
    message: "",
    error: "",
    userProfile: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearErr: (state) => {
      state.error = null;
    },
    setLogout: (state) => {
      localStorage.removeItem("authID");
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const accessToken = action.payload.token;
        localStorage.setItem("authID", accessToken);
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(profile.pending, (state) => {
        state.loading = true;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(profile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(allUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(allUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(allUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMe.fulfilled, (state, action) => {
        state.loading = false;

        const { id } = action.payload;
        state.users = state.users.filter((item) => item._id !== id);
      })
      .addCase(deleteMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(profileUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload.data;
      })
      .addCase(profileUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(followUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError, clearErr, setLogout } = authSlice.actions;

export default authSlice.reducer;
