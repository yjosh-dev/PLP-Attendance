import { useState, useEffect, useRef } from "react";
import { Flag, RefreshCw } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function pad(n) {
  const safe = typeof n === "number" && isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  return String(safe).padStart(2, "0");
}

function fmtDate(str) {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function fmtTime(str) {
  if (!str) return "";
  const [h, mi] = str.split(":");
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr || 12}:${mi} ${hr >= 12 ? "PM" : "AM"}`;
}

function CountUnit({ value, label }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 200);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex items-center justify-center bg-white border rounded-2xl shadow-sm transition-all duration-200
          ${flash ? "border-[#32a852]/40 scale-95" : "border-gray-200 scale-100"}`}
        style={{ width: 80, height: 88 }}
      >
        <span className="text-4xl font-bold text-gray-700 tabular-nums select-none">{pad(value)}</span>
      </div>
      <span className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400">{label}</span>
    </div>
  );
}

const Colon = () => (
  <div className="flex flex-col gap-2 pb-7">
    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
  </div>
);

export default function NextScheduleTimer() {
  const [schedule,  setSchedule]  = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [fetching,  setFetching]  = useState(true);
  const [isPast,    setIsPast]    = useState(false);
  const [error,     setError]     = useState(null);
  const intervalRef = useRef(null);

  function startTicker(target) {
    clearInterval(intervalRef.current);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(intervalRef.current);
        setIsPast(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const s = Math.floor(diff / 1000);
      setCountdown({
        days:    Math.floor(s / 86400),
        hours:   Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      });
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
  }

  const fetchNext = async () => {
    clearInterval(intervalRef.current);
    setFetching(true);
    setError(null);
    setIsPast(false);
    try {
      const token = localStorage.getItem("auth_token");
      const res   = await fetch("http://localhost:8000/api/fetch_next_ceremony", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch");

      if (json.data) {
        setSchedule(json.data);
        if (json.data.countdown?.is_past) {
          setIsPast(true);
        } else {
          const target = new Date(`${json.data.flag_ceremony_date}T${json.data.flag_ceremony_start}`);
          startTicker(target);
        }
      } else {
        setSchedule(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNext();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3 gap-2.5">

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
        
          <div>
            <h1 className="text-sm font-bold text-gray-700 leading-none">Monitoring Unavailable</h1>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none">Please wait until the start of event</p>
          </div>
        </div>
        <button
          onClick={fetchNext}
          disabled={fetching}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={11} className={fetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.3,
          }}
        />

        {/* Loading */}
        {fetching && (
          <div className="flex flex-col items-center gap-3 relative">
            <div className="w-10 h-10 rounded-full border-2 border-gray-100 border-t-[#32a852] animate-spin" />
            <p className="text-[11px] text-gray-400">Fetching schedule…</p>
          </div>
        )}

        {/* Error */}
        {!fetching && error && (
          <div className="flex flex-col items-center gap-2 relative text-center px-6">
            <p className="text-sm font-semibold text-gray-500">Could not load schedule</p>
            <p className="text-[11px] text-gray-400">{error}</p>
            <button
              onClick={fetchNext}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#32a852] text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        )}

        {/* No schedule */}
        {!fetching && !error && !schedule && (
          <div className="flex flex-col items-center gap-3 relative">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Flag size={20} className="text-gray-200" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500">No upcoming ceremony</p>
              <p className="text-[11px] text-gray-400 mt-1">There are no pending ceremonies scheduled.</p>
            </div>
          </div>
        )}

        {/* Ongoing */}
        {!fetching && !error && schedule && isPast && (
          <div className="flex flex-col items-center gap-3 relative">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
              <Flag size={20} className="text-[#32a852]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700">Ceremony is now ongoing</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {fmtDate(schedule.flag_ceremony_date)} · {fmtTime(schedule.flag_ceremony_start)} – {fmtTime(schedule.flag_ceremony_end)}
              </p>
            </div>
          </div>
        )}

        {/* Live countdown */}
        {!fetching && !error && schedule && !isPast && (
          <div className="flex flex-col items-center gap-6 relative">
            {/* Badge + date */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#32a852] animate-pulse" />
                <span className="text-[10px] font-semibold text-gray-500 tracking-wide">Upcoming Ceremony</span>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{fmtDate(schedule.flag_ceremony_date)}</p>
              <p className="text-[11px] text-gray-400">
                {fmtTime(schedule.flag_ceremony_start)}&nbsp;–&nbsp;{fmtTime(schedule.flag_ceremony_end)}
              </p>
            </div>

            {/* Countdown units */}
            <div className="flex items-center gap-2.5">
              <CountUnit value={countdown.days}    label="Days"    />
              <Colon />
              <CountUnit value={countdown.hours}   label="Hours"   />
              <Colon />
              <CountUnit value={countdown.minutes} label="Minutes" />
              <Colon />
              <CountUnit value={countdown.seconds} label="Seconds" />
            </div>

            <p className="text-[10px] text-gray-400 text-center max-w-[260px] leading-relaxed">
              Attendance will be recorded during this ceremony.<br />
              Please be present before the start time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}