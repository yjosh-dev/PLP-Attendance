import { useState, useRef, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:8000/storage/";
const API_URL = "http://localhost:8000/api/attendance";

// ─── QR Placeholder ────────────────────────────────────────────────────────────
function QRPlaceholder() {
  return (
    <svg width="44" height="44" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="6" fill="#fffbea" />
      <rect x="4" y="4" width="18" height="18" rx="3" fill="#2d6a4f" />
      <rect x="7" y="7" width="12" height="12" rx="1.5" fill="#fffbea" />
      <rect x="9.5" y="9.5" width="7" height="7" rx="1" fill="#2d6a4f" />
      <rect x="34" y="4" width="18" height="18" rx="3" fill="#2d6a4f" />
      <rect x="37" y="7" width="12" height="12" rx="1.5" fill="#fffbea" />
      <rect x="39.5" y="9.5" width="7" height="7" rx="1" fill="#2d6a4f" />
      <rect x="4" y="34" width="18" height="18" rx="3" fill="#2d6a4f" />
      <rect x="7" y="37" width="12" height="12" rx="1.5" fill="#fffbea" />
      <rect x="9.5" y="39.5" width="7" height="7" rx="1" fill="#2d6a4f" />
      <rect x="34" y="34" width="5" height="5" rx="1" fill="#e9c46a" />
      <rect x="41" y="34" width="5" height="5" rx="1" fill="#2d6a4f" />
      <rect x="47" y="34" width="5" height="5" rx="1" fill="#2d6a4f" />
      <rect x="34" y="41" width="5" height="5" rx="1" fill="#2d6a4f" />
      <rect x="47" y="41" width="5" height="5" rx="1" fill="#e9c46a" />
      <rect x="41" y="47" width="5" height="5" rx="1" fill="#2d6a4f" />
      <rect x="47" y="47" width="5" height="5" rx="1" fill="#2d6a4f" />
      <rect x="34" y="47" width="5" height="5" rx="1" fill="#e9c46a" />
    </svg>
  );
}

// ─── Employee ID Card ──────────────────────────────────────────────────────────
function EmployeeIDCard({ employee, row }) {
  const {
    employee_id, account_email, first_name, middle_name,
    last_name, profile_image, department, position, phone_number,
  } = employee;

  const fullName = [first_name, last_name].filter(Boolean).join(" ");
  const initials = [first_name?.[0], last_name?.[0]].filter(Boolean).join("").toUpperCase();
  const avatarSrc = profile_image ? `${BASE_URL}${profile_image}` : null;
  const empId = String(employee_id);

  const isTimeIn = !!row?.time_in;
  const timeValue = row?.time_in ?? row?.time_out ?? null;
  const actionLabel = isTimeIn ? "Time In" : "Time Out";
  const actionColor = isTimeIn ? "#2d6a4f" : "#e07b39";
  const actionBg = isTimeIn ? "#d8f3dc" : "#fff3e0";
  const actionBorder = isTimeIn ? "#52b788" : "#f4a261";

  return (
    <div style={{ position: "relative", width: "100%", height: 160, userSelect: "none" }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden",
        boxShadow: "0 6px 24px rgba(45,106,79,0.18), 0 2px 8px rgba(0,0,0,0.07)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "#fff" }} />

        {/* Left sidebar */}
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0, width: 68,
          background: "linear-gradient(160deg,#2d6a4f 0%,#40916c 60%,#52b788 100%)",
        }}>
          <div style={{ position: "absolute", bottom: -14, left: -20, width: 100, height: 44, background: "#e9c46a", transform: "rotate(-15deg)", opacity: 0.22 }} />
          <div style={{ position: "absolute", top: -6, right: -14, width: 64, height: 30, background: "#f4d58d", transform: "rotate(-15deg)", opacity: 0.15 }} />
          <div style={{ position: "absolute", top: 10, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>GO</span>
            <div style={{ width: 16, height: 2, background: "#e9c46a", borderRadius: 2, marginTop: 2 }} />
          </div>
          <div style={{
            position: "absolute", top: 38, left: "50%", transform: "translateX(-50%)",
            width: 46, height: 46, borderRadius: 9, overflow: "hidden",
            border: "2px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt={fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#e9c46a,#f4d58d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2d6a4f" }}>{initials}</span>
              </div>
            )}
          </div>
          <div style={{ position: "absolute", bottom: 7, left: 4, right: 4, background: "rgba(255,255,255,0.12)", borderRadius: 6, padding: "2px 4px", textAlign: "center" }}>
            <p style={{ fontSize: 6, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d8f3dc", margin: 0 }}>ID No.</p>
            <p style={{ fontSize: 7.5, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", margin: "1px 0 0" }}>{empId.replace(/(\d{4})(?=\d)/g, "$1 ")}</p>
          </div>
        </div>

        {/* Right content */}
        <div style={{ position: "absolute", top: 0, left: 68, right: 0, bottom: 0 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 34, background: "linear-gradient(90deg,#e9c46a,#f4d58d 60%,#fffbea 100%)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(45,106,79,0.15) 1px,transparent 1px)", backgroundSize: "10px 10px" }} />
            <div style={{ position: "absolute", inset: 0, padding: "5px 10px 0" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#2d6a4f", margin: 0, lineHeight: 1 }}>GovOrg</p>
              <p style={{ fontSize: 5.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "#40916c", margin: "2px 0 0" }}>Official Employee ID</p>
            </div>
          </div>
          <div style={{ position: "absolute", top: 34, left: 0, right: 0, height: 2, background: "#2d6a4f" }} />
          <div style={{ position: "absolute", top: 40, left: 10, right: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#2d3748", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>{fullName}</p>
            {middle_name && <p style={{ fontSize: 7, color: "#9a9bb4", letterSpacing: "0.07em", margin: "2px 0 0" }}>{middle_name}</p>}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 4, background: "#d8f3dc", border: "1px solid #52b788", borderRadius: 20, padding: "2px 6px" }}>
              <div style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: "#2d6a4f" }} />
              <span style={{ fontSize: 6.5, fontWeight: 700, color: "#2d6a4f", letterSpacing: "0.06em" }}>{position}</span>
            </div>
            <p style={{ fontSize: 7, color: "#9a9bb4", margin: "2px 0 0" }}>{department}</p>
          </div>
          <div style={{ position: "absolute", top: 38, right: 6 }}><QRPlaceholder /></div>
          <div style={{ position: "absolute", bottom: 36, left: 10, right: 10, height: 1, background: "linear-gradient(90deg,#e9c46a,#d8f3dc,#f0f0f5)" }} />
          <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 6px" }}>
            {[
              { label: "Phone", value: phone_number },
              { label: "Email", value: account_email?.length > 16 ? account_email.slice(0, 14) + "…" : account_email },
              { label: "Dept", value: department },
            ].map(({ label, value }) => (
              <div key={label}>
                <span style={{ fontSize: 6, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "#9a9bb4" }}>{label}</span>
                <p style={{ fontSize: 8, fontWeight: 600, color: "#3a3d55", lineHeight: 1.3, margin: "1px 0 0" }}>{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action badge */}
      <div style={{
        position: "absolute", top: -10, right: -8,
        display: "flex", alignItems: "center", gap: 4,
        background: actionBg, border: `1.5px solid ${actionBorder}`,
        borderRadius: 20, padding: "3px 9px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: actionColor }} />
        <span style={{ fontSize: 8, fontWeight: 700, color: actionColor, letterSpacing: "0.08em" }}>
          {actionLabel}{timeValue ? ` · ${timeValue}` : ""}
        </span>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AttendanceLogin() {
  const [value, setValue] = useState("");
  const [uiState, setUiState] = useState("idle"); // idle | loading | success | error
  const [employee, setEmployee] = useState(null);
  const [row, setRow] = useState(null);
  const [apiMsg, setApiMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Camera
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [camStatus, setCamStatus] = useState("idle"); // idle | starting | granted | denied
  const [capturedFrame, setCapturedFrame] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const resetRef = useRef(null);

  // ── Focus management: always keep cursor in the input ──────────────────────
  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // Refocus whenever uiState changes (catches the re-enable after reset)
  useEffect(() => { focusInput(); }, [uiState, focusInput]);

  // Intercept blur on the input itself and redirect focus back,
  // unless focus is moving to the camera <select>
  const handleInputBlur = useCallback((e) => {
    const next = e.relatedTarget;
    if (next && (next.tagName === "SELECT" || next.tagName === "OPTION")) return;
    focusInput();
  }, [focusInput]);

  // ── Enumerate cameras ──────────────────────────────────────────────────────
  const enumerateDevices = useCallback(async () => {
    try {
      // Brief permission probe so labels aren't empty strings
      const probe = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      probe.getTracks().forEach((t) => t.stop());
      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      return cams;
    } catch {
      setCamStatus("denied");
      return [];
    }
  }, []);

  // ── Start a specific camera stream ────────────────────────────────────────
  const startCamera = useCallback(async (deviceId) => {
    setCamStatus("starting");
    setCapturedFrame(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    try {
      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamStatus("granted");
    } catch {
      setCamStatus("denied");
    }
    focusInput();
  }, [focusInput]);

  // ── On mount: enumerate then pick a sensible default ──────────────────────
  useEffect(() => {
    (async () => {
      const cams = await enumerateDevices();
      if (cams.length === 0) return;
      // Prefer a physical webcam — skip known virtual cam labels
      const preferred =
        cams.find((c) => !/(iriun|droidcam|epoccam|ivcam|obs|virtual|ndi|snap camera)/i.test(c.label))
        ?? cams[0];
      setSelectedDeviceId(preferred.deviceId);
      await startCamera(preferred.deviceId);
    })();
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Switch camera from dropdown ───────────────────────────────────────────
  const handleDeviceChange = (e) => {
    const id = e.target.value;
    setSelectedDeviceId(id);
    startCamera(id);
    // Return focus to input after picking
    setTimeout(focusInput, 100);
  };

  // ── Capture a frame the moment the API call fires ─────────────────────────
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (camStatus !== "granted" || !video || !video.videoWidth) return null;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    return canvas.toDataURL("image/jpeg", 0.85);
  }, [camStatus]);

  // ── ID input handler ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    clearTimeout(debounceRef.current);
    clearTimeout(resetRef.current);

    if (!val.trim()) {
      setUiState("idle");
      setEmployee(null);
      setRow(null);
      setApiMsg("");
      setCapturedFrame(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setUiState("loading");
      setEmployee(null);
      setRow(null);
      setApiMsg("");

      // Capture exactly when fetch is called
      const frame = captureFrame();
      if (frame) setCapturedFrame(frame);

      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ employee_id: val.trim() }),
        });
        const json = await res.json();
        const ok = json.success === true || json.success === "true";
        if (ok && json.data) {
          setEmployee(json.data);
          setRow(json.row ?? null);
          setApiMsg(json.message ?? "");
          setUiState("success");
        } else {
          setErrMsg(json.message || "Not found.");
          setUiState("error");
        }
      } catch {
        setErrMsg("Connection error. Please try again.");
        setUiState("error");
      }

      // Auto-reset → then refocus
      resetRef.current = setTimeout(() => {
        setValue("");
        setUiState("idle");
        setEmployee(null);
        setRow(null);
        setApiMsg("");
        setErrMsg("");
        setCapturedFrame(null);
        // uiState change will trigger the focusInput effect, but call explicitly too
        focusInput();
      }, 900);
    }, 600);
  };

  useEffect(() => () => {
    clearTimeout(debounceRef.current);
    clearTimeout(resetRef.current);
  }, []);

  const isSuccess = uiState === "success" && employee;
  const isTimeIn = !!row?.time_in;

  // Overlay label shown inside the camera
  const camOverlayLabel =
    uiState === "loading" ? "Scanning…"
    : uiState === "success" ? (apiMsg || "Attendance recorded")
    : uiState === "error"   ? (errMsg || "Not found")
    : null;

  const camOverlayColor =
    uiState === "success" ? "#32a852"
    : uiState === "error"  ? "#ef4444"
    : "#e9c46a";

  return (
    <div style={{
      width: "97%", height: "97%",
      background: "#ECECEC",
      borderRadius: 14,
      display: "flex",
      flexDirection: "column",
      padding: 10,
      gap: 8,
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes att-spin   { to { transform:rotate(360deg); } }
        @keyframes att-pulse  { 0%,100%{transform:scale(1);}50%{transform:scale(1.08);} }
        @keyframes att-fadeup { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);} }
        @keyframes cam-scan   { 0%{top:10px;}50%{top:calc(100% - 14px);}100%{top:10px;} }
        @keyframes cam-flash  { 0%{opacity:.45;}100%{opacity:0;} }
        @keyframes cam-glow   { 0%,100%{opacity:1;}50%{opacity:.4;} }
        .att-input {
          font-size: 22px; font-weight: 700; letter-spacing: .12em;
          color: #1f2937; background: #f9fafb;
          border: 2px solid #e5e7eb; border-radius: 12px;
          padding: 12px 44px 12px 20px;
          text-align: center; width: 100%; box-sizing: border-box;
          transition: border-color .2s, box-shadow .2s, background .2s;
          caret-color: #32a852;
        }
        .att-input:focus {
          outline: none;
          border-color: #32a852;
          box-shadow: 0 0 0 4px rgba(50,168,82,.12);
        }
        .att-input::placeholder { color:#d1d5db; font-weight:400; letter-spacing:.04em; font-size:15px; }
        .att-input.err { background:#fef2f2; border-color:rgba(239,68,68,.5); }
        .att-input.loading { opacity:.55; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <h1 style={{ fontSize:13, fontWeight:700, color:"#374151", margin:0, lineHeight:1 }}>Attendance</h1>
          <p style={{ fontSize:10, color:"#9ca3af", margin:"3px 0 0", lineHeight:1 }}>
            {new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}
          </p>
        </div>

        {/* Camera selector */}
        {devices.length > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <select
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              style={{
                fontSize:10, fontWeight:600, color:"#374151",
                background:"#fff", border:"1px solid #e5e7eb",
                borderRadius:8, padding:"3px 22px 3px 8px",
                cursor:"pointer", appearance:"none",
                backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239ca3af'/%3E%3C/svg%3E")`,
                backgroundRepeat:"no-repeat", backgroundPosition:"right 6px center",
                maxWidth:170,
              }}
            >
              {devices.map((d, i) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
            {camStatus === "granted" && (
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#32a852", animation:"att-pulse 2s ease-in-out infinite" }}/>
                <span style={{ fontSize:8, fontWeight:600, color:"#32a852", letterSpacing:"0.08em" }}>LIVE</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Camera (top, flex-grow) ── */}
      <div style={{
        flex:"1 1 0",
        background:"#111",
        borderRadius:12,
        overflow:"hidden",
        position:"relative",
        minHeight:0,
      }}>
        {/* Live video */}
        <video
          ref={videoRef}
          autoPlay playsInline muted
          style={{
            width:"100%", height:"100%", objectFit:"cover",
            display: camStatus === "granted" && !capturedFrame ? "block" : "none",
            transform:"scaleX(-1)",
          }}
        />

        {/* Frozen snapshot */}
        {capturedFrame && (
          <img
            src={capturedFrame} alt="snapshot"
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transform:"scaleX(-1)" }}
          />
        )}

        {/* No-camera placeholder */}
        {!capturedFrame && camStatus !== "granted" && (
          <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
            {camStatus === "starting" ? (
              <>
                <svg width="28" height="28" viewBox="0 0 80 80" fill="none" style={{ animation:"att-spin 1s linear infinite" }}>
                  <circle cx="40" cy="40" r="34" stroke="#333" strokeWidth="3"/>
                  <circle cx="40" cy="40" r="34" stroke="#32a852" strokeWidth="3" strokeLinecap="round" strokeDasharray="60 155"/>
                </svg>
                <p style={{ fontSize:10, color:"#555", margin:0 }}>Starting camera…</p>
              </>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <p style={{ fontSize:10, color:"#555", margin:0 }}>
                  {camStatus === "denied" ? "Camera blocked — check browser permissions" : "No camera"}
                </p>
              </>
            )}
          </div>
        )}

        {/* Corner guides */}
        {["tl","tr","bl","br"].map((p) => (
          <div key={p} style={{
            position:"absolute", width:22, height:22, pointerEvents:"none",
            ...(p==="tl"?{top:10,left:10,borderTop:"2.5px solid #32a852",borderLeft:"2.5px solid #32a852",borderTopLeftRadius:5}:{}),
            ...(p==="tr"?{top:10,right:10,borderTop:"2.5px solid #32a852",borderRight:"2.5px solid #32a852",borderTopRightRadius:5}:{}),
            ...(p==="bl"?{bottom:10,left:10,borderBottom:"2.5px solid #32a852",borderLeft:"2.5px solid #32a852",borderBottomLeftRadius:5}:{}),
            ...(p==="br"?{bottom:10,right:10,borderBottom:"2.5px solid #32a852",borderRight:"2.5px solid #32a852",borderBottomRightRadius:5}:{}),
          }}/>
        ))}

        {/* Scan-line animation */}
        {uiState === "loading" && (
          <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
            <div style={{
              position:"absolute", left:12, right:12, height:2,
              background:"linear-gradient(90deg,transparent,#32a852,transparent)",
              boxShadow:"0 0 10px #32a852",
              animation:"cam-scan 1.1s ease-in-out infinite",
            }}/>
            <div style={{
              position:"absolute", inset:0,
              background:"rgba(50,168,82,0.07)",
              animation:"cam-flash 0.4s ease-out forwards",
            }}/>
          </div>
        )}

        {/* Success/error border glow */}
        {(uiState === "success" || uiState === "error") && (
          <div style={{
            position:"absolute", inset:0, borderRadius:12, pointerEvents:"none",
            border:`2.5px solid ${uiState === "success" ? "#32a852" : "#ef4444"}`,
            animation:"cam-glow 0.8s ease-in-out 2",
          }}/>
        )}

        {/* Status pill */}
        {camOverlayLabel && (
          <div style={{
            position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)",
            background:"rgba(0,0,0,0.62)", backdropFilter:"blur(6px)",
            borderRadius:20, padding:"4px 14px",
            display:"flex", alignItems:"center", gap:6,
            animation:"att-fadeup 0.25s ease",
            whiteSpace:"nowrap",
          }}>
            <div style={{
              width:6, height:6, borderRadius:"50%", background:camOverlayColor,
              animation: uiState === "loading" ? "att-pulse 0.8s infinite" : "none",
            }}/>
            <span style={{ fontSize:10, fontWeight:700, color:"#fff", letterSpacing:"0.06em" }}>{camOverlayLabel}</span>
          </div>
        )}

        {/* Snapshot timestamp */}
        {capturedFrame && (
          <div style={{
            position:"absolute", top:10, right:10,
            background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)",
            borderRadius:8, padding:"3px 8px",
            animation:"att-fadeup 0.3s ease",
          }}>
            <span style={{ fontSize:8.5, color:"#fff", fontWeight:600 }}>
              📸 {new Date().toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom panel: ID card (success) OR input ── */}
      <div style={{
        flexShrink:0,
        background:"#fff",
        borderRadius:12,
        border:"1px solid #e5e7eb",
        padding: isSuccess ? "14px 14px 10px" : "12px 14px",
        display:"flex",
        flexDirection:"column",
        gap:8,
        boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
      }}>
        {isSuccess ? (
          <div style={{ animation:"att-fadeup 0.3s ease" }}>
            <EmployeeIDCard employee={employee} row={row} />
          </div>
        ) : (
          <>
            {/* Label row */}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span style={{ fontSize:10, fontWeight:600, color:"#6b7280", letterSpacing:"0.05em", textTransform:"uppercase" }}>
                Employee ID
              </span>
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#32a852" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontSize:8, color:"#32a852", fontWeight:600, letterSpacing:"0.06em" }}>CURSOR LOCKED</span>
              </div>
            </div>

            {/* Input — never truly disabled, just readOnly while processing so focus is never lost */}
            <div style={{ position:"relative" }}>
              <input
                ref={inputRef}
                className={`att-input${uiState === "error" ? " err" : ""}${uiState === "loading" ? " loading" : ""}`}
                type="text"
                value={value}
                onChange={handleChange}
                onBlur={handleInputBlur}
                placeholder="Scan or type ID…"
                readOnly={uiState === "loading"}
                autoComplete="off"
              />
              {uiState === "loading" && (
                <div style={{
                  position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                  width:8, height:8, borderRadius:"50%", background:"#32a852",
                  animation:"att-pulse 0.8s ease-in-out infinite",
                }}/>
              )}
              {uiState === "error" && (
                <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <circle cx="12" cy="16" r=".5" fill="#ef4444"/>
                  </svg>
                </div>
              )}
            </div>
            <p style={{ fontSize:10, color: uiState === "error" ? "#ef4444" : "#9ca3af", margin:0, textAlign:"center" }}>
              {uiState === "error"
                ? errMsg || "No record found. Please try again."
                : "Barcode scanner or keyboard · cursor always stays here"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}