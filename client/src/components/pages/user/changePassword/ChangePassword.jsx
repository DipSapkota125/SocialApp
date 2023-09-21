import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  changePassword,
  clearError,
} from "../../../../redux/features/authSlice";
import Change from "../../../../assets/images/updatePassword.png";
import MetaData from "../../../layout/metaData/MetaData";
import SubHeader from "../../../layout/subHeader/SubHeader";
const ChangePassword = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordValue, setPasswordValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { oldPassword, newPassword, confirmPassword } = passwordValue;

  const [passwordError, setPasswordError] = useState({});

  const validatedForm = () => {
    let newErrors = {};
    if (!oldPassword) {
      newErrors.oldPassword = "oldPassword is required";
    }
    if (!newPassword) {
      newErrors.newPassword = "newPassword is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "newPassword must be 8 characters long";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "confirmPassword is required";
    }

    setPasswordError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setPasswordValue({ ...passwordValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatedForm()) {
      dispatch(changePassword({ passwordValue, toast, navigate }));
    } else {
      return toast.error("Invalid input");
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
      <MetaData title="Change Password" />
      <SubHeader />
      <div className="border border-gray-300 rounded p-4 my-8">
        <div className=" flex flex-col md:flex-row justify-center md:justify-between gap-4">
          {/* Image column */}
          <div className="md:w-1/2 flex justify-center items-center">
            {/* Replace the image source and alt text with your own */}
            <img
              src={Change}
              alt="Change img"
              className="w-3/4 h-auto object-contain max-w-full max-h-full"
            />
          </div>

          {/* Form column */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl text-gray-500 mb-6">Change Password</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  oldPassword*
                </label>
                <div className="mt-1">
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    placeholder="old Password"
                    value={oldPassword}
                    onChange={handleChange}
                    className="appearance-none block w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300 sm:text-sm"
                  />
                  {passwordError && (
                    <span className="text-red-600 text-sm">
                      {passwordError.oldPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  new Password*
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="new password"
                    value={newPassword}
                    onChange={handleChange}
                    className="appearance-none block w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300 sm:text-sm"
                  />
                  {passwordError && (
                    <span className="text-red-600 text-sm">
                      {passwordError.newPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  confirm Password*
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm Password"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300 sm:text-sm"
                  />
                  {passwordError && (
                    <span className="text-red-600 text-sm">
                      {passwordError.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-1">
                    <span>Loading</span>
                    <div className="w-4 h-4 border-t-2 border-blue-200 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "save"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
