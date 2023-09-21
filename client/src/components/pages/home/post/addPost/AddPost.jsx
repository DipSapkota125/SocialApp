import React, { useEffect, useState } from "react";
import "./AddPost.css";
import { addPost, clearError } from "../../../../../redux/features/myPostSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { profile } from "../../../../../redux/features/authSlice";

const AddPost = () => {
  const { loading, error } = useSelector((state) => state.myPost);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postImg, setPostImg] = useState("");
  const [postImgPreview, setPostImgPreview] = useState("");

  const [addValue, setAddValue] = useState({
    caption: "",
  });

  const { caption } = addValue;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setAddValue({ ...addValue, [name]: value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setPostImgPreview(reader.result);
        setPostImg(file);
      };
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const AddData = new FormData();
    AddData.append("caption", caption);
    AddData.append("postImg", postImg);
    if (caption && postImg) {
      await dispatch(addPost({ AddData, toast, navigate }));
      dispatch(profile());
    } else {
      return toast.error("Invalid input!");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);
  return (
    <>
      <div className="newPost">
        <form className="newPostForm" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-2">New Post</h2>

          <label htmlFor="postImgInput" className="mb-4 cursor-pointer">
            {postImgPreview ? (
              <img
                src={postImgPreview}
                alt="post"
                className="mb-4 max-h-64 max-w-full"
                // Adjust the max-h and max-w classes to control the size
              />
            ) : (
              <div className="border border-gray-300 rounded-md p-4">
                Click to select an image
              </div>
            )}

            <input
              type="file"
              id="postImgInput"
              name="postImg"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <input
            type="text"
            name="caption"
            placeholder="Caption..."
            value={caption}
            onChange={handleChange}
            className="mb-4 px-4 py-2 border rounded-full w-full"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none  focus:ring-blue-300"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-1">
                <span>Loading</span>
                <div className="w-4 h-4 border-t-2 border-blue-200 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Post"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddPost;
