import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearError,
  profile,
  updateMe,
} from "../../../../redux/features/authSlice";
import Loader from "../../../layout/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../../../layout/metaData/MetaData";
import SubHeader from "../../../layout/subHeader/SubHeader";

const Profile = () => {
  const { isLoading, loading, error, user } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shownToastOnce = useRef(false);

  const [editValue, setEditValue] = useState({
    fullName: "",
    email: "",
    mobile_No: "",
    bio: "",
    dob: "",
    gender: "",
  });

  const { fullName, email, mobile_No, bio, dob, gender } = editValue;
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showData, setShowDataVisible] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setEditValue({ ...editValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = new FormData();
    updateData.append("fullName", fullName);
    updateData.append("bio", bio);
    updateData.append("dob", dob);
    updateData.append("gender", gender);
    updateData.append("avatar", avatar);

    dispatch(updateMe({ updateData, toast, navigate }));
  };

  useEffect(() => {
    if (user) {
      setEditValue({
        fullName: user?.fullName || "",
        email: user?.email || "",
        mobile_No: user?.mobile_No || "",
        gender: user?.gender || "",
        dob: user?.dob || "",
        bio: user?.bio || "",
      });
      setAvatarPreview(user?.avatar?.url || "");
    }
  }, [user]);

  useEffect(() => {
    if (error && !shownToastOnce.current) {
      toast.error(error);
      dispatch(clearError());
      shownToastOnce.current = true;
    }
    dispatch(profile());
  }, [dispatch, error]);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatar(file); // Update the avatar state with the file object
      };
    }
  };

  return (
    <>
      <MetaData title="account information" />
      <SubHeader />
      <div className="profile-container bg-white p-4 rounded-lg flex justify-center my-5">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col md:flex-row items-center">
            <label
              htmlFor="imgFile"
              className="md:w-1/3 md:text-center mb-4 md:mb-0"
            >
              <div className="rounded-full w-32 h-32 overflow-hidden mx-auto cursor-pointer">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center bg-gray-200"
                    style={{ borderRadius: "50%" }} // This style makes it circular
                  >
                    <span>Select Image</span>
                  </div>
                )}
                <input
                  id="imgFile"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </div>
            </label>
            <div className="md:w-2/3 md:pl-6 flex flex-col md:flex-row justify-between md:items-center md:ml-4">
              <div className="text-center md:text-left mb-4 md:mb-0 mr-6">
                <h2 className="text-2xl font-semibold text-gray-500">
                  {user?.fullName}
                </h2>
                <p className="text-gray-600">{user?.email}</p>

                <button
                  className="bg-gray-100 text-gray-500 font-sm px-2 py-1 rounded-lg mt-0"
                  onClick={() => setShowDataVisible(!showData)}
                >
                  Edit Profile
                </button>
              </div>
              <div className="md:flex gap-4 md:mb-4 ml-6">
                <div className="text-center">
                  <Link to="/account/post-information">
                    {user?.posts.length}
                    <h3 className="text-md font-semibold text-gray-500">
                      Posts
                    </h3>
                  </Link>
                </div>
                <div className="text-center">
                  {user?.followers?.length}
                  <h3 className="text-md font-semibold text-gray-500">
                    Followers
                  </h3>
                </div>
                <div className="text-center">
                  {user?.following?.length}
                  <h3 className="text-md font-semibold text-gray-500">
                    Following
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showData && (
        <div className="flex justify-center items-center my-5">
          <form onSubmit={handleSubmit} className="lg:pr-4">
            <div className="flex flex-wrap -mx-4">
              <div className="mb-4 w-1/2 px-4">
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-gray-500"
                  >
                    NAME
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="border focus:outline-none border-gray-300 px-2 py-1 w-full"
                    value={fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="mobile_No"
                    className="block mb-2 text-gray-700"
                  >
                    MOBILE NUMBER
                  </label>
                  <input
                    id="mobile_No"
                    name="mobile_No"
                    type="number"
                    className="border focus:outline-none border-gray-300 px-2 py-1 w-full"
                    value={mobile_No}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="gender" className="block mb-2 text-gray-700">
                    GENDER
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    type="text"
                    className="border focus:outline-none border-gray-300 px-2 py-2 w-full"
                    value={gender}
                    onChange={handleChange}
                  >
                    <option>Select options</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 w-1/2 px-4">
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-gray-500">
                    EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    className="border focus:outline-none border-gray-300 px-2 py-1 w-full"
                    value={email}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="date" className="block mb-2 text-gray-500">
                    DATE OF BIRTH
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type={user?.dob ? "text" : "date"}
                    className="border focus:outline-none border-gray-300 px-2 py-1 w-full"
                    value={dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="bio" className="block mb-2 text-gray-500">
                    BIO
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="border focus:outline-none border-gray-300 px-2 py-1 w-full"
                    value={bio}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
              Save{isLoading && <span>....</span>}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Profile;
