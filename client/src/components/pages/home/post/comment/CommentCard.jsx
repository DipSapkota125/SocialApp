import React from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { commentRemove } from "../../../../../redux/features/postSlice";

const CommentCard = ({
  userId,
  postId,
  fullName,
  avatar,
  comment,
  commentId,
  isAccount,
}) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteCommentHandle = (e) => {
    e.preventDefault();
    dispatch(commentRemove({ postId, commentId, toast }));
  };
  return (
    <>
      <div key={userId} className="flex items-start justify-between mt-4">
        <div className="flex items-center">
          <Link to={`/user/${userId}`}>
            <img
              src={avatar}
              alt={fullName}
              className="w-8 h-8 rounded-full mr-2"
            />
          </Link>
          <div>
            <p className="text-gray-700 font-bold">{fullName}</p>
            <p className="text-gray-600 text-sm">{comment}</p>
          </div>
        </div>

        {isAccount ? (
          <button
            onClick={deleteCommentHandle}
            className="text-gray-600 hover:text-red-600"
          >
            <FaTrash className="text-red-600" size={16} />
          </button>
        ) : userId === user._id ? (
          <button
            onClick={deleteCommentHandle}
            className="text-gray-600 hover:text-red-600"
          >
            <FaTrash className="text-red-600" size={16} />
          </button>
        ) : null}
      </div>
    </>
  );
};

export default CommentCard;
