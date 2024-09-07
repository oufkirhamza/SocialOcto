import "./firstSection.sass";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/img/icons8-octocat-400.png";

export const FirstSection = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    localStorage.setItem("userName", JSON.stringify(userName));
  }, [userName]);
  
  const search = () => {
    if (userName) {
      // console.log(userName);
      navigate("/about");
    }
  };
  // console.log()
  return (
    <>
      <div className="bg-[#0d1117] flex-col gap-3 min-h-screen flex items-center">
        <img src={logo} alt="logo github" />
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="Enter your name"
          className="p-2 rounded"
        />
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded ml-2"
          onClick={search}
        >
          search
        </button>
      </div>
    </>
  );
};
