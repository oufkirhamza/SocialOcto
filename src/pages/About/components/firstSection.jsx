import "./firstSection.sass";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import logo_github from "../../../assets/img/Animation_githubLogo.json";
import Lottie from "react-lottie";
import logo_glasses from "../../../assets/img/logo glasses.png";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa6";
import { LuGithub } from "react-icons/lu";
import { BiSolidStar } from "react-icons/bi";

export const FirstSectionAbout = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [userName, setUserName] = useState("");
  const secretKey = process.env.REACT_APP_ACCESS_KEY;
  const [data, setData] = useState("");
  const [dataFollowers, setDataFollowers] = useState("");
  const [dataRepos, setDataRepos] = useState("");
  const [reposLanguages, setReposLanguages] = useState("");
  const repos = [...dataRepos];
  const languages = [...reposLanguages];
  const morpho = {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("userName"));
    if (item) {
      setUserName(item);
    }
    const fetchingData = async () => {
      // console.log(JSON.parse(localStorage.getItem("userName")));
      // User
      if (userName) {
        const fetchUser = await axios
          .get(`https://api.github.com/users/${userName}`, {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          })
          .catch((error) => {
            console.log("user : ", error.response);
          });

        // followers
        const fetchFollowers = await axios
          .get(`https://api.github.com/users/${userName}/followers`, {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          })
          .catch((error) => {
            // console.log("followers : ", error);
          });

        // repos
        const fetchRepos = await axios
          .get(`https://api.github.com/users/${userName}/repos`, {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          })
          .catch((error) => {
            // console.log("repos : ", error);
          });
        if (fetchUser && fetchFollowers && fetchRepos) {
          setData(fetchUser.data);

          setDataFollowers(fetchFollowers.data);
          setDataRepos(fetchRepos.data);
          // console.log(dataFollowers, data);
        } else {
          setLoading(false);
        }
      }
    };
    fetchingData();
    // setLoading(false);
  }, [userName]);
  // console.log(dataFollowers);
  useEffect(() => {
    const fetchLanguages = async () => {
      if (repos.length === 0) return;

      try {
        const languagesData = await Promise.all(
          repos.map((repo) =>
            axios.get(
              `https://api.github.com/repos/${userName}/${repo.name}/languages`,
              {
                headers: {
                  Authorization: `Bearer ${secretKey}`,
                },
              }
            )
          )
        );
        const temp = languagesData.map((response) => response.data);
        setReposLanguages(temp);
        setLoading(false);
      } catch (error) {
        // console.log(error);
        if (error.response && error.response.status === 403) {
          console.error(
            "Access forbidden: Check your credentials and permissions."
          );
        } else {
          console.error("An error occurred:", error.message);
        }
      }
    };
    if (repos.length > 0 && reposLanguages.length === 0) {
      fetchLanguages();
    }
  }, [repos, reposLanguages.length, userName]);
  if (reposLanguages) {
    languages.forEach((element) => {
      for (const property in element) {
        if (morpho[property]) {
          morpho[property] += element[property];
        } else {
          morpho[property] = element[property];
        }
        // console.log("this morpho : ", morpho);
      }
    });
  }

  const copa = {
    labels: Object.keys(morpho),
    datasets: [
      {
        data: Object.values(morpho),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(25, 205, 76)",
          "rgb(255, 85, 86)",
          "rgb(255, 205, 86)",
          "rgb(122, 205, 86)",
          "rgb(25, 205, 86)",
          "rgb(255, 25, 6)",
          "rgb(255, 99, 86)",
          "rgb(140, 19, 86)",
        ],
        hoverOffset: 15,
      },
    ],
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: logo_github,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[100vh] min-w-[100%] bg-[#000]">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      ) : (
        <div className="bg-[#0d1117] flex flex-col gap-10 px-5 py-6 text-white">
          {data ? (
            <>
              <div className="flex flex-col items-center py-6">
                <Link
                  to={"/"}
                  className="self-start bg-[#263243] px-3 py-2 rounded-lg text-xl ml-16 "
                >
                  <IoHome />
                </Link>
                <div className="flex flex-col items-center gap-5">
                  <img
                    className="rounded-full lg:w-[12vw] w-[60vw]"
                    src={data.avatar_url}
                    alt=""
                  />
                  <div className="flex flex-col items-center gap-5">
                    <h1 className="text-4xl"> {data.name} </h1>
                    <h1 className="text-lg text-white/75"> @{data.login} </h1>
                    <div className="flex gap-5 text-xl">
                      <div className="flex flex-col items-center">
                        <p>{data.following}</p> <p>Following</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p>{data.followers}</p> <p>Followers</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p>{data.public_repos}</p> <p>Public Repos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex  justify-center flex-wrap lg:flex-row flex-col gap-5">
                {repos.map((element, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-5 bg-gradient-to-tr from-transparent to-[#25344a] border-2 border-slate-200/50 rounded-lg lg:w-[25%] w-full py-4 px-4"
                  >
                    <div className="flex gap-2 text-xl items-center font-medium">
                      <FaBookOpen />
                      <p className="truncate">{element.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <BiSolidStar className="text-yellow-500" />
                      {element.watchers}
                      <p>stars</p>
                    </div>
                    {languages[index] && (
                      <div className="flex flex-wrap gap-3 ">
                        {Object.getOwnPropertyNames(languages[index]).map(
                          (element, index) => (
                            <p
                              key={index}
                              className="bg-gray-500/50 px-3  gap-2 rounded-md"
                            >
                              {element}
                            </p>
                          )
                        )}
                      </div>
                    )}
                    <Link
                      to={element.html_url}
                      target="_blank"
                      className="flex mt-auto justify-center items-center w-full py-2 gap-2 border rounded-md group relative overflow-hidden z-40"
                    >
                      <div class="absolute inset-0 w-0 bg-[#287eff2e] transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                      <LuGithub className="z-50" />
                      <h1 className="z-50">View on Github</h1>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex justify-center lg:w-[40%] mx-auto py-5">
                <Doughnut data={copa} />
              </div>
            </>
          ) : (
            <div className="w-full h-[100vh] flex flex-col items-center justify-center text-4xl text-white">
              <img className="w-[30%]" src={logo_glasses} alt="" />
              <h1>There is no username : {userName}</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};
