import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

// Status badge component
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

// Skeleton loader for events
const EventSkeleton = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 bg-gray-200 rounded w-32" />
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-100 rounded w-40" />
      <div className="h-4 bg-gray-100 rounded w-36" />
      <div className="h-4 bg-gray-100 rounded w-44" />
    </div>
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="h-8 bg-gray-100 rounded-lg w-full" />
    </div>
  </div>
);

export default function FlagCeremonyEventsList({ onViewEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/analytics/flag-ceremony/events"
      );
      setEvents(response.data.events);
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", ...new Set(events.map((e) => e.status))];

  const handleEventClick = (eventId) => {
    console.log("Event clicked:", eventId);
    if (onViewEvent && typeof onViewEvent === 'function') {
      onViewEvent(eventId);
    } else {
      console.error("onViewEvent is not a function:", onViewEvent);
    }
  };

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3 gap-2.5">
      {/* ── TOOLBAR ── */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* SEARCH */}
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

          {/* STATUS FILTER */}
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

          {/* REFRESH BUTTON */}
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

      {/* ── EVENTS LIST ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {loading && (
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

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400"
            >
              <p className="text-xs">{error}</p>
              <button
                onClick={fetchEvents}
                className="text-[11px] px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
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

          {!loading && !error && filteredEvents.length > 0 && (
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
}