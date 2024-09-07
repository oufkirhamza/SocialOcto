import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-[#000] justify-center items-center flex flex-col text-white font-mono">
      <h1 className="text-9xl">404</h1>
      <p className="text-xl">Sorry, we were unable to find that page</p>
      <p className="text-2xl">Back to <span className="underline cursor-pointer" onClick={()=>navigate('/')}>home page</span></p>
    </div>
  );
};

export default Error;
