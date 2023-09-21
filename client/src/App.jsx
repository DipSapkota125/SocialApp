import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Home from "./components/pages/home/Home";
import Header from "./components/header/Header";
import PageNotFound from "./components/pages/pageNotFound/PageNotFound";
import Login from "./components/pages/user/login/Login";
import Register from "./components/pages/user/register/Register";
import Profile from "./components/pages/user/profile/Profile";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/layout/route/privateRoute/PrivateRoute";
import ChangePassword from "./components/pages/user/changePassword/ChangePassword";
import ForgotPassword from "./components/pages/user/forgotPassword/ForgotPassword";
import ResetPassword from "./components/pages/user/resetPassword/ResetPassword";
import Account from "./components/pages/home/post/ownPost/Account";
import AddPost from "./components/pages/home/post/addPost/AddPost";
import UserProfile from "./components/pages/user/userProfile/UserProfile";
import Search from "./components/pages/search/Search";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        {isAuthenticated && <Header />}
        <ToastContainer position="bottom-right" />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/account" element={<Login />} />
          <Route
            path="/account/post-information"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route
            path="/account/change/password"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ChangePassword />
              </PrivateRoute>
            }
          />

          <Route
            path="/account/information"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/add/social-post"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AddPost />
              </PrivateRoute>
            }
          />

          <Route
            path="/user/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/account/forgot/password" element={<ForgotPassword />} />
          <Route
            path="/account/password/reset/:token"
            element={<ResetPassword />}
          />

          <Route
            path="/search"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Search />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
