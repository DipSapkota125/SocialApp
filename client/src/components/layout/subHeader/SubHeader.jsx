import React from "react";
import { FcHome, FcNext } from "react-icons/fc";
import { Link, useLocation } from "react-router-dom";

const SubHeader = () => {
  const location = useLocation();
  const routeName = location.pathname.substring(1);

  return (
    <>
      <div className="bg-gra-50 p-2 px-12">
        <div className="flex items-center">
          <Link to="/">
            <FcHome className="p-1 w-8 h-8" />
          </Link>
          <FcNext className="mr-1 p-1 w-6 h-6" />
          <span className="text-gray-500">{routeName}</span>
        </div>
      </div>
    </>
  );
};

export default SubHeader;
