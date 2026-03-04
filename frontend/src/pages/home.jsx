import "./home.css";
import clsx from "clsx";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import img from "../../assets/img/plp.webp";
import plplogo from "../../assets/logo/plp.png";
import whiteArrow from "../../assets/img/arrow-white.svg";
import greenArrow from "../../assets/img/arrow-green.svg";

import { TokenContext } from "../context/tokenProvider";

export default function Home() {

  const [authToken, setAuthToken] = useContext(TokenContext)
  const [isHovered, setIsHovered] = useState(false);
  const [isPasswordFocused, setPassFocus] = useState(false);
  const [isEmailFocused, setEmailFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setSuccess] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const navigate = useNavigate();

  const [accountCredentials, setAccountCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");
    setAccountCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleLogin = async () => {
    if (!accountCredentials.email || !accountCredentials.password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);

    try {
      // API CALL FOR LOGIN ENDPOINT
      const response = await axios.post("http://localhost:8000/api/login", {
        account_email: accountCredentials.email,
        account_password: accountCredentials.password,
      });
      // SET HASHED TOKEN TO LOCALSTORAGE
      localStorage.setItem("auth_token", response.data?.token);
      // SET THE LOADING MODAL
      setSuccess(true);
      // TURN OFF AFTER 3 SECONDS
      setTimeout(() => setSuccess(false), 3000);
      // RESIZE THE SCREEN & NAVIGATE TO DASH
      window.electron.resizeWindow(1200, 790);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message);
      setLoginError(true);
      setIsLoading(false)
      setTimeout(() => setLoginError(false), 3000);
    } 
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center select-none relative"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* GREEN OVERLAY */}
      <div className="absolute inset-0 bg-green-900 opacity-75" />

      {/* LOGIN CARD */}
      <div className="z-50 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl flex flex-col items-center pt-0 pb-10 px-10 mt-10 border-4 border-green-700">
        {/* LOGO */}
        <div className="w-28 h-28 rounded-full bg-white shadow-lg -mt-14 flex justify-center items-center border-4 border-green-700">
          <img src={plplogo} className="w-20 h-20 object-contain" />
        </div>

        {/* HEADER */}
        <div className="flex flex-col items-center mt-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 inter">
            Welcome Back!
          </h1>
          <p className="text-sm text-gray-400 inter mt-1">
            Sign in to your PLP account
          </p>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4 w-full">
          {/* EMAIL */}
          <fieldset
            className={clsx(
              "border-2 w-full h-14 rounded-lg px-2 transition-colors duration-200",
              {
                "border-gray-300 text-gray-400": !isEmailFocused,
                "border-green-700 text-green-700": isEmailFocused,
                "border-red-700 text-red-700": loginError,
              },
            )}
          >
            <legend className="inter text-xs px-1 ml-2 font-medium">
              Email
            </legend>
            <input
              type="email"
              name="email"
              value={accountCredentials.email}
              onChange={handleChange}
              className="focus:outline-none w-full pl-2 text-gray-700 text-sm font-medium bg-transparent"
              placeholder="sample@plp.edu.ph"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
          </fieldset>

          {/* PASSWORD */}
          <fieldset
            className={clsx(
              "border-2 w-full h-14 rounded-lg px-2 transition-colors duration-200 relative",
              {
                "border-gray-300 text-gray-400": !isPasswordFocused,
                "border-green-700 text-green-700": isPasswordFocused,
                "border-red-700 text-red-700": loginError,
              },
            )}
          >
            <legend className="inter text-xs px-1 ml-2 font-medium">
              Password
            </legend>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={accountCredentials.password}
                onChange={handleChange}
                className="focus:outline-none w-full pl-2 text-gray-700 text-sm font-medium bg-transparent"
                placeholder="••••••••••••••"
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-400 hover:text-green-700 transition pr-1 whitespace-nowrap"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </fieldset>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end -mt-2">
            <button className="text-xs text-green-700 hover:underline inter">
              Forgot password?
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-500 text-xs text-center -mt-1 inter">
              {error}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={clsx(
              "w-full h-12 rounded-lg mt-2 flex items-center justify-center gap-2 font-medium transition-all duration-200 border-2",
              {
                "bg-green-700 text-white border-green-700 hover:bg-white hover:text-green-700":
                  !isLoading,
                "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed":
                  isLoading,
              },
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isLoading ? (
              <span className="inter text-sm">Logging in...</span>
            ) : (
              <>
                <span className="inter text-lg">Log in</span>
                <img
                  src={isHovered ? greenArrow : whiteArrow}
                  className="w-5 h-5"
                />
              </>
            )}
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 inter mt-6 text-center">
          © {new Date().getFullYear()} Pamantasan ng Lungsod ng Pasig
        </p>
      </div>

      {isLoading && (
        <div className="w-screen h-screen absolute inset-0 bg-green-800 z-50 flex flex-col items-center justify-center gap-6">
          {/* LOGO */}
          <div className="rounded-full w-36 h-36 bg-white shadow-2xl flex items-center justify-center animate-pulse">
            <img src={plplogo} className="w-28 h-28 object-contain" />
          </div>

          {/* SCHOOL NAME */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-white text-xl font-bold inter tracking-wide">
              Pamantasan ng Lungsod ng Pasig
            </h1>
            <p className="text-green-300 text-sm inter">
              Authenticating your account...
            </p>
          </div>

          {/* SPINNER */}
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
