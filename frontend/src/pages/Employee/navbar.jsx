import { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../context/navbarProvider";

import {
  LayoutDashboard,
  Monitor,
  ClipboardList,
  Users,
  Info,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const navItems = [
  {
    section: "MENU",
    items: [
      { icon: LayoutDashboard, label: "Dashboard" },
      { icon: Monitor, label: "Monitoring" },
      { icon: ClipboardList, label: "Attendance" },
    ],
  },
  { section: "EMPLOYEES", items: [{ icon: Users, label: "Manage" }] },
  {
    section: "GENERAL",
    items: [
      { icon: Info, label: "About" },
    ],
  },
];

export default function Navbar() {
  const [nigga, setNigga] = useState(false);
  const navigate = useNavigate();
  const [navbar, setNavbar] = useContext(NavbarContext);
  const handleClick = (value) => {
    setNavbar(value);
  };


  return (
    <div
      className="w-[93%] h-[96%] rounded-xl bg-[#ECECEC] m-3 flex flex-col pt-6 pb-4 shadow-sm"
      style={{ borderRight: "1px solid #e8ede8" }}
    >
      <div className=""></div>

      {/* NAV ITEMS */}
      <div className="flex flex-col gap-6 flex-1 px-3">
        {navItems.map((group) => (
          <div key={group.section}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#aaa",
                letterSpacing: "0.1em",
                paddingLeft: 10,
                marginBottom: 6,
              }}
            >
              {group.section}
            </p>
            {group.items.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setNavbar(label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: navbar === label ? "#f0f7f0" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderLeft:
                    navbar === label
                      ? "3px solid #2d8c2d"
                      : "3px solid transparent",
                  marginBottom: 2,
                }}
              >
                <Icon size={16} color={navbar === label ? "#2d8c2d" : "#888"} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: navbar === label ? 600 : 400,
                    color: navbar === label ? "#1a5c1a" : "#555",
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
