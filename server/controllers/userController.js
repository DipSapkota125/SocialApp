import { tryCatchAsyncError } from "../middlewares/tryCatchAsyncError.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto";
import path from "path";
// import fs from "fs/promises";
import fs from "fs";
import sendEmail from "../utils/sendEmail.js";
import util from "util";

const unlink = util.promisify(fs.unlink);

//create Account
export const register = tryCatchAsyncError(async (req, res, next) => {
  const { fullName, email, mobile_No, password } = req.body;
  if (!fullName || !email || !mobile_No || !password) {
    return next(new ErrorHandler("Please enter all required fields!", 400));
  }

  if (!/^\d{10}$/.test(mobile_No)) {
    return next(
      new ErrorHandler("mobileNo must be exactly 10 digits long!", 400)
    );
  }

  // Check if a user with the same mobile number already exists
  const existingUserWithMobileNo = await User.findOne({ mobile_No });
  if (existingUserWithMobileNo) {
    return next(
      new ErrorHandler(
        "Mobile number already exists. Please use a different mobile number.",
        400
      )
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new ErrorHandler(
        "Email already exists. Please use a different email.",
        400
      )
    );
  }

  const user = await User.create({
    fullName,
    email,
    mobile_No,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Registered successfully!",
    data: user,
  });
});

//verify Otp

export const verifyAccount = tryCatchAsyncError(async (req, res, next) => {
  const otp = Number(req.body.otp);
  if (!otp) return next(new ErrorHandler("Invalid OTP!", 400));

  const user = await User.findById(req.user.id);
  if (user.otp !== otp || user.otp_expiry < Date.now()) {
    // Preserve the existing avatar URL
    const existingImageUrl = user.avatar ? user.avatar.url : null;

    // Delete the image from public/gallery if it exists
    if (existingImageUrl) {
      const filename = path.basename(existingImageUrl);
      const previousImagePath = path.join("public", "gallery", filename);

      try {
        await fs.unlink(previousImagePath);
      } catch (err) {
        // Handle any errors related to file deletion
        console.error("Error deleting image:", err);
      }
    }

    return next(new ErrorHandler("Invalid OTP or has expired!", 400));
  }

  user.verified = true;
  user.otp = null;
  user.otp_expiry = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Account verified successfully!",
    data: user,
  });
});

//login
export const login = tryCatchAsyncError(async (req, res, next) => {
  const { email, mobile_No, password } = req.body;

  if ((!email && !mobile_No) || !password) {
    return next(new ErrorHandler("Please enter required fields!", 400));
  }

  let user;

  // Check if login using email
  if (email) {
    user = await User.findOne({ email })
      .select("+password")
      .populate("posts followers following");
  }

  // If user was not found by email, try finding by phone number
  if (!user && mobile_No && mobile_No.length === 10) {
    user = await User.findOne({ mobile_No }).select("+password");
  }

  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 404));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials!", 400));
  }

  const token = await user.getJwtToken();

  // Set the expiration time to 2 hours from now
  const expiration = new Date();
  expiration.setTime(expiration.getTime() + 2 * 60 * 60 * 1000); // 2 hours in milliseconds

  const options = {
    expires: expiration, // Set the expiration time
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    message: "Login successfully!",
    user,
    token,
  });
});

//get loggedInProfile

export const profile = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate(
    "posts followers following"
  );
  if (!user) return next(new ErrorHandler("user not found!", 404));

  res.status(200).json({
    success: true,
    message: "user get successFully!",
    data: user,
  });
});

//updateProfile
export const updateProfile = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  const { fullName, dob, gender, bio } = req.body;

  // Preserve the existing avatar URL
  const existingImageUrl = user.avatar ? user.avatar.url : null;

  // Update the user's full name, dob, gender, and bio
  user.fullName = fullName;
  user.dob = dob;
  user.gender = gender;
  user.bio = bio;

  // Check if a new image is being uploaded and it's different from the existing one
  if (req.file && existingImageUrl !== req.file.filename) {
    const baseUrl = `${req.protocol}://${req.hostname}:${
      process.env.PORT || 5000
    }`;
    const avatarPath = req.file.filename;
    const avatarImageUrl = `${baseUrl}/gallery/${avatarPath}`.replace(
      /\\/g,
      "/"
    );

    // Check if the previous image exists and is not the same as the newly uploaded image
    if (existingImageUrl) {
      const filename = path.basename(existingImageUrl);
      const previousImagePath = path.join("public/gallery", filename);

      // Check if the file exists before attempting to delete it
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath);
      }
    }

    // Update the avatar URL
    user.avatar = { url: avatarImageUrl };
  }

  // Save the user changes
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile update success!",
    data: user,
  });
});

