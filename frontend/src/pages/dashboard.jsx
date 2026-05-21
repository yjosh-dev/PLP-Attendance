import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmployeeContext } from "../context/employeeProvider";
import { TokenContext } from "../context/tokenProvider";
import { NavbarContext } from "../context/navbarProvider";

import Header from "./Employee/header";
import Navbar from "./Employee/navbar";
import plplogo from "../../assets/logo/plp.png";
import LoadingModal from "../components/modals/loadingModal";
import ConfirmationModal from "../components/modals/confirmatioModal";
import EmployeeList from "./Employee/employeeList";
import AddEmployee from "./Employee/addEmployee";
import ScheduleCeremony from "./Employee/ScheduleCeremony";
import NextCeremony from "./Employee/NextCeremony";
import NextScheduleTimer from "./Employee/NextScheduleTimer";
import AttendanceLogin from "./Employee/AttendanceLogin";
import AppealList from "./Employee/AppealList";
import BulkAdd from "./Employee/bulkAdd";
import AnalyticsDashboard from "./Employee/Dashboard";
import AdvancedAnalyticsDashboard from "./Employee/AnalyticsDashboard";
import FlagCeremonyEventsList from "./Employee/FlagCeremonyEventList";

export default function Dashboard() {
  const navigate = useNavigate();

  const [Logout, setLogout] = useState(false);
  const [LoggingOut, setLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenInvalid, setTokenValidity] = useContext(TokenContext);
  const [employeeDetails, setEmployeeDetails] = useContext(EmployeeContext);
  const [navbar, setNavbar] = useContext(NavbarContext);

  useEffect(() => {
    setIsLoading(true)
    // PRELIMINARY CHECKING ON TOKEN
    if (!localStorage.getItem("auth_token")) {
      setTokenValidity(true);
    }

    // CHECK IF CONTEXT IS EMPTY (FIRST TIME LOADING)
    if (!employeeDetails) {
      // RUN FETCH API CALL (SERVES AS TOKEN CHECKING ALSO THRU SANCTUM PROTECTED ROUTE)
      fetchUser(localStorage.getItem("auth_token"));
    } else {
      // SET LOADING TO OFF SINCE ITS ALREADY LOADED ONCE
      setIsLoading(false);
    }
  }, []);


  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/fetch-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeDetails(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setTokenValidity(true);
    }
  };

  const handleLogout = async (token) => {
    setLoggingOut(true)
    try {
      const response = await axios.post("http://localhost:8000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("auth_token")
      setEmployeeDetails(null)
      navigate("/")
      console.log(response)
    } catch (error) {
      setTimeout(() => {
        setLoggingOut(false)
      }, 2000);
      console.log(error.response)
    }
  };

  const render = (navbar) => {
      switch (navbar) {
         case "Dashboard":
            return <AdvancedAnalyticsDashboard />

         case "Add Employee":
            return <AddEmployee />

         case "Manage":
            return <EmployeeList />

         case "Set Schedule":
            return <ScheduleCeremony />
        
         case "Monitoring":
            return <NextCeremony />

         case "Attendance": 
            return <AttendanceLogin />

         case "Appeal":
            return <AppealList />

        case "Bulk Insert":
            return <BulkAdd />
            
        case "Ceremony Records":
            return <FlagCeremonyEventsList />

        default:
            return (
              <div className="w-full h-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/80 p-8 text-center">
                <p className="text-sm font-semibold text-gray-600">No screen for &ldquo;{navbar}&rdquo; yet</p>
                <p className="mt-2 text-xs text-gray-400 max-w-sm">
                  Choose <span className="font-medium text-gray-600">Dashboard</span> under Analytics to open the monthly report, or pick another item that is wired in the app.
                </p>
              </div>
            )
      }
  }

  return (
      <div className="w-screen h-screen flex  ">
        {/* LEFT NAVBAR */}
        <div className="w-[17%] h-full ">
          <Navbar />
        </div>

        <div className="w-[83%] h-full ">
          {/* TOP HEADER */}
          <div className="w-full h-[10%] ">
            <Header onLogout={() => setLogout(true)} />
          </div>
          <div className="w-[97%] h-[85%] ml-3 mt-1 flex justify-center items-center">
             {render(navbar)}
          </div>
        </div>

      {Logout && (
        <div className="absolute w-screen h-screen flex items-center justify-center">
          <ConfirmationModal
            message={"Are you sure you want to log out of this account?"}
            onConfirm={() => handleLogout(localStorage.getItem("auth_token"))}
            onCancel={() => setLogout(false)}
          />
        </div>
      )}

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
              Logging into account...
            </p>
          </div>

          {/* SPINNER */}
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {LoggingOut && (
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
              Logging out..........
            </p>
          </div>

          {/* SPINNER */}
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {isTokenInvalid && (
        <div className="absolute inset-0 w-screen h-screen bg-green-700/60 backdrop-blur-sm z-50 flex items-center justify-center">
          {/* CARD */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 w-[90%] max-w-sm">
            {/* ICON */}
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            {/* TEXT */}
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="text-gray-800 text-lg font-bold">
                Session Expired
              </h2>
              <p className="text-gray-500 text-sm">
                Your session is no longer valid. Please log in again to
                continue.
              </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
