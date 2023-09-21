import React from "react";
import NotFound from "../../../assets/images/NoFound.png";
import MetaData from "../../layout/metaData/MetaData";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <MetaData title="page not found" />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-gray-500 text-xl">OOP'S PAGE NOT FOUND</h1>

        <img
          src={NotFound}
          alt="Not Found"
          className="w-80 h-80  object-cover"
        />
        <Link to="/">
          <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            Home
          </button>
        </Link>
      </div>
    </>
  );
};

export default PageNotFound;
