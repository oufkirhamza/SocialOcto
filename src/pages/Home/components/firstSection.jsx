import "./firstSection.sass";
import { MyContext } from "../../../utils/contextProvider";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const FirstSection = () => {
  const [userName, setUserName] = useContext(MyContext);
  const navigate = useNavigate()
  const search = () => {
    console.log(userName);
    navigate('/about');
    // setUserName("");
  };
  return (
    <>
      <div className="bg-[#0d1117] h-screen flex justify-center items-center">
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="Enter your name"
          className="p-2 rounded"
        />
        <button
          className="bg-blue-700 text-white p-2 rounded ml-2"
          onClick={search}
        >
          search
        </button>
      </div>
    </>
  );
};
