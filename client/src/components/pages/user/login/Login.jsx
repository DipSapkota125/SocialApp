import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearError, login } from "../../../../redux/features/authSlice";
import MetaData from "../../../layout/metaData/MetaData";
import ConnectVerse from "../../../../assets/images/ConnectVerse.png";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState({});

  const validatedForm = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    let newErrors = {};
    if (!email && !mobile_No) {
      newErrors.email = "Email or mobileNo is required!";
    } else if (!emailRegex.test(email) && !/^\d{10}$/.test(mobile_No)) {
      newErrors.email = "Invalid email format or mobileNo!";
    }
    if (!password) {
      newErrors.password = "Password is required!";
    } else if (password.length < 8) {
      newErrors.password = "Password must be 8 characters long!";
    }
    setLoginError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { email, mobile_No, password } = loginValue;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setLoginValue({ ...loginValue, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatedForm()) {
      dispatch(login({ loginValue, toast, navigate }));
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
      <MetaData title="ConnectVerse login" />
      <div className=" font-sans min-h-screen flex flex-col sm:flex-row justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="sm:w-1/2">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="mb-6 text-center">
              <img
                src={ConnectVerse}
                alt="ConnectVerse Logo"
                className="mx-auto w-24"
              />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-500">
              Login to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email and password to login to your account
            </p>
          </div>

          {/* Rest of your login form code */}
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address or Mobile No
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      placeholder="Email or phone number"
                      value={email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-blue-200 sm:text-sm"
                    />
                    {loginError && (
                      <span className="text-red-500 text-sm">
                        {loginError.email}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none  focus:border-blue-200 sm:text-sm"
                    />
                    {loginError && (
                      <span className="text-red-500 text-sm">
                        {loginError.password}
                      </span>
                    )}

                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      to="/account/forgot/password"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot your password?
                    </Link>
                  </div>
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
                      "Login"
                    )}
                  </button>
                </div>
              </form>
              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Create a new account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-[#F5F5F5] font-sans min-h-screen flex flex-col sm:flex-row justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="sm:w-1/2">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-xl font-bold text-gray-500">
              Login to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email and password to login to your account
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address or Mobile No
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      placeholder="Email or phone number"
                      value={email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:border-blue-200 sm:text-sm"
                    />
                    {loginError && (
                      <span className="text-red-500 text-sm">
                        {loginError.email}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none  focus:border-blue-200 sm:text-sm"
                    />
                    {loginError && (
                      <span className="text-red-500 text-sm">
                        {loginError.password}
                      </span>
                    )}

                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      to="/account/forgot/password"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot your password?
                    </Link>
                  </div>
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
                      "Login"
                    )}
                  </button>
                </div>
              </form>
              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Create a new account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Login;
