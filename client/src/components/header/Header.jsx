import React, { useEffect, useState } from "react";
import "./Header.css";
import {
  FaAngleDown,
  FaHome,
  FaPlus,
  FaSearch,
  FaUserCircle,
  FaHistory,
} from "react-icons/fa";
import {
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { BsCameraReelsFill } from "react-icons/bs";
import { MdPostAdd, MdLiveTv } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import decode from "jwt-decode";
import { setLogout } from "../../redux/features/authSlice";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userToken = localStorage.getItem("authID");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState(window.location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleAddDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (userToken) {
      const decodedData = decode(userToken);

      if (decodedData.exp * 1000 < new Date().getTime()) {
        dispatch(setLogout());
        navigate("/login");
        toast.error("Your session has expired. Please login again.");
      }
    }
  }, [dispatch, navigate, userToken]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="header bg-gray-100 rounded-lg shadow-lg py-2 px-4">
        <Link to="/" onClick={() => setTab("/")}>
          {tab === "/" ? (
            <FaHome style={{ color: "black" }} />
          ) : (
            <AiOutlineHome />
          )}
        </Link>

        <Link onClick={toggleAddDropdown}>
          {tab === "/add/social-post" ? (
            <FaPlus style={{ color: "black" }} />
          ) : (
            <AiOutlinePlus />
          )}
        </Link>
        {showDropdown && (
          <div className="relative">
            <ul
              className="absolute right-0 mt-6 py-2 w-32 bg-white border border-gray-300 rounded shadow mx-auto"
              style={{ zIndex: "9999" }}
            >
              <li className="my-1">
                <Link
                  to="/add/social-post"
                  className="px-4 py-2 text-gray-800 hover:text-gray-600"
                >
                  <MdPostAdd className="inline-block mr-2" /> Post
                </Link>
              </li>

              <li className="my-1">
                <Link
                  to="/add/story"
                  className="px-4 py-2 text-gray-800 hover:text-gray-600"
                >
                  <FaHistory className="inline-block mr-2" />
                  Story
                </Link>
              </li>

              <li className="my-1">
                <Link
                  to="/add/reel"
                  className="px-4 py-2 text-gray-800 hover:text-gray-600"
                >
                  <BsCameraReelsFill className="inline-block mr-2" />
                  Reel
                </Link>
              </li>

              <li className="my-1">
                <Link
                  to="/add/live"
                  className="px-4 py-2 text-gray-800 hover:text-gray-600"
                >
                  <MdLiveTv className="inline-block mr-2" />
                  Live
                </Link>
              </li>
            </ul>
          </div>
        )}

        <Link to="search" onClick={() => setTab("/search")}>
          {tab === "/search" ? (
            <FaSearch style={{ color: "black" }} />
          ) : (
            <AiOutlineSearch />
          )}
        </Link>
        {isAuthenticated ? (
          <div className="relative">
            <button
              className="flex items-center text-red-600 py-2 px-4"
              onClick={toggleDropdown}
            >
              <div className="flex items-center">
                <Link to="/account/post-information">
                  {user?.avatar?.url ? (
                    <img
                      src={user?.avatar?.url}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
                  )}
                </Link>
                {/* <span>{user?.fullName}</span> */}
              </div>
              <FaAngleDown className="ml-2" />
            </button>
            {/* 
            {isOpen && (
              <ul
                className="absolute right-0 mt-2 py-2 w-60 bg-white border border-gray-300 rounded shadow"
                style={{ zIndex: "9999" }}
              >
                <li className="my-1">
                  <Link
                    to="/account/information"
                    className="px-4 py-2 text-gray-800 hover:text-gray-600"
                  >
                    <FaUser className="inline-block mr-2" /> Profile
                  </Link>
                </li>
                <li className="my-1">
                  <Link
                    to="/account/change/password"
                    className="px-4 py-2 text-gray-800 hover:text-gray-600"
                  >
                    <FaKey className="inline-block mr-2" /> Change Password
                  </Link>
                </li>
                {user && user?.role === "admin" && (
                  <li className="my-1">
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-2 text-gray-800 hover:text-gray-600"
                    >
                      <FaChartBar className="inline-block mr-2" />
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    className="px-4 py-2 text-gray-800"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="inline-block mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            )} */}
          </div>
        ) : (
          <Link to="/account" onClick={() => setTab("/account")}>
            {tab === "/account" ? (
              <FaUser style={{ color: "black" }} />
            ) : (
              <AiOutlineUser />
            )}
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
