import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Constants ─────────────────────────────────────────────────────────────────

const API_URL = "http://localhost:8000/api/analytics/flag-ceremony/current";

const STATUS_COLORS = {
    Present:    { bg: "bg-green-100",  text: "text-green-700",  dot: "#22c55e" },
    Absent:     { bg: "bg-red-100",    text: "text-red-600",    dot: "#ef4444" },
    Excused:    { bg: "bg-amber-100",  text: "text-amber-700",  dot: "#f59e0b" },
    "Early-out":{ bg: "bg-blue-100",   text: "text-blue-700",   dot: "#3b82f6" },
    Pending:    { bg: "bg-gray-100",   text: "text-gray-500",   dot: "#9ca3af" },
};

const SORT_KEYS   = ["name", "timeIn", "department", "status"];
const STATUSES    = ["All", "Present", "Absent", "Excused", "Early-out", "Pending"];
const DEPT_ALL    = "All";

// ── Small helpers ─────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color, animate }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!animate) { setDisplay(value); return; }
        let cur = 0;
        const inc = value / (600 / 16);
        const t = setInterval(() => {
            cur += inc;
            if (cur >= value) { setDisplay(value); clearInterval(t); }
            else setDisplay(Math.floor(cur));
        }, 16);
        return () => clearInterval(t);
    }, [value, animate]);

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1"
        >
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{animate ? display : value}</p>
            {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
        </motion.div>
    );
}

function SortIcon({ active, dir }) {
    if (!active) return <span className="text-gray-300 ml-0.5">↕</span>;
    return <span className="text-green-600 ml-0.5">{dir === "asc" ? "↑" : "↓"}</span>;
}

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

// ── Main dashboard ─────────────────────────────────────────────────────────────

