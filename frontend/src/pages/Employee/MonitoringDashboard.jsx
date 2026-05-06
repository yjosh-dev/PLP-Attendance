import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Area
} from 'recharts';

export default function MonitoringDashboard() {
    const [latestComers, setLatestComers] = useState([
        { id: 1, name: "John Dela Cruz", time: "08:15 AM", department: "Engineering", avatar: "JD" },
        { id: 2, name: "Maria Santos", time: "08:22 AM", department: "HR", avatar: "MS" },
        { id: 3, name: "Carlos Reyes", time: "08:30 AM", department: "Sales", avatar: "CR" }
    ]);

    const [currentAttendance, setCurrentAttendance] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    
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
        
        animateValue(0, 350, setCurrentAttendance);
        animateValue(0, 50, setAbsentCount);
    }, []);

    const weeklyAttendance = [
        { day: "Mon", present: 320, absent: 30 },
        { day: "Tue", present: 335, absent: 25 },
        { day: "Wed", present: 340, absent: 20 },
        { day: "Thu", present: 330, absent: 28 },
        { day: "Fri", present: 310, absent: 35 },
    ];

    const departmentData = [
        { name: "Engineering", value: 45, color: "#4ade80" },
        { name: "Sales", value: 30, color: "#22c55e" },
        { name: "HR", value: 15, color: "#16a34a" },
        { name: "Marketing", value: 10, color: "#15803d" },
    ];

    const attendanceTrend = [
        { hour: "8:00", count: 45 },
        { hour: "8:30", count: 120 },
        { hour: "9:00", count: 210 },
        { hour: "9:30", count: 280 },
        { hour: "10:00", count: 310 },
        { hour: "10:30", count: 335 },
        { hour: "11:00", count: 350 },
    ];

    const statusData = [
        { name: "Present", value: 350, color: "#22c55e" },
        { name: "Absent", value: 50, color: "#ef4444" },
        { name: "Late", value: 25, color: "#f59e0b" },
    ];

    // Sample CCTV feeds with grayscale/green overlay
    const cctvFeeds = [
        { id: 1, name: "Main Entrance", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop", status: "Live" },
        { id: 2, name: "HR Department", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop", status: "Live" },
        { id: 3, name: "Engineering Wing", image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop", status: "Live" },
        { id: 4, name: "Parking Area", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop", status: "Live" },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-lg p-2 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700">{label}</p>
                    {payload.map((p, idx) => (
                        <p key={idx} className="text-xs" style={{ color: p.color }}>
                            {p.name}: {p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl overflow-hidden flex flex-col shadow-xl"
        >
            {/* Header - White/Gray/Green Theme */}
            <div className="bg-white border-b border-gray-200 px-4 py-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">MONITORING DASHBOARD</h1>
                        <p className="text-gray-500 text-xs">Real-time attendance tracking & surveillance</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-gray-600 text-xs">All Systems Online</span>
                    </div>
                </div>
            </div>

            {/* Main Content - Compact Grid */}
            <div className="flex-1 p-3 overflow-auto custom-scrollbar">
                {/* Stats Cards Row - White Theme */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                        <p className="text-gray-500 text-xs mb-1">Current Attendance</p>
                        <p className="text-2xl font-bold text-gray-800">{currentAttendance}</p>
                        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentAttendance / 400) * 100}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-green-500 rounded-full"
                            />
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                        <p className="text-gray-500 text-xs mb-1">Total Capacity</p>
                        <p className="text-2xl font-bold text-green-600">95%</p>
                        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '95%' }}
                                transition={{ duration: 1 }}
                                className="h-full bg-green-600 rounded-full"
                            />
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                        <p className="text-gray-500 text-xs mb-1">Absent</p>
                        <p className="text-2xl font-bold text-red-500">{absentCount}</p>
                        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(absentCount / 400) * 100}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-red-500 rounded-full"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Two Column Layout - Charts & Latest Comers */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                    {/* Left Column - Charts */}
                    <div className="col-span-2 space-y-3">
                        {/* Mini Bar Chart */}
                        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                            <h3 className="text-gray-700 text-xs font-semibold mb-2">Weekly Overview</h3>
                            <ResponsiveContainer width="100%" height={140}>
                                <BarChart data={weeklyAttendance}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={10} />
                                    <YAxis stroke="#9ca3af" fontSize={10} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="present" fill="#22c55e" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="absent" fill="#ef4444" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Mini Area Chart + Pie Chart Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                                <h3 className="text-gray-700 text-xs font-semibold mb-2">Today's Trend</h3>
                                <ResponsiveContainer width="100%" height={120}>
                                    <AreaChart data={attendanceTrend}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="hour" stroke="#9ca3af" fontSize={9} />
                                        <YAxis stroke="#9ca3af" fontSize={9} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                                <h3 className="text-gray-700 text-xs font-semibold mb-1">Status Distribution</h3>
                                <ResponsiveContainer width="100%" height={110}>
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={3} dataKey="value">
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-2 mt-1">
                                    {statusData.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-gray-500 text-[10px]">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest Comers Section - White Theme */}
                    <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                        <h3 className="text-gray-700 text-xs font-semibold mb-2">Latest Check-ins</h3>
                        <div className="space-y-2">
                            <AnimatePresence>
                                {latestComers.map((comer, index) => (
                                    <motion.div
                                        key={comer.id}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-semibold">
                                                {comer.avatar}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-800">{comer.name}</p>
                                                <p className="text-[10px] text-gray-500">{comer.department}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-semibold text-green-600">{comer.time}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* CCTV Section - White Theme */}
                <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 mb-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-700 text-xs font-semibold">Security Surveillance</h3>
                        <div className="flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-gray-500 text-[10px]">RECORDING</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {cctvFeeds.map((feed) => (
                            <motion.div 
                                key={feed.id}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="relative group cursor-pointer"
                            >
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img 
                                        src={feed.image} 
                                        alt={feed.name}
                                        className="w-full h-24 object-cover brightness-90 contrast-125"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                                    <div className="absolute bottom-1 left-1 right-1">
                                        <p className="text-white text-[10px] font-semibold drop-shadow-md">{feed.name}</p>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-green-400"></div>
                                            <span className="text-gray-200 text-[8px] drop-shadow-md">{feed.status}</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1 right-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Department & Legend Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100">
                        <h3 className="text-gray-700 text-xs font-semibold mb-2">Department Distribution</h3>
                        <ResponsiveContainer width="100%" height={100}>
                            <PieChart>
                                <Pie data={departmentData} cx="50%" cy="50%" innerRadius={20} outerRadius={40} paddingAngle={3} dataKey="value">
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-2 mt-1">
                            {departmentData.map((item, idx) => (
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
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                <span className="text-gray-600 text-[10px]">Engineering</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="text-gray-600 text-[10px]">Sales</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                                <span className="text-gray-600 text-[10px]">HR</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-700"></div>
                                <span className="text-gray-600 text-[10px]">Marketing</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <span className="text-gray-600 text-[10px]">Absent/Late</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                                <span className="text-gray-600 text-[10px]">Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}