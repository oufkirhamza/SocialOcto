import "./firstSection.sass";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../utils/contextProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import logo_github from "../../../assets/img/Animation_githubLogo.json";
import Lottie from "react-lottie";

export const FirstSectionAbout = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [userName, setUserName] = useContext(MyContext);
  const secretKey = process.env.REACT_APP_ACCESS_KEY;
  const [data, setData] = useState("");
  const [dataFollowers, setDataFollowers] = useState("");
  const [dataRepos, setDataRepos] = useState("");
  const [reposLanguages, setReposLanguages] = useState("");
  const navigate = useNavigate();
  const repos = [...dataRepos];
  const languages = [...reposLanguages];
  const morpho = {};
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchingData = async () => {
      // User

      const fetchUser = await axios
        .get(`https://api.github.com/users/${userName}`, {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        })
        .catch((error) => {
          console.log("user : ", error);
        });

      // followers
      const fetchFollowers = await axios
        .get(`https://api.github.com/users/${userName}/followers`, {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        })
        .catch((error) => {
          console.log("followers : ", error);
        });

      // repos
      const fetchRepos = await axios
        .get(`https://api.github.com/users/${userName}/repos`, {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        })
        .catch((error) => {
          console.log("repos : ", error);
        });
      setData(fetchUser.data);
      setDataFollowers(fetchFollowers.data);
      setDataRepos(fetchRepos.data);
    };
    fetchingData();
  }, [userName]);
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
        hoverOffset: 4,
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
      {loading && (
        <div className="flex justify-center items-center min-h-[100vh] min-w-[100%] bg-[#000]">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      )}
      <div className="bg-[#0d1117] flex flex-col gap-10 py-6 text-white">
        {data && !loading ? (
          <>
            <div className="flex flex-col items-center py-6">
              <img
                className="rounded-full w-[10vw]"
                src={data.avatar_url}
                alt=""
              />
              <h1 className="text-4xl"> {data.name} </h1>
              <div>
                <h1> Following : {data.following} </h1>
                <h1> Followers : {data.followers} </h1>
              </div>
              <h1> Public Repos : {data.public_repos} </h1>
            </div>
            <div className="flex justify-center flex-wrap gap-5 ml-5">
              {repos.map((element, index) => (
                <div
                  key={index}
                  className="border-2 border-white w-[25%] py-4 px-2"
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={element.html_url}
                  >
                    <p>{element.name}</p>
                    {languages[index] && (
                      <div className="flex gap-3">
                        {Object.getOwnPropertyNames(languages[index]).map(
                          (element, index) => (
                            <p key={index} className="">
                              {element}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </div>
            <div className="flex justify-center w-[50%] mx-auto">
              <Doughnut data={copa} />
            </div>
          </>
        ) : (
          !loading && <h1>There is no user</h1>
        )}
      </div>
    </>
  );
};
