import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  CalendarDays,
  History,
  Plus,
  X,
  CheckCircle,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function pad(n) {
  return String(n).padStart(2, "0");
}

// Helper function to format time for display
function formatTimeForDisplay(time24) {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

const STATUS_STYLES = {
  pending: {
    badge: "bg-gray-100 border-gray-200 text-gray-500",
    chip: "bg-gray-50 border-gray-200",
    chipText: "text-gray-500",
  },
  cancelled: {
    badge: "bg-gray-100 border-gray-200 text-gray-400",
    chip: "bg-gray-50 border-gray-200",
    chipText: "text-gray-400",
  },
  completed: {
    badge: "bg-green-50 border-green-200 text-green-700",
    chip: "bg-green-50 border-green-200",
    chipText: "text-green-700",
  },
};

function ConfirmModal({ data, onConfirm, onCancel, isEditing, loading }) {
  const s = STATUS_STYLES[data.status];
  const fmtDate = (str) => {
    const [y, m, d] = str.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.10)] flex flex-col items-center px-6 py-7 gap-4">
        <div className="w-14 h-14 flex items-center justify-center border rounded-full bg-green-50 border-green-100">
          <CheckCircle size={26} color="#16a34a" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-base font-semibold text-gray-800">
            {isEditing ? "Update Ceremony?" : "Schedule Ceremony?"}
          </h1>
          <p className="text-sm text-gray-400 leading-snug">
            Review the details before confirming.
          </p>
        </div>
        <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-2">
          {[
            { label: "Date", value: fmtDate(data.flag_ceremony_date) },
            { label: "Start", value: formatTimeForDisplay(data.flag_ceremony_start) },
            { label: "End", value: formatTimeForDisplay(data.flag_ceremony_end) },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="flex items-center justify-between py-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  {label}
                </span>
                <span className="text-[11px] font-semibold text-gray-700">
                  {value}
                </span>
              </div>
              <div className="h-px bg-gray-100" />
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
              Status
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.badge}`}
            >
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex gap-2.5 w-full">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-150 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors duration-150 disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Saving…
              </>
            ) : isEditing ? (
              "Update"
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ data, onConfirm, onCancel, loading }) {
  const fmtDate = (str) => {
    const [y, m, d] = str.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.10)] flex flex-col items-center px-6 py-7 gap-4">
        <div className="w-14 h-14 flex items-center justify-center border rounded-full bg-red-50 border-red-100">
          <Trash2 size={24} color="#dc2626" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-base font-semibold text-gray-800">
            Delete Ceremony?
          </h1>
          <p className="text-sm text-gray-400 leading-snug">
            This action cannot be undone.
          </p>
        </div>
        <div className="w-full bg-red-50 border border-red-100 rounded-xl p-3.5 flex flex-col gap-2">
          {[
            { label: "Date", value: fmtDate(data.flag_ceremony_date) },
            { label: "Start", value: formatTimeForDisplay(data.flag_ceremony_start) },
            { label: "End", value: formatTimeForDisplay(data.flag_ceremony_end) },
          ].map(({ label, value }, idx, arr) => (
            <div key={label}>
              <div className="flex items-center justify-between py-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">
                  {label}
                </span>
                <span className="text-[11px] font-semibold text-red-700">
                  {value}
                </span>
              </div>
              {idx < arr.length - 1 && <div className="h-px bg-red-100" />}
            </div>
          ))}
        </div>
        <div className="w-full flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
          <AlertTriangle
            size={12}
            className="text-amber-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-[10px] text-amber-600 leading-snug">
            Deleting this ceremony will also remove all related attendance
            records.
          </p>
        </div>
        <div className="flex gap-2.5 w-full">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-150 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors duration-150 disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={12} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleCeremony() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [ceremonies, setCeremonies] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    flag_ceremony_start: "07:00",
    flag_ceremony_end: "07:30",
    status: "pending",
  });

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── FETCH ALL SCHEDULES ──────────────────────────────────────────
  const fetchSchedules = useCallback(async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8000/api/fetch_schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setCeremonies(data.data);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // ── NAVIGATION ───────────────────────────────────────────────────
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };
  const goToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const getCeremonyForDate = (d) =>
    ceremonies.find((c) => c.flag_ceremony_date === d);

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    const ex = getCeremonyForDate(dateStr);
    setForm(
      ex
        ? {
            flag_ceremony_start: ex.flag_ceremony_start,
            flag_ceremony_end: ex.flag_ceremony_end,
            status: ex.status,
          }
        : {
            flag_ceremony_start: "07:00",
            flag_ceremony_end: "07:30",
            status: "pending",
          },
    );
    setShowForm(true);
    setShowHistory(false);
  };

  // ── VALIDATE TIMES ──────────────────────────────────────────────
  const validateTimes = () => {
    const start = form.flag_ceremony_start;
    const end = form.flag_ceremony_end;
    
    if (!start || !end) {
      showToast("error", "Please select both start and end times");
      return false;
    }
    
    // Check if end time is after start time
    if (end <= start) {
      showToast("error", "End time must be after start time");
      return false;
    }
    
    return true;
  };

  // ── CREATE / UPDATE ──────────────────────────────────────────────
  const handleConfirmSubmit = async () => {
    if (!validateTimes()) {
      setShowConfirm(false);
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8000/api/create_schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flag_ceremony_date: selectedDate,
          flag_ceremony_start: form.flag_ceremony_start,
          flag_ceremony_end: form.flag_ceremony_end,
          status: form.status,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Request failed");
      
      await fetchSchedules();
      showToast("success", isEditing ? "Ceremony updated successfully" : "Ceremony scheduled successfully");
      setShowConfirm(false);
      setShowForm(false);
      setSelectedDate(null);
    } catch (err) {
      showToast("error", err.message);
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE ───────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    const ceremony = getCeremonyForDate(selectedDate);
    if (!ceremony) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8000/api/delete_schedule", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flag_ceremony_id: ceremony.flag_ceremony_id }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }

      await fetchSchedules();
      showToast("success", "Ceremony deleted successfully");
      setShowDeleteConfirm(false);
      setShowForm(false);
      setSelectedDate(null);
    } catch (err) {
      showToast("error", err.message);
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const fmtDate = (str) => {
    if (!str) return "";
    const [y, m, d] = str.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  const upcomingCeremonies = ceremonies
    .filter((c) => c.flag_ceremony_date >= todayStr)
    .sort((a, b) => a.flag_ceremony_date.localeCompare(b.flag_ceremony_date));
  const pastCeremonies = ceremonies
    .filter((c) => c.flag_ceremony_date < todayStr)
    .sort((a, b) => b.flag_ceremony_date.localeCompare(a.flag_ceremony_date));
  const isEditing = selectedDate ? !!getCeremonyForDate(selectedDate) : false;

  const inputCls =
    "w-full bg-white border border-gray-200 rounded-lg text-[11px] text-gray-600 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#32a852]/30 focus:border-[#32a852] transition-all placeholder-gray-300";
  const labelCls =
    "text-[9px] font-bold tracking-widest uppercase text-gray-400";

  const selectedCeremony = selectedDate
    ? getCeremonyForDate(selectedDate)
    : null;

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3.5 gap-3 overflow-hidden relative">
      {showConfirm && (
        <ConfirmModal
          data={{ ...form, flag_ceremony_date: selectedDate }}
          isEditing={isEditing}
          loading={loading}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}

      {showDeleteConfirm && selectedCeremony && (
        <DeleteModal
          data={selectedCeremony}
          loading={deleteLoading}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {toast && (
        <div
          className={`absolute top-3 right-3 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold shadow-lg
          ${toast.type === "success" ? "bg-[#32a852] text-white" : "bg-red-600 text-white"}`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={12} />
          ) : (
            <X size={12} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="text-md font-bold text-gray-700 leading-none">
              Set Flag Ceremony Schedule
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
              Click any date to schedule a ceremony
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSchedules}
            disabled={fetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-gray-300 transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            <Loader2 size={11} className={fetching ? "animate-spin" : ""} />
            {fetching ? "Loading…" : "Refresh"}
          </button>
          <button
            onClick={goToday}
            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-600 hover:border-gray-300 transition-all duration-150 active:scale-95"
          >
            Today
          </button>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={prevMonth}
              className="px-2 py-1.5 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft size={13} />
            </button>
            <div className="w-px h-4 bg-gray-100" />
            <button
              onClick={nextMonth}
              className="px-2 py-1.5 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600"
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
            <span className="text-[11px] font-bold text-gray-700">
              {MONTHS[currentMonth]}
            </span>
            <span className="text-[11px] text-gray-400">{currentYear}</span>
          </div>
          <button
            onClick={() => {
              setShowHistory((h) => !h);
              setShowForm(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95
              ${showHistory ? "bg-[#32a852] text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}
          >
            <History size={12} />
            History
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Left Panel */}
        <div className="w-[205px] flex-shrink-0 flex flex-col min-h-0">
          {showHistory ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                  History
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              {pastCeremonies.length === 0 ? (
                <p className="text-[10px] text-gray-300 text-center mt-4">
                  No past ceremonies
                </p>
              ) : (
                pastCeremonies.map((c) => {
                  const s = STATUS_STYLES[c.status];
                  return (
                    <div
                      key={c.flag_ceremony_id ?? c.id}
                      className="p-2 bg-gray-50 border border-gray-100 rounded-lg flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-gray-600">
                          {fmtDate(c.flag_ceremony_date)}
                        </span>
                        <span
                          className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${s.badge}`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400">
                        {formatTimeForDisplay(c.flag_ceremony_start)} – {formatTimeForDisplay(c.flag_ceremony_end)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          ) : showForm ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2.5 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                  {isEditing ? "Edit" : "Schedule"}
                </span>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedDate(null);
                  }}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Event Type</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <Flag size={10} className="text-[#32a852] flex-shrink-0" />
                  <span className="text-[11px] text-gray-600">
                    Flag Ceremony
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Date</label>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-[11px] text-gray-600">
                    {fmtDate(selectedDate)}
                  </span>
                  <CalendarDays size={10} className="text-gray-300" />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className={labelCls}>Start Time</label>
                  <input
                    type="time"
                    value={form.flag_ceremony_start}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        flag_ceremony_start: e.target.value,
                      }))
                    }
                    className={inputCls}
                    step="60"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className={labelCls}>End Time</label>
                  <input
                    type="time"
                    value={form.flag_ceremony_end}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        flag_ceremony_end: e.target.value,
                      }))
                    }
                    className={inputCls}
                    step="60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Status</label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    className={`${inputCls} appearance-none pr-6 cursor-pointer`}
                  >
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronLeft
                    size={9}
                    className="absolute right-2 top-1/2 -translate-y-1/2 -rotate-90 text-gray-300 pointer-events-none"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!validateTimes()) return;
                  setShowConfirm(true);
                }}
                className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#32a852" }}
              >
                {isEditing ? "Review & Update" : "Review & Confirm"}
              </button>

              {isEditing && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-1.5 rounded-lg text-[11px] font-medium text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors duration-150 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={10} />
                  Delete Ceremony
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2 flex-1 min-h-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                  Upcoming
                </span>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[9px] font-bold text-[#32a852] bg-green-50 border border-green-100 rounded-full px-1.5 py-0.5">
                  {upcomingCeremonies.length}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto min-h-0">
                {fetching ? (
                  <div className="flex flex-col items-center gap-2 mt-6">
                    <Loader2 size={18} className="text-gray-300 animate-spin" />
                    <p className="text-[10px] text-gray-300">Loading…</p>
                  </div>
                ) : upcomingCeremonies.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 mt-6">
                    <Flag size={20} className="text-gray-200" />
                    <p className="text-[10px] text-gray-300 text-center">
                      No ceremonies.
                      <br />
                      Click a date to add one.
                    </p>
                  </div>
                ) : (
                  upcomingCeremonies.map((c) => {
                    const s = STATUS_STYLES[c.status];
                    return (
                      <button
                        key={c.flag_ceremony_id ?? c.id}
                        onClick={() => handleDayClick(c.flag_ceremony_date)}
                        className="flex flex-col gap-0.5 p-2 bg-gray-50 border border-gray-100 rounded-lg text-left hover:border-gray-300 transition-all duration-150 flex-shrink-0"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-semibold text-gray-600">
                            {fmtDate(c.flag_ceremony_date)}
                          </span>
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${s.badge}`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-400">
                          {formatTimeForDisplay(c.flag_ceremony_start)} – {formatTimeForDisplay(c.flag_ceremony_end)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedDate(null);
                  setShowForm(true);
                  setForm({
                    flag_ceremony_start: "07:00",
                    flag_ceremony_end: "07:30",
                    status: "pending",
                  });
                }}
                className="flex items-center justify-center gap-1 w-full py-1.5 rounded-lg text-[10px] font-semibold text-gray-400 border border-dashed border-gray-200 hover:border-[#32a852]/50 hover:text-[#32a852] transition-all duration-150 flex-shrink-0"
              >
                <Plus size={10} />
                Add Ceremony
              </button>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-0">
          <div className="grid grid-cols-7 border-b border-gray-100 flex-shrink-0">
            {DAYS.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-[10px] font-black tracking-widest uppercase text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          <div
            className="flex-1 grid grid-cols-7 min-h-0"
            style={{ gridTemplateRows: `repeat(${totalCells / 7}, 1fr)` }}
          >
            {fetching ? (
              <div
                className="col-span-7 flex flex-col items-center justify-center gap-2 text-gray-300"
                style={{ gridColumn: "1 / -1", gridRow: "1 / -1" }}
              >
                <Loader2 size={20} className="animate-spin" />
                <span className="text-[11px]">Loading schedules…</span>
              </div>
            ) : (
              Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - firstDay + 1;
                const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                const dateStr = isCurrentMonth
                  ? `${currentYear}-${pad(currentMonth + 1)}-${pad(dayNum)}`
                  : null;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const ceremony = dateStr ? getCeremonyForDate(dateStr) : null;
                const isPast = dateStr && dateStr < todayStr;
                const chip = ceremony ? STATUS_STYLES[ceremony.status] : null;

                return (
                  <div
                    key={i}
                    onClick={() => isCurrentMonth && handleDayClick(dateStr)}
                    className={`border-b border-r border-gray-50 flex flex-col p-1.5 transition-colors duration-100
                      ${isCurrentMonth ? "cursor-pointer hover:bg-gray-50" : "bg-gray-50/40"}
                      ${isSelected ? "bg-green-50/50" : ""}
                      ${isToday && !isSelected ? "bg-gray-50" : ""}
                    `}
                  >
                    {isCurrentMonth && (
                      <>
                        <div
                          className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold mb-1 flex-shrink-0
                          ${isToday ? "bg-[#32a852] text-white" : isSelected ? "bg-gray-700 text-white" : isPast ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {dayNum}
                        </div>
                        {ceremony && (
                          <div
                            className={`rounded px-1.5 py-0.5 flex items-center gap-1 border ${chip.chip}`}
                            style={{ minWidth: 0 }}
                          >
                            <Flag size={7} className={chip.chipText} />
                            <span
                              className={`text-[8px] font-semibold truncate ${chip.chipText}`}
                            >
                              {formatTimeForDisplay(ceremony.flag_ceremony_start)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}