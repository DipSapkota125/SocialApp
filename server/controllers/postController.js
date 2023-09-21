import { tryCatchAsyncError } from "../middlewares/tryCatchAsyncError.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import path from "path";
import fs from "fs";

//create post
export const addPost = tryCatchAsyncError(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.hostname}:${
    process.env.PORT || 5000
  }`;
  const imagePath = req.file ? req.file.filename : undefined;

  // Check if caption and postImg are provided
  if (!req.body.caption || !imagePath)
    return next(new ErrorHandler("please enter required field", 400));

  const newPostData = {
    caption: req.body.caption,
    postImg: { url: `${baseUrl}/gallery/${imagePath}`.replace(/\\/g, "/") },
    owner: req.user.id,
  };

  const newPost = await Post.create(newPostData);

  const user = await User.findById(req.user.id);
  user.posts.unshift(newPost._id);

  await user.save();

  res.status(201).json({
    success: true,
    data: newPost,
  });
});

//updateCaption
export const updateCaption = tryCatchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorHandler("post not found", 404));

  if (post.owner.toString() !== req.user.id.toString()) {
    return next(new ErrorHandler("unauthorize", 400));
  }

  post.caption = req.body.caption;
  await post.save();

  res.status(200).json({
    success: true,
    message: "post updated!",
  });
});

//likeAndUnLikePost
export const likeAndUnlikePost = tryCatchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorHandler("post not found", 404));
  if (post.likes.includes(req.user.id)) {
    const index = post.likes.indexOf(req.user.id);

    post.likes.splice(index, 1);

    await post.save();

    res.status(200).json({
      success: true,
      message: "post Unliked!",
    });
  } else {
    post.likes.push(req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      message: "post Liked!",
    });
  }
});

//delete Post
export const deletePost = tryCatchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorHandler("Post not found!", 404));

  if (post.owner.toString() !== req.user.id.toString()) {
    return next(
      new ErrorHandler("You are unauthorized to perform this action", 403)
    );
  }

  //destroy img from public/gallery
  const existingImageURl = post.postImg.url;
  if (existingImageURl) {
    const filename = path.basename(existingImageURl);
    const previousImagePath = path.join("public", "gallery", filename);
    fs.unlinkSync(previousImagePath);
  }

  // Add a check to ensure post is not null before calling remove()

  await post.deleteOne();

  const user = await User.findById(req.user.id);

  const index = user.posts.indexOf(req.params.id);
  user.posts.splice(index, 1);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully!",
  });
});

//getPostOfFollowing
export const postOfFollowing = tryCatchAsyncError(async (req, res, next) => {
  //first populate method for get posts or use another below alternative
  // const user = await User.findById(req.user.id).populate("following", "posts");
  // if (!user) return next(new ErrorHandler("user not found!", 404));

  // res.status(200).json({
  //   success: true,
  //   data: user.following,
  // });

  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("user not found!", 404));

  const posts = await Post.find({
    owner: {
      $in: user.following,
    },
  }).populate("owner likes comments.user");
  res.status(200).json({
    success: true,
    data: posts.reverse(),
  });
});

export const addComment = tryCatchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Post not found!", 404));
  }

  const commentIndex = post.comments.findIndex(
    (item) => item.user.toString() === req.user.id.toString()
  );

  if (commentIndex !== -1) {
    // Comment already exists, update it
    post.comments[commentIndex].comment = req.body.comment;
  } else {
    // Comment doesn't exist, add it
    post.comments.push({
      user: req.user.id,
      comment: req.body.comment,
    });
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: commentIndex !== -1 ? "Comment updated!" : "Comment added!",
  });
});

//delete comment
export const deleteComment = tryCatchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorHandler("post not found!", 404));

  if (post.owner.toString() === req.user.id.toString()) {
    if (req.body.commentId == undefined) {
      return res.status(400).json({
        success: false,
        message: "commentId is required!",
      });
    }
    post.comments.forEach((item, index) => {
      if (item._id.toString() === req.body.commentId.toString()) {
        return post.comments.splice(index, 1);
      }
    });
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Selected comment deleted!",
    });
  } else {
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user.id.toString()) {
        return post.comments.splice(index, 1);
      }
    });
    await post.save();
    return res.status(200).json({
      success: true,
      message: "comment remove",
    });
  }
});

//get my ownPosts
export const myPosts = tryCatchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const posts = [];
  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i]).populate(
      "likes comments.user owner"
    );
    posts.push(post);
  }

  res.status(200).json({
    success: true,
    message: "posts get successFully!",
    data: posts,
  });
});