export default function MonitoringDashboard() {
    const [data,          setData]          = useState(null);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);
    const [lastRefresh,   setLastRefresh]   = useState(null);

    // Table controls
    const [sortKey,       setSortKey]       = useState("name");
    const [sortDir,       setSortDir]       = useState("asc");
    const [filterDept,    setFilterDept]    = useState(DEPT_ALL);
    const [filterStatus,  setFilterStatus]  = useState("All");

    const printRef = useRef(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const json = await res.json();
            setData(json);
            setLastRefresh(new Date());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load + auto-refresh every 30 s (live ceremony)
    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 30_000);
        return () => clearInterval(id);
    }, [fetchData]);

    // ── Derived department filter list ─────────────────────────────────────────
    const departments = useMemo(() => {
        if (!data?.attendanceLog) return [DEPT_ALL];
        const depts = [...new Set(data.attendanceLog.map(r => r.department))].sort();
        return [DEPT_ALL, ...depts];
    }, [data]);

    // ── Sorted + filtered table rows ───────────────────────────────────────────
    const tableRows = useMemo(() => {
        if (!data?.attendanceLog) return [];
        let rows = [...data.attendanceLog];
        if (filterDept   !== DEPT_ALL) rows = rows.filter(r => r.department === filterDept);
        if (filterStatus !== "All")    rows = rows.filter(r => r.status     === filterStatus);
        rows.sort((a, b) => {
            const av = a[sortKey] ?? ""; const bv = b[sortKey] ?? "";
            return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return rows;
    }, [data, sortKey, sortDir, filterDept, filterStatus]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    };

    // ── Print ──────────────────────────────────────────────────────────────────
    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const ceremony = data?.ceremony;
        const win = window.open("", "_blank");
        win.document.write(`
            <html><head><title>Flag Ceremony Attendance Report</title>
            <style>
                body { font-family: sans-serif; padding: 32px; color: #111; }
                h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
                .meta { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #f3f4f6; text-align: left; padding: 8px 12px;
                     font-weight: 600; border-bottom: 2px solid #e5e7eb; }
                td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; }
                tr:last-child td { border-bottom: none; }
                @media print { body { padding: 0; } }
            </style></head><body>
            <h2>Flag Ceremony Attendance Report</h2>
            <div class="meta">
                Date: ${ceremony?.date ?? "—"} &nbsp;|&nbsp;
                Time: ${ceremony?.start ?? "—"} – ${ceremony?.end ?? "—"} &nbsp;|&nbsp;
                Status: ${ceremony?.status ?? "—"} &nbsp;|&nbsp;
                Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp;
                Showing: ${tableRows.length} records
            </div>
            ${content.innerHTML}
            </body></html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 400);
    };

    // ── Clear filters ──────────────────────────────────────────────────────────
    const clearFilters = () => {
        setFilterDept(DEPT_ALL);
        setFilterStatus("All");
    };

    // ── Loading / error states ─────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading ceremony data…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <p className="text-red-500 font-medium text-sm">{error}</p>
                    <button
                        onClick={fetchData}
                        className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { ceremony, kpis, timelineSlots, statusMix, departmentStats, attendanceLog } = data ?? {};

    // ── No ceremony today ──────────────────────────────────────────────────────
    if (!ceremony) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-1">
                    <p className="text-lg font-semibold text-gray-700">No flag ceremony today</p>
                    <p className="text-sm text-gray-400">Check back when a ceremony has been scheduled.</p>
                </div>
            </div>
        );
    }

    const statusBadge = {
        Pending:   "bg-amber-100 text-amber-700",
        Completed: "bg-green-100 text-green-700",
        Cancelled: "bg-red-100 text-red-600",
    }[ceremony.status] ?? "bg-gray-100 text-gray-500";

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="w-full bg-gray-50 h-screen overflow-y-auto p-4 space-y-4">

            {/* ── Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    
                    <p className="text-xs text-gray-500">
                        {ceremony.date} &nbsp;·&nbsp; {ceremony.start} – {ceremony.end}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge}`}>
                        {ceremony.status}
                    </span>
                    {ceremony.status === "Pending" && (
                        <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </span>
                    )}
                    <button
                        onClick={fetchData}
                        className="text-[11px] px-3 py-1.5 rounded-lg border border-gray-200
                                   text-gray-600 hover:bg-white hover:border-green-400
                                   hover:text-green-600 transition-colors flex items-center gap-1"
                    >
                        ↻ Refresh
                    </button>
                    {lastRefresh && (
                        <span className="text-[10px] text-gray-400 hidden sm:inline">
                            Updated {lastRefresh.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard label="Attendance Rate" value={`${kpis.attendanceRate}%`}
                         color="text-green-600" animate={false} />
                <KpiCard label="Present"  value={kpis.present}  color="text-green-600" animate />
                <KpiCard label="Absent"   value={kpis.absent}   color="text-red-500"   animate />
                <KpiCard label="Pending"  value={kpis.pending}  color="text-gray-400"
                         sub={`Excused: ${kpis.excused}  ·  Early-out: ${kpis.earlyOut}`} animate />
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Arrival timeline (ComposedChart: Bar = arrivals, Line = cumulative) */}
                <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Arrival Timeline</h2>
                            <p className="text-[11px] text-gray-400">
                                Arrivals per 30-min slot &amp; cumulative present
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-2 bg-green-200 rounded-sm inline-block" /> Arrivals
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 border-t-2 border-green-600 inline-block" /> Cumulative
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart data={timelineSlots} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#d1d5db" />
                            <YAxis tick={{ fontSize: 10 }} stroke="#d1d5db" allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="arrivals" name="Arrivals"
                                fill="#86efac" radius={[3, 3, 0, 0]} maxBarSize={32}
                            />
                            <Line
                                type="monotone" dataKey="cumulative" name="Cumulative"
                                stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: "#16a34a" }}
                                activeDot={{ r: 5 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Status donut */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700 mb-1">Status Breakdown</h2>
                    <p className="text-[11px] text-gray-400 mb-2">All {kpis.total} employees</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie
                                data={statusMix.filter(s => s.value > 0)}
                                cx="50%" cy="50%"
                                innerRadius={40} outerRadius={65}
                                paddingAngle={2} dataKey="value"
                            >
                                {statusMix.filter(s => s.value > 0).map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1 mt-1">
                        {statusMix.filter(s => s.value > 0).map((s, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px]">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full shrink-0"
                                          style={{ background: s.color }} />
                                    <span className="text-gray-600">{s.name}</span>
                                </span>
                                <span className="font-semibold text-gray-700">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Department stats ── */}
            {departmentStats.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">By Department</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {departmentStats.map((dept, i) => (
                            <div key={i} className="rounded-lg border border-gray-100 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-700 truncate pr-2">{dept.name}</p>
                                    <span className="text-[10px] font-bold text-green-600 shrink-0">
                                        {dept.rate}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dept.rate}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.08 }}
                                        className="h-full bg-green-500 rounded-full"
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500">
                                    <span className="text-green-600">{dept.present} present</span>
                                    <span className="text-red-500">{dept.absent} absent</span>
                                    <span className="text-amber-500">{dept.excused} excused</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Attendance Log Table ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">Attendance Log</span>

                        {/* Sort pills */}
                        {SORT_KEYS.map(key => (
                            <button
                                key={key}
                                onClick={() => toggleSort(key)}
                                className={`text-[10px] px-2 py-1 rounded border font-medium transition-colors ${
                                    sortKey === key
                                        ? "bg-green-500 text-white border-green-500"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                                }`}
                            >
                                {key === "name" ? "Name" : 
                                 key === "timeIn" ? "Time In" :
                                 key === "department" ? "Dept" : "Status"}
                                {sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                            </button>
                        ))}

                        {/* Dept filter */}
                        <select
                            value={filterDept}
                            onChange={e => setFilterDept(e.target.value)}
                            className="text-[10px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
                        >
                            {departments.map(d => (
                                <option key={d} value={d}>{d === DEPT_ALL ? "All Depts" : d}</option>
                            ))}
                        </select>

                        {/* Status filter */}
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="text-[10px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
                        >
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>
                            ))}
                        </select>

                        {/* Clear filters button */}
                        <button
                            onClick={clearFilters}
                            className="text-[10px] px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50"
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Print button */}
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5
                                   rounded border border-green-500 text-green-600
                                   hover:bg-green-500 hover:text-white transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/>
                        </svg>
                        Print Report
                    </button>
                </div>

                {/* Scrollable Table Container */}
                <div ref={printRef} className="border-t border-gray-100">
                    <div className="overflow-x-auto">
                        <div className="max-h-[450px] overflow-y-auto">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold w-8 bg-gray-50">#</th>
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold bg-gray-50
                                                       cursor-pointer hover:text-green-600 select-none"
                                            onClick={() => toggleSort("name")}>
                                            Employee Name <SortIcon active={sortKey === "name"} dir={sortDir} />
                                        </th>
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold bg-gray-50">Position</th>
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold bg-gray-50
                                                       cursor-pointer hover:text-green-600 select-none"
                                            onClick={() => toggleSort("timeIn")}>
                                            Time In <SortIcon active={sortKey === "timeIn"} dir={sortDir} />
                                        </th>
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold bg-gray-50">Time Out</th>
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold bg-gray-50
                                                       cursor-pointer hover:text-green-600 select-none"
                                            onClick={() => toggleSort("department")}>
                                            Department <SortIcon active={sortKey === "department"} dir={sortDir} />
                                        </th>
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold bg-gray-50
                                                       cursor-pointer hover:text-green-600 select-none"
                                            onClick={() => toggleSort("status")}>
                                            Status <SortIcon active={sortKey === "status"} dir={sortDir} />
                                        </th>
                                        <th className="text-left px-3 py-2.5 text-gray-500 font-semibold bg-gray-50">Signature</th>
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
                                                    <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                                                    <td className="px-3 py-2.5 font-medium text-gray-800">{row.name}</td>
                                                    <td className="px-3 py-2.5 text-gray-500 text-[11px]">{row.position}</td>
                                                    <td className="px-3 py-2.5 text-gray-600">{row.timeIn}</td>
                                                    <td className="px-3 py-2.5 text-gray-600">{row.timeOut}</td>
                                                    <td className="px-3 py-2.5 text-gray-600">{row.department}</td>
                                                    <td className="px-3 py-2.5">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <div className="w-24 border-b border-gray-300" />
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

                {/* Table footer */}
                <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <span className="text-[10px] text-gray-500">
                        Showing {tableRows.length} of {attendanceLog?.length ?? 0} records
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {ceremony.date} &nbsp;·&nbsp; {ceremony.start} – {ceremony.end}
                    </span>
                </div>
            </div>

        </div>
    );
}