import React, { useEffect, useState } from "react";
import "./Post.css";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { FaTimes, FaTrash, FaUserCircle } from "react-icons/fa";
import { MdMoreVert, MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactModal from "react-modal";
import moment from "moment";
ReactModal.setAppElement("#root");
import {
  addUpdateComment,
  clearError,
  postLikeUnlike,
  postOfFollowing,
} from "../../../../redux/features/postSlice";
import CommentCard from "./comment/CommentCard";
import {
  allMyPosts,
  removePost,
  updateCaption,
} from "../../../../redux/features/myPostSlice";
import { profile } from "../../../../redux/features/authSlice";

const Post = ({
  postId,
  postDate,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerName,
  ownerImage,
  ownerId,
  isDelete = false,
  isAccount = false,
}) => {
  const timeDifference = moment(postDate).fromNow();

  const { error } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState({
    comment: "",
  });

  const [captionValue, setCaptionValue] = useState({
    caption: "",
  });
  const [captionToggle, setCaptionToggle] = useState("");
  const [deletePost, setDeletePost] = useState(false);

  const { comment } = commentValue;
  const { caption: updateNewCaption } = captionValue;
  const handleChange = (e) => {
    let { name, value } = e.target;
    setCommentValue({ ...commentValue, [name]: value });
  };

  const handleCaptionChange = (e) => {
    let { name, value } = e.target;
    setCaptionValue({ ...captionValue, [name]: value });
  };

  const [commentToggle, setCommentToggle] = useState(false);

  const handleLikedUnLiked = async () => {
    setLiked(!liked);
    await dispatch(postLikeUnlike({ postId, toast, navigate }));

    if (isAccount) {
      dispatch(allMyPosts());
    } else {
      dispatch(postOfFollowing());
    }
  };

  const handleCaptionSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCaption({ postId, captionValue, toast, navigate }));
    dispatch(allMyPosts());
  };

  const handleDeletePost = () => {
    dispatch(removePost({ postId, toast }));
    dispatch(profile());
  };

  const handleAddCommentSubmit = (e) => {
    e.preventDefault();

    if (!comment) {
      return toast.error("comment is required!");
    } else {
      dispatch(addUpdateComment({ postId, commentValue, toast }));
    }
    if (isAccount) {
      dispatch(allMyPosts());
    } else {
      dispatch(postOfFollowing());
    }
  };

  useEffect(() => {
    if (caption) {
      setCaptionValue({
        caption: caption || "",
      });
    }
  }, [caption]);
  useEffect(() => {
    likes.forEach((item) => {
      if (item?._id === user?._id) {
        setLiked(true);
      }
    });
  }, [likes, user?._id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);
  return (
    <>
      <div className="post">
        <div className="postHeader">
          {isAccount ? (
            <button onClick={() => setCaptionToggle(!captionToggle)}>
              <MdMoreVert />
            </button>
          ) : null}
        </div>
        <ReactModal
          isOpen={captionToggle}
          onRequestClose={() => setCaptionToggle(!captionToggle)}
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-content">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md text-gray-500">Edit Caption</h2>
              <button
                onClick={() => setCaptionToggle(!captionToggle)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* update caption form */}
            <form className="captionForm" onSubmit={handleCaptionSubmit}>
              <input
                type="text"
                name="caption"
                placeholder="edit caption..."
                value={updateNewCaption}
                onChange={handleCaptionChange}
                className="border p-2 w-full rounded-md focus:outline-none focus:border-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
              >
                save
              </button>
            </form>
          </div>
        </ReactModal>

        <img src={postImage} alt="postImg" />

        <div className="postDetails">
          {ownerImage ? (
            <img src={ownerImage} alt="ownerImg" className="ownerImage" />
          ) : (
            <FaUserCircle size={20} className="ownerIcon" />
          )}
          <Link
            to={`/user/${ownerId}`}
            className="ml-0 text-gray-600 font-bold"
          >
            <span className="text-sm">{ownerName}</span>
          </Link>
          <p className="ml-2 text-sm text-gray-500">{caption}</p>
          <p className="text-sm ">{timeDifference}</p>
        </div>
        <button
          style={{
            border: "none",
            margin: "1vmax 2vmax",
            cursor: "pointer",
            backgroundColor: "white",
          }}
          onClick={() => setLikesUser(!likesUser)}
          disabled={likes.length === 0 ? true : false}
        >
          <span>{likes.length} likes</span>
        </button>

        <div className="postFooter">
          <button onClick={handleLikedUnLiked}>
            {liked ? (
              <AiFillHeart className="text-red-600" />
            ) : (
              <AiOutlineHeart />
            )}
          </button>

          <button onClick={() => setCommentToggle(!commentToggle)}>
            <GoComment size={20} />
          </button>
          {isDelete ? (
            <button onClick={() => setDeletePost(!deletePost)}>
              <FaTrash className="text-red-600" size={20} />
            </button>
          ) : (
            ""
          )}
          <ReactModal
            isOpen={deletePost}
            onRequestClose={() => setDeletePost(!deletePost)}
            className="modal"
            overlayClassName="modal-overlay"
          >
            <div className="modal-content">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-md text-gray-500">
                  Are you sure want to delete your post?
                </h2>
                <button
                  onClick={() => setDeletePost(!deletePost)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={24} /> {/* Use the cross icon */}
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleDeletePost}
                  className="bg-red-500 text-white px-4 py-2 rounded-full mr-2 hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeletePost(!deletePost)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ReactModal>
        </div>

        {/* for likes modal */}
        <ReactModal
          isOpen={likesUser}
          onRequestClose={() => setLikesUser(!likesUser)}
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-content">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-gray-500">Liked By</h2>
              <button
                onClick={() => setLikesUser(!likesUser)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={24} /> {/* Use the cross icon */}
              </button>
            </div>
            {/* Display liked users here */}
            {likes &&
              likes.map((like) => (
                <div key={like._id} className="flex items-center mb-2">
                  <img
                    src={like?.avatar?.url}
                    alt={like.fullName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{like.fullName}</span>
                </div>
              ))}
          </div>
        </ReactModal>

        {/* for comment modal */}
        <ReactModal
          isOpen={commentToggle}
          onRequestClose={() => setCommentToggle(!commentToggle)}
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-content">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-gray-500">Comments</h2>
              <button
                onClick={() => setCommentToggle(!commentToggle)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Comment form */}
            <form className="commentForm" onSubmit={handleAddCommentSubmit}>
              <input
                type="text"
                name="comment"
                placeholder="Write a comment..."
                value={comment}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <MdSend />
              </button>
            </form>

            {/* Display comments */}
            {comments && comments.length > 0 ? (
              comments &&
              comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  userId={comment?.user._id}
                  fullName={comment?.user?.fullName}
                  avatar={comment?.user?.avatar?.url}
                  comment={comment?.comment}
                  commentId={comment._id}
                  postId={postId}
                  isAccount={isAccount}
                />
              ))
            ) : (
              <span>No comments yet</span>
            )}
          </div>
        </ReactModal>
      </div>
    </>
  );
};

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  postImage: PropTypes.string.isRequired,
  likes: PropTypes.array,
  comments: PropTypes.array,
  ownerName: PropTypes.string.isRequired,
  ownerImage: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  isDelete: PropTypes.bool,
  isAccount: PropTypes.bool,
  timeDifference: PropTypes.string, // Add this line
};

export default Post;
