import React, { useEffect, useState } from "react";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../../layout/loader/Loader";
import { FiLogOut } from "react-icons/fi";
import {
  allMyPosts,
  clearError,
} from "../../../../../redux/features/myPostSlice";
import Post from "../Post";
import { Link, useNavigate } from "react-router-dom";
import { deleteMe, setLogout } from "../../../../../redux/features/authSlice";
import ReactModal from "react-modal";
import { FaTimes } from "react-icons/fa";

const Account = () => {
  const { loading, error, myPosts } = useSelector((state) => state.myPost);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);

  const handleLogout = () => {
    dispatch(setLogout());
    toast.success("logout successFully!");
    navigate("/account");
  };

  const handleDeleteAccount = async () => {
    await dispatch(deleteMe());
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    dispatch(allMyPosts());
  }, [dispatch, error]);
  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="account ">
            <div className="accountleft">
              {myPosts && myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <Post
                    key={post?._id}
                    postId={post?._id}
                    caption={post?.caption}
                    postImage={post?.postImg?.url}
                    likes={post?.likes}
                    comments={post?.comments}
                    ownerName={post?.owner?.fullName}
                    ownerImage={post?.owner?.avatar?.url}
                    ownerId={post?.owner?._id}
                    isAccount={true}
                    isDelete={true}
                    postDate={post.createdAt}
                  />
                ))
              ) : (
                <span>No Posts To Show</span>
              )}
            </div>
            <div className="accountright">
              <img
                src={user?.avatar?.url}
                alt={user?.fullName}
                className="w-24 h-24 rounded-full object-cover cursor-pointer"
              />
              <span className="text-gray-500 my-2">{user?.fullName}</span>

              <div>
                <button onClick={() => setFollowersToggle(!followersToggle)}>
                  <span className="text-gray-500">followers</span>
                </button>
                <span>{user?.followers?.length}</span>
              </div>

              {/* for followers */}
              <ReactModal
                isOpen={followersToggle}
                onRequestClose={() => setFollowersToggle(!followersToggle)}
                className="modal"
                overlayClassName="modal-overlay"
              >
                <div className="modal-content">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md text-gray-500">Followers By</h2>
                    <button
                      onClick={() => setFollowersToggle(!followersToggle)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FaTimes size={24} /> {/* Use the cross icon */}
                    </button>
                  </div>
                  {/* Display liked users here */}
                  {user && user?.followers?.length > 0 ? (
                    user &&
                    user?.followers?.map((item) => (
                      <div key={item._id} className="flex items-center mb-2">
                        <img
                          src={item?.avatar?.url}
                          alt={item.fullName}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{item.fullName}</span>
                      </div>
                    ))
                  ) : (
                    <span>No followers yet</span>
                  )}
                </div>
              </ReactModal>

              <div>
                <button onClick={() => setFollowingToggle(!followingToggle)}>
                  <span className="text-gray-500">following</span>
                </button>
                <span>{user?.following?.length}</span>
              </div>

              {/* for following */}
              <ReactModal
                isOpen={followingToggle}
                onRequestClose={() => setFollowingToggle(!followingToggle)}
                className="modal"
                overlayClassName="modal-overlay"
              >
                <div className="modal-content">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md text-gray-500">Following By</h2>
                    <button
                      onClick={() => setFollowingToggle(!followingToggle)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FaTimes size={24} /> {/* Use the cross icon */}
                    </button>
                  </div>
                  {/* Display liked users here */}
                  {user && user?.following?.length > 0 ? (
                    user &&
                    user?.following?.map((item) => (
                      <div key={item._id} className="flex items-center mb-2">
                        <img
                          src={item?.avatar?.url}
                          alt={item.fullName}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{item.fullName}</span>
                      </div>
                    ))
                  ) : (
                    <span>No following yet</span>
                  )}
                </div>
              </ReactModal>

              <div>
                <span className="text-gray-500">Posts</span>
                <span>{user?.posts?.length}</span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-blue-300"
              >
                <FiLogOut className="h-6 w-6" />
                <span>Logout</span>
              </button>
              <Link to="/account/information">Edit Profile</Link>
              <Link to="/account/change/password">Change Password</Link>
              <button
                onClick={() => setDeleteAccount(!deleteAccount)}
                className="text-red-500 my-2"
              >
                Delete Account
              </button>
              {/* for deleteAccount */}
              <ReactModal
                isOpen={deleteAccount}
                onRequestClose={() => setDeleteAccount(!deleteAccount)}
                className="modal"
                overlayClassName="modal-overlay"
              >
                <div className="modal-content">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md text-gray-500">
                      Are you sure want to delete your account?
                    </h2>
                    <button
                      onClick={() => setDeleteAccount(!deleteAccount)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FaTimes size={24} /> {/* Use the cross icon */}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-500 text-white px-4 py-2 rounded-full mr-2 hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteAccount(!deleteAccount)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </ReactModal>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default Account;
