import "./home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import img from "../../assets/img/plp.webp";
import plplogo from "../../assets/logo/plp.png";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [accountCredentials, setAccountCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    alert(accountCredentials.email)
    alert(accountCredentials.password)
    axios
      .post("http://localhost:8000/api/login", {
        email: accountCredentials.email,
        password: accountCredentials.password,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div
      className="background-image w-screen h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      {/* GREEN OVERLAY FOR BACKGROUND IMAGE */}
      <div className="w-screen h-screen absolute opacity-70 bg-green-800 flex items-center justify-center "></div>
      {/* LOGIN BOX CONTAINER */}
      <div className="z-50 w-[40%] h-[80%] bg-white rounded-sm flex flex-col items-center mt-10 gap-5">
        {/* WHITE CIRCLE OVERLAY FOR PLP ICON*/}
        <div className="w-28 h-28 rounded-full bg-white -mt-15 flex justify-center items-center">
          <img src={plplogo} className="w-24 h-24" />
        </div>
        <div className="flex flex-col items-center justify-center -mt-2 mb-10">
          <h1 className="mt-3 text-3xl font-bold inter">Welcome!</h1>
          <h1 className="text-md text-gray-500 inter">
            Please enter your PLP account.
          </h1>
        </div>
        <div className="flex flex-col gap-6">
          <input
            type="text"
            className="w-80 h-9 bg-gray-300 rounded-md pl-3 text-black active:outline-green-700"
            placeholder="Email"
            value={accountCredentials.email}
            onChange={(e) =>
              setAccountCredentials((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          ></input>
          <input
            type="text"
            className="w-80 h-9 bg-gray-300 rounded-md pl-3"
            placeholder="Password"
            value={accountCredentials.password}
            onChange={(e) =>
              setAccountCredentials((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          ></input>
          <div className="w-full h-10 flex items-center not-first:-mt-4 justify-around ">
            <div className="flex flex-row items-center gap-2 -ml-4">
              <input type="checkbox" className="w-4 h-4"></input>
              <h1 className="inter text-sm">Show password</h1>
            </div>
            <h1 className="inter text-sm text-green-700 font-medium -mr-3">
              Forgot password?
            </h1>
          </div>
        </div>
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="text-white w-80 h-10 rounded-sm bg-green-700 transition hover:bg-white hover:border-3 hover:border-green-700 hover:text-green-700"
        >
          <h1 className=" font-medium text-xl">Log in</h1>
        </button>
      </div>
    </div>
  );
}
