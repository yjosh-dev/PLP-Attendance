import { useState, useRef, useEffect } from "react";

const BASE_URL = "http://localhost:8000/storage/";
const API_URL  = "http://localhost:8000/api/attendance";

// ─── QR Placeholder ───────────────────────────────────────────────────────────
function QRPlaceholder() {
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
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

// ─── Inline ID Card (scaled to fit) ───────────────────────────────────────────
function EmployeeIDCard({ employee }) {
  const {
    employee_id, account_email, first_name, middle_name,
    last_name, profile_image, department, position, phone_number,
  } = employee;

  const fullName  = [first_name, last_name].filter(Boolean).join(" ");
  const initials  = [first_name?.[0], last_name?.[0]].filter(Boolean).join("").toUpperCase();
  const avatarSrc = profile_image ? `${BASE_URL}${profile_image}` : null;
  const empId     = String(employee_id);
  const org_name  = "GovOrg";
  const org_tagline = "Official Employee ID";

  return (
    <div className="relative select-none w-full" style={{ height: 190 }}>
      <div className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(45,106,79,0.18), 0 2px 8px rgba(0,0,0,0.07)" }}>

        {/* White base */}
        <div className="absolute inset-0 bg-white" />

        {/* ── LEFT green sidebar ── */}
        <div className="absolute top-0 left-0 bottom-0 w-[80px]"
          style={{ background: "linear-gradient(160deg, #2d6a4f 0%, #40916c 60%, #52b788 100%)" }}>
          <div className="absolute inset-0 overflow-hidden">
            <div style={{ position:"absolute", bottom:-16, left:-24, width:110, height:50, background:"#e9c46a", transform:"rotate(-15deg)", opacity:0.22 }} />
            <div style={{ position:"absolute", top:-8, right:-16, width:70, height:35, background:"#f4d58d", transform:"rotate(-15deg)", opacity:0.15 }} />
          </div>

          {/* Monogram */}
          <div className="absolute top-3 left-0 right-0 flex flex-col items-center">
            <span className="text-white font-bold leading-none" style={{ fontSize:18, letterSpacing:"-0.03em" }}>
              {org_name.slice(0,2).toUpperCase()}
            </span>
            <div style={{ width:20, height:2, background:"#e9c46a", borderRadius:2, marginTop:3 }} />
          </div>

          {/* Avatar */}
          <div style={{
            position:"absolute", top:48, left:"50%", transform:"translateX(-50%)",
            width:56, height:56, borderRadius:12, overflow:"hidden",
            border:"2.5px solid #fff", boxShadow:"0 4px 14px rgba(0,0,0,0.2)",
          }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt={fullName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            ) : (
              <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#e9c46a,#f4d58d)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:20, fontWeight:700, color:"#2d6a4f" }}>{initials}</span>
              </div>
            )}
          </div>

          {/* ID pill */}
          <div style={{ position:"absolute", bottom:10, left:5, right:5, background:"rgba(255,255,255,0.12)", borderRadius:7, padding:"3px 5px", textAlign:"center" }}>
            <p className="text-[7px] tracking-widest uppercase" style={{ color:"#d8f3dc" }}>ID No.</p>
            <p className="font-bold" style={{ fontSize:9, color:"#fff", letterSpacing:"0.08em", marginTop:1 }}>
              {empId.replace(/(\d{4})(?=\d)/g, "$1 ")}
            </p>
          </div>
        </div>

        {/* ── RIGHT content ── */}
        <div className="absolute top-0 right-0 bottom-0" style={{ left:80 }}>

          {/* Yellow header */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:40, background:"linear-gradient(90deg,#e9c46a,#f4d58d 60%,#fffbea 100%)" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(45,106,79,0.15) 1px,transparent 1px)", backgroundSize:"10px 10px" }} />
            <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, padding:"7px 12px 0" }}>
              <p className="font-bold leading-tight" style={{ fontSize:12, color:"#2d6a4f" }}>{org_name}</p>
              <p className="uppercase" style={{ fontSize:6.5, letterSpacing:"0.22em", color:"#40916c", marginTop:1 }}>{org_tagline}</p>
            </div>
          </div>

          {/* Green separator */}
          <div style={{ position:"absolute", top:40, left:0, right:0, height:2, background:"#2d6a4f" }} />

          {/* Name block */}
          <div style={{ position:"absolute", top:48, left:12, right:60 }}>
            <p className="font-bold leading-tight" style={{ fontSize:14, color:"#2d3748", letterSpacing:"-0.02em" }}>{fullName}</p>
            {middle_name && <p className="text-[8px] mt-0.5" style={{ color:"#9a9bb4", letterSpacing:"0.07em" }}>{middle_name}</p>}
            <div style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:4, background:"#d8f3dc", border:"1px solid #52b788", borderRadius:20, padding:"2px 7px" }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:"#2d6a4f" }} />
              <span className="font-bold" style={{ fontSize:7.5, color:"#2d6a4f", letterSpacing:"0.06em" }}>{position}</span>
            </div>
            <p className="text-[7.5px] mt-0.5" style={{ color:"#9a9bb4" }}>{department}</p>
          </div>

          {/* QR */}
          <div style={{ position:"absolute", top:46, right:8 }}>
            <QRPlaceholder />
          </div>

          {/* Gradient divider */}
          <div style={{ position:"absolute", bottom:46, left:12, right:12, height:1, background:"linear-gradient(90deg,#e9c46a,#d8f3dc,#f0f0f5)" }} />

          {/* Info row */}
          <div style={{ position:"absolute", bottom:10, left:12, right:12, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 6px" }}>
            {[
              { label:"Phone", value: phone_number },
              { label:"Email", value: account_email.length > 16 ? account_email.slice(0,14)+"…" : account_email },
              { label:"Dept",  value: department },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-[1px]">
                <span className="uppercase font-bold" style={{ fontSize:6.5, letterSpacing:"0.18em", color:"#9a9bb4" }}>{label}</span>
                <span className="font-semibold" style={{ fontSize:9, color:"#3a3d55", lineHeight:1.3 }}>{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Spinner ring ──────────────────────────────────────────────────────────────
function SpinnerRing({ spinning }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ position:"absolute" }}>
      <circle cx="40" cy="40" r="34" stroke="#d1fae5" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="34" stroke="#32a852" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="60 155"
        style={{ transformOrigin:"40px 40px", animation: spinning ? "att-spin 1.1s linear infinite" : "none" }} />
    </svg>
  );
}

// ─── Center icon ───────────────────────────────────────────────────────────────
function CenterIcon({ state }) {
  const bg = state === "error" ? "#ef4444" : "#32a852";
  return (
    <div className="flex items-center justify-center rounded-full z-10 transition-all duration-300"
      style={{ width:48, height:48, background:bg, boxShadow:"0 4px 16px rgba(50,168,82,0.3)" }}>
      {state === "success" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : state === "error" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <rect x="3"  y="12" width="4" height="9" rx="1"/>
          <rect x="10" y="7"  width="4" height="14" rx="1"/>
          <rect x="17" y="3"  width="4" height="18" rx="1"/>
        </svg>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AttendanceLogin() {
  const [value,    setValue]    = useState("");
  const [uiState,  setUiState]  = useState("idle");
  const [employee, setEmployee] = useState(null);
  const [errMsg,   setErrMsg]   = useState("");
  const debounceRef = useRef(null);
  const resetRef    = useRef(null);

  const title =
    uiState === "loading" ? "Scanning…" :
    uiState === "success" ? `Welcome, ${employee?.first_name}!` :
    uiState === "error"   ? "Not recognized" :
                            "Tap your ID";

  const subtitle =
    uiState === "loading" ? "Looking up your record…" :
    uiState === "success" ? "Attendance logged successfully." :
    uiState === "error"   ? errMsg || "No record found. Please try again." :
                            "Scan or enter your Employee ID below.";

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    clearTimeout(debounceRef.current);
    clearTimeout(resetRef.current);

    if (!val.trim()) {
      setUiState("idle");
      setEmployee(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setUiState("loading");
      setEmployee(null);
      try {
        const token = localStorage.getItem("auth_token");
        const res   = await fetch(`${API_URL}?employee_id=${encodeURIComponent(val.trim())}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success && json.data) {
          setEmployee(json.data);
          setUiState("success");
        } else {
          setErrMsg(json.message || "Not found.");
          setUiState("error");
        }
      } catch {
        setErrMsg("Connection error. Please try again.");
        setUiState("error");
      }

      resetRef.current = setTimeout(() => {
        setValue("");
        setUiState("idle");
        setEmployee(null);
        setErrMsg("");
      }, 2000);
    }, 600);
  };

  useEffect(() => () => {
    clearTimeout(debounceRef.current);
    clearTimeout(resetRef.current);
  }, []);

  const isSuccess = uiState === "success" && employee;

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3 gap-2.5">
      <style>{`
        @keyframes att-spin   { to { transform: rotate(360deg); } }
        @keyframes att-fadeup { from { opacity:0; transform:translateY(10px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes att-pulse  { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        .att-input::placeholder { color: #b0bbb5; }
        .att-input:focus { outline:none; border-color:#32a852; box-shadow:0 0 0 3px rgba(50,168,82,0.12); }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          
          <div>
            <h1 className="text-sm font-bold text-gray-700 leading-none">Attendance</h1>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
              {new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}
            </p>
          </div>
        </div>
        
      </div>

      {/* ── Body ── */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 relative overflow-hidden px-4">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize:"22px 22px", opacity:0.25 }} />

        {/* ── Idle / Loading / Error view ── */}
        {!isSuccess && (
          <>
            <div className="relative flex items-center justify-center"
              style={{ width:80, height:80, animation: uiState === "idle" ? "att-pulse 3s ease-in-out infinite" : "none" }}>
              <SpinnerRing spinning={uiState === "loading"} />
              <CenterIcon state={uiState} />
            </div>

            <div className="flex flex-col items-center gap-1 relative">
              <p className="text-base font-bold text-gray-700 text-center transition-all duration-300">{title}</p>
              <p className={`text-[11px] text-center leading-relaxed max-w-[200px] transition-all duration-300 ${uiState === "error" ? "text-red-400" : "text-gray-400"}`}>
                {subtitle}
              </p>
            </div>

            <div className="relative w-full max-w-[200px]">
              <input
                className="att-input w-full text-center text-sm text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 transition-all duration-200"
                style={{ borderColor: uiState === "error" ? "rgba(239,68,68,0.4)" : uiState === "success" ? "rgba(50,168,82,0.4)" : "" }}
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Employee ID"
                autoFocus
              />
              {uiState === "loading" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#32a852]"
                  style={{ animation:"att-pulse 0.8s ease-in-out infinite" }} />
              )}
            </div>
          </>
        )}

        {/* ── Success: show ID card ── */}
        {isSuccess && (
          <div className="relative w-full flex flex-col items-center gap-3" style={{ animation:"att-fadeup 0.3s ease" }}>
            <EmployeeIDCard employee={employee} />

            {/* Subtle "logged" badge below card */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#32a852" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="text-[10px] font-semibold text-[#32a852]">Attendance recorded</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}