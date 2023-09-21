import React, { useEffect, useState } from "react";
import Forgot from "../../../../assets/images/updatePassword.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MetaData from "../../../layout/metaData/MetaData";
import SubHeader from "../../../layout/subHeader/SubHeader";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearError,
  resetPassword,
} from "../../../../redux/features/authSlice";

const ResetPassword = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [resetValue, setResetValue] = useState({
    password: "",
    confirmPassword: "",
  });

  const { password, confirmPassword } = resetValue;
  const [resetPasswordErr, setResetPasswordErr] = useState({});

  const validatedForm = () => {
    let newErrors = {};

    if (!password) {
      newErrors.password = "password is required!";
    } else if (password.length < 8) {
      newErrors.password = "password must be 8 characters long!";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "confirmPassword is required!";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "passwords do not match";
    }

    setResetPasswordErr(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setResetValue({ ...resetValue, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatedForm()) {
      dispatch(resetPassword({ token, resetValue, navigate, toast }));
    } else {
      return toast.error("Invalid field");
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
      <MetaData title="reset password" />
      <SubHeader />
      <div className="container my-5">
        <div className="flex flex-col md:flex-row justify-center">
          <div className="md:w-6/12 mb-4 md:mb-0">
            <img
              src={Forgot}
              alt="Forgot Password"
              className="w-3/4 h-auto object-contain max-w-full max-h-full"
            />
          </div>
          <div className="md:w-6/12 flex flex-col justify-center">
            <h2 className="text-gray-500 text-2xl font-semibold">
              Reset your password?
            </h2>

            <form onSubmit={handleSubmit} className="mt-2">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-gray-700">
                  new Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter newPassword"
                  value={password}
                  onChange={handleChange}
                  className="appearance-none block w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300 sm:text-sm"
                />
                {resetPasswordErr && (
                  <span className="text-red-500 text-sm">
                    {resetPasswordErr.password}
                  </span>
                )}
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
                    placeholder="Enter confirm Password"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300 sm:text-sm"
                  />
                  {resetPasswordErr && (
                    <span className="text-red-500 text-sm">
                      {resetPasswordErr.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-1">
                    <span>Loading</span>
                    <div className="w-4 h-4 border-t-2 border-blue-200 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "SAVE"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
