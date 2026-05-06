// EmployeeDetailModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import plplogo from "../../../assets/logo/plp.png";
const BASE_URL = "http://localhost:8000/storage/";

// QR Placeholder Component
function QRPlaceholder() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="6" fill="#fffbea" />
      <rect x="4" y="4" width="18" height="18" rx="3" fill="#2d6a4f"/>
      <rect x="7" y="7" width="12" height="12" rx="1.5" fill="#fffbea"/>
      <rect x="9.5" y="9.5" width="7" height="7" rx="1" fill="#2d6a4f"/>
      <rect x="34" y="4" width="18" height="18" rx="3" fill="#2d6a4f"/>
      <rect x="37" y="7" width="12" height="12" rx="1.5" fill="#fffbea"/>
      <rect x="39.5" y="9.5" width="7" height="7" rx="1" fill="#2d6a4f"/>
      <rect x="4" y="34" width="18" height="18" rx="3" fill="#2d6a4f"/>
      <rect x="7" y="37" width="12" height="12" rx="1.5" fill="#fffbea"/>
      <rect x="9.5" y="39.5" width="7" height="7" rx="1" fill="#2d6a4f"/>
      <rect x="34" y="34" width="5" height="5" rx="1" fill="#e9c46a"/>
      <rect x="41" y="34" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="47" y="34" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="34" y="41" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="47" y="41" width="5" height="5" rx="1" fill="#e9c46a"/>
      <rect x="41" y="47" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="47" y="47" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="34" y="47" width="5" height="5" rx="1" fill="#e9c46a"/>
    </svg>
  );
}

