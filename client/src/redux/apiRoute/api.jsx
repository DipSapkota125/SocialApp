import axios from "axios";

const devEnv = import.meta.env.MODE !== "production";
const devApiUrl = import.meta.env.VITE_REACT_APP_DEV_API;
const prodAPiUrl = import.meta.env.VITE_REACT_APP_PROD_API;

// Create axios instance
const API = axios.create({
  baseURL: devEnv ? devApiUrl : prodAPiUrl,
});

//interceptors

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authID"); // Get token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//register
export const userRegister = (registerValue) =>
  API.post("/register", registerValue);
//login
export const userLogin = (loginValue) => API.post("/login", loginValue);

//profile(me)
export const userMe = () => API.get("/me");

//update/me
export const updateProfile = (profile) => API.put("/update/me", profile);

//change password
export const passwordUpdate = (passwordValue) =>
  API.put("/change/password", passwordValue);

//forgot password
export const passwordForgot = (forgotValue) =>
  API.post("/forgot/password", forgotValue);

//resetPassword
export const passwordReset = (token, resetValue) =>
  API.put(`/password/reset/${token}`, resetValue);

//all loggedInUsers
export const loggedInUsers = (fullName = "") =>
  API.get(`/users?fullName=${fullName}`);

//postOfFollowing
export const followingPost = () => API.get("/posts");

//likeUnlikePost
export const likeUnlike = (postId) => API.get(`/post/${postId}`);
//add /update comment
export const commentAdd = (postId, commentValue) =>
  API.put(`/add/comment/${postId}`, commentValue);

//delete comment
export const commentRemove = (postId, commentId) =>
  API.delete(`/add/comment/${postId}`, commentId);

//get own posts
export const ownPosts = () => API.get("/my/posts");

//add post
export const createPost = (AddData) => API.post("/add/post", AddData);
//update caption
export const captionUpdate = (postId, captionValue) =>
  API.put(`/update/caption/${postId}`, captionValue);

//delete Post
export const postDelete = (postId) => API.delete(`/post/${postId}`);

//delete profile
export const profileDelete = () => API.delete("/delete/me");

//user-posts
export const userPosts = (id) => API.get(`/user-posts/${id}`);

//user profile
export const userProfile = (id) => API.get(`/user/${id}`);

//follow
export const userFollow = (userId) => API.get(`/follow/${userId}`);
