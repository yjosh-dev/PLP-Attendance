import { useState, useEffect, useId, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
 
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
 
function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
}
 
function buildDailySeries(year, monthIndex) {
    const n = daysInMonth(year, monthIndex);
    const out = [];
    let acc = 280;
    for (let d = 1; d <= n; d++) {
        const wobble = Math.sin((d / n) * Math.PI * 2) * 25;
        const noise = (d % 7) * 4 - 10;
        acc = Math.min(380, Math.max(240, Math.round(acc + wobble * 0.15 + noise)));
        const absent = Math.max(8, Math.round(55 - (acc / 380) * 35 + (d % 5) * 2));
        const late = Math.round(12 + Math.sin(d * 0.5) * 6);
        out.push({
            day: `${monthIndex + 1}/${d}`,
            present: acc,
            absent,
            late,
            rate: Math.round((acc / (acc + absent + late)) * 1000) / 10,
        });
    }
    return out;
}
 
function buildWeeklyBuckets(daily) {
    const weeks = [];
    for (let i = 0; i < daily.length; i += 7) {
        const chunk = daily.slice(i, i + 7);
        if (!chunk.length) continue;
        const present = chunk.reduce((s, r) => s + r.present, 0);
        const absent = chunk.reduce((s, r) => s + r.absent, 0);
        const late = chunk.reduce((s, r) => s + r.late, 0);
        weeks.push({
            label: `W${weeks.length + 1}`,
            present,
            absent,
            late,
        });
    }
    return weeks;
}
 
const departmentMonthly = [
    { name: "Engineering", avgRate: 96.2, late: 42, absent: 18, ceremonies: 4 },
    { name: "Sales", avgRate: 93.8, late: 61, absent: 31, ceremonies: 4 },
    { name: "HR", avgRate: 97.1, late: 22, absent: 9, ceremonies: 4 },
    { name: "Marketing", avgRate: 91.5, late: 55, absent: 44, ceremonies: 3 },
];
 
const departmentPieColors = ["#4ade80", "#22c55e", "#16a34a", "#15803d"];
 
const statusMonthly = [
    { name: "Present", value: 8420, color: "#22c55e" },
    { name: "Absent", value: 612, color: "#ef4444" },
    { name: "Late", value: 334, color: "#f59e0b" },
];
 
const focusTiles = [
    { id: 1, title: "Ceremony days", value: "4", sub: "In selected month", tone: "from-green-500 to-green-600" },
    { id: 2, title: "Peak headcount", value: "~380", sub: "Single-day high", tone: "from-emerald-500 to-emerald-600" },
    { id: 3, title: "Late incidents", value: "—", sub: "Roll-up total", tone: "from-amber-500 to-amber-600" },
    { id: 4, title: "Absent days", value: "—", sub: "Roll-up total", tone: "from-red-500 to-red-600" },
];
 