// Info Cell Component for ID Card
function InfoCell({ label, value }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <span style={{
        fontSize: 7.5,
        fontFamily: "'Trebuchet MS', sans-serif",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#9a9bb4",
        fontWeight: 700,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 10.5,
        fontFamily: "'Georgia', serif",
        color: "#3a3d55",
        fontWeight: 600,
        lineHeight: 1.3,
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

// Employee ID Card Component
function EmployeeIDCard({ employee }) {
  const {
    employee_id = "",
    account_email = "",
    first_name = "",
    middle_name = "",
    last_name = "",
    profile_image = null,
    department = "",
    position = "",
    phone_number = "",
  } = employee;

  const fullName = [first_name, last_name].filter(Boolean).join(" ");
  const initials = [first_name?.[0], last_name?.[0]].filter(Boolean).join("").toUpperCase();
  const avatarSrc = profile_image ? `${BASE_URL}${profile_image}` : null;
  const empId = String(employee_id);
  const org_name = "PAMANTASAN NG LUNGSOD NG PASIG";
  const org_tagline = "Umaagos ang Pag-asa.";

  return (
    <div className="relative select-none" style={{ width: "100%", height: 220 }}>
      <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ boxShadow: "0 12px 48px rgba(45,106,79,0.18), 0 2px 8px rgba(0,0,0,0.08)" }}>
        
        {/* White base */}
        <div className="absolute inset-0 bg-white" />

        {/* LEFT green sidebar */}
        <div className="absolute top-0 left-0 bottom-0 w-[90px]" style={{ background: "linear-gradient(160deg, #2d6a4f 0%, #40916c 60%, #52b788 100%)" }}>
          
          {/* Diagonal yellow accent slash */}
          <div className="absolute inset-0 overflow-hidden">
            <div style={{
              position: "absolute",
              bottom: -20, left: -30,
              width: 130, height: 60,
              background: "#e9c46a",
              transform: "rotate(-15deg)",
              opacity: 0.22,
            }} />
            <div style={{
              position: "absolute",
              top: -10, right: -20,
              width: 80, height: 40,
              background: "#f4d58d",
              transform: "rotate(-15deg)",
              opacity: 0.15,
            }} />
          </div>

          {/* Org acronym / monogram */}
          <div className="absolute top-4 left-0 right-0 flex flex-col items-center -mt-2">
            <img src={plplogo} class="w-10 h-10"/>
            <div style={{ width: 24, height: 2, background: "#e9c46a", borderRadius: 2, marginTop: 4 }} />
          </div>

          {/* Avatar */}
          <div style={{
            position: "absolute",
            top: 60, left: "50%",
            transform: "translateX(-50%)",
            width: 68, height: 68,
            borderRadius: 14,
            overflow: "hidden",
            border: "3px solid #fff",
            boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
          }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt={fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg, #e9c46a, #f4d58d)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, color: "#2d6a4f" }}>
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Employee ID pill at bottom of sidebar */}
          <div style={{
            position: "absolute",
            bottom: 12, left: 6, right: 6,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "4px 6px",
            textAlign: "center",
          }}>
            <span style={{
              fontFamily: "'Trebuchet MS', sans-serif",
              fontSize: 7,
              letterSpacing: "0.12em",
              color: "#d8f3dc",
              textTransform: "uppercase",
            }}>ID No.</span>
            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.08em",
              marginTop: 1,
            }}>
              {empId.replace(/(\d{4})(?=\d)/g, "$1 ")}
            </p>
          </div>
        </div>

        {/* RIGHT content area */}
        <div className="absolute top-0 right-0 bottom-0" style={{ left: 90 }}>

          {/* Top yellow header strip */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 46,
            background: "linear-gradient(90deg, #e9c46a 0%, #f4d58d 60%, #fffbea 100%)",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(45,106,79,0.15) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: "8px 14px 0" }}>
              <p style={{
                fontFamily: "'Georgia', serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#2d6a4f",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}>
                {org_name}
              </p>
              <p style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: 7.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#40916c",
                marginTop: 1,
              }}>
                {org_tagline}
              </p>
            </div>
          </div>

          {/* Green line separator */}
          <div style={{ position: "absolute", top: 46, left: 0, right: 0, height: 2, background: "#2d6a4f" }} />

          {/* Name block */}
          <div style={{ position: "absolute", top: 56, left: 14, right: 70 }}>
            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: 17,
              fontWeight: 700,
              color: "#2d3748",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}>
              {fullName}
            </p>
            {middle_name && (
              <p style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: 8,
                color: "#9a9bb4",
                letterSpacing: "0.08em",
                marginTop: 2,
              }}>
                {middle_name}
              </p>
            )}
            {/* Position badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              marginTop: 5,
              background: "#d8f3dc",
              border: "1px solid #52b788",
              borderRadius: 20,
              padding: "2px 8px",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2d6a4f" }} />
              <span style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: 8.5,
                fontWeight: 700,
                color: "#2d6a4f",
                letterSpacing: "0.06em",
              }}>
                {position}
              </span>
            </div>
            <p style={{
              fontFamily: "'Trebuchet MS', sans-serif",
              fontSize: 8,
              color: "#9a9bb4",
              letterSpacing: "0.05em",
              marginTop: 3,
            }}>
              {department}
            </p>
          </div>

          {/* QR top-right */}
          <div style={{ position: "absolute", top: 54, right: 10 }}>
            <QRPlaceholder />
          </div>

          {/* Gray divider */}
          <div style={{
            position: "absolute", bottom: 54, left: 14, right: 14,
            height: 1,
            background: "linear-gradient(90deg, #e9c46a, #d8f3dc, #f0f0f5)",
          }} />

          {/* Info row */}
          <div style={{
            position: "absolute", bottom: 12, left: 14, right: 14,
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 8px",
          }}>
            <InfoCell label="Phone" value={phone_number} />
            <InfoCell label="Email" value={account_email.length > 18 ? account_email.slice(0, 16) + "…" : account_email} />
            <InfoCell label="Dept." value={department} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Button Component
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
      active 
        ? "text-emerald-700" 
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
        transition={{ duration: 0.2 }}
      />
    )}
  </button>
);

// Attendance Score Card
const AttendanceScoreCard = ({ score, grade, totalDays }) => (
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-emerald-700 font-medium mb-1">Attendance Score</p>
        <p className="text-3xl font-bold text-emerald-800">{score}%</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-emerald-700 font-medium mb-1">Grade</p>
        <p className="text-2xl font-bold text-emerald-800">{grade}</p>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-emerald-200">
      <p className="text-xs text-emerald-600">Total working days: {totalDays}</p>
    </div>
  </div>
);

