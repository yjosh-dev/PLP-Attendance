import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Present: { bg: "bg-green-100", text: "text-green-700", dot: "#22c55e" },
  Absent: { bg: "bg-red-100", text: "text-red-600", dot: "#ef4444" },
  Excused: { bg: "bg-amber-100", text: "text-amber-700", dot: "#f59e0b" },
  "Early-out": { bg: "bg-blue-100", text: "text-blue-700", dot: "#3b82f6" },
  Pending: { bg: "bg-gray-100", text: "text-gray-500", dot: "#9ca3af" },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-2 border border-gray-200 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.stroke }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

function KpiCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
    </div>
  );
}

function SortIcon({ active, dir }) {
  if (!active) return <span className="text-gray-300 ml-0.5">↕</span>;
  return <span className="text-green-600 ml-0.5">{dir === "asc" ? "↑" : "↓"}</span>;
}

export default function PastCeremonyAnalytics({ eventId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchCeremonyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/analytics/flag-ceremony/${eventId}`
      );
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ceremony data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchCeremonyData();
    }
  }, [eventId]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const getFilteredAndSortedRows = () => {
    if (!data?.attendanceLog) return [];
    let rows = [...data.attendanceLog];
    if (filterDept !== "All") rows = rows.filter((r) => r.department === filterDept);
    if (filterStatus !== "All") rows = rows.filter((r) => r.status === filterStatus);
    rows.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return rows;
  };

  const departments = data?.attendanceLog
    ? ["All", ...new Set(data.attendanceLog.map((r) => r.department))]
    : ["All"];
  const statuses = ["All", "Present", "Absent", "Excused", "Early-out", "Pending"];
  const tableRows = getFilteredAndSortedRows();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading ceremony data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-red-500 font-medium text-sm">{error}</p>
          <button
            onClick={fetchCeremonyData}
            className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data?.ceremony) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-gray-700">Ceremony not found</p>
          <p className="text-sm text-gray-400">The requested ceremony does not exist.</p>
        </div>
      </div>
    );
  }

  const { ceremony, kpis, timelineSlots, statusMix, attendanceLog } = data;

  const statusBadge = {
    Pending: "bg-amber-100 text-amber-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-600",
  }[ceremony.status] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-3">
        {/* ── Header with ceremony info ── */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-gray-800">{ceremony.date}</h2>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock size={12} />
                  <span>{ceremony.start} – {ceremony.end}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}>
                  {ceremony.status}
                </span>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to Events
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Total Employees</p>
              <p className="text-lg font-bold text-gray-700">{kpis.total}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Attendance Rate</p>
              <p className="text-lg font-bold text-green-600">{kpis.attendanceRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Present / Absent</p>
              <p className="text-sm font-semibold">
                <span className="text-green-600">{kpis.present}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-red-500">{kpis.absent}</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Excused / Early-out</p>
              <p className="text-sm font-semibold">
                <span className="text-amber-600">{kpis.excused}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-blue-500">{kpis.earlyOut}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Arrival timeline */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Arrival Timeline</h3>
                <p className="text-[10px] text-gray-400">Arrivals per 30-min slot</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={timelineSlots} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#d1d5db" />
                <YAxis tick={{ fontSize: 10 }} stroke="#d1d5db" allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="arrivals" name="Arrivals" fill="#86efac" radius={[3, 3, 0, 0]} maxBarSize={32} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#16a34a" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Status breakdown */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={160}>
              <RePieChart>
                <Pie
                  data={statusMix.filter((s) => s.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusMix
                    .filter((s) => s.value > 0)
                    .map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {statusMix
                .filter((s) => s.value > 0)
                .map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-gray-600">{s.name}</span>
                    <span className="font-semibold text-gray-700">{s.value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ── Attendance Table ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Attendance Log</span>

              {/* Sort buttons */}
              {["name", "timeIn", "department", "status"].map((key) => (
                <button
                  key={key}
                  onClick={() => toggleSort(key)}
                  className={`text-[10px] px-2 py-1 rounded border font-medium transition-colors ${
                    sortKey === key
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
                  }`}
                >
                  {key === "name"
                    ? "Name"
                    : key === "timeIn"
                    ? "Time In"
                    : key === "department"
                    ? "Dept"
                    : "Status"}
                  {sortKey === key && (sortDir === "asc" ? " ↑" : " ↓")}
                </button>
              ))}

              {/* Department filter */}
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="text-[10px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Depts" : d}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-[10px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Status" : s}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[10px] text-gray-400">
              Showing {tableRows.length} of {attendanceLog?.length || 0} records
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold w-8">#</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold">Employee Name</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold">Position</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold">Time In</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold">Time Out</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold">Department</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold">Status</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-semibold">Signature</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {tableRows.map((row, i) => {
                      const sc = STATUS_COLORS[row.status] ?? STATUS_COLORS.Pending;
                      return (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                          <td className="px-3 py-2 font-medium text-gray-800">{row.name}</td>
                          <td className="px-3 py-2 text-gray-500 text-[11px]">{row.position}</td>
                          <td className="px-3 py-2 text-gray-600">{row.timeIn}</td>
                          <td className="px-3 py-2 text-gray-600">{row.timeOut}</td>
                          <td className="px-3 py-2 text-gray-600">{row.department}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="w-20 border-b border-gray-300" />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                  {tableRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center text-gray-400 text-xs">
                        No records match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}