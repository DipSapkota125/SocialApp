import React, { useState } from "react";
import "./Search.css";
import { useDispatch, useSelector } from "react-redux";
import { allUsers } from "../../../redux/features/authSlice";
import User from "../home/userFriend/User";
import MetaData from "../../layout/metaData/MetaData";

const Search = () => {
  const { users } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    if (fullName) {
      dispatch(allUsers(fullName));
    }
  };
  return (
    <>
      <MetaData title="Search user" />
      <div className="search">
        <form className="searchForm" onSubmit={submitHandler}>
          <span variant="h3" style={{ padding: "2vmax" }}>
            Social Aap
          </span>

          <input
            type="text"
            name="fullName"
            value={fullName}
            placeholder="Name"
            required
            onChange={(e) => setFullName(e.target.value)}
          />

          <button
            className="bg-blue-700 hover:bg-blue-800 border px-4 py-2 text-white rounded-md"
            type="submit"
          >
            Search
          </button>

          <div className="searchResults">
            {users &&
              users.map((user) => (
                <User
                  key={user?._id}
                  userId={user?._id}
                  name={user?.name}
                  avatar={user?.avatar?.url}
                />
              ))}
          </div>
        </form>
      </div>
    </>
  );
};

export default Search;