// Attendance History Table
const AttendanceHistoryTable = ({ records }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">#</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Date</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Time In</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Time Out</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
         </tr>
      </thead>
      <tbody>
        {records.map((record, idx) => (
          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-3 px-4 text-xs text-gray-600">{idx + 1}</td>
            <td className="py-3 px-4 text-xs text-gray-700">{record.date}</td>
            <td className="py-3 px-4 text-xs text-gray-700">{record.timeIn}</td>
            <td className="py-3 px-4 text-xs text-gray-700">{record.timeOut}</td>
            <td className="py-3 px-4">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                record.status === "Present" ? "bg-green-100 text-green-700" :
                record.status === "Late" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {record.status}
              </span>
            </td>
           </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Session Table
const SessionTable = ({ sessions }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Date</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Login Time</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Logout Time</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Duration</th>
         </tr>
      </thead>
      <tbody>
        {sessions.map((session, idx) => (
          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-3 px-4 text-xs text-gray-700">{session.date}</td>
            <td className="py-3 px-4 text-xs text-gray-700">{session.loginTime}</td>
            <td className="py-3 px-4 text-xs text-gray-700">{session.logoutTime}</td>
            <td className="py-3 px-4 text-xs text-gray-700">{session.duration}</td>
           </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Main Modal Component
export default function EmployeeDetailModal({ employee, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("attendance");

  // Mock data for attendance
  const attendanceData = {
    score: 94,
    grade: "A",
    totalDays: 22,
    history: [
      { date: "2024-01-15", timeIn: "08:15 AM", timeOut: "05:30 PM", status: "Present" },
      { date: "2024-01-16", timeIn: "08:45 AM", timeOut: "05:30 PM", status: "Late" },
      { date: "2024-01-17", timeIn: "08:20 AM", timeOut: "05:30 PM", status: "Present" },
      { date: "2024-01-18", timeIn: "09:00 AM", timeOut: "05:30 PM", status: "Late" },
      { date: "2024-01-19", timeIn: "08:10 AM", timeOut: "05:30 PM", status: "Present" },
      { date: "2024-01-20", timeIn: "08:30 AM", timeOut: "05:30 PM", status: "Present" },
      { date: "2024-01-21", timeIn: "—", timeOut: "—", status: "Absent" },
      { date: "2024-01-22", timeIn: "08:25 AM", timeOut: "05:30 PM", status: "Present" },
    ]
  };

  // Mock data for sessions
  const sessionData = [
    { date: "2024-01-15", loginTime: "08:15 AM", logoutTime: "05:30 PM", duration: "8h 15m" },
    { date: "2024-01-16", loginTime: "08:45 AM", logoutTime: "05:30 PM", duration: "7h 45m" },
    { date: "2024-01-17", loginTime: "08:20 AM", logoutTime: "05:30 PM", duration: "8h 10m" },
    { date: "2024-01-18", loginTime: "09:00 AM", logoutTime: "05:30 PM", duration: "7h 30m" },
    { date: "2024-01-19", loginTime: "08:10 AM", logoutTime: "05:30 PM", duration: "8h 20m" },
    { date: "2024-01-20", loginTime: "08:30 AM", logoutTime: "05:30 PM", duration: "8h 00m" },
  ];

  if (!employee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[900px] max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-white/90 hover:bg-white transition-colors text-gray-500 hover:text-gray-700 shadow-sm"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* ID Card Section */}
              <div className="p-6 pb-4 bg-gradient-to-b from-gray-50 to-white">
                <EmployeeIDCard employee={employee} />
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 px-6 bg-white">
                <TabButton active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")}>
                  Attendance Record
                </TabButton>
                <TabButton active={activeTab === "sessions"} onClick={() => setActiveTab("sessions")}>
                  Session History
                </TabButton>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "attendance" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <AttendanceScoreCard 
                      score={attendanceData.score}
                      grade={attendanceData.grade}
                      totalDays={attendanceData.totalDays}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-4">Attendance History</h3>
                      <AttendanceHistoryTable records={attendanceData.history} />
                    </div>
                  </motion.div>
                )}

                {activeTab === "sessions" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-gray-800">User Session History</h3>
                    <SessionTable sessions={sessionData} />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}