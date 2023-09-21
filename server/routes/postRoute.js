import express from "express";
import {
  addComment,
  addPost,
  deleteComment,
  deletePost,
  likeAndUnlikePost,
  myPosts,
  postOfFollowing,
  updateCaption,
} from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../file/upload.js";
import { userPosts } from "../controllers/userController.js";
const router = express.Router();

//createPost
router
  .route("/add/post")
  .post(isAuthenticated, upload.single("postImg"), addPost);

//add update comment(delete comment)
router
  .route("/add/comment/:id")
  .put(isAuthenticated, addComment)
  .delete(isAuthenticated, deleteComment);

//update post(caption)
router.route("/update/caption/:id").put(isAuthenticated, updateCaption);
//like andUnlikePost
router
  .route("/post/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .delete(isAuthenticated, deletePost);

//postOfFollowing
router.route("/posts").get(isAuthenticated, postOfFollowing);

//get allOwn Posts
router.route("/my/posts").get(isAuthenticated, myPosts);

//get user posts
router.route("/user-posts/:id").get(isAuthenticated, userPosts);
export default router;