//change password
export const changePassword = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new ErrorHandler("user not found!", 404));

  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("please enter required field!", 400));

  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("password must be match!", 400));

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler("oldPassword is incorrect", 400));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "password change successFully!",
  });
});

//forgot Password
export const forgotPassword = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler("User not found! Please check your email address.", 404)
    );
  }

  const resetPasswordToken = user.getResetPasswordToken();

  await user.save();

  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetPasswordToken}`;
  const resetUrl = `${req.protocol}://localhost:5173/account/password/reset/${resetPasswordToken}`;

  // const message = `You have requested a password reset. Click the link below to reset your password: \n\n ${resetUrl}`;
  const message =
    `Dear ${user.fullName},\n\n` +
    `Password request action is triggered for your account.\n\n` +
    `Your registered email is ${user.email}.\n\n` +
    `Use Code To reset your password: ${resetPasswordToken}.\n\n` +
    `Or\n\n` +
    `Click here to reset your password: ${resetUrl}.\n\n` +
    `If you face any difficulty during the Password Reset, do get in touch with our Support team.\n\n` +
    `This email was auto-generated by Sapkota Marketplace. Please do not reply to this mail.\n\n` +
    `Regards,\n` +
    `Sapkota Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: `An email has been sent to: ${user.email}. Please check your inbox and spam folder if needed.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(500).json({
      success: false,
      message: "Unable to send the reset email. Please try again later.",
    });
  }
});

//resetPassword
export const resetPassword = tryCatchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new ErrorHandler("Password is required!", 400));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or has expired", 401));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully!",
  });
});

//logout
export const logout = tryCatchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
    .json({
      success: true,
      message: "Logged out!",
    });
});

//follow user
export const followUser = tryCatchAsyncError(async (req, res, next) => {
  const userToFollow = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user.id);

  if (!userToFollow) return next(new ErrorHandler("User not found!", 404));

  // Check if the loggedInUser is already following userToFollow
  const isAlreadyFollowing = loggedInUser.following.includes(userToFollow._id);

  if (isAlreadyFollowing) {
    // Unfollow the user
    const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
    const indexFollowers = userToFollow.followers.indexOf(loggedInUser.id);

    loggedInUser.following.splice(indexFollowing, 1);
    userToFollow.followers.splice(indexFollowers, 1);
  } else {
    // Follow the user
    loggedInUser.following.push(userToFollow._id);
    userToFollow.followers.push(loggedInUser.id);
  }

  await loggedInUser.save();
  await userToFollow.save();

  res.status(200).json({
    success: true,
    message: isAlreadyFollowing ? "User unfollowed!" : "User followed!",
    data: loggedInUser,
  });
});

//delete Profile
// export const deleteProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     const userId = user._id;

//     if (!user) {
//       return next(new ErrorHandler("User not found!", 404));
//     }

//     // Delete user's avatar image if it exists
//     if (user.avatar) {
//       const avatarFilename = path.basename(user.avatar.url);
//       const avatarImagePath = path.join("public", "gallery", avatarFilename);
//       await unlink(avatarImagePath);
//     }

//     // Delete user's posts and associated images in parallel
//     const postsToDelete = await Post.find({ _id: { $in: user.posts } });
//     const deletePostPromises = postsToDelete.map(async (post) => {
//       if (post.postImg) {
//         const postImageFilename = path.basename(post.postImg.url);
//         const postImagePath = path.join("public", "gallery", postImageFilename);
//         await unlink(postImagePath);
//       }
//       await post.deleteOne();
//     });
//     await Promise.all(deletePostPromises);

//     // Removing user from followers' following and followings' followers in parallel
//     const removeUserPromises = [];

//     user.followers.forEach((followerId) => {
//       removeUserPromises.push(
//         User.findById(followerId).then(async (follower) => {
//           const index = follower.following.indexOf(user.id);
//           if (index !== -1) {
//             follower.following.splice(index, 1);
//             await follower.save();
//           }
//         })
//       );
//     });

