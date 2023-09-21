import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../apiRoute/api";

//get own posts
export const allMyPosts = createAsyncThunk(
  "/myPost/ownPost",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.ownPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//add post
export const addPost = createAsyncThunk(
  "/myPost/addPost",
  async ({ AddData, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.createPost(AddData);
      toast.success(response.data.message || "post added!");
      navigate("/account/post-information");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update caption(captionUpdate)
export const updateCaption = createAsyncThunk(
  "/myPost/updateCaption",
  async ({ postId, captionValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.captionUpdate(postId, captionValue);
      toast.success(response.data.message || "caption updated!");
      navigate("/account/post-information");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//deletePost(postDelete)
export const removePost = createAsyncThunk(
  "/myPost/deletePost",
  async ({ postId, toast }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.postDelete(postId);
      toast.success(response.data.message || "post added!");
      dispatch(allMyPosts());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//all user-posts
export const postsUser = createAsyncThunk(
  "/auth/user-posts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.userPosts(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const myPostSlice = createSlice({
  name: "myPost",
  initialState: {
    loading: "false",
    error: "",
    message: "",
    myPost: null,
    myPosts: [],
    userPosts: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allMyPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(allMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = action.payload.data;
      })
      .addCase(allMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.myPost = action.payload;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCaption.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCaption.fulfilled, (state, action) => {
        state.loading = false;
        state.myPost = action.payload;
      })
      .addCase(updateCaption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(removePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.loading = false;
        state.myPost = action.payload;
      })
      .addCase(removePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(postsUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(postsUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload.data;
      })
      .addCase(postsUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError } = myPostSlice.actions;

export default myPostSlice.reducer;
