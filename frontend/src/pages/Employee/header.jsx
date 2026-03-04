import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { Search, Bell, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { EmployeeContext } from "../../context/employeeProvider";
import { NavbarContext } from "../../context/navbarProvider";


export default function Header({onLogout}) {

  const [employeeDetails, setEmployeeDetails] = useContext(EmployeeContext);
  const [navbar, setNavbar] = useContext(NavbarContext);
  const [accountDropDown, setAccountDropDown] = useState(false);
  
  return (
    <div
      className="w-[97%] h-[90%] rounded-xl bg-[#ECECEC] m-3 flex items-center px-6 gap-4 shadow-sm"
      style={{ border: "1px solid #e8ede8" }}
    >
      {/* SEARCH */}
      <div
        style={{
          flex: 1,
          maxWidth: 380,
          background: "#f5f7f5",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
        }}
      >
        <Search size={16} color="#aaa" />
        <input
          placeholder="Search for anything"
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: 13,
            color: "#333",
            width: "100%",
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* ICONS */}
      <button
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#f5f7f5",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bell size={17} color="#444" />
      </button>
      <button
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#f5f7f5",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Phone size={17} color="#444" />
      </button>

      {/* USER */}
      <div
        className="cursor-pointer select-none"
        onClick={() => {
          setAccountDropDown((prev) => !prev);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 20px",
          background: "#f5f7f5",
          borderRadius: 24,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2d8c2d, #1a5c1a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ color: "white", fontWeight: 700, fontSize: 12 }}
          ></span>
        </div>
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: 0,
            }}
          >
            {employeeDetails
              ? `Employee ${employeeDetails.last_name}`
              : "Loading..."}
          </p>
          <p style={{ fontSize: 11, color: "#888", margin: 0 }}>
            {employeeDetails ? `${employeeDetails.user_type}` : "Loading..."}
          </p>
          <AnimatePresence>
            {accountDropDown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute w-45 bg-[#f5f7f5] border border-gray-200 mt-6 rounded-2xl -ml-15 shadow-[1px_1px_4px_-2px_rgba(0,0,0,0.50)] overflow-hidden z-50"
              >
                {/* PROFILE HEADER */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {employeeDetails?.first_name} {employeeDetails?.last_name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {employeeDetails?.account_email}
                  </p>
                </div>

                {/* MENU ITEMS */}
                <div className="py-1.5 flex flex-col">
                  {/* Profile */}
                  <button
                    onClick={() => {
                      setNavbar("Profile");
                      setAccountDropDown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 hover:bg-gray-200/60 transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>My Profile</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => {
                      setNavbar("Settings");
                      setAccountDropDown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 hover:bg-gray-200/60 transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Settings</span>
                  </button>

                  {/* DIVIDER */}
                  <div className="border-t border-gray-200 my-1 mx-3" />

                  {/* Logout */}
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-500 hover:bg-gray-200/60 transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
