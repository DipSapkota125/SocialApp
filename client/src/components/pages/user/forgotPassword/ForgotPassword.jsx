import React, { useEffect, useState } from "react";
import Forgot from "../../../../assets/images/Forgot.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearError,
  forgotPassword,
} from "../../../../redux/features/authSlice";
import MetaData from "../../../layout/metaData/MetaData";
import SubHeader from "../../../layout/subHeader/SubHeader";

const ForgotPassword = () => {
  const { loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [forgotValue, setForgotValue] = useState({
    email: "",
  });

  const { email } = forgotValue;
  const handleChange = (e) => {
    let { name, value } = e.target;
    setForgotValue({ ...forgotValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required!");
    dispatch(forgotPassword({ forgotValue, navigate, toast }));

    // Clear the email field
    setTimeout(() => {
      setForgotValue({ email: "" });
    }, 5000);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);
  return (
    <>
      <MetaData title="Forgot Password" />
      <SubHeader />
      <div className="container my-8">
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
              Forgot your password?
            </h2>
            <p className="text-gray-500 my-2">
              Don’t worry! Just fill in your email and we’ll help you <br />
              reset your password.
            </p>
            <form onSubmit={handleSubmit} className="">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleChange}
                  className="appearance-none block w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-300 sm:text-sm"
                />
                <p className="text-xs text-gray-500">
                  We'll never share your email with anyone else.
                </p>
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-1">
                    <span>Loading</span>
                    <div className="w-4 h-4 border-t-2 border-blue-200 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "SUBMIT"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
