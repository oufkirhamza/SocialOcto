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
      navigate("/about");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key == "Enter") {
      search();
    }
  };

  return (
    <>
      <div className="bg-[#0d1117] flex-col gap-3 min-h-screen flex items-center">
        <img src={logo} alt="logo github" />
        <input
          onKeyDown={(e) => handleKeyPress(e)}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="Enter your github username"
          className="p-2 rounded w-[30%]"
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