export default function AnalyticsDashboard() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [monthIndex, setMonthIndex] = useState(now.getMonth());
    const gradId = useId().replace(/:/g, "");
 
    const daily = useMemo(() => buildDailySeries(year, monthIndex), [year, monthIndex]);
    const weekly = useMemo(() => buildWeeklyBuckets(daily), [daily]);
 
    const departmentPie = useMemo(
        () =>
            departmentMonthly.map((d, i) => ({
                name: d.name,
                value: Math.round(d.avgRate),
                color: departmentPieColors[i % departmentPieColors.length],
            })),
        []
    );
 
    const areaFromWeeks = useMemo(
        () => weekly.map((w) => ({ label: w.label, count: Math.round(w.present / Math.max(1, 7)) })),
        [weekly]
    );
 
    const kpis = useMemo(() => {
        const totalPresent = daily.reduce((s, r) => s + r.present, 0);
        const totalAbsent = daily.reduce((s, r) => s + r.absent, 0);
        const totalLate = daily.reduce((s, r) => s + r.late, 0);
        const workdays = daily.length;
        const avgDailyPresent = Math.round(totalPresent / workdays);
        const rate =
            Math.round((totalPresent / (totalPresent + totalAbsent + totalLate)) * 1000) / 10;
        return { avgDailyPresent, rate, totalLate, totalAbsent, ceremonySessions: 4 };
    }, [daily]);
 
    const [animatedPresent, setAnimatedPresent] = useState(0);
    const [animatedAbsent, setAnimatedAbsent] = useState(0);
 
    useEffect(() => {
        const animateValue = (start, end, setter, duration = 800) => {
            const increment = (end - start) / (duration / 16);
            let current = start;
            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    setter(end);
                    clearInterval(timer);
                } else {
                    setter(Math.floor(current));
                }
            }, 16);
        };
        animateValue(0, kpis.avgDailyPresent, setAnimatedPresent);
        animateValue(0, Math.min(400, kpis.totalAbsent), setAnimatedAbsent);
    }, [kpis.avgDailyPresent, kpis.totalAbsent]);
 
    const periodLabel = `${MONTH_NAMES[monthIndex]} ${year}`;
 
    const highlights = useMemo(() => {
        const best = daily.reduce((a, r) => (r.present > a.present ? r : a), daily[0]);
        const worstLate = daily.reduce((a, r) => (r.late > a.late ? r : a), daily[0]);
        const label = `${MONTH_NAMES[monthIndex]} ${year}`;
        return [
            { id: 1, name: "Strongest day", sub: best?.day ?? "—", time: `${best?.present ?? 0} present`, avatar: "▲" },
            { id: 2, name: "Most late load", sub: worstLate?.day ?? "—", time: `${worstLate?.late ?? 0} late`, avatar: "!" },
            { id: 3, name: "Working days", sub: `${daily.length} in month`, time: label, avatar: "∑" },
        ];
    }, [daily, monthIndex, year]);
 
    const tiles = useMemo(
        () =>
            focusTiles.map((t, i) => ({
                ...t,
                value: i === 2 ? String(kpis.totalLate) : i === 3 ? String(kpis.totalAbsent) : t.value,
            })),
        [kpis.totalLate, kpis.totalAbsent]
    );
 
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-lg p-2 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700">{label}</p>
                    {payload.map((p, idx) => (
                        <p key={idx} className="text-xs" style={{ color: p.color }}>
                            {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };
 
    return (
        <div className="h-full w-[96%] bg-gradient-to-br bg-gray-200 rounded-xl overflow-hidden flex flex-col shadow-xl">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-0 w-full rounded-xl overflow-hidden flex flex-col shadow-xl"
            >
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 py-2 shrink-0">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">ANALYTICS DASHBOARD</h1>
                            <p className="text-gray-500 text-xs">Monthly roll-up — same layout rhythm as monitoring</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={monthIndex}
                                onChange={(e) => setMonthIndex(Number(e.target.value))}
                                className="text-xs font-medium text-gray-800 border border-gray-200 rounded-md px-2 py-1 bg-white"
                            >
                                {MONTH_NAMES.map((m, i) => (
                                    <option key={m} value={i}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="text-xs font-medium text-gray-800 border border-gray-200 rounded-md px-2 py-1 bg-white"
                            >
                                {[year - 1, year, year + 1].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-gray-600 text-xs">Report ready</span>
                            </div>
                        </div>
                    </div>
                </div>
 
                {/* Body */}
                <div className="flex-1 min-h-0 p-3 overflow-auto custom-scrollbar">
 
                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-lg p-3 shadow-md border border-gray-100 min-w-0">
                            <p className="text-gray-500 text-xs mb-1">Avg daily present</p>
                            <p className="text-2xl font-bold text-gray-800">{animatedPresent}</p>
                            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (animatedPresent / 400) * 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-green-500 rounded-full"
                                />
                            </div>
                        </motion.div>
 
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-lg p-3 shadow-md border border-gray-100 min-w-0">
                            <p className="text-gray-500 text-xs mb-1">Monthly rate</p>
                            <p className="text-2xl font-bold text-green-600">{kpis.rate}%</p>
                            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, kpis.rate)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-green-600 rounded-full"
                                />
                            </div>
                        </motion.div>
 
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-lg p-3 shadow-md border border-gray-100 min-w-0">
                            <p className="text-gray-500 text-xs mb-1">Absent (month)</p>
                            <p className="text-2xl font-bold text-red-500">{animatedAbsent}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Late total: {kpis.totalLate}</p>
                            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (animatedAbsent / 400) * 100)}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-red-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </div>
 
                    {/* Charts + Highlights */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="col-span-2 space-y-3 min-w-0">
                            {/* Weekly bar chart */}
                            <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                                <h3 className="text-gray-700 text-xs font-semibold mb-2">Month overview (by week)</h3>
                                <ResponsiveContainer width="100%" height={140}>
                                    <BarChart data={weekly}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="label" stroke="#9ca3af" fontSize={10} />
                                        <YAxis stroke="#9ca3af" fontSize={10} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="present" fill="#22c55e" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="absent" fill="#ef4444" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
 
                            {/* Area + Pie row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 min-w-0">
                                    <h3 className="text-gray-700 text-xs font-semibold mb-2">Week intensity</h3>
                                    <ResponsiveContainer width="100%" height={120}>
                                        <AreaChart data={areaFromWeeks}>
                                            <defs>
                                                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="label" stroke="#9ca3af" fontSize={9} />
                                            <YAxis stroke="#9ca3af" fontSize={9} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill={`url(#${gradId})`}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
 
                                <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 min-w-0">
                                    <h3 className="text-gray-700 text-xs font-semibold mb-1">Status mix</h3>
                                    <ResponsiveContainer width="100%" height={110}>
                                        <PieChart>
                                            <Pie
                                                data={statusMonthly}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={25}
                                                outerRadius={40}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {statusMonthly.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-2 mt-1 flex-wrap">
                                        {statusMonthly.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-gray-500 text-[10px]">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        {/* Highlights sidebar */}
                        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 min-w-0">
                            <h3 className="text-gray-700 text-xs font-semibold mb-2">Highlights</h3>
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {highlights.map((row, index) => (
                                        <motion.div
                                            key={row.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                            className="flex items-center justify-between p-2 rounded bg-gray-50"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                                                    {row.avatar}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-gray-800 truncate">{row.name}</p>
                                                    <p className="text-[10px] text-gray-500 truncate">{row.sub}</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-semibold text-green-600 shrink-0 ml-1">{row.time}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
 
                    {/* Monthly Focus Tiles */}
                    <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-gray-700 text-xs font-semibold">Monthly focus</h3>
                            <span className="text-gray-500 text-[10px]">{periodLabel}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {tiles.map((tile) => (
                                <motion.div
                                    key={tile.id}
                                    whileHover={{ scale: 1.03, zIndex: 10 }}
                                    className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                                >
                                    <div className={`h-24 bg-gradient-to-br ${tile.tone} flex flex-col justify-end p-2`}>
                                        <p className="text-white text-[10px] font-semibold drop-shadow-md">{tile.title}</p>
                                        <p className="text-white text-lg font-bold drop-shadow-md">{tile.value}</p>
                                        <span className="text-white/90 text-[8px] drop-shadow-md">{tile.sub}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
 
                    {/* Department + Legend */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 min-w-0">
                            <h3 className="text-gray-700 text-xs font-semibold mb-2">Department distribution</h3>
                            <ResponsiveContainer width="100%" height={100}>
                                <PieChart>
                                    <Pie
                                        data={departmentPie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={20}
                                        outerRadius={40}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {departmentPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-2 mt-1">
                                {departmentPie.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-gray-600 text-[10px]">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
 
                        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                            <h3 className="text-gray-700 text-xs font-semibold mb-2">Legend</h3>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                    <span className="text-gray-600 text-[10px]">Present / rate</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                                    <span className="text-gray-600 text-[10px]">Weekly trend</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                    <span className="text-gray-600 text-[10px]">Absent</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="text-gray-600 text-[10px]">Late</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                                    <span className="text-gray-600 text-[10px]">Est. sample data</span>
                                </div>
                            </div>
                        </div>
                    </div>
 
                </div>
            </motion.div>
        </div>
    );
}