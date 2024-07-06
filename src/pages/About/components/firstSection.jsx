import "./firstSection.sass";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../../utils/contextProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

export const FirstSectionAbout = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [userName, setUserName] = useContext(MyContext);

  const [data, setData] = useState("");
  const [dataFollowers, setDataFollowers] = useState("");
  const [dataRepos, setDataRepos] = useState("");
  const [reposLanguages, setReposLanguages] = useState("");
  const token = "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";
  const navigate = useNavigate();
  const repos = [...dataRepos];
  const languages = [...reposLanguages];
  const morpho = {};

  useEffect(() => {
    const fetchData = async () => {
      [
        [`https://api.github.com/users/${userName}`, setData],
        [
          `https://api.github.com/users/${userName}/followers`,
          setDataFollowers,
        ],
        [`https://api.github.com/users/${userName}/repos`, setDataRepos],
      ].forEach(([link, setValue]) => {
        console.log("this is ", userName);
        axios
          .get(link, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setValue(res.data);
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              console.error(
                "Access forbidden: Check your credentials and permissions."
              );
            } else {
              console.error("An error occurred:", error.message);
            }
          });
      });
    };
    
    fetchData();
  }, [userName]);
  useEffect(()=>{
    const fetchLanguages = async () => {
      if (repos.length > 0) {
        let temp = [];
        for (let index = 0; index < repos.length; index++) {
          const element = repos[index];
          await axios
            .get(
              `https://api.github.com/repos/${userName}/${element.name}/languages`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              temp[index] = response.data;
              setReposLanguages(temp);
              console.log("reposlanguages : ", reposLanguages);
            })
            .catch((error) => {
              if (error.response && error.response.status === 403) {
                console.error(
                  "Access forbidden: Check your credentials and permissions."
                );
              } else {
                console.error("An error occurred:", error.message);
              }
            });
        }
      }
    };
    fetchLanguages();
  }, [userName])
  if (reposLanguages) {
    languages.forEach((element) => {
      for (const property in element) {
        if (morpho[property]) {
          morpho[property] += element[property];
        } else {
          morpho[property] = element[property];
        }
        console.log("this morpho : ", morpho);
      }
    });
  }
  const copa = {
    labels: Object.keys(morpho),
    datasets: [
      {
        // label: 'My First Dataset',
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

  return (
    <div className="bg-[#0d1117] flex flex-col gap-10 py-6 text-white">
      <>
        {data ? (
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
            <div className="flex flex-wrap gap-5 ml-5">
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
                      {Object.getOwnPropertyNames(languages[index]).map((element, index)=>(
                        <p className="">{element}</p>
                      ))}
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h1>There is no user</h1>
        )}
      </>
      <div className="flex justify-center w-[50%] mx-auto">
        <Doughnut data={copa} />
      </div>
    </div>
  );
};
