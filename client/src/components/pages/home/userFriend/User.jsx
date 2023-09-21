import React from "react";
import "./User.css";
import { Link } from "react-router-dom";

const User = ({ userId, name, avatar }) => {
  return (
    <>
      <Link to={`/user/${userId}`} className="homeUser">
        <img src={avatar} alt="avatar Img" />
        <span>{name}</span>
      </Link>
    </>
  );
};

export default User;
