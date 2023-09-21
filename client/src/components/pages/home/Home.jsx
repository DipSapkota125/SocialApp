import React, { useEffect } from "react";
import "./Home.css";
import User from "./userFriend/User";
import Post from "./post/Post";
import MetaData from "../../../components/layout/metaData/MetaData";
import { clearError, postOfFollowing } from "../../../redux/features/postSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../layout/loader/Loader";
import { allUsers, clearErr } from "../../../redux/features/authSlice";

const Home = () => {
  const { loading, error, posts } = useSelector((state) => state.post);
  const {
    loading: isLoading,
    error: isError,
    users,
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    dispatch(postOfFollowing());
  }, [dispatch, error]);

  useEffect(() => {
    if (isError) {
      dispatch(clearErr());
    }
    dispatch(allUsers());
  }, [dispatch, isError]);
  return (
    <>
      <MetaData title="home" />
      {loading === true || isLoading === true ? (
        <Loader />
      ) : (
        <div className="home">
          <div className="homeleft">
            {posts && posts.length > 0 ? (
              posts &&
              posts.map((post) => (
                <Post
                  key={post._id}
                  postId={post._id}
                  caption={post.caption}
                  postImage={post?.postImg?.url}
                  likes={post?.likes}
                  comments={post?.comments}
                  ownerName={post?.owner?.fullName}
                  ownerImage={post?.owner?.avatar?.url}
                  ownerId={post?.owner?._id}
                  isAccount={false}
                  postDate={post.createdAt}
                />
              ))
            ) : (
              <span className="text-center">No post yet</span>
            )}
          </div>
          <div className="homeright">
            {users && users.length > 0 ? (
              users &&
              users.map((user) => (
                <User
                  key={user._id}
                  userId={user._id}
                  name={user.fullName}
                  avatar={user?.avatar?.url}
                />
              ))
            ) : (
              <span className="text-center">No Users Yet</span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
