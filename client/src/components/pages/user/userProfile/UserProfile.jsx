import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Loader from "../../../layout/loader/Loader";
import Post from "../../home/post/Post";
import ReactModal from "react-modal";
import { clearError, postsUser } from "../../../../redux/features/myPostSlice";
import {
  clearErr,
  followUser,
  profileUser,
} from "../../../../redux/features/authSlice";

const UserProfile = () => {
  const { loading, error, userPosts } = useSelector((state) => state.myPost);
  const {
    user: me,
    userProfile,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);

  const userId = userProfile && userProfile._id;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);

  const [myProfile, setMyProfile] = useState(false);
  const [following, setFollowing] = useState(false);

  const handleFollow = async () => {
    setFollowing(!following);
    await dispatch(followUser({ userId, toast }));
    dispatch(profileUser(id));
  };

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearErr());
    }
    dispatch(profileUser(id));
  }, [dispatch, authError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    dispatch(postsUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (me && me?._id === id) {
      setMyProfile(true);
    }

    if (userProfile) {
      userProfile &&
        userProfile?.followers?.forEach((item) => {
          if (item?._id === me?._id) {
            setFollowing(true);
          } else {
            setFollowing(false);
          }
        });
    }
  }, [userProfile, me?._id, id]);

  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="account ">
            <div className="accountleft">
              {userPosts && userPosts.length > 0 ? (
                userPosts.map((post) => (
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
                    postDate={post.createdAt}
                  />
                ))
              ) : (
                <span>No Posts To Show</span>
              )}
            </div>
            <div className="accountright">
              <img
                src={userProfile?.avatar?.url}
                alt={userProfile?.fullName}
                className="w-24 h-24 rounded-full object-cover cursor-pointer"
              />
              <span className="text-gray-500 my-2">
                {userProfile?.fullName}
              </span>

              <div>
                <button onClick={() => setFollowersToggle(!followersToggle)}>
                  <span className="text-gray-500">followers</span>
                </button>
                <span>{userProfile?.followers?.length}</span>
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
                  {userProfile && userProfile?.followers?.length > 0 ? (
                    userProfile &&
                    userProfile?.followers?.map((item) => (
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
                <span>{userProfile?.following?.length}</span>
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
                  {userProfile && userProfile?.following?.length > 0 ? (
                    userProfile &&
                    userProfile?.following?.map((item) => (
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
                <span>{userProfile?.posts?.length}</span>
              </div>

              {myProfile ? null : (
                <button
                  style={{ background: following ? "gray" : "" }}
                  className="bg-blue-500 text-white hover:to-blue-600 px-4 py-2 rounded-md"
                  onClick={handleFollow}
                >
                  {authLoading && <span>...</span>}
                  {following ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
