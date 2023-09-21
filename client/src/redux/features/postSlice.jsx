import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../apiRoute/api";

export const postOfFollowing = createAsyncThunk(
  "/all/posts",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.followingPost();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//likeUnlike
export const postLikeUnlike = createAsyncThunk(
  "/post/likeUnlike",
  async ({ postId, toast, navigate }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.likeUnlike(postId);
      toast.success(response.data.message || "post liked!");
      // dispatch(postOfFollowing());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//add updateComment
export const addUpdateComment = createAsyncThunk(
  "/post/addUpdateComment",
  async ({ postId, commentValue, toast }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.commentAdd(postId, commentValue);
      toast.success(response.data.message || "comment added!");
      // dispatch(postOfFollowing());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//remove comment
export const commentRemove = createAsyncThunk(
  "/post/removeComment",
  async ({ postId, commentId, toast }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.commentRemove(postId, commentId);
      toast.success(response.data.message || "comment remove success!");
      dispatch(postOfFollowing());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: false,
    message: "",
    error: "",
    posts: [],
    post: {},
    like: null,
    comment: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOfFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(postOfFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
      })
      .addCase(postOfFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(postLikeUnlike.pending, (state) => {
        state.loading = true;
      })
      .addCase(postLikeUnlike.fulfilled, (state, action) => {
        state.loading = false;
        state.like = action.payload;
      })
      .addCase(postLikeUnlike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addUpdateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUpdateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comment = action.payload;
      })
      .addCase(addUpdateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(commentRemove.pending, (state) => {
        state.loading = true;
      })
      .addCase(commentRemove.fulfilled, (state, action) => {
        state.loading = false;
        state.comment = action.payload;
        //   const { postId, commentId } = action.payload;
        //   const post = state.posts.find((post) => post._id === postId);

        //   if (post && post.comments) {
        //     post.comments = post.comments.filter(
        //       (comment) => comment._id !== commentId
        //     );
        //   }
        // })
      })
      .addCase(commentRemove.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});
export const { clearError } = postSlice.actions;
export default postSlice.reducer;
