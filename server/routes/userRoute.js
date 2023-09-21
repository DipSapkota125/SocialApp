import express from "express";
import {
  allUsers,
  changePassword,
  deleteProfile,
  followUser,
  forgotPassword,
  login,
  logout,
  profile,
  register,
  resetPassword,
  updateProfile,
  userProfile,
  verifyAccount,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../file/upload.js";
const router = express.Router();

//register
router.route("/register").post(register);
//login
router.route("/login").post(login);
//verifyAccount
router.route("/verify/account").post(verifyAccount);
//logged out
router.route("/logout").get(logout);
//get profile
router.route("/me").get(isAuthenticated, profile);
//update profile

//userProfile
router.route("/user/:id").get(isAuthenticated, userProfile);
//allUsers
router.route("/users").get(isAuthenticated, allUsers);
router
  .route("/update/me")
  .put(isAuthenticated, upload.single("avatar"), updateProfile);

//delete Profile
router.route("/delete/me").delete(isAuthenticated, deleteProfile);

//change password
router.route("/change/password").put(isAuthenticated, changePassword);

//forgotPassword
router.route("/forgot/password").post(forgotPassword);

//resetPassword
router.route("/password/reset/:token").put(resetPassword);

//user followed
router.route("/follow/:id").get(isAuthenticated, followUser);

export default router;