//     user.following.forEach((followingId) => {
//       removeUserPromises.push(
//         User.findById(followingId).then(async (follows) => {
//           const index = follows.followers.indexOf(user.id);
//           if (index !== -1) {
//             follows.followers.splice(index, 1);
//             await follows.save();
//           }
//         })
//       );
//     });

//     //removing all comments of the user from all posts

//     const allPosts = await Post.find();
//     for (let i = 0; i < allPosts.length; i++) {
//       const post = await Post.findById(allPosts[i]._id);

//       for (let j = 0; j < post.comments.length; j++) {
//         if (post.comments[j].user === userId) {
//           post.comments.splice(j, 1);
//         }
//       }
//       await post.save();
//     }

//     // removing all likes of the user from all posts

//     for (let i = 0; i < allPosts.length; i++) {
//       const post = await Post.findById(allPosts[i]._id);

//       for (let j = 0; j < post.likes.length; j++) {
//         if (post.likes[j] === userId) {
//           post.likes.splice(j, 1);
//         }
//       }
//       await post.save();
//     }

//     await Promise.all(removeUserPromises);

//     // Delete user
//     await user.deleteOne();

//     // Logout user after deleting the profile
//     res.cookie("token", null, { expires: new Date(0), httpOnly: true });

//     res.status(200).json({
//       success: true,
//       message: "Profile deleted!",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userId = user._id;

    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    // Delete user's avatar image if it exists
    if (user.avatar) {
      const avatarFilename = path.basename(user.avatar.url);
      const avatarImagePath = path.join("public", "gallery", avatarFilename);
      await unlink(avatarImagePath);
    }

    // Delete user's posts and associated images in parallel
    const postsToDelete = await Post.find({ _id: { $in: user.posts } });
    const deletePostPromises = postsToDelete.map(async (post) => {
      if (post.postImg) {
        const postImageFilename = path.basename(post.postImg.url);
        const postImagePath = path.join("public", "gallery", postImageFilename);
        await unlink(postImagePath);
      }
      await post.deleteOne();
    });
    await Promise.all(deletePostPromises);

    // Removing user from followers' following and followings' followers in parallel
    const removeUserPromises = [];

    user.followers.forEach((followerId) => {
      removeUserPromises.push(
        User.findByIdAndUpdate(
          followerId,
          { $pull: { following: user.id } }, // Remove user from followers' following list
          { new: true }
        )
      );
    });

    user.following.forEach((followingId) => {
      removeUserPromises.push(
        User.findByIdAndUpdate(
          followingId,
          { $pull: { followers: user.id } }, // Remove user from followings' followers list
          { new: true }
        )
      );
    });

    // Removing all comments and likes of the user from all posts in parallel
    const removeCommentsLikesPromises = [];

    const allPosts = await Post.find();

    allPosts.forEach((post) => {
      const commentIndex = post.comments.findIndex(
        (comment) => comment.user.toString() === userId.toString()
      );
      if (commentIndex !== -1) {
        // Remove user's comment
        post.comments.splice(commentIndex, 1);
        removeCommentsLikesPromises.push(post.save());
      }

      if (post.likes.includes(userId)) {
        // Remove user's like
        post.likes = post.likes.filter(
          (likeId) => likeId.toString() !== userId.toString()
        );
        removeCommentsLikesPromises.push(post.save());
      }
    });

    await Promise.all(removeUserPromises);
    await Promise.all(removeCommentsLikesPromises);

    // Delete user
    await user.deleteOne();

    // Logout user after deleting the profile
    res.cookie("token", null, { expires: new Date(0), httpOnly: true });

    res.status(200).json({
      success: true,
      message: "Profile deleted!",
    });
  } catch (err) {
    next(err);
  }
};

//export const getUserProfile(any User)
export const userProfile = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate(
    "posts followers following"
  );
  if (!user) return next(new ErrorHandler("user not found!", 404));

  res.status(200).json({
    success: true,
    message: "user get successFully!",
    data: user,
  });
});

//getAllUsers
export const allUsers = tryCatchAsyncError(async (req, res, next) => {
  const users = await User.find({
    fullName: { $regex: req.query.fullName, $options: "i" },
  });

  res.status(200).json({
    success: true,
    message: "all user get successFully!",
    data: users,
  });
});

//get all userPosts
export const userPosts = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const posts = [];

  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i]).populate(
      "likes comments.user owner"
    );
    posts.push(post);
  }

  res.status(200).json({
    success: true,
    data: posts,
  });
});
