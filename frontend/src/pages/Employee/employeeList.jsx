import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useReducer, useContext } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  UserPlus,
  SlidersHorizontal,
  ListRestart
} from "lucide-react";

import { NavbarContext } from "../../context/navbarProvider";

import EmployeeCard from "../../components/ui/employeeCard";

const SortBtn = ({ field, label, sortConfig, onSort }) => (
  <button
    onClick={() => onSort(field)}
    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg transition-colors duration-150 ${
      sortConfig.field === field
        ? "bg-white text-gray-700 shadow-sm"
        : "text-gray-400 hover:text-gray-500"
    }`}
  >
    {label}
    {sortConfig.field === field ? (
      sortConfig.direction === "asc" ? (
        <ChevronUp size={10} />
      ) : (
        <ChevronDown size={10} />
      )
    ) : (
      <ChevronsUpDown size={10} className="text-gray-300" />
    )}
  </button>
);

function SkeletonCard() {
  return (
    <div className="w-50 h-67 bg-white rounded-md overflow-hidden flex flex-col shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]">
      <div className="w-full h-[3%] bg-gray-200 animate-pulse" />
      <div className="w-full h-[13%] flex items-center px-2.5">
        <div className="w-12 h-4 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="w-full h-[45%] flex items-center justify-center flex-col gap-2">
        <div className="w-14 h-14 rounded-full bg-gray-100 animate-pulse" />
        <div className="flex flex-col items-center gap-1">
          <div className="w-24 h-3 bg-gray-100 rounded-full animate-pulse" />
          <div className="w-16 h-2.5 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="mx-2 mb-2 flex-1 bg-gray-50 rounded-lg p-2 flex flex-col justify-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-2.5 bg-gray-100 rounded-full animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function EmployeeList() {
  const [navbar, setNavbar] = useContext(NavbarContext)
  const [deletingId, setDeletingId] = useState(null);
  const [token, setToken] = useState();
  const [isAdd, setIsAddEmployee] = useState(false);
  const [employeeRecord, setEmployeeRecord] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "last_name",
    direction: "asc",
  });

  useEffect(() => {
    setToken(localStorage.getItem("auth_token"));
    fetchEmployees();
  }, []);

  const handlePressAdd = () => {
    setIsAddEmployee(!isAdd);
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/fetch_employees",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );
      setEmployeeRecord(response.data.data);
    } catch (err) {
      setError("Failed to load employees. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" },
    );
  };

  const handleRefresh = () => {
      console.log(employeeRecord)
      setIsLoading(true)
      fetchEmployees()
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
  }

  const handleDelete = async (employee_id) => {
    setDeletingId(employee_id);
    try {
      await axios.post(
        "http://localhost:8000/api/delete_employee",
        { employee_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEmployeeRecord((prev) =>
        prev.filter((e) => e.employee_id !== employee_id),
      );
    } catch (error) {
      alert("Error deleting employee");
      setDeletingId(null);
    }
  };

  const filtered = employeeRecord
    .filter((e) => {
      const fullName = `${e.first_name} ${e.last_name}`.toLowerCase();
      return (
        fullName.includes(search.toLowerCase()) ||
        e.account_email?.toLowerCase().includes(search.toLowerCase()) ||
        String(e.employee_id).includes(search)
      );
    })
    .sort((a, b) => {
      const vals = {
        last_name: [a.last_name, b.last_name],
        department: [a.department_name, b.department_name],
        position: [a.position_name, b.position_name],
      };
      const [aVal, bVal] = vals[sortConfig.field] ?? [a.last_name, b.last_name];
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3 gap-2.5">
      {/* ── TOOLBAR ── */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 select-none cursor-pointer">
          {/* SEARCH */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] w-48">
            <Search size={11} className="text-gray-300 shrink-0" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[11px] text-gray-600 placeholder-gray-300 bg-transparent outline-none w-full"
            />
          </div>

          {/* SORT */}
          <div className="flex items-center gap-1 bg-[#E3E3E3] border border-gray-300/40 rounded-xl px-2.5 py-1.5">
            <SlidersHorizontal size={10} className="text-gray-400 mr-1" />
            <SortBtn
              field="last_name"
              label="Name"
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <SortBtn
              field="department"
              label="Dept"
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <SortBtn
              field="position"
              label="Position"
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>
          <div className="flex items-center gap-1 bg-[#E3E3E3] border border-gray-300/40 rounded-xl px-2.5 py-1.5 ">
          <ListRestart size={19} className="text-gray-400 " onClick={() => handleRefresh()}/>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">
            <span className="text-gray-600 font-medium">{filtered.length}</span>{" "}
            employee{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl transition-colors duration-150"
            onClick={() => setNavbar("Add Employee")}
          >
            <UserPlus size={11} />
            Add Employee
          </button>
        </div>
      </div>
      {/* ── RECORD LIST ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* LOADING */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          )}

          {/* ERROR */}
          {!isLoading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400"
            >
              <p className="text-xs">{error}</p>
              <button
                onClick={fetchEmployees}
                className="text-[11px] px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* EMPTY */}
          {!isLoading && !error && filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300"
            >
              <UserPlus size={28} strokeWidth={1.5} />
              <p className="text-xs">No employees found</p>
            </motion.div>
          )}

          {/* RECORDS */}
          {!isLoading && !error && filtered.length > 0 && (
            <motion.div
              key="records"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
            >
              {filtered.map((emp, i) => (
                <motion.div
                  key={emp.employee_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <EmployeeCard
                    key={emp.employee_id}
                    employee={emp}
                    
                    isDeleting={deletingId === emp.employee_id}
                    onDelete={() =>
                      handleDelete(
                        emp.employee_id,
                        localStorage.getItem("auth_token"),
                      )
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
