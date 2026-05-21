import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  Printer,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsRight,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Status Colors ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Present: { bg: "bg-green-100", text: "text-green-700", dot: "#22c55e" },
  Absent: { bg: "bg-red-100", text: "text-red-600", dot: "#ef4444" },
  Excused: { bg: "bg-amber-100", text: "text-amber-700", dot: "#f59e0b" },
  "Early-out": { bg: "bg-blue-100", text: "text-blue-700", dot: "#3b82f6" },
  Pending: { bg: "bg-gray-100", text: "text-gray-500", dot: "#9ca3af" },
};

// ── Helper Components ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-600 border-red-200",
  };
  const style = styles[status] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style}`}>
      {status}
    </span>
  );
};

const EventSkeleton = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 bg-gray-200 rounded w-32" />
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-100 rounded w-40" />
      <div className="h-4 bg-gray-100 rounded w-36" />
    </div>
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="h-8 bg-gray-100 rounded-lg w-full" />
    </div>
  </div>
);

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

const KpiCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
    <p className="text-xs text-gray-500 font-medium">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
  </div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronsLeft size={12} />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={12} />
      </button>
      
      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
            currentPage === page
              ? "bg-green-500 text-white"
              : page === "..."
              ? "cursor-default"
              : "border border-gray-200 hover:bg-gray-50"
          }`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronRightIcon size={12} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <ChevronsRight size={12} />
      </button>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function FlagCeremonyHistory() {
  // View state: 'list' or 'analytics'
  const [view, setView] = useState("list");
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Events list state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Print ref
  const printRef = useRef(null);

  // ── Fetch all events ────────────────────────────────────────────────────────
  const fetchEvents = async () => {
    setLoadingEvents(true);
    setEventsError(null);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/analytics/flag-ceremony/events"
      );
      setEvents(response.data.events);
    } catch (err) {
      setEventsError("Failed to load events. Please try again.");
    } finally {
      setLoadingEvents(false);
    }
  };

  // ── Fetch single event analytics ────────────────────────────────────────────
  const fetchAnalytics = async (eventId) => {
    setLoadingAnalytics(true);
    setAnalyticsError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/analytics/flag-ceremony/${eventId}`
      );
      setAnalyticsData(response.data);
      setCurrentPage(1); // Reset pagination when new data loads
    } catch (err) {
      setAnalyticsError(err.response?.data?.message || "Failed to load ceremony data");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAnalytics(selectedEventId);
    }
  }, [selectedEventId]);

  // ── Event list handlers ─────────────────────────────────────────────────────
  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    setView("analytics");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedEventId(null);
    setAnalyticsData(null);
    setCurrentPage(1);
  };

  // ── Table handlers ──────────────────────────────────────────────────────────
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getFilteredAndSortedRows = () => {
    if (!analyticsData?.attendanceLog) return [];
    let rows = [...analyticsData.attendanceLog];
    if (filterDept !== "All") rows = rows.filter((r) => r.department === filterDept);
    if (filterStatus !== "All") rows = rows.filter((r) => r.status === filterStatus);
    rows.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return rows;
  };

  // Get paginated rows
  const getPaginatedRows = () => {
    const allRows = getFilteredAndSortedRows();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return {
      rows: allRows.slice(startIndex, endIndex),
      total: allRows.length,
      totalPages: Math.ceil(allRows.length / rowsPerPage),
    };
  };

  // ── Print functionality ─────────────────────────────────────────────────────
  const handlePrint = () => {
    const ceremony = analyticsData?.ceremony;
    const allRows = getFilteredAndSortedRows();
    const kpis = analyticsData?.kpis;
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Flag Ceremony Attendance Report - ${ceremony?.date || "Report"}</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 40px;
              color: #111;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            h1 {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            .subtitle {
              font-size: 12px;
              color: #666;
              margin: 5px 0;
            }
            .meta-info {
              display: flex;
              justify-content: space-between;
              margin: 20px 0;
              padding: 10px;
              background: #f5f5f5;
              border-radius: 8px;
              font-size: 12px;
              flex-wrap: wrap;
              gap: 10px;
            }
            .stats-grid {
              display: flex;
              justify-content: space-around;
              margin: 20px 0;
              padding: 15px;
              background: #fafafa;
              border-radius: 8px;
              flex-wrap: wrap;
              gap: 15px;
            }
            .stat-item {
              text-align: center;
            }
            .stat-label {
              font-size: 11px;
              color: #666;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 18px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-top: 20px;
            }
            th {
              background: #f0f0f0;
              text-align: left;
              padding: 10px 8px;
              font-weight: 600;
              border-bottom: 2px solid #ddd;
            }
            td {
              padding: 8px;
              border-bottom: 1px solid #eee;
            }
            tr:last-child td {
              border-bottom: none;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
            }
            .status-present { background: #dcfce7; color: #166534; }
            .status-absent { background: #fee2e2; color: #991b1b; }
            .status-excused { background: #fed7aa; color: #92400e; }
            .status-early-out { background: #dbeafe; color: #1e40af; }
            .status-pending { background: #f3f4f6; color: #4b5563; }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 10px;
              color: #999;
              text-align: center;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Flag Ceremony Attendance Report</h1>
            <div class="subtitle">Official Attendance Record</div>
          </div>
          
          <div class="meta-info">
            <div><strong>Date:</strong> ${ceremony?.date || "—"}</div>
            <div><strong>Time:</strong> ${ceremony?.start || "—"} – ${ceremony?.end || "—"}</div>
            <div><strong>Status:</strong> ${ceremony?.status || "—"}</div>
            <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Total Employees</div>
              <div class="stat-value">${kpis?.total || 0}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Attendance Rate</div>
              <div class="stat-value" style="color: #16a34a;">${kpis?.attendanceRate || 0}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Present</div>
              <div class="stat-value" style="color: #16a34a;">${kpis?.present || 0}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Absent</div>
              <div class="stat-value" style="color: #dc2626;">${kpis?.absent || 0}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Excused</div>
              <div class="stat-value" style="color: #d97706;">${kpis?.excused || 0}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Early-out</div>
              <div class="stat-value" style="color: #2563eb;">${kpis?.earlyOut || 0}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              ${allRows.map((row, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${row.name}</td>
                  <td>${row.position}</td>
                  <td>${row.department}</td>
                  <td>${row.timeIn}</td>
                  <td>${row.timeOut}</td>
                  <td>
                    <span class="status-badge status-${row.status.toLowerCase().replace("-", "")}">
                      ${row.status}
                    </span>
                  </td>
                  <td>_________________</td>
                </tr>
              `).join("")}
              ${allRows.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align: center; padding: 40px;">No records found</td>
                </tr>
              ` : ""}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is an electronically generated report. No signature is required.</p>
            <p>Report generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", ...new Set(events.map((e) => e.status))];
  const departments = analyticsData?.attendanceLog
    ? ["All", ...new Set(analyticsData.attendanceLog.map((r) => r.department))]
    : ["All"];
  
  const { rows: paginatedRows, total: totalRows, totalPages } = getPaginatedRows();

  // ── Render Events List View ─────────────────────────────────────────────────
  const renderEventsList = () => (
    <div className="flex flex-col h-full gap-2.5 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] w-48">
            <Search size={11} className="text-gray-300 shrink-0" />
            <input
              type="text"
              placeholder="Search by date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-[11px] text-gray-600 placeholder-gray-300 bg-transparent outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#E3E3E3] border border-gray-300/40 rounded-xl px-2.5 py-1.5">
            <Filter size={10} className="text-gray-400 mr-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[11px] text-gray-600 bg-transparent outline-none cursor-pointer"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#E3E3E3] border border-gray-300/40 rounded-xl px-2.5 py-1.5">
            <RefreshCw size={14} className="text-gray-400 cursor-pointer" onClick={fetchEvents} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">
            <span className="text-gray-600 font-medium">{filteredEvents.length}</span>{" "}
            event{filteredEvents.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Events Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {loadingEvents && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <EventSkeleton key={i} />
              ))}
            </motion.div>
          )}

          {!loadingEvents && eventsError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400"
            >
              <p className="text-xs">{eventsError}</p>
              <button
                onClick={fetchEvents}
                className="text-[11px] px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!loadingEvents && !eventsError && filteredEvents.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300"
            >
              <Calendar size={28} strokeWidth={1.5} />
              <p className="text-xs">No events found</p>
            </motion.div>
          )}

          {!loadingEvents && !eventsError && filteredEvents.length > 0 && (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar size={12} />
                        <span className="text-xs font-medium text-gray-700">{event.date}</span>
                      </div>
                      <StatusBadge status={event.status} />
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-3">
                      <Clock size={10} />
                      <span>
                        {event.start} - {event.end}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Users size={10} className="text-gray-400" />
                          <span className="text-[10px] text-gray-500">Total: {event.stats.total}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp size={10} className="text-green-500" />
                          <span className="text-[10px] font-semibold text-green-600">
                            {event.stats.attendance_rate}% rate
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 text-[10px]">
                        <span className="text-green-600">✓ {event.stats.present} present</span>
                        <span className="text-red-500">✗ {event.stats.absent} absent</span>
                        {event.stats.excused > 0 && (
                          <span className="text-amber-500">◎ {event.stats.excused} excused</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                      <span className="text-[10px] text-gray-400">Click to view analytics</span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // ── Render Analytics View ───────────────────────────────────────────────────
  const renderAnalytics = () => {
    if (loadingAnalytics) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading ceremony data...</p>
          </div>
        </div>
      );
    }

    if (analyticsError) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-red-500 font-medium text-sm">{analyticsError}</p>
            <button
              onClick={() => fetchAnalytics(selectedEventId)}
              className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!analyticsData?.ceremony) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-gray-700">Ceremony not found</p>
            <p className="text-sm text-gray-400">The requested ceremony does not exist.</p>
          </div>
        </div>
      );
    }

    const { ceremony, kpis, timelineSlots, statusMix, attendanceLog } = analyticsData;
    const statusBadgeClass = {
      Pending: "bg-amber-100 text-amber-700",
      Completed: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-600",
    }[ceremony.status] ?? "bg-gray-100 text-gray-500";

    return (
      <div className="flex flex-col h-full gap-2.5 overflow-hidden">
        {/* Header with back button and print */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-gray-800">{ceremony.date}</h2>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock size={12} />
                  <span>{ceremony.start} – {ceremony.end}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadgeClass}`}>
                  {ceremony.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
              >
                <Printer size={12} />
                Print Report
              </button>
              <button
                onClick={handleBackToList}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={12} />
                Back to Events
              </button>
            </div>
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

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Arrival Timeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={timelineSlots} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#d1d5db" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#d1d5db" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="arrivals" name="Arrivals" fill="#86efac" radius={[3, 3, 0, 0]} maxBarSize={32} />
                  <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={statusMix.filter((s) => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusMix.filter((s) => s.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {statusMix.filter((s) => s.value > 0).map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-gray-600">{s.name}</span>
                    <span className="font-semibold text-gray-700">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Table - Full size with pagination */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Attendance Log</span>
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
                    {key === "name" ? "Name" : key === "timeIn" ? "Time In" : key === "department" ? "Dept" : "Status"}
                    {sortKey === key && (sortDir === "asc" ? " ↑" : " ↓")}
                  </button>
                ))}
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="text-[10px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d === "All" ? "All Depts" : d}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-[10px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
                >
                  {["All", "Present", "Absent", "Excused", "Early-out", "Pending"].map((s) => (
                    <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] text-gray-400">
                Showing {paginatedRows.length} of {totalRows} records
              </span>
            </div>

            {/* Printable table wrapper with scroll - FULL SIZE */}
            <div ref={printRef}>
              <div className="overflow-x-auto">
                <div className="overflow-y-auto">
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
                        {paginatedRows.map((row, i) => {
                          const sc = STATUS_COLORS[row.status] ?? STATUS_COLORS.Pending;
                          const rowNumber = (currentPage - 1) * rowsPerPage + i + 1;
                          return (
                            <motion.tr
                              key={row.id}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: i * 0.02 }}
                              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-3 py-2 text-gray-400">{rowNumber}</td>
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
                      {paginatedRows.length === 0 && (
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

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <div className="text-[10px] text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
                <div className="text-[10px] text-gray-400">
                  {rowsPerPage} rows per page
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Main Return ─────────────────────────────────────────────────────────────
  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3 gap-2.5 overflow-hidden">
      {view === "list" ? renderEventsList() : renderAnalytics()}
    </div>
  );
}