import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearError, register } from "../../../../redux/features/authSlice";
import MetaData from "../../../layout/metaData/MetaData";

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerValue, setRegisterValue] = useState({
    fullName: "",
    mobile_No: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState({});
  const { fullName, mobile_No, email, password, confirmPassword } =
    registerValue;

  const validatedForm = () => {
    let newErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!fullName) {
      newErrors.fullName = "fullName is required";
    }
    if (!mobile_No) {
      newErrors.mobile_No = "mobile_No is required";
    } else if (!/^\d{10}$/.test(mobile_No)) {
      newErrors.mobile_No = "mobileNo must be exactly 10 digits long";
    }
    if (!email) {
      newErrors.email = "email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "invalid Email format";
    }
    if (!password) {
      newErrors.password = "password is required";
    } else if (password.length < 8) {
      newErrors.password = "password must be 8 characters long";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "confirmPassword is required";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "passwords do not match";
    }
    setRegisterError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setRegisterValue({ ...registerValue, [name]: value });
  };

  const handleCrossIconClick = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatedForm()) {
      dispatch(register({ registerValue, toast, navigate }));
    } else {
      return toast.warn("Invalid input!");
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
      <MetaData title="register" />
      <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center ">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-end mb-4">
            {/* Cross Icon */}
            <FaTimes
              className="cursor-pointer text-red-500"
              onClick={handleCrossIconClick}
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-500">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-wrap">
              <div className="w-1/2 pr-2">
                <label
                  htmlFor="fullName"
                  className="block text-gray-500 text-sm mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-200"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={handleChange}
                />
                {registerError && (
                  <span className="text-sm text-red-500">
                    {registerError.fullName}
                  </span>
                )}
              </div>
              <div className="w-1/2 pl-2">
                <label
                  htmlFor="mobileNo"
                  className="block text-gray-500 text-sm mb-2"
                >
                  Mobile No
                </label>
                <input
                  type="text"
                  id="mobile_No"
                  name="mobile_No"
                  className="w-full border rounded-md py-2 px-3 focus:outline-none  focus:border-blue-300"
                  placeholder="123-456-7890"
                  value={mobile_No}
                  onChange={handleChange}
                />
                {registerError && (
                  <span className="text-sm text-red-500">
                    {registerError.mobile_No}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-500 text-sm mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                className="w-full border rounded-md py-2 px-3 focus:outline-none  focus:border-blue-300"
                placeholder="you@example.com"
                value={email}
                onChange={handleChange}
              />
              {registerError && (
                <span className="text-sm text-red-500">
                  {registerError.email}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-500 text-sm mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border rounded-md py-2 px-3 focus:outline-none  focus:border-blue-300"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
              {registerError && (
                <span className="text-sm text-red-500">
                  {registerError.password}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-500 text-sm mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full border rounded-md py-2 px-3 focus:outline-none  focus:border-blue-300"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
              />
              {registerError && (
                <span className="text-sm text-red-500">
                  {registerError.confirmPassword}
                </span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-200"
                disabled={loading} // Disable the button when loading is true
              >
                {loading ? (
                  <div className="flex items-center space-x-1">
                    <span>Loading</span>
                    <div className="w-4 h-4 border-t-2 border-blue-200 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
            <div className="mt-2">
              <span className="text-gray-500 text-sm ">
                Already have an Account?{" "}
                <Link className="text-blue-500" to="/account">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
